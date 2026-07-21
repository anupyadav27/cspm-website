# Connect Amazon Web Services (AWS)

This guide walks you through connecting an AWS account or AWS Organization to the CSPM platform. The connection is read-only — no changes are ever made to your AWS environment.

**Time to complete**: ~15 minutes
**AWS knowledge required**: IAM, basic console navigation

<img src="/diagrams/onboard-aws.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="AWS onboarding flow: Create IAM Role, Attach Policies, Enter in Onam, Scan Running" />

---

## How It Works

The onboarding diagram above shows the connection model end-to-end. The platform uses **cross-account IAM role assumption** — you create a role in your AWS account that trusts the platform's AWS account, the platform stores only a reference to that role ARN, and at scan time AWS STS issues short-lived credentials that the platform uses for read-only API calls.

**Three properties of this design:**

- **No long-lived credentials are stored anywhere.** No access keys, no secrets — only the role ARN reference.
- **Temporary credentials are rotated every hour by AWS STS.** Even if a credential is somehow exposed, it expires within 60 minutes.
- **Read-only is enforced by your IAM policy**, not by us. You attach a read-only policy to the role you create — the platform cannot exceed what your policy allows.

---

## Prerequisites

- AWS account with permissions to create IAM roles and policies
- CSPM platform account with at least `tenant_admin` role
- Your CSPM **Platform Account ID** and **External ID** — found in the platform under **Onboarding → Connect Cloud Account → AWS**

---

## Step 1 — Create the IAM Role

### Option A: Using the AWS Console

1. Open the [AWS IAM Console](https://console.aws.amazon.com/iam)
2. Navigate to **Roles → Create role**
3. Select **AWS account** as the trusted entity type
4. Select **Another AWS account**
5. Enter the CSPM **Platform Account ID** (shown in the platform onboarding screen)
6. Check **Require external ID** and enter the **External ID** shown in the platform
7. Click **Next**

### Option B: Using AWS CLI

```bash
# Replace PLATFORM_ACCOUNT_ID and EXTERNAL_ID with values from the platform
aws iam create-role \
  --role-name CSPMScannerRole \
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
```

### Option C: Using CloudFormation

```yaml
# cspm-role.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: CSPM Platform Read-Only Scanner Role

Parameters:
  PlatformAccountId:
    Type: String
    Description: CSPM platform AWS account ID
  ExternalId:
    Type: String
    Description: External ID from the CSPM onboarding screen

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
              AWS: !Sub 'arn:aws:iam::${PlatformAccountId}:root'
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
    Description: Copy this ARN into the CSPM platform onboarding screen
```

```bash
aws cloudformation deploy \
  --template-file cspm-role.yaml \
  --stack-name cspm-scanner-role \
  --parameter-overrides \
    PlatformAccountId=PLATFORM_ACCOUNT_ID \
    ExternalId=EXTERNAL_ID \
  --capabilities CAPABILITY_NAMED_IAM
```

---

## Step 2 — Attach Required Permissions

Attach these AWS managed policies to the role:

| Policy | ARN | Why Required |
|---|---|---|
| `SecurityAudit` | `arn:aws:iam::aws:policy/SecurityAudit` | Core security service scanning |
| `ReadOnlyAccess` | `arn:aws:iam::aws:policy/ReadOnlyAccess` | Broad read access for resource discovery |

Plus the additional custom policy from Step 1 covering these AWS service-specific permissions:

| Category | Permissions | Why required |
|---|---|---|
| **Advisor & Analysis** | `support:DescribeTrustedAdvisorChecks` · `access-analyzer:ListAnalyzers` · `access-analyzer:ListFindings` | Read AWS Trusted Advisor findings · IAM Access Analyzer findings |
| **Threat Detection** | `guardduty:ListDetectors` · `guardduty:GetMasterAccount` · `securityhub:GetFindings` | Read GuardDuty threat findings · Security Hub aggregated findings |
| **Vulnerability** | `inspector2:ListFindings` · `inspector2:ListCoverage` | Read Inspector v2 vulnerability findings and coverage |
| **Data Security** | `macie2:GetMacieSession` · `macie2:ListFindings` | Read Macie sensitive-data discovery findings |

Each permission is read-only — no `Create*`, `Update*`, `Delete*`, or `Put*` actions are required.

---

## Step 3 — Copy the Role ARN

After creating the role, copy the Role ARN. It looks like:

```
arn:aws:iam::123456789012:role/CSPMScannerRole
```

---

## Step 4 — Connect in the Platform

1. In the CSPM platform, navigate to **Onboarding → Connect Cloud Account**
2. Select **Amazon Web Services**
3. Paste the **Role ARN**
4. Enter the **Account Alias** (a friendly name for this account)
5. Select which **Regions** to scan (or select All)
6. Click **Validate Connection**

The platform will attempt to assume the role and verify read access. A green checkmark means the connection is successful.

---

## Step 5 — Run Your First Scan

After connecting, trigger a scan:

1. Navigate to **Onboarding → Cloud Accounts**
2. Click the account you just added
3. Click **Run Scan Now**
4. The scan typically completes in 15–60 minutes depending on account size

You'll receive an in-app notification and email when the scan completes.

---

## AWS Organizations — Connect All Accounts at Once

For AWS Organizations, deploy the IAM role to all member accounts automatically:

```bash
# Deploy via AWS Organizations StackSets
aws cloudformation create-stack-set \
  --stack-set-name cspm-scanner-roles \
  --template-url https://s3.amazonaws.com/cspm-templates/cspm-role.yaml \
  --parameters \
    ParameterKey=PlatformAccountId,ParameterValue=PLATFORM_ACCOUNT_ID \
    ParameterKey=ExternalId,ParameterValue=EXTERNAL_ID \
  --capabilities CAPABILITY_NAMED_IAM \
  --permission-model SERVICE_MANAGED \
  --auto-deployment Enabled=true,RetainStacksOnAccountRemoval=false
```

This auto-deploys the role to all existing and new accounts in your organization.

---

## Services Scanned

The platform scans **40+ AWS services** organized into five categories. New AWS services are added on a quarterly cadence.

| Category | Services scanned |
|---|---|
| **Compute** | EC2 Instances · Lambda Functions · ECS Tasks · EKS Clusters · Elastic Beanstalk · Fargate · Auto Scaling Groups |
| **Storage & Data** | S3 Buckets · EBS Volumes · RDS Instances · DynamoDB Tables · Redshift Clusters · ElastiCache · Aurora · DocumentDB |
| **Network** | VPCs · Security Groups · NACLs · Load Balancers (ALB/NLB/Classic) · CloudFront · Route 53 · WAF · Network Firewall · API Gateway |
| **Security & Identity** | IAM Users / Roles / Policies · KMS Keys · Secrets Manager · Certificate Manager · GuardDuty · Security Hub · CloudTrail · Config · Inspector |
| **AI / ML** | SageMaker · Bedrock · Comprehend · Rekognition · Textract |

Don't see a service you need? Email `support@onam.io` — most additions ship within 4 weeks.

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `AccessDenied: AssumeRole` | Trust policy or external ID mismatch | Verify Platform Account ID and External ID match exactly |
| `Connection timed out` | Role doesn't exist in the right account | Confirm the role ARN account ID matches the account you're connecting |
| `NoSuchBucket` during scan | Region restrictions too narrow | Ensure selected regions include where your resources exist |
| Scan returns 0 resources | IAM permissions insufficient | Verify both `SecurityAudit` and `ReadOnlyAccess` are attached |
| IAM findings missing | Missing `access-analyzer` permissions | Attach the custom additional policy from Step 2 |

---

## Security FAQ

**Does CSPM ever write to my AWS account?**
No. The IAM role includes only read permissions. There is no `Allow` statement for write, delete, or modify actions.

**What if I revoke the role?**
Scanning stops immediately. No orphaned credentials remain — the platform stores only the role ARN, not credentials.

**Can I restrict which services are scanned?**
Yes. You can create a custom policy that limits which services the role can access. Note that restricting access will result in those services not appearing in findings.

---

*Last updated: 2026-05-08*
