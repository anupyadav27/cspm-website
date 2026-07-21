# Connect Google Cloud Platform (GCP)

This guide walks you through connecting a GCP project or organization to the CSPM platform using a Service Account with read-only access.

**Time to complete**: ~20 minutes
**GCP knowledge required**: IAM basics, Service Accounts, gcloud CLI (optional)

<img src="/diagrams/onboard-gcp.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="GCP onboarding flow: Create Service Account, Assign IAM Roles, Download JSON Key, Scan Running" />

---

## How It Works

The onboarding diagram above shows the connection model end-to-end. The platform connects to GCP via a **service account with read-only roles** at the project (or organization) level. You create the service account, assign the read-only roles, generate a JSON key, and upload the key to the platform — the platform then authenticates via service-account credentials and reads resource configurations through the GCP APIs.

**Three properties of this design:**

- **Read-only roles only** — `roles/viewer`, `roles/iam.securityReviewer`, `roles/cloudasset.viewer`, etc. No write actions are possible.
- **Scoped to the project (or organization) you grant** — the platform cannot see projects you didn't assign roles in.
- **Service-account keys can be rotated at any time** — recommended every 12 months with calendar-reminder rotation. Workload Identity Federation is also supported on Enterprise plans.

---

## Prerequisites

- GCP project with `Owner` or `Security Admin` role to create Service Accounts and assign roles
- Billing enabled on the GCP project
- CSPM platform account with at least `tenant_admin` role
- Required APIs enabled (see Step 1)

---

## Step 1 — Enable Required APIs

```bash
# Enable all APIs required for scanning
gcloud services enable \
  cloudasset.googleapis.com \
  cloudresourcemanager.googleapis.com \
  iam.googleapis.com \
  compute.googleapis.com \
  container.googleapis.com \
  storage.googleapis.com \
  sqladmin.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com \
  securitycenter.googleapis.com \
  cloudkms.googleapis.com \
  dns.googleapis.com \
  run.googleapis.com \
  cloudfunctions.googleapis.com \
  bigquery.googleapis.com \
  redis.googleapis.com \
  --project=YOUR_PROJECT_ID
```

Or enable them in the [Google Cloud Console](https://console.cloud.google.com/apis/dashboard).

---

## Step 2 — Create a Service Account

### Using GCP Console

1. Open [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click **Create Service Account**
3. Name: `cspm-scanner`
4. Description: `Read-only scanner for CSPM platform`
5. Click **Create and Continue**
6. Skip roles for now (assigned in Step 3)
7. Click **Done**
8. Copy the **Service Account email** (format: `cspm-scanner@PROJECT_ID.iam.gserviceaccount.com`)

### Using gcloud CLI

```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts create cspm-scanner \
  --display-name="CSPM Scanner" \
  --description="Read-only scanner for CSPM platform" \
  --project=$PROJECT_ID

SA_EMAIL="cspm-scanner@${PROJECT_ID}.iam.gserviceaccount.com"
echo "Service Account: $SA_EMAIL"
```

---

## Step 3 — Assign Read-Only Roles

Six built-in GCP roles are required. Each one grants read access to a specific area of GCP — there are no write actions in any of them.

| Role | What it grants | Why required |
|---|---|---|
| `roles/viewer` | Basic read access to most GCP services | Core resource discovery |
| `roles/iam.securityReviewer` | Read IAM policies | IAM posture analysis |
| `roles/cloudasset.viewer` | Cloud Asset Inventory access | Comprehensive resource inventory |
| `roles/cloudkms.viewer` | KMS key metadata read | Encryption posture analysis |
| `roles/container.clusterViewer` | GKE cluster configuration read | Container security analysis |
| `roles/securitycenter.findingsViewer` | Security Command Center findings | Threat detection enrichment |

```bash
PROJECT_ID=$(gcloud config get-value project)
SA_EMAIL="cspm-scanner@${PROJECT_ID}.iam.gserviceaccount.com"

# Core read access
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/viewer"

# IAM and security policy reading
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.securityReviewer"

# Cloud Asset API (resource inventory)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudasset.viewer"

# KMS key metadata
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudkms.viewer"

# GKE cluster details
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/container.clusterViewer"

# Security Command Center findings
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/securitycenter.findingsViewer"
```

---

## Step 4 — Create a Service Account Key

```bash
# Create and download the key
gcloud iam service-accounts keys create cspm-key.json \
  --iam-account=$SA_EMAIL \
  --project=$PROJECT_ID

echo "Key file created: cspm-key.json"
```

**Security note**: Treat `cspm-key.json` like a password. Do not commit it to version control. Delete it after uploading to the platform.

---

## Step 5 — Connect in the Platform

1. In the CSPM platform, navigate to **Onboarding → Connect Cloud Account**
2. Select **Google Cloud Platform**
3. Upload the `cspm-key.json` file (or paste its contents)
4. Enter a **Project Alias** (friendly name)
5. Select which **Services** to scan or keep the default (all)
6. Click **Validate Connection**

After validation, delete the local key file:

```bash
rm cspm-key.json
```

---

## GCP Services Scanned

The platform scans **30+ GCP services** organized into five categories. New services are added on a quarterly cadence.

| Category | Services scanned |
|---|---|
| **Compute** | Compute Engine VMs · GKE Clusters and Nodes · Cloud Run Services · Cloud Functions · App Engine |
| **Storage & Data** | Cloud Storage Buckets · Cloud SQL Instances · Cloud Spanner · BigQuery Datasets · Firestore · Memorystore Redis · Cloud Bigtable |
| **Networking** | VPC Networks · Firewall Rules · Cloud Load Balancing · Cloud Armor WAF · Cloud DNS · VPC Service Controls |
| **Identity & Security** | IAM Bindings and Policies · Service Accounts · Cloud KMS Keys · Secret Manager · Security Command Center · Binary Authorization |
| **Monitoring & Audit** | Cloud Logging · Cloud Monitoring · Audit Logs configuration · Log Sinks |

---

## Organization-Level Scanning (All Projects)

To scan all projects in a GCP Organization:

```bash
ORG_ID=$(gcloud organizations list --format='value(name)' | head -1)
ORG_ID=${ORG_ID#organizations/}

# Grant roles at org level (inherits to all projects)
gcloud organizations add-iam-policy-binding $ORG_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/viewer"

gcloud organizations add-iam-policy-binding $ORG_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.securityReviewer"

gcloud organizations add-iam-policy-binding $ORG_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudasset.viewer"
```

Then connect each project in the platform using the same service account key.

---

## Workload Identity Federation (Keyless — Recommended for Production)

Instead of a JSON key, you can use Workload Identity Federation for keyless authentication:

```bash
# Create a Workload Identity Pool
gcloud iam workload-identity-pools create cspm-pool \
  --location=global \
  --display-name="CSPM Scanner Pool"

# Create a provider (AWS example — CSPM runs on AWS)
gcloud iam workload-identity-pools providers create-aws cspm-provider \
  --location=global \
  --workload-identity-pool=cspm-pool \
  --account-id=CSPM_PLATFORM_AWS_ACCOUNT_ID

# Bind the Service Account
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/cspm-pool/*"
```

Contact support@yourplatform.com to configure Workload Identity Federation for your account.

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Permission denied on project` | `roles/viewer` not assigned at project level | Run Step 3 role assignments again |
| `Cloud Asset API not enabled` | API disabled | Run `gcloud services enable cloudasset.googleapis.com` |
| `Invalid key format` | Key file corrupted during copy-paste | Re-download the JSON key file |
| GKE clusters not appearing | `container.clusterViewer` missing | Assign `roles/container.clusterViewer` |
| No KMS findings | `cloudkms.viewer` missing | Assign `roles/cloudkms.viewer` |
| `UNAUTHENTICATED` | Service account key expired or deleted | Create a new key in Step 4 |

---

## Key Rotation

GCP Service Account keys should be rotated every 90 days:

```bash
# Create a new key
gcloud iam service-accounts keys create cspm-key-new.json \
  --iam-account=$SA_EMAIL

# Upload the new key to the platform:
# Onboarding → Cloud Accounts → [your account] → Edit → Update Key

# Then delete the old key (list key IDs first)
gcloud iam service-accounts keys list --iam-account=$SA_EMAIL

gcloud iam service-accounts keys delete OLD_KEY_ID \
  --iam-account=$SA_EMAIL

# Delete the local file
rm cspm-key-new.json
```

---

*Last updated: 2026-05-08*
