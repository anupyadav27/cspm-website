import type { DocArticle } from "./types";

export const articles: DocArticle[] = [
  {
    slug: "onboarding/aws",
    title: "Connect Amazon Web Services (AWS)",
    breadcrumb: "Onboarding / AWS",
    body: `
This guide walks you through connecting an AWS account — or an entire AWS Organization — to Onam. You create a cross-account IAM role in your account, attach AWS managed read-only policies, and register the role ARN in the Onam console. The connection is read-only: Onam never makes changes to your AWS environment.

**Time to complete**: ~15 minutes. **AWS knowledge required**: IAM, basic console navigation.

![AWS onboarding flow: create the IAM role, attach read-only policies, register the role in the Onam console, first scan runs](/diagrams/onboard-aws.svg)

## How the connection works

The diagram above shows the connection model end-to-end. Onam uses **cross-account IAM role assumption** — the same mechanism AWS recommends for third-party integrations. You create a role in your AWS account that trusts Onam's AWS account, protected by a unique **External ID** (which prevents the confused-deputy attack). Onam stores only a reference to that role ARN, and at scan time AWS STS issues short-lived credentials that Onam uses for read-only API calls.

- **No long-lived credentials are stored anywhere.** No access keys, no secrets — only the role ARN reference, held in AWS Secrets Manager and encrypted with KMS.
- **Temporary credentials rotate every hour.** AWS STS credentials expire within 60 minutes of issue, even if one were somehow exposed.
- **Read-only is enforced by your IAM policy, not by Onam.** You attach a read-only policy to the role you create — Onam cannot exceed what your policy allows.

> **How the connection stays read-only:** the role carries only \`SecurityAudit\`, \`ReadOnlyAccess\`, and a short list of additional read permissions — there is no Allow statement for any write, delete, or modify action, and AWS IAM enforces that boundary on every API call. Delete the role at any time and access ends instantly, with no orphaned credentials left behind.

### Before you begin

- An AWS account with permission to create IAM roles and policies
- An Onam account with at least the \`tenant_admin\` role
- Your Onam **Platform Account ID** and **External ID** — shown in the Onam console under **Onboarding → Connect Cloud Account → AWS**

An access-key connection option also exists for restricted evaluation environments, but the IAM role is strongly recommended — it is the only model in which no secret is ever exchanged.

## Step 1 — Create the IAM role

### Option A: Using the AWS Console

1. Open the [AWS IAM Console](https://console.aws.amazon.com/iam)
2. Navigate to **Roles → Create role**
3. Select **AWS account** as the trusted entity type
4. Select **Another AWS account**
5. Enter the Onam **Platform Account ID** (shown in the Onam onboarding screen)
6. Check **Require external ID** and enter the **External ID** shown in the console
7. Click **Next**

### Option B: Using the AWS CLI

\`\`\`bash
# Replace PLATFORM_ACCOUNT_ID and EXTERNAL_ID with values from the Onam console
aws iam create-role \\
  --role-name CSPMScannerRole \\
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::PLATFORM_ACCOUNT_ID:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "EXTERNAL_ID"
        }
      }
    }]
  }'
\`\`\`

### Option C: Using CloudFormation

\`\`\`yaml
# cspm-role.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Onam Read-Only Scanner Role

Parameters:
  PlatformAccountId:
    Type: String
    Description: Onam platform AWS account ID
  ExternalId:
    Type: String
    Description: External ID from the Onam onboarding screen

Resources:
  CSPMScannerRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: CSPMScannerRole
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: !Sub 'arn:aws:iam::\${PlatformAccountId}:root'
            Action: sts:AssumeRole
            Condition:
              StringEquals:
                sts:ExternalId: !Ref ExternalId
      ManagedPolicyArns:
        - arn:aws:iam::aws:policy/SecurityAudit
        - arn:aws:iam::aws:policy/ReadOnlyAccess
      Policies:
        - PolicyName: CSPMAdditionalPermissions
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action:
                  - support:DescribeTrustedAdvisorChecks
                  - support:DescribeTrustedAdvisorCheckResult
                  - access-analyzer:ListAnalyzers
                  - access-analyzer:ListFindings
                  - guardduty:ListDetectors
                  - guardduty:GetMasterAccount
                  - securityhub:GetFindings
                  - securityhub:DescribeHub
                  - inspector2:ListFindings
                  - inspector2:ListCoverage
                  - macie2:GetMacieSession
                  - macie2:ListFindings
                Resource: '*'

Outputs:
  RoleArn:
    Value: !GetAtt CSPMScannerRole.Arn
    Description: Copy this ARN into the Onam onboarding screen
\`\`\`

\`\`\`bash
aws cloudformation deploy \\
  --template-file cspm-role.yaml \\
  --stack-name cspm-scanner-role \\
  --parameter-overrides \\
    PlatformAccountId=PLATFORM_ACCOUNT_ID \\
    ExternalId=EXTERNAL_ID \\
  --capabilities CAPABILITY_NAMED_IAM
\`\`\`

## Step 2 — Attach the read-only policies

Attach these AWS managed policies to the role:

| Policy | ARN | Why required |
| --- | --- | --- |
| \`SecurityAudit\` | \`arn:aws:iam::aws:policy/SecurityAudit\` | Core security service scanning |
| \`ReadOnlyAccess\` | \`arn:aws:iam::aws:policy/ReadOnlyAccess\` | Broad read access for resource discovery |

Plus the additional custom policy from Step 1 covering these AWS service-specific permissions:

| Category | Permissions | Why required |
| --- | --- | --- |
| **Advisor & Analysis** | \`support:DescribeTrustedAdvisorChecks\` · \`access-analyzer:ListAnalyzers\` · \`access-analyzer:ListFindings\` | Read AWS Trusted Advisor findings and IAM Access Analyzer findings |
| **Threat Detection** | \`guardduty:ListDetectors\` · \`guardduty:GetMasterAccount\` · \`securityhub:GetFindings\` | Read GuardDuty threat findings and Security Hub aggregated findings |
| **Vulnerability** | \`inspector2:ListFindings\` · \`inspector2:ListCoverage\` | Read Inspector v2 vulnerability findings and coverage |
| **Data Security** | \`macie2:GetMacieSession\` · \`macie2:ListFindings\` | Read Macie sensitive-data discovery findings |

Each permission is read-only — no \`Create*\`, \`Update*\`, \`Delete*\`, or \`Put*\` actions are required.

## Step 3 — Register the role in the Onam console

After creating the role, copy the Role ARN. It looks like:

\`\`\`
arn:aws:iam::123456789012:role/CSPMScannerRole
\`\`\`

1. In the Onam console, navigate to **Onboarding → Connect Cloud Account**
2. Select **Amazon Web Services**
3. Paste the **Role ARN**
4. Enter an **Account Alias** (a friendly name for this account)
5. Select which **Regions** to scan (or select All)
6. Click **Validate Connection**

Onam attempts to assume the role and verifies read access. A green checkmark means the connection succeeded.

![The Onboarding view in the Onam console (demo account)](/screenshots/screenshot-onboarding.png)

### Run your first scan

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the account you just added
3. Click **Run Scan Now**
4. The scan typically completes in 15–60 minutes depending on account size

You receive an in-app notification and an email when the scan completes. Findings appear in the console graded by severity: Critical, High, Medium, Low, or Info.

## Connect an entire AWS Organization

For AWS Organizations, deploy the IAM role to all member accounts automatically with CloudFormation StackSets:

\`\`\`bash
# Deploy via AWS Organizations StackSets
aws cloudformation create-stack-set \\
  --stack-set-name cspm-scanner-roles \\
  --template-url https://s3.amazonaws.com/cspm-templates/cspm-role.yaml \\
  --parameters \\
    ParameterKey=PlatformAccountId,ParameterValue=PLATFORM_ACCOUNT_ID \\
    ParameterKey=ExternalId,ParameterValue=EXTERNAL_ID \\
  --capabilities CAPABILITY_NAMED_IAM \\
  --permission-model SERVICE_MANAGED \\
  --auto-deployment Enabled=true,RetainStacksOnAccountRemoval=false
\`\`\`

This auto-deploys the role to all existing accounts in your organization — and to every new account the moment it is created. Register each role ARN in the Onam console (or use the bulk-import option on the onboarding screen).

## What gets scanned

Onam evaluates **157 AWS services** against **2,278 posture rules**, plus 530 identity-focused CIEM rules — part of the 10,000+ rule registry that spans all seven supported clouds. New AWS services are added on a quarterly cadence.

| Category | Services scanned |
| --- | --- |
| **Compute** | EC2 Instances · Lambda Functions · ECS Tasks · EKS Clusters · Elastic Beanstalk · Fargate · Auto Scaling Groups |
| **Storage & Data** | S3 Buckets · EBS Volumes · RDS Instances · DynamoDB Tables · Redshift Clusters · ElastiCache · Aurora · DocumentDB |
| **Network** | VPCs · Security Groups · NACLs · Load Balancers (ALB/NLB/Classic) · CloudFront · Route 53 · WAF · Network Firewall · API Gateway |
| **Security & Identity** | IAM Users / Roles / Policies · KMS Keys · Secrets Manager · Certificate Manager · GuardDuty · Security Hub · CloudTrail · Config · Inspector |
| **AI / ML** | SageMaker · Bedrock · Comprehend · Rekognition · Textract |

Don't see a service you need? Email support@onam.io — most additions ship within 4 weeks.

The same role also powers behavioral threat detection: Onam's [CDR engine](/docs/features/cdr) ingests CloudTrail activity (via CloudWatch Logs and S3) and runs single-event rules, multi-event correlation scenarios, and statistical behavior baselines over it.

## Troubleshooting and security FAQ

| Error | Cause | Fix |
| --- | --- | --- |
| \`AccessDenied: AssumeRole\` | Trust policy or external ID mismatch | Verify Platform Account ID and External ID match exactly |
| \`Connection timed out\` | Role doesn't exist in the right account | Confirm the role ARN account ID matches the account you're connecting |
| \`NoSuchBucket\` during scan | Region restrictions too narrow | Ensure selected regions include where your resources exist |
| Scan returns 0 resources | IAM permissions insufficient | Verify both \`SecurityAudit\` and \`ReadOnlyAccess\` are attached |
| IAM findings missing | Missing \`access-analyzer\` permissions | Attach the custom additional policy from Step 2 |

### Security FAQ

**Does Onam ever write to my AWS account?** No. The IAM role includes only read permissions. There is no Allow statement for write, delete, or modify actions.

**What if I revoke the role?** Scanning stops immediately. No orphaned credentials remain — Onam stores only the role ARN, not credentials.

**Can I restrict which services are scanned?** Yes. You can create a custom policy that limits which services the role can access. Note that restricting access means those services will not appear in findings.

## Next steps

- [Connect Microsoft Azure](/docs/onboarding/azure) — repeat the process for your next cloud; Onam covers all 7.
- [CSPM](/docs/features/cspm) — how the 2,278 AWS rules become prioritized findings.
- [CDR](/docs/features/cdr) — turn on CloudTrail-based threat detection for this account.
- [Book a demo](/request-demo) — walk through your first scan results with an Onam engineer.
`,
  },
  {
    slug: "onboarding/azure",
    title: "Connect Microsoft Azure",
    breadcrumb: "Onboarding / Azure",
    body: `
This guide walks you through connecting an Azure subscription to Onam using a service principal with read-only access. You register an app in Microsoft Entra ID, create a client secret, assign the built-in **Reader** role, and paste the credentials into the Onam console. The connection is read-only: Onam never makes changes to your Azure environment.

**Time to complete**: ~20 minutes. **Azure knowledge required**: Microsoft Entra ID (Azure AD), IAM basics.

![Azure onboarding flow: register the application, assign the Reader role, create a client secret, first scan runs](/diagrams/onboard-azure.svg)

## How the connection works

The diagram above shows the connection model end-to-end. Onam connects to Azure via a **service principal in Microsoft Entra ID** with the **Reader** role at subscription scope. You register an app, generate a client secret, assign Reader, and enter the credentials in the Onam console — Onam then authenticates via OAuth2 client credentials and reads resource configurations through the Azure Resource Manager API.

- **Reader role only** — Microsoft's built-in least-privilege read role. No write actions are possible.
- **Scoped to the subscriptions you assign** — Onam cannot see subscriptions you didn't explicitly grant Reader on.
- **Client secret expires on the schedule you set** — 24 months recommended, with a calendar reminder to rotate.

> **How the connection stays read-only:** the service principal holds only the built-in **Reader** role plus read-only Microsoft Graph permissions (\`Directory.Read.All\`, \`Policy.Read.All\`, \`AuditLog.Read.All\`). Azure RBAC enforces the boundary on every API call — Onam cannot exceed the roles you assigned. The client secret is stored encrypted (AWS Secrets Manager with KMS) and you can revoke it in Entra ID at any time to sever access instantly.

### Before you begin

- An Azure subscription with the \`Owner\` or \`User Access Administrator\` role
- Permission to register applications in Microsoft Entra ID (Azure AD)
- An Onam account with at least the \`tenant_admin\` role

## Step 1 — Register an app and create a client secret

### Register the app (Azure Portal)

1. Open [Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade)
2. Navigate to **App registrations → New registration**
3. Name: \`cspm-scanner\` (or any name you prefer)
4. Supported account types: **Accounts in this organizational directory only**
5. Redirect URI: leave blank
6. Click **Register**
7. Copy the **Application (client) ID** and **Directory (tenant) ID** — you'll need these later

### Register the app (Azure CLI)

\`\`\`bash
# Create the App Registration
az ad app create --display-name cspm-scanner

# Get the App ID
APP_ID=$(az ad app list --display-name cspm-scanner --query '[0].appId' -o tsv)
echo "App ID: $APP_ID"

# Create a Service Principal
az ad sp create --id $APP_ID

# Get your Tenant ID
TENANT_ID=$(az account show --query tenantId -o tsv)
echo "Tenant ID: $TENANT_ID"
\`\`\`

### Create the client secret (Azure Portal)

1. In your App Registration, navigate to **Certificates & secrets**
2. Click **New client secret**
3. Description: \`cspm-scanner-secret\`
4. Expiry: **24 months** (recommended — set a calendar reminder to rotate)
5. Click **Add**

### Create the client secret (Azure CLI)

\`\`\`bash
# Create a client secret (valid for 2 years)
SECRET=$(az ad app credential reset \\
  --id $APP_ID \\
  --years 2 \\
  --query password -o tsv)
echo "Client Secret: $SECRET"
\`\`\`

> Copy the secret value immediately — Azure shows it exactly once. If you lose it, generate a new secret; the old one keeps working until you delete it or it expires.

## Step 2 — Assign the Reader role at subscription scope

Reader is the **lowest-privilege built-in Azure role that grants read access to every resource type**. Assigning it at subscription scope automatically covers every resource group and every resource within those groups.

| Scope | What the role grants | Why we recommend subscription scope |
| --- | --- | --- |
| **Subscription (recommended)** | Read access to every resource group and resource in the subscription | One assignment covers everything; new resource groups automatically inherit |
| **Resource group** | Read access to that specific group only | Tighter scope — but you'll need to re-assign on every new resource group |
| **Management group** | Read access across multiple subscriptions | Best for multi-subscription orgs — assign once, covers all subs |

### Using the Azure Portal

1. Navigate to **Subscriptions** → select your subscription
2. Go to **Access control (IAM) → Add → Add role assignment**
3. Role: **Reader**
4. Assign access to: **User, group, or service principal**
5. Select: \`cspm-scanner\` (your App Registration)
6. Click **Review + assign**

### Using the Azure CLI

\`\`\`bash
# Get your Subscription ID
SUB_ID=$(az account show --query id -o tsv)
echo "Subscription ID: $SUB_ID"

# Assign Reader role
az role assignment create \\
  --assignee $APP_ID \\
  --role Reader \\
  --scope /subscriptions/$SUB_ID
\`\`\`

## Step 3 — Grant Microsoft Graph permissions

To scan Microsoft Entra ID resources (users, groups, app registrations, conditional access policies), grant three application-level Graph API permissions:

| Permission | GUID (for CLI) | What it enables |
| --- | --- | --- |
| \`Directory.Read.All\` | \`7ab1d382-f21e-4acd-a863-ba3e13f7da61\` | Read users, groups, and app registrations |
| \`Policy.Read.All\` | \`246dd0d5-5bd0-4def-940b-0421030a5b68\` | Read conditional access and authorization policies |
| \`AuditLog.Read.All\` | \`b0afded3-3588-46d8-8b3d-9842eff778da\` | Read Entra ID sign-in and audit logs |

### Using the Azure Portal

1. In your App Registration, go to **API permissions → Add a permission**
2. Select **Microsoft Graph**
3. Select **Application permissions** (not Delegated)
4. Add \`Directory.Read.All\`, \`Policy.Read.All\`, and \`AuditLog.Read.All\`
5. Click **Grant admin consent** (requires Global Administrator or Privileged Role Administrator)

### Using the Azure CLI

\`\`\`bash
# Add Microsoft Graph permissions
GRAPH_APP_ID="00000003-0000-0000-c000-000000000000"

az ad app permission add \\
  --id $APP_ID \\
  --api $GRAPH_APP_ID \\
  --api-permissions \\
    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \\
    246dd0d5-5bd0-4def-940b-0421030a5b68=Role \\
    b0afded3-3588-46d8-8b3d-9842eff778da=Role

# Grant admin consent
az ad app permission admin-consent --id $APP_ID
\`\`\`

## Step 4 — Connect and run your first scan

1. In the Onam console, navigate to **Onboarding → Connect Cloud Account**
2. Select **Microsoft Azure**
3. Fill in the four credential fields (table below)
4. Enter an **Account Alias** (friendly name)
5. Click **Validate Connection**

| Field | Where to find it |
| --- | --- |
| **Subscription ID** | \`az account show --query id -o tsv\` |
| **Tenant ID (Directory ID)** | App Registration → Overview |
| **Application (client) ID** | App Registration → Overview |
| **Client Secret** | The value you copied in Step 1 (shown once) |

### Run your first scan

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the subscription you just added
3. Click **Run Scan Now** — the first scan typically completes in 15–60 minutes depending on subscription size

You receive an in-app notification and an email when the scan completes.

### Multi-subscription setup

To connect multiple Azure subscriptions, repeat Steps 2–4 for each subscription. You can reuse the same App Registration — just assign the Reader role at each subscription scope. For Azure Management Groups (to cover all subscriptions at once):

\`\`\`bash
# Assign Reader at management group scope
MG_ID="your-management-group-id"

az role assignment create \\
  --assignee $APP_ID \\
  --role Reader \\
  --scope /providers/Microsoft.Management/managementGroups/$MG_ID
\`\`\`

## What gets scanned

Onam evaluates **112 Azure services** against **3,741 posture rules**, plus 202 identity-focused CIEM rules — the largest per-cloud rule set in Onam's 10,000+ rule registry. New services are added on a quarterly cadence.

| Category | Services scanned |
| --- | --- |
| **Compute** | Virtual Machines · AKS Clusters · Azure Functions · App Service · Container Instances · Virtual Machine Scale Sets |
| **Storage & Data** | Blob Storage · Azure SQL Database · Cosmos DB · Azure Database for PostgreSQL · Azure Database for MySQL · Data Lake Storage · Synapse |
| **Networking** | Virtual Networks · NSGs · Azure Firewall · Application Gateway · Front Door · DDoS Protection · Private Endpoints |
| **Identity & Security** | Entra ID Users and Groups · App Registrations · Managed Identities · Key Vault · Conditional Access Policies · Defender for Cloud · Sentinel Workspace |
| **Monitoring** | Diagnostic Settings · Activity Logs · Monitor Alerts · Log Analytics Workspaces |

The same service principal also powers behavioral threat detection: Onam's [CDR engine](/docs/features/cdr) ingests Azure Monitor activity logs (exported to Blob Storage) and correlates them into threat findings.

## Troubleshooting and secret rotation

| Error | Cause | Fix |
| --- | --- | --- |
| \`AuthenticationFailed\` | Wrong tenant ID or client ID | Verify values from App Registration Overview page |
| \`InvalidClientSecret\` | Secret expired or copied incorrectly | Regenerate the client secret in Entra ID |
| \`Authorization_RequestDenied\` | Reader role not assigned | Assign Reader role at subscription scope (Step 2) |
| No Entra ID resources in findings | Graph permissions not granted | Complete Step 3 and grant admin consent |
| \`InsufficientPrivileges\` | Admin consent not granted | A Global Admin must grant admin consent for Graph permissions |

### Rotating the client secret

Client secrets expire. Set a calendar reminder before expiry:

\`\`\`bash
# Create a new secret before the old one expires
NEW_SECRET=$(az ad app credential reset --id $APP_ID --years 2 --query password -o tsv)

# Update the credential in the Onam console:
# Onboarding → Cloud Accounts → [your account] → Edit → Update Secret
\`\`\`

## Next steps

- [Connect Google Cloud Platform](/docs/onboarding/gcp) — repeat the process for your next cloud; Onam covers all 7.
- [CIEM](/docs/features/ciem) — analyze Entra ID identities and effective permissions across your subscriptions.
- [CDR](/docs/features/cdr) — turn on activity-log threat detection for this subscription.
- [Book a demo](/request-demo) — walk through your first scan results with an Onam engineer.
`,
  },
  {
    slug: "onboarding/gcp",
    title: "Connect Google Cloud Platform (GCP)",
    breadcrumb: "Onboarding / GCP",
    body: `
This guide walks you through connecting a GCP project or organization to Onam using a service account with read-only access. You enable the required APIs, create the service account, assign six built-in read-only roles, and upload a JSON key (or configure keyless Workload Identity Federation). The connection is read-only: Onam never makes changes to your GCP environment.

**Time to complete**: ~20 minutes. **GCP knowledge required**: IAM basics, service accounts, gcloud CLI (optional).

![GCP onboarding flow: create the service account, assign IAM roles, download the JSON key, first scan runs](/diagrams/onboard-gcp.svg)

## How the connection works

The diagram above shows the connection model end-to-end. Onam connects to GCP via a **service account with read-only roles** at the project (or organization) level. You create the service account, assign the roles, generate a JSON key, and upload the key in the Onam console — Onam then authenticates with the service-account credentials and reads resource configurations through the GCP APIs.

- **Read-only roles only** — \`roles/viewer\`, \`roles/iam.securityReviewer\`, \`roles/cloudasset.viewer\`, and three more. No write actions are possible.
- **Scoped to the project (or organization) you grant** — Onam cannot see projects you didn't assign roles in.
- **Keys can be rotated at any time** — rotate at least every 90 days, or skip keys entirely with Workload Identity Federation (available on Enterprise plans).

> **How the connection stays read-only:** every role you assign in this guide is a Google-built read-only role — none contains a single write, delete, or \`setIamPolicy\` permission, and GCP IAM enforces that on every API call. The uploaded key is stored in AWS Secrets Manager, encrypted with KMS; disable or delete the key in GCP at any time and access ends instantly.

### Before you begin

- A GCP project with the \`Owner\` or \`Security Admin\` role, to create service accounts and assign roles
- Billing enabled on the GCP project
- An Onam account with at least the \`tenant_admin\` role

## Step 1 — Enable APIs and create the service account

### Enable the required APIs

\`\`\`bash
# Enable all APIs required for scanning
gcloud services enable \\
  cloudasset.googleapis.com \\
  cloudresourcemanager.googleapis.com \\
  iam.googleapis.com \\
  compute.googleapis.com \\
  container.googleapis.com \\
  storage.googleapis.com \\
  sqladmin.googleapis.com \\
  monitoring.googleapis.com \\
  logging.googleapis.com \\
  securitycenter.googleapis.com \\
  cloudkms.googleapis.com \\
  dns.googleapis.com \\
  run.googleapis.com \\
  cloudfunctions.googleapis.com \\
  bigquery.googleapis.com \\
  redis.googleapis.com \\
  --project=YOUR_PROJECT_ID
\`\`\`

Or enable them in the [Google Cloud Console](https://console.cloud.google.com/apis/dashboard).

### Create the service account (GCP Console)

1. Open [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **Create Service Account**
3. Name: \`cspm-scanner\`
4. Description: \`Read-only scanner for Onam\`
5. Click **Create and Continue**
6. Skip roles for now (assigned in Step 2)
7. Click **Done**
8. Copy the **Service Account email** (format: \`cspm-scanner@PROJECT_ID.iam.gserviceaccount.com\`)

### Create the service account (gcloud CLI)

\`\`\`bash
PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts create cspm-scanner \\
  --display-name="CSPM Scanner" \\
  --description="Read-only scanner for Onam" \\
  --project=$PROJECT_ID

SA_EMAIL="cspm-scanner@\${PROJECT_ID}.iam.gserviceaccount.com"
echo "Service Account: $SA_EMAIL"
\`\`\`

## Step 2 — Assign read-only roles

Six built-in GCP roles are required. Each one grants read access to a specific area of GCP — there are no write actions in any of them.

| Role | What it grants | Why required |
| --- | --- | --- |
| \`roles/viewer\` | Basic read access to most GCP services | Core resource discovery |
| \`roles/iam.securityReviewer\` | Read IAM policies | IAM posture analysis |
| \`roles/cloudasset.viewer\` | Cloud Asset Inventory access | Comprehensive resource inventory |
| \`roles/cloudkms.viewer\` | KMS key metadata read | Encryption posture analysis |
| \`roles/container.clusterViewer\` | GKE cluster configuration read | Container security analysis |
| \`roles/securitycenter.findingsViewer\` | Security Command Center findings | Threat detection enrichment |

\`\`\`bash
PROJECT_ID=$(gcloud config get-value project)
SA_EMAIL="cspm-scanner@\${PROJECT_ID}.iam.gserviceaccount.com"

# Core read access
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/viewer"

# IAM and security policy reading
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/iam.securityReviewer"

# Cloud Asset API (resource inventory)
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/cloudasset.viewer"

# KMS key metadata
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/cloudkms.viewer"

# GKE cluster details
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/container.clusterViewer"

# Security Command Center findings
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/securitycenter.findingsViewer"
\`\`\`

## Step 3 — Create a key and connect

### Create a service account key

\`\`\`bash
# Create and download the key
gcloud iam service-accounts keys create cspm-key.json \\
  --iam-account=$SA_EMAIL \\
  --project=$PROJECT_ID

echo "Key file created: cspm-key.json"
\`\`\`

> Treat \`cspm-key.json\` like a password. Do not commit it to version control, and delete the local copy immediately after uploading it to the Onam console.

### Connect in the Onam console

1. In the Onam console, navigate to **Onboarding → Connect Cloud Account**
2. Select **Google Cloud Platform**
3. Upload the \`cspm-key.json\` file (or paste its contents)
4. Enter a **Project Alias** (friendly name)
5. Select which **Services** to scan or keep the default (all)
6. Click **Validate Connection**

After validation, delete the local key file:

\`\`\`bash
rm cspm-key.json
\`\`\`

### Run your first scan

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the project you just added
3. Click **Run Scan Now** — the first scan typically completes in 15–60 minutes depending on project size

You receive an in-app notification and an email when the scan completes.

## Organization-wide scanning and keyless federation

### Organization-level scanning (all projects)

To scan all projects in a GCP Organization, grant the roles at organization level — they inherit down to every project:

\`\`\`bash
ORG_ID=$(gcloud organizations list --format='value(name)' | head -1)
ORG_ID=\${ORG_ID#organizations/}

# Grant roles at org level (inherits to all projects)
gcloud organizations add-iam-policy-binding $ORG_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/viewer"

gcloud organizations add-iam-policy-binding $ORG_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/iam.securityReviewer"

gcloud organizations add-iam-policy-binding $ORG_ID \\
  --member="serviceAccount:\${SA_EMAIL}" \\
  --role="roles/cloudasset.viewer"
\`\`\`

Then connect each project in the Onam console using the same service account key.

### Workload Identity Federation (keyless — recommended for production)

Instead of a JSON key, use Workload Identity Federation for keyless authentication:

\`\`\`bash
# Create a Workload Identity Pool
gcloud iam workload-identity-pools create cspm-pool \\
  --location=global \\
  --display-name="CSPM Scanner Pool"

# Create a provider (AWS — Onam runs on AWS)
gcloud iam workload-identity-pools providers create-aws cspm-provider \\
  --location=global \\
  --workload-identity-pool=cspm-pool \\
  --account-id=ONAM_PLATFORM_AWS_ACCOUNT_ID

# Bind the Service Account
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \\
  --role="roles/iam.workloadIdentityUser" \\
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/cspm-pool/*"
\`\`\`

Contact support@onam.io to enable Workload Identity Federation for your Onam tenant.

## What gets scanned

Onam evaluates **47 GCP services** against **2,676 posture rules**, plus 176 identity-focused CIEM rules — part of the 10,000+ rule registry spanning all seven supported clouds. New services are added on a quarterly cadence.

| Category | Services scanned |
| --- | --- |
| **Compute** | Compute Engine VMs · GKE Clusters and Nodes · Cloud Run Services · Cloud Functions · App Engine |
| **Storage & Data** | Cloud Storage Buckets · Cloud SQL Instances · Cloud Spanner · BigQuery Datasets · Firestore · Memorystore Redis · Cloud Bigtable |
| **Networking** | VPC Networks · Firewall Rules · Cloud Load Balancing · Cloud Armor WAF · Cloud DNS · VPC Service Controls |
| **Identity & Security** | IAM Bindings and Policies · Service Accounts · Cloud KMS Keys · Secret Manager · Security Command Center · Binary Authorization |
| **Monitoring & Audit** | Cloud Logging · Cloud Monitoring · Audit Logs configuration · Log Sinks |

The same service account also powers behavioral threat detection: Onam's [CDR engine](/docs/features/cdr) ingests Cloud Audit Logs (exported to a GCS bucket) and correlates them into threat findings.

## Troubleshooting and key rotation

| Error | Cause | Fix |
| --- | --- | --- |
| \`Permission denied on project\` | \`roles/viewer\` not assigned at project level | Run the Step 2 role assignments again |
| \`Cloud Asset API not enabled\` | API disabled | Run \`gcloud services enable cloudasset.googleapis.com\` |
| \`Invalid key format\` | Key file corrupted during copy-paste | Re-download the JSON key file |
| GKE clusters not appearing | \`container.clusterViewer\` missing | Assign \`roles/container.clusterViewer\` |
| No KMS findings | \`cloudkms.viewer\` missing | Assign \`roles/cloudkms.viewer\` |
| \`UNAUTHENTICATED\` | Service account key expired or deleted | Create a new key in Step 3 |

### Key rotation

Rotate service account keys at least every 90 days (or move to Workload Identity Federation and skip keys entirely):

\`\`\`bash
# Create a new key
gcloud iam service-accounts keys create cspm-key-new.json \\
  --iam-account=$SA_EMAIL

# Upload the new key in the Onam console:
# Onboarding → Cloud Accounts → [your account] → Edit → Update Key

# Then delete the old key (list key IDs first)
gcloud iam service-accounts keys list --iam-account=$SA_EMAIL

gcloud iam service-accounts keys delete OLD_KEY_ID \\
  --iam-account=$SA_EMAIL

# Delete the local file
rm cspm-key-new.json
\`\`\`

## Next steps

- [Connect Kubernetes clusters](/docs/onboarding/kubernetes) — add in-cluster visibility for your GKE clusters.
- [CSPM](/docs/features/cspm) — how the 2,676 GCP rules become prioritized findings.
- [Compliance frameworks](/docs/compliance/frameworks) — map GCP findings to CIS, NIST, PCI-DSS, and 78 other frameworks.
- [Book a demo](/request-demo) — walk through your first scan results with an Onam engineer.
`,
  },
  {
    slug: "onboarding/oci",
    title: "Connect Oracle Cloud Infrastructure (OCI)",
    breadcrumb: "Onboarding / OCI",
    body: `
This guide walks you through connecting an OCI tenancy to Onam using a read-only IAM user and an API signing key. You generate an RSA key pair, create a dedicated user/group/policy with inspect and read verbs only, upload the public key, and enter the credentials in the Onam console. The connection is read-only: Onam never makes changes to your OCI environment.

**Time to complete**: ~20 minutes. **OCI knowledge required**: IAM users, groups, policies, API keys.

![OCI onboarding flow: create the IAM user, grant read access, generate the API key, first scan runs](/diagrams/onboard-oci.svg)

## How the connection works

The diagram above shows the connection model end-to-end. Onam connects to OCI via a **dedicated IAM user with API key signing**, scoped to inspect/read permissions across all resources. You generate an API key pair, create the user/group/policy, upload the public key, and enter the credentials in the Onam console — Onam then signs API requests with the private key and reads resource configurations through the OCI REST APIs.

- **Inspect + read permissions only** — no write actions are possible.
- **Scoped to the tenancy or compartments you grant** — the policy you write controls Onam's reach.
- **API keys can be rotated at any time** — old keys can be revoked instantly without service interruption (rotation is hot-swappable).

> **How the connection stays read-only:** the only policy statements the scanner group holds use OCI's \`inspect\` and \`read\` verbs — the two lowest of OCI's four permission verbs. There is no \`use\` or \`manage\` grant anywhere, and OCI IAM enforces that on every signed request. The private key is stored in AWS Secrets Manager, encrypted with KMS; delete the API key from the user in OCI and access ends instantly.

### Before you begin

- An OCI tenancy with Administrator access to create IAM users, groups, and policies
- \`openssl\` installed locally (for key generation)
- An Onam account with at least the \`tenant_admin\` role

## Step 1 — Generate an API signing key pair

\`\`\`bash
# Create a directory for the keys
mkdir -p ~/.oci/cspm

# Generate RSA private key (2048-bit minimum, 4096 recommended)
openssl genrsa -out ~/.oci/cspm/cspm_api_key.pem 4096
chmod 600 ~/.oci/cspm/cspm_api_key.pem

# Extract the public key
openssl rsa -pubout \\
  -in ~/.oci/cspm/cspm_api_key.pem \\
  -out ~/.oci/cspm/cspm_api_key_public.pem

echo "Public key:"
cat ~/.oci/cspm/cspm_api_key_public.pem
\`\`\`

## Step 2 — Create the IAM user, group, and policy

### Using the OCI Console

**Create the user:**

1. Open [OCI Console → Identity & Security → Users](https://cloud.oracle.com/identity/users)
2. Click **Create User**
3. Name: \`cspm-scanner\`
4. Description: \`Read-only scanner for Onam\`
5. Click **Create**
6. Copy the **User OCID** from the user details page

**Create the group and add the user:**

1. Navigate to **Identity & Security → Groups** and click **Create Group**
2. Name: \`CspmScanners\`, then click **Create**
3. Open the \`CspmScanners\` group and click **Add User to Group**
4. Select \`cspm-scanner\`

**Create the policy:**

1. Navigate to **Identity & Security → Policies**
2. Click **Create Policy**
3. Name: \`CspmScannerPolicy\`
4. Compartment: **root** (tenancy level — required for full coverage)
5. Enter the two policy statements below and click **Create**

\`\`\`
Allow group CspmScanners to inspect all-resources in tenancy
Allow group CspmScanners to read all-resources in tenancy
\`\`\`

### Using the OCI CLI

\`\`\`bash
# Set your tenancy OCID
TENANCY_OCID="ocid1.tenancy.oc1..YOUR_TENANCY_OCID"

# Create user
oci iam user create \\
  --name cspm-scanner \\
  --description "Read-only scanner for Onam" \\
  --compartment-id $TENANCY_OCID

USER_OCID=$(oci iam user list --compartment-id $TENANCY_OCID \\
  --query "data[?name=='cspm-scanner'].id | [0]" --raw-output)

# Create group
oci iam group create \\
  --name CspmScanners \\
  --description "CSPM scanner group" \\
  --compartment-id $TENANCY_OCID

GROUP_OCID=$(oci iam group list --compartment-id $TENANCY_OCID \\
  --query "data[?name=='CspmScanners'].id | [0]" --raw-output)

# Add user to group
oci iam group add-user \\
  --user-id $USER_OCID \\
  --group-id $GROUP_OCID

# Create policy
oci iam policy create \\
  --name CspmScannerPolicy \\
  --compartment-id $TENANCY_OCID \\
  --description "Onam read-only access" \\
  --statements '["Allow group CspmScanners to inspect all-resources in tenancy","Allow group CspmScanners to read all-resources in tenancy"]'
\`\`\`

### Restrict scanning to specific compartments (optional)

OCI organizes resources into compartments. The tenancy-level policy above covers all compartments, including nested ones. To restrict scanning, scope the statements to a compartment instead:

\`\`\`
Allow group CspmScanners to inspect all-resources in compartment COMPARTMENT_NAME
Allow group CspmScanners to read all-resources in compartment COMPARTMENT_NAME
\`\`\`

Note that restricting to specific compartments excludes resources in other compartments from findings.

## Step 3 — Upload the public key and gather values

**Upload the API public key:**

1. In the OCI Console, navigate to **Identity → Users → cspm-scanner**
2. Click **API Keys → Add API Key**
3. Select **Paste Public Key**
4. Paste the contents of \`~/.oci/cspm/cspm_api_key_public.pem\`
5. Click **Add**
6. Copy the **Fingerprint** shown (format: \`aa:bb:cc:dd:ee:ff:...\`)
7. Copy the **User OCID** and **Tenancy OCID** from the same page

**Gather the values needed to connect:**

\`\`\`bash
# Print all values needed for the Onam console
echo "Tenancy OCID: $TENANCY_OCID"
echo "User OCID: $USER_OCID"
echo "Region: $(oci iam region-subscription list --query 'data[?["is-home-region"]==\\\`true\\\`].["region-name"] | [0]' --raw-output)"
echo "Fingerprint: (copied from OCI Console in the previous step)"
echo "Private Key:"
cat ~/.oci/cspm/cspm_api_key.pem
\`\`\`

## Step 4 — Connect and run your first scan

1. In the Onam console, navigate to **Onboarding → Connect Cloud Account**
2. Select **Oracle Cloud Infrastructure**
3. Fill in the five credential fields (table below)
4. Click **Validate Connection**

| Field | Format / example |
| --- | --- |
| **Tenancy OCID** | starts with \`ocid1.tenancy.oc1..\` |
| **User OCID** | starts with \`ocid1.user.oc1..\` |
| **Home Region** | e.g. \`ap-mumbai-1\`, \`us-ashburn-1\` |
| **Fingerprint** | the key fingerprint from Step 3 |
| **Private Key** | full contents of \`cspm_api_key.pem\` |

### Run your first scan

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the tenancy you just added
3. Click **Run Scan Now** — the first scan typically completes in 15–60 minutes depending on tenancy size

You receive an in-app notification and an email when the scan completes.

## What gets scanned

Onam evaluates **42 OCI services** against **1,451 posture rules**, plus 107 identity-focused CIEM rules — part of the 10,000+ rule registry spanning all seven supported clouds. New services are added on a quarterly cadence.

| Category | Services scanned |
| --- | --- |
| **Compute** | Compute Instances · OKE Clusters · Container Instances · Functions |
| **Storage & Data** | Object Storage Buckets · Block Volumes · File Storage · Autonomous Database · DB Systems · MySQL Database · NoSQL Database |
| **Networking** | VCNs · Security Lists · Network Security Groups · Load Balancers · Internet Gateways · NAT Gateways · DRG · WAF Policies |
| **Identity & Security** | IAM Users and Groups · Policies · Vaults and Keys · Secrets · Compartments · Identity Domains |
| **Monitoring** | Audit Logs · Events Service · Notifications · Logging configuration |

The same credentials also power behavioral threat detection: Onam's [CDR engine](/docs/features/cdr) ingests events from the OCI Audit service and correlates them into threat findings.

## Troubleshooting and key rotation

| Error | Cause | Fix |
| --- | --- | --- |
| \`NotAuthenticated\` | Wrong fingerprint, key, or user OCID | Re-verify all values; re-upload the public key if needed |
| \`NotAuthorized\` | Policy not created or not at tenancy level | Verify the policy is in the root compartment with the correct group name |
| \`InvalidParameter: region\` | Unknown region identifier | Use the region identifier format (e.g., \`ap-mumbai-1\`, not \`Mumbai\`) |
| Resources missing from specific compartments | Policy scoped to wrong compartment | Move the policy to the root compartment level |
| \`403\` on a specific service | Policy missing the \`inspect\` verb for that service | The statements above cover all services; check group membership |

### API key rotation

Rotate API keys every 90 days. Rotation is hot-swappable — upload the new key before removing the old one and scanning is never interrupted:

\`\`\`bash
# Generate new key pair
openssl genrsa -out ~/.oci/cspm/cspm_api_key_new.pem 4096
openssl rsa -pubout \\
  -in ~/.oci/cspm/cspm_api_key_new.pem \\
  -out ~/.oci/cspm/cspm_api_key_new_public.pem

# Upload new public key in the OCI Console
# (Identity → Users → cspm-scanner → API Keys → Add API Key)

# Update the private key in the Onam console:
# Onboarding → Cloud Accounts → [your account] → Edit → Update Key

# Delete the old key from the OCI Console after confirming the new one works
\`\`\`

## Next steps

- [Connect Alibaba Cloud](/docs/onboarding/alicloud) — repeat the process for your next cloud; Onam covers all 7.
- [CSPM](/docs/features/cspm) — how the 1,451 OCI rules become prioritized findings.
- [Compliance](/docs/features/compliance) — map OCI findings to CIS, ISO 27001, PCI-DSS, and 78 other frameworks.
- [Book a demo](/request-demo) — walk through your first scan results with an Onam engineer.
`,
  },
  {
    slug: "onboarding/alicloud",
    title: "Connect Alibaba Cloud",
    breadcrumb: "Onboarding / Alibaba Cloud",
    body: `
This guide walks you through connecting an Alibaba Cloud account to Onam using a RAM (Resource Access Management) user with read-only access. You create the user, attach the \`AliyunReadOnlyAccess\` system policy plus a small custom security policy, and enter the AccessKey credentials in the Onam console. The connection is read-only: Onam never makes changes to your Alibaba Cloud environment.

**Time to complete**: ~15 minutes. **Alibaba Cloud knowledge required**: RAM users, policies, and AccessKeys.

![Alibaba Cloud onboarding flow: create the RAM user, attach the read policy, enter credentials, first scan runs](/diagrams/onboard-alicloud.svg)

## How the connection works

The diagram above shows the connection model end-to-end. Onam connects to Alibaba Cloud via a **dedicated RAM user with the ReadOnlyAccess policy** (plus a few additional service-specific read permissions). You create the user, attach the policies, generate an AccessKey pair, and enter the credentials in the Onam console — Onam then authenticates with the AccessKey and reads resource configurations through the Alibaba Cloud APIs.

- **ReadOnlyAccess + service-specific read permissions** — no write actions are possible.
- **Scoped to the account you grant** — Onam cannot see other Alibaba Cloud accounts.
- **AccessKeys can be rotated at any time** — old keys can be revoked instantly.

> **How the connection stays read-only:** the RAM user holds only Alibaba's system \`AliyunReadOnlyAccess\` policy plus a custom policy whose every action is a \`Describe*\`, \`Get*\`, \`List*\`, or \`Lookup*\` read call. RAM enforces that boundary on every API request. The AccessKey is stored in AWS Secrets Manager, encrypted with KMS; delete the key in the RAM console and access ends instantly.

### Before you begin

- An Alibaba Cloud account with RAM management permissions
- An Onam account with at least the \`tenant_admin\` role
- Your Alibaba Cloud **Account ID** (found in the top-right account menu)

## Step 1 — Create a RAM user

### Using the Alibaba Cloud Console

1. Log in to the [Alibaba Cloud Console](https://ram.console.aliyun.com/users)
2. Navigate to **RAM Console → Users → Create User**
3. **Logon Name**: \`cspm-scanner\`
4. **Display Name**: \`CSPM Scanner\`
5. **Access Mode**: select **Programmatic Access** (AccessKey only)
6. Click **OK**
7. **Save the AccessKey ID and Secret** shown immediately — the secret cannot be retrieved again

### Using the Alibaba Cloud CLI (aliyun)

\`\`\`bash
# Create the RAM user
aliyun ram CreateUser \\
  --UserName cspm-scanner \\
  --DisplayName "CSPM Scanner"

# Create AccessKey for the user
aliyun ram CreateAccessKey \\
  --UserName cspm-scanner

# Save the output — AccessKeyId and AccessKeySecret shown once only
\`\`\`

> The AccessKey secret is shown exactly once, at creation time. If you lose it, delete the key and create a new one — there is no recovery path.

## Step 2 — Attach read-only policies

### Attach AliyunReadOnlyAccess

Using the console:

1. In the RAM Console, open the \`cspm-scanner\` user
2. Click **Add Permissions**
3. Search for \`ReadOnlyAccess\`
4. Select **AliyunReadOnlyAccess** (system policy)
5. Click **OK**

Using the CLI:

\`\`\`bash
aliyun ram AttachPolicyToUser \\
  --PolicyName AliyunReadOnlyAccess \\
  --PolicyType System \\
  --UserName cspm-scanner
\`\`\`

### Additional permissions for full coverage

\`AliyunReadOnlyAccess\` covers most services, but some security-specific APIs need additional grants:

\`\`\`bash
# Create a custom policy for security scanning
aliyun ram CreatePolicy \\
  --PolicyName CspmSecurityScanPolicy \\
  --PolicyDocument '{
    "Version": "1",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "actiontrail:LookupEvents",
          "actiontrail:DescribeTrails",
          "actiontrail:GetTrailStatus",
          "sts:GetCallerIdentity",
          "resourcemanager:ListAccounts",
          "resourcemanager:GetResourceDirectory",
          "cloudfirewall:DescribeInstanceMembers",
          "cloudfirewall:DescribeVpcFirewallList",
          "sas:DescribeSecurityCheckScheduleConfig",
          "sas:DescribeRiskCheckSummary"
        ],
        "Resource": "*"
      }
    ]
  }'

# Attach the custom policy
aliyun ram AttachPolicyToUser \\
  --PolicyName CspmSecurityScanPolicy \\
  --PolicyType Custom \\
  --UserName cspm-scanner
\`\`\`

## Step 3 — Connect and run your first scan

### Find your Account ID

1. Click your avatar in the top-right of the Alibaba Cloud Console
2. Select **Security Settings** or hover over the account name
3. The **Account ID** is a numeric string (e.g., \`1234567890123456\`)

Or via the CLI:

\`\`\`bash
aliyun sts GetCallerIdentity
# AccountId is in the response
\`\`\`

### Connect in the Onam console

1. In the Onam console, navigate to **Onboarding → Connect Cloud Account**
2. Select **Alibaba Cloud**
3. Fill in the credential fields (table below)
4. Click **Validate Connection**

| Field | Value |
| --- | --- |
| **Account ID** | numeric account identifier from the step above |
| **AccessKey ID** | from Step 1 |
| **AccessKey Secret** | from Step 1 (shown once) |
| **Home Region** | e.g. \`cn-hangzhou\`, \`ap-southeast-1\` |
| **Account Alias** | any friendly name |

### Run your first scan

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the account you just added
3. Click **Run Scan Now** — the first scan typically completes in 15–60 minutes depending on account size

You receive an in-app notification and an email when the scan completes.

## Multi-account setup (Resource Directory)

For organizations using Alibaba Cloud Resource Directory (multi-account):

1. Connect the master account first using the steps above
2. In each member account, create a RAM role that trusts the \`cspm-scanner\` user from the master account

\`\`\`bash
# In each member account, create a RAM role trusting the master account
aliyun ram CreateRole \\
  --RoleName CspmCrossAccountRole \\
  --AssumeRolePolicyDocument '{
    "Statement": [{
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "RAM": ["acs:ram::MASTER_ACCOUNT_ID:root"]
      }
    }],
    "Version": "1"
  }'
\`\`\`

Contact support@onam.io to configure multi-account Resource Directory scanning for your tenant.

## What gets scanned

Onam evaluates **20+ Alibaba Cloud services** against **1,541 posture rules**, plus 114 identity-focused CIEM rules — part of the 10,000+ rule registry spanning all seven supported clouds. New services are added on a quarterly cadence.

| Category | Services scanned |
| --- | --- |
| **Compute** | ECS Instances · ACK Clusters · Function Compute · Elastic Container Instance |
| **Storage & Data** | OSS Buckets · RDS Instances · PolarDB · ApsaraDB for Redis · Table Store · ApsaraDB for MongoDB |
| **Networking** | VPCs · Security Groups · Server Load Balancer · Cloud Firewall · WAF · NAT Gateway · Anti-DDoS |
| **Identity & Security** | RAM Users and Roles · RAM Policies · KMS Keys · Secrets Manager · ActionTrail · Cloud Security Center |
| **Monitoring** | Cloud Monitor · Log Service · ActionTrail audit logs |

The same credentials also power behavioral threat detection: Onam's [CDR engine](/docs/features/cdr) ingests ActionTrail events and correlates them into threat findings.

## Troubleshooting and AccessKey rotation

| Error | Cause | Fix |
| --- | --- | --- |
| \`InvalidAccessKeyId\` | AccessKey ID incorrect or user deleted | Re-create the AccessKey in the RAM Console |
| \`SignatureDoesNotMatch\` | AccessKey Secret incorrect | Verify the secret was copied without extra spaces |
| \`NoPermission\` | ReadOnlyAccess policy not attached | Complete Step 2 |
| OSS buckets missing | Cross-region bucket not listed | Ensure Home Region covers the bucket regions |
| ActionTrail events missing | ActionTrail not enabled | Enable ActionTrail in the Alibaba Cloud Console |
| \`InvalidParameter.Region\` | Unsupported region format | Use the region ID format (e.g., \`cn-hangzhou\`, not \`China Hangzhou\`) |

### AccessKey rotation

Rotate AccessKeys every 90 days:

1. In the RAM Console, open the \`cspm-scanner\` user
2. Click **Create AccessKey** to generate a new one
3. Update the credential in the Onam console: **Onboarding → Cloud Accounts → Edit**
4. Verify scanning works with the new key
5. Delete the old AccessKey from the RAM Console

\`\`\`bash
# List existing keys
aliyun ram ListAccessKeys --UserName cspm-scanner

# Delete old key after new one is confirmed working
aliyun ram DeleteAccessKey \\
  --UserName cspm-scanner \\
  --UserAccessKeyId OLD_ACCESS_KEY_ID
\`\`\`

## Next steps

- [Connect IBM Cloud](/docs/onboarding/ibm) — repeat the process for your next cloud; Onam covers all 7.
- [CSPM](/docs/features/cspm) — how the 1,541 Alibaba Cloud rules become prioritized findings.
- [CDR](/docs/features/cdr) — turn on ActionTrail-based threat detection for this account.
- [Book a demo](/request-demo) — walk through your first scan results with an Onam engineer.
`,
  },
  {
    slug: "onboarding/ibm",
    title: "Connect IBM Cloud",
    breadcrumb: "Onboarding / IBM Cloud",
    body: `
This guide walks you through connecting an IBM Cloud account to Onam using a Service ID API key with read-only IAM access. You create an access group holding Viewer/Reader policies, add a Service ID to it, generate an API key, and enter the key in the Onam console. The connection is read-only: Onam never makes changes to your IBM Cloud environment.

**Time to complete**: ~15 minutes. **IBM Cloud knowledge required**: IAM access groups, policies, and API keys.

![IBM Cloud onboarding flow: create the Service ID, assign the Viewer role, generate the API key, first scan runs](/diagrams/onboard-ibm.svg)

## How the connection works

The diagram above shows the connection model end-to-end. Onam connects to IBM Cloud via a **Service ID inside an Access Group** that holds read-only policies. You create the Access Group, attach the policies, create the Service ID, generate an API key, and enter the key in the Onam console — Onam then exchanges the API key for a short-lived IAM Bearer token and reads resource configurations through the IBM Cloud APIs.

- **Read-only policies only** — **Viewer** (platform) and **Reader** (service) roles across IAM-enabled services. No write actions are possible.
- **Scoped to the account you grant** — the Access Group's policies determine Onam's reach.
- **API keys can be rotated at any time** — Service ID API keys are independent of human user accounts, so they survive staff changes.

> **How the connection stays read-only:** the Access Group grants only IBM's **Viewer** platform role and **Reader** service role — neither contains a write, delete, or configuration action, and IBM Cloud IAM enforces that on every call. The API key itself is exchanged for Bearer tokens that expire within the hour, and the stored key (AWS Secrets Manager, KMS-encrypted) can be revoked in the IAM console at any time.

### Before you begin

- An IBM Cloud account with IAM Administrator access
- The \`ibmcloud\` CLI installed and logged in (optional — console steps are also provided)
- An Onam account with at least the \`tenant_admin\` role

## Step 1 — Create an access group with read-only policies

### Install and log in to the IBM Cloud CLI (optional)

\`\`\`bash
# Install IBM Cloud CLI
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh

# Log in
ibmcloud login --sso

# Target your account
ibmcloud account show
\`\`\`

### Create the access group (Console)

1. Open [IBM Cloud IAM → Access groups](https://cloud.ibm.com/iam/groups)
2. Click **Create**
3. Name: \`CspmScanners\`
4. Description: \`Read-only access for Onam scanner\`
5. Click **Create**

### Assign read-only policies (Console)

IBM Cloud uses fine-grained IAM policies per service. Assign **Viewer** (platform) and **Reader** (service) roles:

1. Open the \`CspmScanners\` access group
2. Click **Access → Assign access**
3. Select **All Identity and Access enabled services**
4. Platform role: **Viewer**. Service role: **Reader**
5. Click **Add → Assign**
6. Repeat for **All Account Management Services** with platform role **Viewer**

### Create the group and policies (CLI)

\`\`\`bash
ibmcloud iam access-group-create CspmScanners \\
  --description "Read-only access for Onam scanner"

# Viewer + Reader on all IAM-enabled services
ibmcloud iam access-group-policy-create CspmScanners \\
  --roles Viewer,Reader \\
  --service-name "*"

# Viewer on account management services
ibmcloud iam access-group-policy-create CspmScanners \\
  --roles Viewer \\
  --account-management
\`\`\`

## Step 2 — Create a Service ID and API key

Service IDs are non-human identities for programmatic access — the IBM Cloud equivalent of AWS IAM roles for applications.

### Using the IBM Cloud Console

1. Navigate to [IAM → Service IDs](https://cloud.ibm.com/iam/serviceids)
2. Click **Create**
3. Name: \`cspm-scanner\`. Description: \`Onam read-only scanner\`
4. Click **Create**
5. Open the \`CspmScanners\` access group, click **Service IDs → Add service IDs**, and select \`cspm-scanner\`
6. Open the \`cspm-scanner\` Service ID and click **API keys → Create**
7. Name: \`cspm-api-key\`, then click **Create**
8. **Download or copy the API key value** — it cannot be retrieved again

### Using the IBM Cloud CLI

\`\`\`bash
# Create Service ID
ibmcloud iam service-id-create cspm-scanner \\
  --description "Onam read-only scanner"

# Get Service ID
SERVICE_ID=$(ibmcloud iam service-id cspm-scanner --uuid -q)
echo "Service ID: $SERVICE_ID"

# Add Service ID to access group
ibmcloud iam access-group-service-id-add CspmScanners $SERVICE_ID

# Create API key for Service ID
ibmcloud iam service-api-key-create cspm-api-key $SERVICE_ID \\
  --description "Onam scanner API key"

# The API key value is shown once — save it immediately
\`\`\`

> The API key value is shown exactly once. If you lose it, create a new key and delete the old one — there is no recovery path.

## Step 3 — Connect and run your first scan

### Find your Account ID

\`\`\`bash
# Get Account ID
ACCOUNT_ID=$(ibmcloud account show --output json | jq -r '.account_id')
echo "Account ID: $ACCOUNT_ID"
\`\`\`

Or in the IBM Cloud Console: click your account name in the top bar → **Manage → Account → Account settings**.

### Connect in the Onam console

1. In the Onam console, navigate to **Onboarding → Connect Cloud Account**
2. Select **IBM Cloud**
3. Fill in the credential fields (table below)
4. Click **Validate Connection**

| Field | Value |
| --- | --- |
| **Account ID** | from the step above |
| **API Key** | from Step 2 (shown once) |
| **Home Region** | e.g. \`us-south\`, \`eu-gb\`, \`ap-south\` |
| **Account Alias** | any friendly name |

### Run your first scan

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the account you just added
3. Click **Run Scan Now** — the first scan typically completes in 15–60 minutes depending on account size

You receive an in-app notification and an email when the scan completes.

## Multi-account setup (IBM Cloud Enterprise)

For IBM Cloud Enterprise accounts with multiple sub-accounts:

\`\`\`bash
# List all accounts in the enterprise
ibmcloud enterprise accounts --all

# For each sub-account, create the same Service ID and API key
# using the sub-account context:
ibmcloud login --apikey $MASTER_API_KEY -c SUB_ACCOUNT_ID

# Then repeat Steps 1-3 in each sub-account
\`\`\`

Each sub-account requires its own API key connected in the Onam console.

## What gets scanned

Onam evaluates **15+ IBM Cloud services** against **613 posture rules**, plus 110 identity-focused CIEM rules — part of the 10,000+ rule registry spanning all seven supported clouds. New services are added on a quarterly cadence.

| Category | Services scanned |
| --- | --- |
| **Compute** | Virtual Server Instances · IBM Kubernetes Service (IKS) · Code Engine · Cloud Foundry Apps |
| **Storage & Data** | Cloud Object Storage · IBM Db2 · IBM Cloudant · IBM Databases for PostgreSQL · IBM Databases for Redis · IBM Databases for MongoDB |
| **Networking** | VPC Networks · Security Groups · Load Balancers · Direct Link · Internet Services WAF · Transit Gateway |
| **Identity & Security** | IAM Users and Service IDs · Access Groups and Policies · Key Protect · Hyper Protect Crypto Services · Secrets Manager · Activity Tracker · Security and Compliance Center |
| **Monitoring** | IBM Cloud Monitoring · IBM Log Analysis · Activity Tracker events · Flow Logs |

The same credentials also power behavioral threat detection: Onam's [CDR engine](/docs/features/cdr) ingests activity events delivered to Cloud Object Storage and correlates them into threat findings.

## Troubleshooting and API key rotation

| Error | Cause | Fix |
| --- | --- | --- |
| \`BXNIM0109E: API key not valid\` | API key deleted or expired | Create a new API key in Step 2 |
| \`Not Authorized\` | Service ID not in the access group | Add the Service ID to the CspmScanners group (Step 2) |
| Resources missing from specific regions | Region not selected | Add additional regions in: Onboarding → Edit Account |
| IKS clusters missing | Kubernetes service permission missing | Ensure the Reader role is assigned for the Kubernetes service |
| Key Protect keys not appearing | Key Protect Reader role missing | Add the Reader role for Key Protect in the Access Group |
| Activity Tracker events missing | Activity Tracker not provisioned | Provision Activity Tracker in your IBM Cloud account |

### API key rotation

Rotate IBM Cloud API keys every 90 days:

\`\`\`bash
# Create new API key
ibmcloud iam service-api-key-create cspm-api-key-new $SERVICE_ID

# Update in the Onam console: Onboarding → Cloud Accounts → Edit

# Delete old API key
ibmcloud iam service-api-keys $SERVICE_ID
ibmcloud iam service-api-key-delete OLD_KEY_UUID $SERVICE_ID
\`\`\`

## Next steps

- [Connect Kubernetes clusters](/docs/onboarding/kubernetes) — add in-cluster visibility for your IKS clusters.
- [CSPM](/docs/features/cspm) — how the 613 IBM Cloud rules become prioritized findings.
- [Compliance](/docs/features/compliance) — map IBM Cloud findings to CIS, NIST, ISO 27001, and 78 other frameworks.
- [Book a demo](/request-demo) — walk through your first scan results with an Onam engineer.
`,
  },
  {
    slug: "onboarding/kubernetes",
    title: "Connect Kubernetes Clusters",
    breadcrumb: "Onboarding / Kubernetes",
    body: `
This guide walks you through connecting a Kubernetes cluster to Onam — any CNCF-conformant distribution: EKS, AKS, GKE, OKE, ACK, IKS, or self-managed. You create a read-only ServiceAccount bound to a get/list/watch ClusterRole, then register the API server endpoint, CA certificate, and token in the Onam console. The connection is agentless and read-only: nothing is installed in the cluster, and Onam never modifies any object.

**Time to complete**: ~10 minutes per cluster. **Kubernetes knowledge required**: kubectl, RBAC basics.

![The Onboarding view in the Onam console (demo account)](/screenshots/screenshot-onboarding.png)

## How the connection works

Onam talks directly to the Kubernetes API server using a dedicated **ServiceAccount** whose ClusterRole allows exactly three verbs: \`get\`, \`list\`, and \`watch\`. At scan time, Onam enumerates cluster objects — workloads, RBAC bindings, network policies, secrets metadata, admission configuration — and evaluates them against **718 Kubernetes rules covering 51 resource kinds**, plus 103 identity-focused CIEM rules for RBAC analysis.

- **Nothing runs in your cluster.** No DaemonSet, no operator, no sidecars — Onam is a read-only API client, so there is zero workload overhead.
- **RBAC is the enforcement boundary.** The ClusterRole you apply has no \`create\`, \`update\`, \`patch\`, or \`delete\` verb, and the Kubernetes API server rejects anything beyond it.
- **Revocation is one command.** Delete the ServiceAccount (or its namespace) and access ends instantly.

> **How the connection stays read-only:** the ClusterRole in this guide grants only \`get\`, \`list\`, and \`watch\` — the Kubernetes API server's admission path enforces that on every request, so Onam cannot create, modify, or delete any object even in error. The ServiceAccount token is stored in AWS Secrets Manager, encrypted with KMS, and \`kubectl delete ns onam-system\` severs access immediately.

### Before you begin

- \`kubectl\` access to the cluster with permission to create namespaces, ServiceAccounts, and ClusterRoleBindings (typically \`cluster-admin\`)
- A cluster running Kubernetes 1.24 or later
- Network reachability: the API server endpoint must be reachable from Onam — either a public endpoint restricted to Onam's egress IPs (shown on the onboarding screen), or private connectivity on Enterprise plans
- An Onam account with at least the \`tenant_admin\` role

## Step 1 — Create read-only cluster credentials

Apply this manifest. It creates a namespace, a ServiceAccount, a read-only ClusterRole, the binding, and a long-lived token Secret:

\`\`\`yaml
# onam-scanner.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: onam-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: onam-scanner
  namespace: onam-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: onam-scanner-readonly
rules:
  - apiGroups:
      - ""
      - "apps"
      - "batch"
      - "networking.k8s.io"
      - "rbac.authorization.k8s.io"
      - "policy"
      - "storage.k8s.io"
      - "autoscaling"
      - "apiextensions.k8s.io"
      - "admissionregistration.k8s.io"
    resources: ["*"]
    verbs: ["get", "list", "watch"]
  - nonResourceURLs: ["/version", "/healthz"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: onam-scanner-readonly
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: onam-scanner-readonly
subjects:
  - kind: ServiceAccount
    name: onam-scanner
    namespace: onam-system
---
apiVersion: v1
kind: Secret
metadata:
  name: onam-scanner-token
  namespace: onam-system
  annotations:
    kubernetes.io/service-account.name: onam-scanner
type: kubernetes.io/service-account-token
\`\`\`

\`\`\`bash
kubectl apply -f onam-scanner.yaml
\`\`\`

> The ClusterRole includes read access to Secrets so Onam can flag risky patterns — stale ServiceAccount tokens, secrets mounted into privileged pods, plaintext credentials in ConfigMaps. Onam evaluates secret metadata and never stores secret values. If your policy forbids this, replace \`resources: ["*"]\` in the core API group with an explicit list that omits \`secrets\` — the related checks are then skipped and marked as such in reports.

### Retrieve the token, CA certificate, and endpoint

\`\`\`bash
# API server endpoint
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
echo "API server: $APISERVER"

# ServiceAccount token (long-lived, bound to the Secret above)
TOKEN=$(kubectl -n onam-system get secret onam-scanner-token \\
  -o jsonpath='{.data.token}' | base64 -d)
echo "$TOKEN"

# Cluster CA certificate
kubectl -n onam-system get secret onam-scanner-token \\
  -o jsonpath='{.data.ca\\.crt}' | base64 -d > onam-ca.crt
\`\`\`

## Step 2 — Register the cluster in the Onam console

1. In the Onam console, navigate to **Onboarding → Connect Cloud Account**
2. Select **Kubernetes**
3. Fill in the fields below
4. Click **Validate Connection** — Onam performs a \`get /version\` and a namespace list to verify read access

| Field | Value |
| --- | --- |
| **Cluster Alias** | any friendly name, e.g. \`prod-eks-us-east-1\` |
| **API Server URL** | the \`$APISERVER\` value from Step 1 |
| **Distribution** | EKS, AKS, GKE, OKE, ACK, IKS, or self-managed |
| **CA Certificate** | contents of \`onam-ca.crt\` |
| **ServiceAccount Token** | the \`$TOKEN\` value from Step 1 |

### Run your first scan

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the cluster you just added
3. Click **Run Scan Now** — a cluster scan typically completes in 5–20 minutes depending on object count

Findings appear in the console graded Critical, High, Medium, Low, or Info, and flow into the [Container Security](/docs/features/container-security) views alongside image and runtime findings.

## Managed clusters: EKS, AKS, and GKE

Cluster onboarding complements — not replaces — cloud account onboarding. The cloud connection sees the managed control plane from the outside; the cluster connection sees the objects inside it. Connect both for full coverage:

| Distribution | Cloud account connection covers | Cluster connection adds |
| --- | --- | --- |
| **EKS** ([connect AWS](/docs/onboarding/aws)) | Cluster config, node groups, IRSA roles, security groups | Workloads, RBAC bindings, NetworkPolicies, Pod Security admission |
| **AKS** ([connect Azure](/docs/onboarding/azure)) | Cluster config, node pools, managed identities, NSGs | Workloads, RBAC bindings, NetworkPolicies, Pod Security admission |
| **GKE** ([connect GCP](/docs/onboarding/gcp)) | Cluster config, node pools, Workload Identity, firewall rules | Workloads, RBAC bindings, NetworkPolicies, Pod Security admission |

When both connections exist, Onam's Container Security engine correlates them — for example, linking an over-privileged IRSA role (cloud side) to the pod that mounts it (cluster side), which also feeds [attack path analysis](/docs/features/attack-path).

## Enable audit-log ingestion for CDR

Onam's [CDR engine](/docs/features/cdr) ingests Kubernetes audit logs through the Discovery & Inventory pipeline and runs three detection tiers over them: single-event rules (L1), multi-event correlation scenarios (L2), and statistical behavior baselines (L3). Audit logging is off by default on most distributions — enable it per platform:

| Distribution | How to enable audit logs |
| --- | --- |
| **EKS** | Enable \`audit\` in control-plane logging (logs land in CloudWatch, read via the AWS connection) |
| **AKS** | Add a diagnostic setting for the \`kube-audit\` category to a storage account |
| **GKE** | Cloud Audit Logs are on by default; confirm Data Access logs for the Kubernetes Engine API |
| **Self-managed** | Set \`--audit-log-path\` or an audit webhook on the API server, shipping to object storage |

Detections include anonymous API access, \`exec\` into production pods, ClusterRoleBinding escalation, and secret enumeration bursts.

## What gets scanned

Onam evaluates **51 Kubernetes resource kinds** against **718 posture rules**, plus 103 CIEM rules focused on RBAC and identity — part of the 10,000+ rule registry spanning all seven supported clouds.

| Area | Resource kinds (examples) | Example checks |
| --- | --- | --- |
| **Workloads** | Pods, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs | Privileged containers · hostPath mounts · missing resource limits · latest-tag images |
| **RBAC & identity** | Roles, ClusterRoles, RoleBindings, ServiceAccounts | Wildcard verbs · cluster-admin bindings · auto-mounted tokens |
| **Network** | Services, Ingresses, NetworkPolicies | Namespaces without default-deny · public LoadBalancers · missing TLS on Ingress |
| **Secrets & config** | Secrets, ConfigMaps | Credentials in ConfigMaps · stale ServiceAccount tokens · unencrypted etcd (self-managed) |
| **Cluster & admission** | Namespaces, Nodes, PodSecurity admission, webhooks | Anonymous auth enabled · missing Pod Security standards · permissive admission webhooks |

## Troubleshooting

| Error | Cause | Fix |
| --- | --- | --- |
| \`401 Unauthorized\` | Token invalid or Secret recreated | Re-extract the token from \`onam-scanner-token\` and update it in the console |
| \`Connection timed out\` | API server not reachable from Onam | Allowlist Onam's egress IPs on the endpoint, or use private connectivity |
| \`x509: certificate signed by unknown authority\` | Wrong or truncated CA certificate | Re-extract \`ca.crt\` from the token Secret and re-paste the full PEM |
| \`403 Forbidden\` on some kinds | ClusterRole missing an API group | Re-apply the manifest from Step 1 unchanged |
| Scan finds 0 workloads | ClusterRoleBinding subject mismatch | Verify the binding's subject namespace is \`onam-system\` |
| No audit-based CDR findings | Audit logging not enabled | Enable audit logs per the CDR section above |

## Next steps

- [Container Security](/docs/features/container-security) — image scanning, runtime posture, and K8s RBAC analysis on this cluster.
- [CIEM](/docs/features/ciem) — effective-permission analysis across RBAC bindings and cloud IAM.
- [CDR](/docs/features/cdr) — behavioral detection over the audit logs you just enabled.
- [Book a demo](/request-demo) — walk through your first cluster scan with an Onam engineer.
`,
  },
];
