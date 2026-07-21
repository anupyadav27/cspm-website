# RBAC & SSO Guide

This guide covers user roles, permissions, team management, and single sign-on (SSO) configuration for the platform. The model is built around **5 seeded roles** with **27 permissions** in `feature:action` format, three-layer tenant isolation, and SAML 2.0 / Google OAuth SSO with optional group-to-role mapping. Everything below applies tenant-by-tenant — your roles, your permissions, your audit log.

<img src="/diagrams/rbac-sso.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:24px;" alt="RBAC role permission matrix for 5 roles and SSO SAML 2.0 configuration flow" />

**Why RBAC matters:** every customer environment combines auditors who need read-only access, analysts who triage findings, and admins who change settings. Mixing those audiences on a single role creates either too-loose access (auditors see secret data) or too-tight access (analysts cannot acknowledge findings). The platform's role catalog is designed to fit those audiences without customization for 95% of teams.

---

## Role Model Overview

The platform ships with **5 hierarchical roles**. Higher-level roles inherit the read permissions of lower-level roles. You assign one role per user per tenant — a user can have different roles in different tenants if your org has multiple.

| Role | Level | Scope | Typical user |
|---|---|---|---|
| `platform_admin` | L1 | Entire platform — all organizations and tenants | Onam support team only — your users do not get this role |
| `org_admin` | L2 | All tenants within your organization | IT director, CISO |
| `tenant_admin` | L4 | Single tenant (cloud environment) | Security team lead, DevSecOps lead |
| `analyst` | L4 | Single tenant — read + triage findings | Day-to-day security analyst, SOC operator |
| `viewer` | L4 | Single tenant — read-only, restricted to non-sensitive engines | Auditor, executive, board-reporting reader |

**`platform_admin` is reserved for Onam SREs.** Customers do not get this role; it exists for support workflows that require an explicit, audit-logged impersonation handshake you approve.

**The role hierarchy is additive on reads, intersection-based on writes** — a `tenant_admin` can do everything an `analyst` can; an `analyst` can do everything a `viewer` can. Writes don't cascade upward — `tenant_admin` cannot do `org_admin` actions like billing.

---

## Permission Matrix

All permissions follow the **`feature:action`** format. The catalog covers 27 permissions across 18 features and 4 action verbs (`read`, `write`, `create`, `delete`). Each role grants a subset.

<img src="/diagrams/ref-rbac-permissions.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="RBAC permissions — 27 permissions grouped by domain in feature:action format with role mapping" />

**The four permission groups in the diagram:**

1. **Base Read (every role, including viewer)** — 9 read permissions on non-sensitive engines: `discoveries`, `inventory`, `check`, `threat`, `compliance`, `iam`, `network`, `risk`, plus `scans:read` and `reports:read`.
2. **Sensitive Read (analyst+ roles only)** — 8 read permissions on engines that contain sensitive data details: `vulnerability`, `datasec`, `container`, `dbsec`, `ai_security`, `encryption`, `secops`, `ciem`. **The viewer role gets HTTP 403 on these — by design.** Sensitive engines may include PII column samples, credential references, vulnerability paths, attack chains.
3. **Write (tenant_admin+ roles)** — 7 mutating permissions: `scans:create`, `reports:write`, `tenants:read/write`, `users:read/write`, `accounts:read`. Plus 2 reserved for org_admin: `accounts:write`, `billing:read`.
4. **Permission format & role granting** — the `feature:action` rule, role inheritance, and SAML group mapping.

**Full role-by-permission matrix:**

| Permission | platform_admin | org_admin | tenant_admin | analyst | viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| `discoveries:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `inventory:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `check:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `threat:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `compliance:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `iam:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `network:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `risk:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `reports:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `scans:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `vulnerability:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `datasec:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `container:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `dbsec:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `ai_security:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `encryption:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `secops:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `ciem:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `scans:create` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `reports:write` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `tenants:read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `users:read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `accounts:read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tenants:write` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `users:write` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `accounts:write` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `billing:read` | ✅ | ✅ | ❌ | ❌ | ❌ |

> **`viewer` role: 9 read-only permissions.** Sensitive security modules (Vulnerability, DataSec, CIEM, Container, DB Security, AI Security, Encryption, SecOps) return HTTP 403 for viewers. This is enforced at the engine endpoint, not just hidden in the UI — auditors with viewer accounts cannot bypass via direct API call.

<img src="/diagrams/p-iam.svg" style="width:auto;max-width:100%;display:block;margin-left:auto;margin-right:auto;border-radius:10px;margin-bottom:16px;" alt="Onam CSPM — IAM and RBAC platform view showing role assignments, permission matrix, and user management dashboard" />

---

## Managing Users

### Invite a User

The user invite flow is a five-step path from admin action to active user with the right permissions. Each step has built-in safeguards.

<img src="/diagrams/ref-rbac-invite-flow.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="User invite flow — admin invites, email sent, user signs in, role applied, access granted" />

**Reading the flow left-to-right:**

1. **Admin sends invite** — Settings → Users → Invite User. Admin selects the role at invite time so the user lands with correct permissions on first login.
2. **Email with signup link** — signed URL valid for 72 hours, single-use. Lost links must be re-issued, not extended.
3. **User authenticates** — existing accounts log in; new accounts set a password and enroll MFA if required by your tenant policy.
4. **Role applied** — permission set computed and scoped to your tenant ID. An audit-log entry is written with the inviter, invitee, role, and timestamp.
5. **Access granted** — user lands in the dashboard with the assigned permissions enforced at every API call.

**Step-by-step procedure:**

1. Navigate to **Settings → Users → Invite User**
2. Enter the user's email address
3. Select a **Role**
4. Click **Send Invitation**
5. The user receives an email with a signup link valid for 72 hours

### Change a User's Role

1. Navigate to **Settings → Users**
2. Find the user and click **Edit**
3. Change the role from the dropdown
4. Click **Save**

Role changes take effect within 60 seconds via session re-validation. Existing API calls in flight finish under the old role; the next call uses the new role.

### Remove a User

1. Navigate to **Settings → Users**
2. Click **Remove** next to the user
3. Confirm the removal

Removed users lose access immediately. Their findings, audit-log entries, and report attribution are retained — removal does not erase history.

---

## Single Sign-On (SSO)

The platform supports **SAML 2.0** (works with Okta, Azure AD / Entra ID, Google Workspace, JumpCloud, OneLogin, Ping Identity, ADFS) and **Google OAuth** (for Google-Workspace-only orgs).

### SAML 2.0

The SAML flow is the same nine-step handshake every SP↔IdP integration uses. The platform acts as the Service Provider (SP); your IdP authenticates the user.

<img src="/diagrams/ref-rbac-saml-flow.svg" style="width:100%;max-width:920px;border-radius:10px;margin-bottom:16px;" alt="SAML 2.0 SSO flow — 9-step handshake from user navigation to authenticated session" />

**Walking through the 9 steps:**

| # | Action | Who |
|---|---|---|
| 1 | Navigate to `/auth/saml/login` | User |
| 2 | Platform issues 302 redirect to IdP with SAML AuthnRequest | Platform → User |
| 3 | Browser POSTs AuthnRequest to IdP | User → IdP |
| 4 | IdP prompts for credentials + MFA | IdP → User |
| 5 | User authenticates at IdP | User (out of platform scope) |
| 6 | IdP returns signed SAML Response to browser | IdP → User |
| 7 | Browser POSTs response to `/auth/saml/callback` | User → Platform |
| 8 | Platform validates signature, extracts email, maps groups | Platform |
| 9 | Platform sets `access_token` cookie, scopes session to your tenant | Platform → User |

#### SAML Configuration

1. Navigate to **Settings → Authentication → SSO → Configure SAML**
2. Download the **Service Provider Metadata XML** (or copy the SP values below)
3. Configure your IdP with these SP values:

| SP Setting | Value |
|---|---|
| **Entity ID** | `https://api.onam.io/auth/saml/metadata` |
| **ACS URL** | `https://api.onam.io/auth/saml/callback` |
| **Binding** | HTTP POST |
| **NameID Format** | `emailAddress` |
| **Signature Algorithm** | RSA-SHA256 |

4. In the platform, enter the IdP values:

| Platform Field | Where to find in IdP |
|---|---|
| **IdP Entity ID** | IdP metadata → `entityID` attribute |
| **IdP SSO URL** | IdP metadata → `SingleSignOnService Location` |
| **IdP Certificate** | IdP metadata → `X509Certificate` |

5. Configure **attribute mapping**:

| Platform Attribute | SAML Attribute Name |
|---|---|
| Email | `email` or `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` |
| First Name | `firstName` or `givenname` |
| Last Name | `lastName` or `surname` |
| Groups (optional) | `groups` or `memberOf` |

6. Click **Test Connection** → **Save**

#### SAML Group-to-Role Mapping

Map IdP groups to platform roles automatically — role changes in your IdP propagate to the platform on the user's next login.

1. Navigate to **Settings → Authentication → SSO → Group Mapping**
2. Add mappings:

| IdP Group | Platform Role |
|---|---|
| `security-admins` | `tenant_admin` |
| `security-analysts` | `analyst` |
| `developers` | `viewer` |

Users get the highest-priority mapped role. Unmapped users can be set to a default role or blocked entirely.

### Google OAuth

1. Navigate to **Settings → Authentication → SSO → Configure Google OAuth**
2. In Google Cloud Console:
   - Create an OAuth 2.0 Client ID
   - Authorized redirect URI: `https://api.onam.io/auth/google/callback`
3. Enter the **Client ID** and **Client Secret** in the platform
4. Optionally restrict to your Google Workspace domain — enter your domain (e.g., `yourcompany.com`) in the **Allowed Domain** field
5. Click **Save**

### Enforce SSO (Disable Password Login)

Once SSO is configured and tested:

1. Navigate to **Settings → Authentication → SSO**
2. Toggle **Require SSO for all users**
3. Confirm — all non-SSO logins will be blocked after this point

> **Warning** — ensure at least one SSO admin can log in successfully before enabling this. The platform cannot reverse the toggle without SSO access.

---

## Multi-Factor Authentication (MFA)

MFA is enforced for all `platform_admin` and `org_admin` accounts and can be required for all users in your tenant.

1. Navigate to **Settings → Authentication → MFA**
2. Select **Require MFA for**: All users / Admins only / None
3. Supported MFA methods:
   - **TOTP** (Google Authenticator, Authy, 1Password, any RFC 6238 app)
   - **Email OTP** (one-time codes via email — for users without TOTP capability)

Users set up MFA on their first login after the policy is enabled. SAML SSO sessions inherit MFA from your IdP — the platform does not require duplicate MFA when the IdP already enforced it.

---

## Audit Logs

Every user-management action is recorded in the audit log and queryable via API.

```http
GET /gateway/api/v1/audit-logs?action=user.invite&page=1
```

```json
{
  "data": [
    {
      "timestamp": "2026-05-09T10:30:00Z",
      "actor_email": "admin@yourcompany.com",
      "action": "user.invite",
      "target_email": "analyst@yourcompany.com",
      "role": "analyst",
      "ip_address": "203.0.113.1",
      "result": "success"
    }
  ]
}
```

**Audit log events include:** login, logout, role change, user invite, user remove, SSO config change, scan trigger, API key create / delete, finding suppression, framework score export.

Audit logs are retained for **2 years** by default, exportable to your SIEM (Splunk, Elastic, Datadog, Sumo Logic) via webhook or daily S3 sync.

---

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| HTTP 403 on specific pages | Role lacks required permission | Check the permission matrix above — upgrade role or use the right account |
| SAML: `InResponseTo mismatch` | Clock skew between IdP and SP | Ensure NTP is synchronized on the IdP server |
| SAML: `Invalid signature` | Wrong certificate in SP config | Re-download IdP metadata and update the certificate |
| Google SSO: `redirect_uri_mismatch` | Wrong redirect URI in Google Console | Set redirect URI exactly to `https://api.onam.io/auth/google/callback` |
| User not auto-assigned role via SAML | Group attribute not mapped or not sent | Configure Group Mapping in SSO settings; verify IdP sends the `groups` attribute |
| MFA setup loop | Browser cookies cleared mid-flow | Clear browser cache fully and retry MFA setup |
| Invite link expired | 72-hour single-use limit hit | Re-issue from Settings → Users — links cannot be extended |

---

*Last updated: 2026-05-09*
*For SSO configuration assistance: support@onam.io*
