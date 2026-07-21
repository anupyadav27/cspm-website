# Connect IBM Cloud

This guide walks you through connecting an IBM Cloud account to the CSPM platform using an API key with read-only IAM access.

**Time to complete**: ~15 minutes
**IBM Cloud knowledge required**: IAM access groups, policies, and API keys

<img src="/diagrams/onboard-ibm.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="IBM Cloud onboarding flow: Create Service ID, Assign Viewer Role, Generate API Key, Scan Running" />

---

## How It Works

The onboarding diagram above shows the connection model end-to-end. The platform connects to IBM Cloud via a **Service ID with an Access Group** that holds read-only policies. You create the Access Group, attach the policies, create the Service ID, generate an API key, and paste the key into the platform — the platform then exchanges the API key for a short-lived IAM Bearer token and reads resource configurations through the IBM Cloud APIs.

**Three properties of this design:**

- **Read-only policies only** — `Viewer` role across IAM-enabled and Cloud Foundry services. No write actions are possible.
- **Scoped to the account you grant** — the Access Group's policies determine the platform's reach.
- **API keys can be rotated at any time** — recommended every 12 months. Service ID API keys are independent of human user accounts.

---

## Prerequisites

- IBM Cloud account with IAM Administrator access
- `ibmcloud` CLI installed and logged in (optional — console steps also provided)
- CSPM platform account with at least `tenant_admin` role

---

## Step 1 — Install and Log In to IBM Cloud CLI (Optional)

```bash
# Install IBM Cloud CLI
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh

# Log in
ibmcloud login --sso

# Target your account
ibmcloud account show
```

---

## Step 2 — Create an IAM Access Group

### Using IBM Cloud Console

1. Open [IBM Cloud IAM → Access groups](https://cloud.ibm.com/iam/groups)
2. Click **Create**
3. Name: `CspmScanners`
4. Description: `Read-only access for CSPM platform scanner`
5. Click **Create**

### Using IBM Cloud CLI

```bash
ibmcloud iam access-group-create CspmScanners \
  --description "Read-only access for CSPM platform scanner"
```

---

## Step 3 — Assign Read-Only Policies to the Access Group

IBM Cloud uses fine-grained IAM policies per service. Assign **Viewer** (platform) and **Reader** (service) roles:

### Using IBM Cloud Console

1. Open the `CspmScanners` access group
2. Click **Access → Assign access**
3. Select **All Identity and Access enabled services**
4. Platform role: **Viewer**
5. Service role: **Reader**
6. Click **Add → Assign**

Repeat for:
- **All Account Management Services** → Platform role: **Viewer**

### Using IBM Cloud CLI

```bash
# Viewer + Reader on all IAM-enabled services
ibmcloud iam access-group-policy-create CspmScanners \
  --roles Viewer,Reader \
  --service-name "*"

# Viewer on account management services
ibmcloud iam access-group-policy-create CspmScanners \
  --roles Viewer \
  --account-management
```

---

## Step 4 — Create a Service ID and API Key

Service IDs are non-human identities for programmatic access — the equivalent of AWS IAM roles for applications.

### Using IBM Cloud Console

1. Navigate to [IAM → Service IDs](https://cloud.ibm.com/iam/serviceids)
2. Click **Create**
3. Name: `cspm-scanner`
4. Description: `CSPM platform read-only scanner`
5. Click **Create**

**Add to Access Group:**
1. Open the `CspmScanners` access group
2. Click **Service IDs → Add service IDs**
3. Select `cspm-scanner`

**Create API Key:**
1. Open the `cspm-scanner` Service ID
2. Click **API keys → Create**
3. Name: `cspm-api-key`
4. Click **Create**
5. **Download or copy the API key value** — it cannot be retrieved again

### Using IBM Cloud CLI

```bash
# Create Service ID
ibmcloud iam service-id-create cspm-scanner \
  --description "CSPM platform read-only scanner"

# Get Service ID
SERVICE_ID=$(ibmcloud iam service-id cspm-scanner --uuid -q)
echo "Service ID: $SERVICE_ID"

# Add Service ID to access group
ibmcloud iam access-group-service-id-add CspmScanners $SERVICE_ID

# Create API key for Service ID
ibmcloud iam service-api-key-create cspm-api-key $SERVICE_ID \
  --description "CSPM scanner API key"

# The API key value is shown once — save it immediately
```

---

## Step 5 — Find Your Account ID

```bash
# Get Account ID
ACCOUNT_ID=$(ibmcloud account show --output json | jq -r '.account_id')
echo "Account ID: $ACCOUNT_ID"
```

Or in the IBM Cloud Console: click your account name in the top bar → **Manage → Account → Account settings**.

---

## Step 6 — Connect in the Platform

1. In the CSPM platform, navigate to **Onboarding → Connect Cloud Account**
2. Select **IBM Cloud**
3. Enter:
   - **Account ID** — from Step 5
   - **API Key** — from Step 4
   - **Home Region** — e.g. `us-south`, `eu-gb`, `ap-south`
   - **Account Alias** — friendly name
4. Click **Validate Connection**

---

## IBM Cloud Services Scanned

The platform scans **15+ IBM Cloud services** organized into five categories. New services are added on a quarterly cadence.

| Category | Services scanned |
|---|---|
| **Compute** | Virtual Server Instances · IBM Kubernetes Service (IKS) · Code Engine · Cloud Foundry Apps |
| **Storage & Data** | Cloud Object Storage · IBM Db2 · IBM Cloudant · IBM Databases for PostgreSQL · IBM Databases for Redis · IBM Databases for MongoDB |
| **Networking** | VPC Networks · Security Groups · Load Balancers · Direct Link · Internet Services WAF · Transit Gateway |
| **Identity & Security** | IAM Users and Service IDs · Access Groups and Policies · Key Protect · Hyper Protect Crypto Services · Secrets Manager · Activity Tracker · Security and Compliance Center |
| **Monitoring** | IBM Cloud Monitoring · IBM Log Analysis · Activity Tracker events · Flow Logs |

---

## Multi-Account Setup (IBM Cloud Enterprise)

For IBM Cloud Enterprise accounts with multiple sub-accounts:

```bash
# List all accounts in the enterprise
ibmcloud enterprise accounts --all

# For each sub-account, create the same Service ID and API key
# using the sub-account context:
ibmcloud login --apikey $MASTER_API_KEY -c SUB_ACCOUNT_ID

# Then repeat Steps 2-5 in each sub-account
```

Each sub-account requires its own API key connected in the platform.

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `BXNIM0109E: API key not valid` | API key deleted or expired | Create a new API key in Step 4 |
| `Not Authorized` | Service ID not in access group | Add Service ID to CspmScanners group (Step 4) |
| Resources missing from specific regions | Region not selected | Add additional regions in: Onboarding → Edit Account |
| IKS clusters missing | Kubernetes service permission missing | Ensure Reader role is assigned for Kubernetes service |
| Key Protect keys not appearing | Key Protect Reader role missing | Add Reader role for Key Protect in Access Group |
| Activity Tracker events missing | Activity Tracker not provisioned | Provision Activity Tracker in your IBM Cloud account |

---

## API Key Rotation

IBM Cloud API keys should be rotated every 90 days:

```bash
# Create new API key
ibmcloud iam service-api-key-create cspm-api-key-new $SERVICE_ID

# Update in CSPM platform: Onboarding → Cloud Accounts → Edit

# Delete old API key
ibmcloud iam service-api-keys $SERVICE_ID
ibmcloud iam service-api-key-delete OLD_KEY_UUID $SERVICE_ID
```

---

*Last updated: 2026-05-08*
