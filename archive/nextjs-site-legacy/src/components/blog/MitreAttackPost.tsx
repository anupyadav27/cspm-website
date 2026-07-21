export function MitreAttackPost() {
  return (
    <>
      <p>
        MITRE ATT&CK for Cloud is a framework that catalogues the tactics, techniques, and procedures (TTPs) that
        adversaries use to attack cloud environments. It is maintained by MITRE, peer-reviewed by threat intelligence
        teams at major security vendors, and updated as new cloud attack techniques are observed in the wild.
      </p>

      <p>
        Most discussions of MITRE ATT&CK treat it as an abstract threat intelligence reference. This post is about
        something more practical: how individual ATT&CK techniques translate into specific cloud misconfigurations
        that a CSPM tool can detect and score — and what that means for how you should read your posture score.
      </p>

      <h2>How ATT&CK for Cloud is structured</h2>

      <p>
        ATT&CK for Cloud covers four platforms: AWS, Azure, GCP, and Office 365. Each platform has a matrix of
        tactics (the adversary's goal) and techniques (the method used to achieve that goal).
      </p>

      <p>
        The tactics in the cloud matrix are:
      </p>

      <ul>
        <li><strong>Initial Access</strong> — getting into the environment</li>
        <li><strong>Execution</strong> — running code</li>
        <li><strong>Persistence</strong> — maintaining access after the initial foothold</li>
        <li><strong>Privilege Escalation</strong> — gaining higher-level permissions</li>
        <li><strong>Defense Evasion</strong> — hiding activity from detection</li>
        <li><strong>Credential Access</strong> — stealing credentials for further use</li>
        <li><strong>Discovery</strong> — mapping the environment</li>
        <li><strong>Lateral Movement</strong> — moving from one resource to another</li>
        <li><strong>Collection</strong> — gathering data of interest</li>
        <li><strong>Exfiltration</strong> — removing data from the environment</li>
        <li><strong>Impact</strong> — disrupting availability or integrity</li>
      </ul>

      <h2>Misconfigurations as enablers</h2>

      <p>
        Here is the key insight: most ATT&CK techniques require a precondition — a misconfiguration, gap, or
        overly permissive setting that the attacker can exploit. CSPM rules are, in effect, precondition detectors.
        When your posture score flags a finding, it is identifying a configuration that makes a specific technique
        easier to execute.
      </p>

      <p>
        Let us walk through specific examples.
      </p>

      <h3>T1078.004 — Valid Cloud Accounts (Initial Access)</h3>

      <p>
        This technique covers attackers using legitimately issued cloud credentials — obtained through phishing,
        credential stuffing, or exposure in source code — to access cloud resources.
      </p>

      <p>
        The CSPM rules that map to T1078.004:
      </p>

      <ul>
        <li>IAM access keys not rotated in 90+ days (stale credentials increase exposure window)</li>
        <li>MFA not enforced on IAM users with console access (reduces attacker cost to exploit a credential)</li>
        <li>Long-lived service account keys in GCP or Azure service principal secrets not rotated</li>
        <li>EC2 instance metadata service (IMDSv1) accessible without authentication (credential theft via SSRF)</li>
      </ul>

      <p>
        When your posture score degrades on any of these rules, it means T1078.004 is now easier to execute
        against your environment.
      </p>

      <h3>T1548.005 — Temporary Elevated Cloud Access (Privilege Escalation)</h3>

      <p>
        Attackers with limited initial access use misconfigured IAM role assumption chains to escalate privileges
        to administrator level.
      </p>

      <p>
        The CSPM rules that map to T1548.005:
      </p>

      <ul>
        <li>IAM roles with overly permissive trust policies that allow any principal in the account to assume them</li>
        <li>Service accounts with <code>iam:PassRole</code> to roles with higher privileges</li>
        <li>Lambda functions with execution roles that include <code>iam:CreatePolicyVersion</code></li>
        <li>Cross-account trust relationships with external accounts without external ID requirements</li>
      </ul>

      <h3>T1562.008 — Disable Cloud Logs (Defense Evasion)</h3>

      <p>
        Before exfiltrating data or moving laterally, sophisticated attackers disable or tamper with logging to
        reduce the chance of detection.
      </p>

      <p>
        The CSPM rules that map to T1562.008:
      </p>

      <ul>
        <li>CloudTrail not enabled in all regions (gaps that create blind spots)</li>
        <li>CloudTrail log file validation not enabled (logs can be tampered without detection)</li>
        <li>S3 buckets holding CloudTrail logs without MFA delete protection (attacker can delete evidence)</li>
        <li>GuardDuty not enabled (primary anomaly detection layer disabled)</li>
      </ul>

      <h3>T1530 — Data from Cloud Storage (Collection)</h3>

      <p>
        Attackers access cloud object storage that holds sensitive data — customer PII, source code, secrets,
        financial records.
      </p>

      <p>
        The CSPM rules that map to T1530:
      </p>

      <ul>
        <li>S3 buckets with public read access (no authentication required)</li>
        <li>S3 buckets without server-side encryption (data accessible in plain text if bucket policy is bypassed)</li>
        <li>S3 access logging disabled (collection activity leaves no trace)</li>
        <li>Overly permissive IAM policies that grant <code>s3:GetObject</code> on <code>*</code> resources</li>
      </ul>

      <h2>How posture score maps to technique coverage</h2>

      <p>
        When we assign a posture score to your cloud environment, each rule that contributes to the score is tagged
        with the ATT&CK techniques it relates to. A score of 87 out of 100 means 13% of your rules are failing —
        but it also means there is a specific set of ATT&CK techniques whose preconditions are currently satisfied
        in your environment.
      </p>

      <p>
        This framing changes how you should prioritise remediation. A rule failure that maps to T1562.008
        (Disable Cloud Logs) or T1078.004 (Valid Cloud Accounts) should be treated more urgently than one that
        maps to a technique that requires prior compromise of a privileged identity. The first set represents
        techniques that are accessible with minimal prior access; the second requires steps the attacker has
        not yet taken.
      </p>

      <h2>Putting it into practice</h2>

      <p>
        The practical application of ATT&CK for Cloud is not to implement every mitigation in the matrix simultaneously.
        It is to use the technique-to-misconfiguration mapping to answer: "If an attacker is already in my environment
        with basic credentials, which techniques can they execute today?"
      </p>

      <p>
        Walk through the privilege escalation techniques first. Then defense evasion. Then collection and exfiltration.
        Fix the rules that open the door to these techniques, and your posture score becomes a leading indicator
        of how hard your environment is to attack — not just a compliance checkbox.
      </p>
    </>
  )
}
