# Connect Alibaba Cloud (AliCloud)

This guide walks you through connecting an Alibaba Cloud account to the CSPM platform using a RAM (Resource Access Management) user with read-only access.

**Time to complete**: ~15 minutes
**AliCloud knowledge required**: RAM users, policies, and AccessKeys

<img src="/diagrams/onboard-alicloud.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="AliCloud onboarding flow: Create RAM User, Attach Read Policy, Enter Credentials, Scan Running" />

---

## How It Works

The onboarding diagram above shows the connection model end-to-end. The platform connects to Alibaba Cloud via a **dedicated RAM user with the ReadOnlyAccess policy** (plus a few additional service-specific read policies). You create the user, attach the policies, generate an AccessKey pair, and paste the credentials into the platform — the platform then authenticates with the AccessKey and reads resource configurations through the AliCloud APIs.

**Three properties of this design:**

- **ReadOnlyAccess + service-specific read policies** — no write actions are possible.
- **Scoped to the account you grant** — the platform cannot see other Alibaba Cloud accounts.
- **AccessKeys can be rotated at any time** — recommended every 12 months. Old keys can be revoked instantly.

---

## Prerequisites

- Alibaba Cloud account with RAM management permissions
- CSPM platform account with at least `tenant_admin` role
- Your Alibaba Cloud **Account ID** (found in the top-right account menu)

---

## Step 1 — Create a RAM User

### Using the Alibaba Cloud Console

1. Log in to the [Alibaba Cloud Console](https://ram.console.aliyun.com/users)
2. Navigate to **RAM Console → Users → Create User**
3. **Logon Name**: `cspm-scanner`
4. **Display Name**: `CSPM Scanner`
5. **Access Mode**: Select **Programmatic Access** (AccessKey only)
6. Click **OK**
7. **Save the AccessKey ID and Secret** shown immediately — the secret cannot be retrieved again

### Using Alibaba Cloud CLI (aliyun)

```bash
# Create the RAM user
aliyun ram CreateUser \
  --UserName cspm-scanner \
  --DisplayName "CSPM Scanner"

# Create AccessKey for the user
aliyun ram CreateAccessKey \
  --UserName cspm-scanner

# Save the output — AccessKeyId and AccessKeySecret shown once only
```

---

## Step 2 — Attach ReadOnlyAccess Policy

### Using the Console

1. In RAM Console, open the `cspm-scanner` user
2. Click **Add Permissions**
3. Search for `ReadOnlyAccess`
4. Select **AliyunReadOnlyAccess** (system policy)
5. Click **OK**

### Using CLI

```bash
aliyun ram AttachPolicyToUser \
  --PolicyName AliyunReadOnlyAccess \
  --PolicyType System \
  --UserName cspm-scanner
```

---

## Step 3 — Additional Permissions for Full Coverage

`AliyunReadOnlyAccess` covers most services but some security-specific APIs need additional grants:

```bash
# Create a custom policy for security scanning
aliyun ram CreatePolicy \
  --PolicyName CspmSecurityScanPolicy \
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
aliyun ram AttachPolicyToUser \
  --PolicyName CspmSecurityScanPolicy \
  --PolicyType Custom \
  --UserName cspm-scanner
```

---

## Step 4 — Find Your Account ID

1. Click your avatar in the top-right of the Alibaba Cloud Console
2. Select **Security Settings** or hover over the account name
3. The **Account ID** is a numeric string (e.g., `1234567890123456`)

Or via CLI:
```bash
aliyun sts GetCallerIdentity
# AccountId is in the response
```

---

## Step 5 — Connect in the Platform

1. In the CSPM platform, navigate to **Onboarding → Connect Cloud Account**
2. Select **Alibaba Cloud**
3. Enter:
   - **Account ID** — numeric account identifier
   - **AccessKey ID** — from Step 1
   - **AccessKey Secret** — from Step 1
   - **Home Region** — e.g. `cn-hangzhou`, `ap-southeast-1`
   - **Account Alias** — friendly name
4. Click **Validate Connection**

---

## AliCloud Services Scanned

The platform scans **20+ AliCloud services** organized into five categories. New services are added on a quarterly cadence.

| Category | Services scanned |
|---|---|
| **Compute** | ECS Instances · ACK Clusters · Function Compute · Elastic Container Instance |
| **Storage & Data** | OSS Buckets · RDS Instances · PolarDB · ApsaraDB for Redis · Table Store · ApsaraDB for MongoDB |
| **Networking** | VPCs · Security Groups · Server Load Balancer · Cloud Firewall · WAF · NAT Gateway · Anti-DDoS |
| **Identity & Security** | RAM Users and Roles · RAM Policies · KMS Keys · Secrets Manager · ActionTrail · Cloud Security Center |
| **Monitoring** | Cloud Monitor · Log Service · ActionTrail audit logs |

---

## Multi-Account Setup (Resource Directory)

For organizations using Alibaba Cloud Resource Directory (multi-account):

1. Connect the master account first using the steps above
2. In the master account, grant the RAM user cross-account access:

```bash
# In the master account, create a policy allowing cross-account reads
# Then in each member account, create a RAM role that trusts the cspm-scanner user
# from the master account

aliyun ram CreateRole \
  --RoleName CspmCrossAccountRole \
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
```

Contact support@yourplatform.com to configure multi-account Resource Directory scanning.

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `InvalidAccessKeyId` | AccessKey ID incorrect or user deleted | Re-create AccessKey in RAM Console |
| `SignatureDoesNotMatch` | AccessKey Secret incorrect | Verify secret was copied without extra spaces |
| `NoPermission` | ReadOnlyAccess policy not attached | Complete Step 2 |
| OSS buckets missing | Cross-region bucket not listed | Ensure Home Region covers the bucket regions |
| ActionTrail events missing | ActionTrail not enabled | Enable ActionTrail in AliCloud Console |
| `InvalidParameter.Region` | Unsupported region format | Use region ID format (e.g., `cn-hangzhou` not `China Hangzhou`) |

---

## AccessKey Rotation

Rotate AccessKeys every 90 days:

1. In RAM Console, open `cspm-scanner` user
2. Click **Create AccessKey** to generate a new one
3. Update the credential in the CSPM platform: **Onboarding → Cloud Accounts → Edit**
4. Verify scanning works with the new key
5. Delete the old AccessKey from RAM Console

```bash
# List existing keys
aliyun ram ListAccessKeys --UserName cspm-scanner

# Delete old key after new one is confirmed working
aliyun ram DeleteAccessKey \
  --UserName cspm-scanner \
  --UserAccessKeyId OLD_ACCESS_KEY_ID
```

---

*Last updated: 2026-05-08*
