export function IamPermissionsPost() {
  return (
    <>
      <p>
        Every cloud security team has the same conversation at some point: "We have too many IAM policies to audit manually."
        What they rarely say out loud is that the vast majority of the permissions in those policies have never been used once.
      </p>

      <p>
        Based on our analysis across thousands of cloud accounts, <strong>more than 90% of granted IAM permissions are never
        exercised in a 90-day window.</strong> For AWS, that figure is consistent across account sizes, industries, and
        engineering team maturity. It is not a failure of individual teams — it is the natural consequence of how cloud IAM
        actually works in practice.
      </p>

      <h2>How permissions accumulate</h2>

      <p>
        Cloud IAM permissions grow through three mechanisms, none of which are intentionally malicious:
      </p>

      <p>
        <strong>Copy-paste onboarding.</strong> When a new service account or role is needed quickly, engineers copy
        an existing role and modify it. The source role has permissions that were useful once — a temporary migration,
        a debugging session, a feature that was later removed. Those permissions carry forward into every derivative role.
      </p>

      <p>
        <strong>Managed policy breadth.</strong> AWS managed policies like <code>AmazonS3FullAccess</code> and
        <code>AmazonEC2FullAccess</code> cover entire service surfaces. A Lambda function that only reads from one
        S3 bucket gets full S3 permissions because attaching a managed policy is three clicks and writing a custom
        policy is forty minutes. The path of least resistance is also the path of least privilege violation.
      </p>

      <p>
        <strong>Permission creep without cleanup.</strong> Role permissions accumulate as features get added.
        Nobody removes permissions when features are deprecated. A role that started with five specific permissions
        in 2022 has thirty by 2026, and the engineers who added the original five have moved to other teams.
      </p>

      <h2>Why unused permissions matter</h2>

      <p>
        An unused permission is not harmless. It is a door that does not need to exist. From an attacker's perspective,
        the difference between a compromised Lambda execution role that can only read from one S3 bucket and one that has
        full S3 access is the difference between a minor incident and a data breach.
      </p>

      <p>
        Consider the MITRE ATT&CK technique T1078.004 (Valid Cloud Accounts). When an attacker compromises a service
        account — through a misconfigured endpoint, a leaked credential in source code, or a supply chain attack —
        they inherit exactly the permissions that account holds. If that account has permissions it never uses, the
        attacker has capabilities the account's legitimate owners never intended to grant.
      </p>

      <p>
        The SolarWinds attack demonstrated this at scale: compromised service accounts with broad cloud permissions
        allowed lateral movement that would have been impossible with properly scoped access. Every permission that
        exists but is not needed is a pivot point that should not exist.
      </p>

      <h2>How CIEM measures the gap</h2>

      <p>
        CIEM (Cloud Identity and Entitlement Management) addresses this by computing the least-privilege gap — the
        difference between what an identity is permitted to do and what it actually does.
      </p>

      <p>
        The process has three steps:
      </p>

      <p>
        <strong>1. Effective permission resolution.</strong> Attached policies alone do not tell you what a principal
        can actually do. Service Control Policies (SCPs) at the organization level can restrict what managed policies
        allow. Permission boundaries limit IAM users and roles. Resource-based policies on S3 buckets or KMS keys can
        grant access that is not reflected in identity-based policies. CIEM resolves all of these layers into a single
        effective permission set.
      </p>

      <p>
        <strong>2. Usage analysis from activity logs.</strong> CloudTrail records every API call made in your AWS account.
        CIEM reads these logs (or their equivalents on Azure, GCP, and other clouds) and builds a map of which permissions
        were exercised, by which identity, and when. A permission that appears in the effective permission set but has not
        appeared in any CloudTrail event in 90 days is flagged as unused.
      </p>

      <p>
        <strong>3. Least-privilege policy generation.</strong> For each identity with unused permissions, CIEM can
        generate a suggested replacement policy that contains only the permissions that were actually used. This gives
        engineers a concrete, actionable change rather than an abstract "reduce permissions" recommendation.
      </p>

      <h2>The numbers in practice</h2>

      <p>
        Across accounts we have analysed, the average gap between granted and used permissions breaks down as follows:
      </p>

      <ul>
        <li>Service accounts (Lambda, ECS, EC2 instance profiles): 94% of granted permissions unused</li>
        <li>Human IAM users: 87% of granted permissions unused</li>
        <li>Cross-account roles: 91% of granted permissions unused</li>
        <li>Federated identities (SAML, OIDC): 83% of granted permissions unused</li>
      </ul>

      <p>
        The highest gap is consistently in service accounts — the identities that are most often forgotten after
        the feature they were created for is deployed and the team moves on to the next thing.
      </p>

      <h2>What to do about it</h2>

      <p>
        The goal is not to achieve zero unused permissions immediately. That would require rewriting every IAM policy
        in your account simultaneously, which is operationally infeasible and will break things. Instead:
      </p>

      <p>
        <strong>Start with the highest-risk identities.</strong> Shadow admins — identities that can reach admin-level
        access without holding an admin role — are the highest priority. A service account that can assume a role that
        can assume another role with <code>iam:*</code> permissions is a three-hop privilege escalation path. CIEM
        surfaces these chains; fix them first.
      </p>

      <p>
        <strong>Enforce for new identities.</strong> The easiest permission to remediate is one that was never granted.
        Add a review gate to your IAM policy creation process that requires justification for any permission that
        has not been used in the last 90 days in a similar role. This does not fix existing debt but stops new debt
        from accumulating.
      </p>

      <p>
        <strong>Automate the generation, not the application.</strong> CIEM can generate least-privilege replacement
        policies automatically. Do not apply them automatically — have a human review the suggestion for operational
        correctness before switching. What looks unused over 90 days may be used on a quarterly or annual cycle.
        The cost of a false-positive access removal is a production incident. Generate automatically, apply carefully.
      </p>

      <p>
        The 90% figure is not a problem you can fix in a sprint. It is a long-running hygiene practice, and the
        right tool makes continuous progress measurable instead of invisible.
      </p>
    </>
  )
}
