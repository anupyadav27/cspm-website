# Connect Microsoft Azure

This guide walks you through connecting an Azure subscription to the CSPM platform using a Service Principal with read-only access.

**Time to complete**: ~20 minutes
**Azure knowledge required**: Azure Active Directory / Entra ID, IAM basics

<img src="/diagrams/onboard-azure.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="Azure onboarding flow: Register Application, Assign Reader Role, Create Client Secret, Scan Running" />

---

## How It Works

The onboarding diagram above shows the connection model end-to-end. The platform connects to Azure via a **service principal in Microsoft Entra ID** with the **Reader** role at subscription scope. You register an app, generate a client secret, assign Reader, and paste the credentials into the platform — the platform then authenticates via OAuth2 and reads resource configurations through the Azure Resource Manager API.

**Three properties of this design:**

- **Reader role only** — Microsoft's built-in least-privilege read role. No write actions are possible.
- **Scoped to the subscriptions you assign** — the platform cannot see subscriptions you didn't explicitly grant Reader on.
- **Client secret expires on the schedule you set** — recommended 24 months with calendar-reminder rotation.

---

## Prerequisites

- Azure subscription with `Owner` or `User Access Administrator` role
- Permission to register applications in Microsoft Entra ID (Azure AD)
- CSPM platform account with at least `tenant_admin` role

---

## Step 1 — Register an App in Entra ID

### Using Azure Portal

1. Open [Microsoft Entra ID](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade)
2. Navigate to **App registrations → New registration**
3. Name: `cspm-scanner` (or any name you prefer)
4. Supported account types: **Accounts in this organizational directory only**
5. Redirect URI: leave blank
6. Click **Register**
7. Copy the **Application (client) ID** and **Directory (tenant) ID** — you'll need these later

### Using Azure CLI

```bash
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
```

---

## Step 2 — Create a Client Secret

### Using Azure Portal

1. In your App Registration, navigate to **Certificates & secrets**
2. Click **New client secret**
3. Description: `cspm-scanner-secret`
4. Expiry: **24 months** (recommended — set a calendar reminder to rotate)
5. Click **Add**
6. **Copy the secret value immediately** — it won't be shown again

### Using Azure CLI

```bash
# Create a client secret (valid for 2 years)
SECRET=$(az ad app credential reset \
  --id $APP_ID \
  --years 2 \
  --query password -o tsv)
echo "Client Secret: $SECRET"
```

---

## Step 3 — Assign Reader Role at Subscription Scope

Reader is the **lowest-privilege built-in Azure role that grants read access to every resource type**. Assigning it at subscription scope automatically covers every resource group and every resource within those groups.

| Scope | What the role grants | Why we recommend subscription scope |
|---|---|---|
| **Subscription (recommended)** | Read access to every resource group and resource in the subscription | One assignment covers everything; new resource groups automatically inherit |
| **Resource group** | Read access to that specific group only | Tighter scope — but you'll need to re-assign on every new resource group |
| **Management group** | Read access across multiple subscriptions | Best for multi-subscription orgs — assign once, covers all subs |

### Using Azure Portal

1. Navigate to **Subscriptions** → select your subscription
2. Go to **Access control (IAM) → Add → Add role assignment**
3. Role: **Reader**
4. Assign access to: **User, group, or service principal**
5. Select: `cspm-scanner` (your App Registration)
6. Click **Review + assign**

### Using Azure CLI

```bash
# Get your Subscription ID
SUB_ID=$(az account show --query id -o tsv)
echo "Subscription ID: $SUB_ID"

# Assign Reader role
az role assignment create \
  --assignee $APP_ID \
  --role Reader \
  --scope /subscriptions/$SUB_ID
```

---

## Step 4 — Grant Microsoft Graph Permissions (for Entra ID scanning)

To scan Azure Active Directory / Entra ID resources (users, groups, app registrations, conditional access policies), grant these Graph API permissions:

### Using Azure Portal

1. In your App Registration, go to **API permissions → Add a permission**
2. Select **Microsoft Graph**
3. Select **Application permissions** (not Delegated)
4. Add these permissions:
   - `Directory.Read.All`
   - `Policy.Read.All`
   - `AuditLog.Read.All`
5. Click **Grant admin consent** (requires Global Administrator or Privileged Role Administrator)

### Using Azure CLI

```bash
# Add Microsoft Graph permissions
GRAPH_APP_ID="00000003-0000-0000-c000-000000000000"

az ad app permission add \
  --id $APP_ID \
  --api $GRAPH_APP_ID \
  --api-permissions \
    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
    246dd0d5-5bd0-4def-940b-0421030a5b68=Role \
    b0afded3-3588-46d8-8b3d-9842eff778da=Role

# Grant admin consent
az ad app permission admin-consent --id $APP_ID
```

---

## Step 5 — Connect in the Platform

1. In the CSPM platform, navigate to **Onboarding → Connect Cloud Account**
2. Select **Microsoft Azure**
3. Enter the following values:
   - **Subscription ID**: from `az account show --query id`
   - **Tenant ID** (Directory ID): from your App Registration overview
   - **Application (Client) ID**: from your App Registration overview
   - **Client Secret**: the value you copied in Step 2
4. Enter an **Account Alias** (friendly name)
5. Click **Validate Connection**

---

## Azure Services Scanned

The platform scans **30+ Azure services** organized into five categories. New services are added on a quarterly cadence.

| Category | Services scanned |
|---|---|
| **Compute** | Virtual Machines · AKS Clusters · Azure Functions · App Service · Container Instances · Virtual Machine Scale Sets |
| **Storage & Data** | Blob Storage · Azure SQL Database · Cosmos DB · Azure Database for PostgreSQL · Azure Database for MySQL · Data Lake Storage · Synapse |
| **Networking** | Virtual Networks · NSGs · Azure Firewall · Application Gateway · Front Door · DDoS Protection · Private Endpoints |
| **Identity & Security** | Entra ID Users and Groups · App Registrations · Managed Identities · Key Vault · Conditional Access Policies · Defender for Cloud · Sentinel Workspace |
| **Monitoring** | Diagnostic Settings · Activity Logs · Monitor Alerts · Log Analytics Workspaces |

---

## Multi-Subscription Setup

To connect multiple Azure subscriptions, repeat Steps 3–5 for each subscription. You can reuse the same App Registration — just assign Reader role at each subscription scope.

For Azure Management Groups (to scan all subscriptions at once):

```bash
# Assign Reader at management group scope
MG_ID="your-management-group-id"

az role assignment create \
  --assignee $APP_ID \
  --role Reader \
  --scope /providers/Microsoft.Management/managementGroups/$MG_ID
```

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `AuthenticationFailed` | Wrong tenant ID or client ID | Verify values from App Registration Overview page |
| `InvalidClientSecret` | Secret expired or copied incorrectly | Regenerate the client secret in Entra ID |
| `Authorization_RequestDenied` | Reader role not assigned | Assign Reader role at subscription scope (Step 3) |
| No AAD resources in findings | Graph permissions not granted | Complete Step 4 and grant admin consent |
| `InsufficientPrivileges` | Admin consent not granted | A Global Admin must grant admin consent for Graph permissions |

---

## Secret Rotation

Client secrets expire. Set a calendar reminder before expiry:

```bash
# Create a new secret before the old one expires
NEW_SECRET=$(az ad app credential reset --id $APP_ID --years 2 --query password -o tsv)

# Update the credential in the CSPM platform:
# Onboarding → Cloud Accounts → [your account] → Edit → Update Secret
```

---

*Last updated: 2026-05-08*
