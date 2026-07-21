export function CdrBehavioralPost() {
  return (
    <>
      <p>
        AWS GuardDuty is a good product. It detects known malicious IP addresses, known cryptocurrency mining
        domains, known port scanning patterns, and a catalogue of documented attack signatures. If an attacker
        uses infrastructure that has appeared in threat feeds, GuardDuty will catch it.
      </p>

      <p>
        The problem is that sophisticated attackers do not use infrastructure that appears in threat feeds.
        They use compromised legitimate accounts, new cloud instances with clean IP addresses, and legitimate
        AWS services as their command-and-control channel. They operate slowly enough to avoid rate-based
        anomaly rules. They escalate privileges incrementally — one permission at a time — over days or weeks.
      </p>

      <p>
        Rule-based detection catches what you already know to look for. The question is how to catch what you do not.
      </p>

      <h2>The three-tier detection architecture</h2>

      <p>
        Onam's CDR (Cloud Detection and Response) engine operates on three detection tiers that complement
        each other. Each tier catches a different class of attacker behavior, and together they close the
        gaps that any single tier leaves open.
      </p>

      <p>
        <strong>L1 — Rule-based signature detection.</strong> Exactly what GuardDuty does, extended to cover
        multi-cloud environments (Azure, GCP, OCI, IBM Cloud) with a single unified alert schema. Rules are
        mapped to MITRE ATT&CK techniques so each alert comes with context about what phase of the attack
        chain it represents. L1 catches the known-bad — compromised credential use from known threat actors,
        documented exploit signatures, SSRF patterns targeting the metadata service, cryptocurrency mining
        indicators.
      </p>

      <p>
        <strong>L2 — Statistical behavioral baseline detection.</strong> For each IAM identity, compute role,
        and workload in your environment, Onam builds a statistical model of normal behavior. Normal means:
        which API calls does this identity make, at what time of day, from which IP ranges, in which regions,
        against which resources? L2 alerts when observed behavior deviates from the baseline beyond a
        configurable threshold. This catches attackers who are using legitimate credentials and behaving
        differently from the identity's established pattern.
      </p>

      <p>
        <strong>L3 — ML anomaly detection.</strong> Where L2 looks at behavior of individual identities against
        their own history, L3 looks at behavior across the entire environment and flags anomalies that do not
        match patterns anywhere in the account. This is particularly effective for detecting novel attack
        techniques and insider threats — cases where the attacker is familiar enough with the environment to
        mimic an individual identity's patterns, but whose behavior is still anomalous at the population level.
      </p>

      <h2>How L2 catches what L1 misses: incremental privilege escalation</h2>

      <p>
        The canonical example of what L1 cannot detect is incremental privilege escalation. Here is a real
        pattern observed in cloud intrusions:
      </p>

      <p>
        Day 1: Attacker gains access to a developer's AWS credentials, likely through a phishing attack or
        a committed access key in a public GitHub repository. The developer's account can read from S3 buckets
        and invoke Lambda functions. The attacker reads the environment — lists resources, describes IAM policies,
        maps the account structure. All of these calls are legitimate API operations. No threat intelligence
        flags fire. GuardDuty sees nothing unusual.
      </p>

      <p>
        Day 3: The attacker notices that the developer's role has <code>iam:ListRolePolicies</code> and uses
        it to map roles with elevated permissions. They find a CI/CD role that can deploy CloudFormation stacks.
        They call <code>iam:AssumeRole</code> to take on the CI/CD role — a call the developer legitimately
        makes regularly for manual deployments. No rule fires.
      </p>

      <p>
        Day 7: Using the CI/CD role, the attacker deploys a CloudFormation stack that creates a new IAM role
        with administrator access. The stack deployment is indistinguishable from legitimate CI/CD activity.
        The administrator role is now available.
      </p>

      <p>
        At no point did the attacker trigger a signature-based rule. They used legitimate credentials to call
        legitimate APIs in a legitimate sequence — just not the developer's usual sequence.
      </p>

      <p>
        L2 catches this because the behavioral baseline for the developer account shows API call patterns
        concentrated in us-east-1 between 9am and 6pm on weekdays. The attacker's activity happens at 2am
        UTC from an unusual IP range, covers nine regions in sequence (consistent with environment mapping),
        and includes <code>iam:ListRolePolicies</code> calls that the developer has never made before. The
        deviation score exceeds the threshold on Day 1. By Day 3, the anomaly score has accumulated across
        multiple sessions and an L2 alert fires with the full session timeline.
      </p>

      <h2>What "normal" means for a cloud identity</h2>

      <p>
        Building a behavioral baseline that is specific enough to be useful without generating constant false
        positives requires care about what signals you model. Onam's L2 baseline captures:
      </p>

      <ul>
        <li><strong>API call distribution</strong> — which services and specific API operations does this identity call, and in what frequency distribution? A Lambda execution role that calls DynamoDB and Secrets Manager but never touches IAM has a narrow, predictable call profile.</li>
        <li><strong>Temporal patterns</strong> — when does this identity make API calls? Business-hours human users show strong daytime concentration. Scheduled Lambda functions show regular call patterns at consistent intervals. An identity that is normally active 9–6 making calls at 2am is a strong signal.</li>
        <li><strong>Source IP and ASN patterns</strong> — does this identity always call from the corporate CIDR block, from a specific geographic region, from AWS service IP ranges? New source ASNs (especially cloud VPS providers) are anomalous for human users.</li>
        <li><strong>Region distribution</strong> — most cloud deployments operate in one or two regions. An identity suddenly making API calls across six regions in sequence is consistent with environment discovery behavior.</li>
        <li><strong>Resource access patterns</strong> — which specific resources does this identity access? A service account that always writes to one specific DynamoDB table but never reads from it accessing a different table is anomalous regardless of whether the IAM policy technically allows it.</li>
      </ul>

      <p>
        The baseline window is 30 days by default. New identities get a 14-day warm-up period during which
        L2 does not alert — it is building the baseline. This prevents false positives during service launches
        when the identity's behavior naturally looks anomalous because it has no history.
      </p>

      <h2>MITRE ATT&CK mapping in CDR context</h2>

      <p>
        Every CDR alert — regardless of which tier generated it — is tagged with the MITRE ATT&CK techniques
        it corresponds to. This matters for two reasons.
      </p>

      <p>
        First, it puts the alert in attack chain context. A single L2 alert for an unusual API call from a
        new IP is low severity in isolation. But if the same identity triggered an L1 alert for metadata
        service enumeration two hours earlier, the two alerts together represent Initial Access (T1078.004)
        followed by Discovery (T1082). The ATT&CK tagging makes this correlation visible in the alert timeline
        without requiring manual analysis.
      </p>

      <p>
        Second, it connects CDR findings to posture findings. If your CDR alert is tagged T1548.005
        (Temporary Elevated Cloud Access — privilege escalation via role assumption), the posture engine can
        immediately surface the IAM misconfigurations that made this technique possible — the overly permissive
        trust policy, the missing condition key on AssumeRole. The CDR alert becomes a force multiplier for
        CSPM remediation.
      </p>

      <h2>Cross-cloud correlation</h2>

      <p>
        Multi-cloud environments create a detection gap that single-cloud tools cannot address: an attacker
        who compromises an AWS identity can use that access to pivot to Azure or GCP workloads, and no
        single-cloud detection tool sees the full picture.
      </p>

      <p>
        A pattern Onam's CDR engine is designed to catch: an attacker compromises AWS credentials and uses
        them to read Secrets Manager entries that contain Azure service principal credentials (a common
        pattern in cross-cloud deployments where one CSP's secrets manager holds credentials for another).
        The AWS activity — reading Secrets Manager — triggers an L2 alert because the identity has never
        accessed that specific secret. Ten minutes later, the Azure service principal makes unusual RBAC
        modification calls in Azure. Neither alert in isolation points to a cross-cloud attack. Together,
        with the 10-minute timestamp correlation, they tell a clear story.
      </p>

      <p>
        Cross-cloud correlation requires a unified identity model that maps AWS IAM principals, Azure
        Managed Identities, and GCP Service Accounts into a single graph. Onam builds this model during
        the discovery phase; CDR alert correlation runs against it to surface cross-cloud attack chains
        that would be invisible in single-cloud detection tools.
      </p>

      <h2>What to expect in the first 14 days</h2>

      <p>
        The first two weeks of CDR deployment are primarily about baseline calibration and tuning out
        operational noise. Here is what typically happens:
      </p>

      <p>
        <strong>Days 1–3.</strong> L1 rules begin firing immediately on day one. The most common early
        findings are not active threats — they are configuration issues that look like threats: EC2 instances
        making repeated metadata service calls (a legitimate pattern for credential refresh), Lambda functions
        calling APIs across multiple regions (a legitimate pattern for globally distributed services), CI/CD
        pipelines creating IAM roles as part of infrastructure provisioning.
      </p>

      <p>
        <strong>Days 4–7.</strong> Review and tune the L1 false positives. Mark legitimate patterns as
        suppressed with an expiry date — suppression should never be permanent for a cloud detection rule.
        The goal is to reduce alert volume to something a human can review in 30 minutes per day.
      </p>

      <p>
        <strong>Days 8–14.</strong> L2 baselines finish their initial calibration. First L2 alerts will
        appear — typically flagging maintenance windows, deployment pipelines that run at unusual hours,
        and identities that have legitimate but irregular usage patterns. Each alert requires a decision:
        suppress (with expiry and owner), investigate, or escalate.
      </p>

      <p>
        By day 15, alert volume should be manageable and signal quality high enough to run a 30-minute
        daily triage. The value of L3 ML anomaly detection becomes apparent after 30–60 days, when the
        model has enough history to reliably distinguish population-level anomalies from operational variance.
      </p>

      <p>
        CDR is not a "set it and forget it" product. It requires sustained analyst engagement to tune baselines
        and investigate alerts. The return on that investment is coverage of attacker behaviors that no
        signature-based tool can detect — and that is the class of behavior responsible for most significant
        cloud breaches.
      </p>
    </>
  )
}
