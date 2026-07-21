# Connect Oracle Cloud Infrastructure (OCI)

This guide walks you through connecting an OCI tenancy to the CSPM platform using a read-only IAM user and API signing key.

**Time to complete**: ~20 minutes
**OCI knowledge required**: IAM users, groups, policies, API keys

<img src="/diagrams/onboard-oci.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="OCI onboarding flow: Create IAM User, Grant Read Access, Generate API Key, Scan Running" />

---

## How It Works

The onboarding diagram above shows the connection model end-to-end. The platform connects to OCI via a **dedicated IAM user with API key signing** scoped to inspect/read permissions across all resources. You generate an API key pair, create the user/group/policy, upload the public key, and paste the credentials into the platform — the platform then signs API requests with the private key and reads resource configurations through the OCI REST APIs.

**Three properties of this design:**

- **Inspect + read permissions only** — no write actions are possible.
- **Scoped to the tenancy / compartments you grant** — the policy you write controls the platform's reach.
- **API keys can be rotated at any time** — recommended every 12 months. Old keys can be revoked instantly without service interruption (rotation is hot-swappable).

---

## Prerequisites

- OCI tenancy with Administrator access to create IAM users, groups, and policies
- `openssl` installed locally (for key generation)
- CSPM platform account with at least `tenant_admin` role

---

## Step 1 — Generate an API Signing Key Pair

```bash
# Create a directory for the keys
mkdir -p ~/.oci/cspm

# Generate RSA private key (2048-bit minimum, 4096 recommended)
openssl genrsa -out ~/.oci/cspm/cspm_api_key.pem 4096
chmod 600 ~/.oci/cspm/cspm_api_key.pem

# Extract the public key
openssl rsa -pubout \
  -in ~/.oci/cspm/cspm_api_key.pem \
  -out ~/.oci/cspm/cspm_api_key_public.pem

echo "Public key:"
cat ~/.oci/cspm/cspm_api_key_public.pem
```

---

## Step 2 — Create IAM User, Group, and Policy

### Using OCI Console

**Create the User:**
1. Open [OCI Console → Identity & Security → Users](https://cloud.oracle.com/identity/users)
2. Click **Create User**
3. Name: `cspm-scanner`
4. Description: `Read-only scanner for CSPM platform`
5. Click **Create**
6. Copy the **User OCID** from the user details page

**Create the Group:**
1. Navigate to **Identity & Security → Groups**
2. Click **Create Group**
3. Name: `CspmScanners`
4. Click **Create**

**Add User to Group:**
1. Open the `CspmScanners` group
2. Click **Add User to Group**
3. Select `cspm-scanner`

**Create the Policy:**
1. Navigate to **Identity & Security → Policies**
2. Click **Create Policy**
3. Name: `CspmScannerPolicy`
4. Compartment: **root** (tenancy level — required for full coverage)
5. Enter these policy statements:

```
Allow group CspmScanners to inspect all-resources in tenancy
Allow group CspmScanners to read all-resources in tenancy
```

6. Click **Create**

### Using OCI CLI

```bash
# Set your tenancy OCID
TENANCY_OCID="ocid1.tenancy.oc1..YOUR_TENANCY_OCID"

# Create user
oci iam user create \
  --name cspm-scanner \
  --description "Read-only scanner for CSPM platform" \
  --compartment-id $TENANCY_OCID

USER_OCID=$(oci iam user list --compartment-id $TENANCY_OCID \
  --query "data[?name=='cspm-scanner'].id | [0]" --raw-output)

# Create group
oci iam group create \
  --name CspmScanners \
  --description "CSPM scanner group" \
  --compartment-id $TENANCY_OCID

GROUP_OCID=$(oci iam group list --compartment-id $TENANCY_OCID \
  --query "data[?name=='CspmScanners'].id | [0]" --raw-output)

# Add user to group
oci iam group add-user \
  --user-id $USER_OCID \
  --group-id $GROUP_OCID

# Create policy
oci iam policy create \
  --name CspmScannerPolicy \
  --compartment-id $TENANCY_OCID \
  --description "CSPM read-only access" \
  --statements '["Allow group CspmScanners to inspect all-resources in tenancy","Allow group CspmScanners to read all-resources in tenancy"]'
```

---

## Step 3 — Upload the API Public Key

1. In OCI Console, navigate to **Identity → Users → cspm-scanner**
2. Click **API Keys → Add API Key**
3. Select **Paste Public Key**
4. Paste the contents of `~/.oci/cspm/cspm_api_key_public.pem`
5. Click **Add**
6. Copy the **Fingerprint** shown (format: `aa:bb:cc:dd:ee:ff:...`)
7. Copy the **User OCID** and **Tenancy OCID** from the same page

---

## Step 4 — Gather Required Values

You need these four values to connect in the platform:

```bash
# Print all values needed for the platform
echo "Tenancy OCID: $TENANCY_OCID"
echo "User OCID: $USER_OCID"
echo "Region: $(oci iam region-subscription list --query 'data[?["is-home-region"]==\`true\`].["region-name"] | [0]' --raw-output)"
echo "Fingerprint: (copied from OCI Console in Step 3)"
echo "Private Key:"
cat ~/.oci/cspm/cspm_api_key.pem
```

---

## Step 5 — Connect in the Platform

1. In the CSPM platform, navigate to **Onboarding → Connect Cloud Account**
2. Select **Oracle Cloud Infrastructure**
3. Enter:
   - **Tenancy OCID** — starts with `ocid1.tenancy.oc1..`
   - **User OCID** — starts with `ocid1.user.oc1..`
   - **Home Region** — e.g. `ap-mumbai-1`, `us-ashburn-1`
   - **Fingerprint** — the key fingerprint from Step 3
   - **Private Key** — paste the full contents of `cspm_api_key.pem`
4. Click **Validate Connection**

---

## OCI Services Scanned

The platform scans **20+ OCI services** organized into five categories. New services are added on a quarterly cadence.

| Category | Services scanned |
|---|---|
| **Compute** | Compute Instances · OKE Clusters · Container Instances · Functions |
| **Storage & Data** | Object Storage Buckets · Block Volumes · File Storage · Autonomous Database · DB Systems · MySQL Database · NoSQL Database |
| **Networking** | VCNs · Security Lists · Network Security Groups · Load Balancers · Internet Gateways · NAT Gateways · DRG · WAF Policies |
| **Identity & Security** | IAM Users and Groups · Policies · Vaults and Keys · Secrets · Compartments · Identity Domains |
| **Monitoring** | Audit Logs · Events Service · Notifications · Logging configuration |

---

## Multi-Compartment Scanning

OCI organizes resources into compartments. The policy `Allow group CspmScanners to read all-resources in tenancy` grants access to all compartments by default, including nested ones.

To restrict scanning to specific compartments:

```
Allow group CspmScanners to inspect all-resources in compartment COMPARTMENT_NAME
Allow group CspmScanners to read all-resources in compartment COMPARTMENT_NAME
```

Note that restricting to specific compartments will exclude resources in other compartments from findings.

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `NotAuthenticated` | Wrong fingerprint, key, or user OCID | Re-verify all values; re-upload public key if needed |
| `NotAuthorized` | Policy not created or not at tenancy level | Verify policy is in the root compartment with correct group name |
| `InvalidParameter: region` | Unknown region identifier | Use the region identifier format (e.g., `ap-mumbai-1`, not `Mumbai`) |
| Resources missing from specific compartments | Policy scoped to wrong compartment | Move policy to root compartment level |
| `403` on specific service | Policy missing `inspect` verb for that service | The policy statements cover all services; check group membership |

---

## API Key Rotation

OCI recommends rotating API keys every 90 days:

```bash
# Generate new key pair
openssl genrsa -out ~/.oci/cspm/cspm_api_key_new.pem 4096
openssl rsa -pubout \
  -in ~/.oci/cspm/cspm_api_key_new.pem \
  -out ~/.oci/cspm/cspm_api_key_new_public.pem

# Upload new public key to OCI Console
# (Identity → Users → cspm-scanner → API Keys → Add API Key)

# Update the private key in the CSPM platform:
# Onboarding → Cloud Accounts → [your account] → Edit → Update Key

# Delete the old key from OCI Console after confirming the new one works
```

---

*Last updated: 2026-05-08*
