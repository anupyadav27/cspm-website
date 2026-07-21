export function AttackPathsPost() {
  return (
    <>
      <p>
        The average enterprise cloud account has 400 to 600 CSPM findings at any given time. Security teams
        triage by severity, work through the CRITICAL queue, and ship patches. Three months later, the
        finding count is roughly the same. The board asks why the environment is still at risk.
      </p>

      <p>
        The answer is that severity scores do not tell you which findings actually lead to breaches. They tell
        you how bad an individual misconfiguration is in isolation. But attackers do not exploit individual
        misconfigurations in isolation — they chain them together. The finding that causes a breach is rarely
        the most severe finding on your list. It is the one that connects to five other findings in a path
        that reaches your most critical assets.
      </p>

      <h2>What an attack path actually is</h2>

      <p>
        An attack path is a sequence of exploitation steps that an attacker could take to move from an initial
        foothold to a target resource. Each step in the path exploits a specific misconfiguration or
        vulnerability. No single step requires extraordinary attacker capability — each one is a logical
        consequence of the previous.
      </p>

      <p>
        A typical AWS attack path might look like this:
      </p>

      <ol>
        <li>A Lambda function is exposed to the internet via an API Gateway without authentication. An attacker sends a crafted request that triggers an SSRF vulnerability in the application code.</li>
        <li>The SSRF reaches the EC2 Instance Metadata Service (IMDSv1) and retrieves temporary credentials for the Lambda execution role.</li>
        <li>The Lambda execution role has <code>iam:PassRole</code> permission on a deployment role used by the CI/CD pipeline.</li>
        <li>Using <code>iam:PassRole</code>, the attacker creates a new Lambda function and assigns the deployment role, giving them pipeline-level permissions.</li>
        <li>The deployment role has <code>s3:GetObject</code> on the S3 bucket where customer PII exports are staged for the data warehouse ETL pipeline.</li>
      </ol>

      <p>
        At step one, the attacker is an anonymous internet user. At step five, they are reading customer PII.
        None of the individual misconfigurations — IMDSv1 enabled, overly permissive execution role,
        unscoped PassRole — are rated CRITICAL in isolation. Together, they form a breach.
      </p>

      <h2>Toxic combinations: when 2+2=10</h2>

      <p>
        The term "toxic combination" describes a set of findings that, in combination, produce a risk that
        is orders of magnitude larger than the sum of individual risk scores. The concept was popularised by
        Wiz and has since become standard terminology in the CNAPP space.
      </p>

      <p>
        A concrete example: suppose you have an EC2 instance that is internet-facing (a HIGH finding) running
        a web application with a known CVE in its web framework (a MEDIUM finding). Neither finding is marked
        CRITICAL. But the CVE provides remote code execution, and the internet-facing exposure means the
        instance can be reached directly from the internet. The combination is CRITICAL — it is a direct RCE
        entry point with no network controls in between.
      </p>

      <p>
        Add one more element: suppose the EC2 instance profile grants <code>ec2:DescribeInstances</code> and
        <code>ssm:SendCommand</code> across the entire account. Now the attacker who exploited the CVE can
        run commands on every EC2 instance in the account. Three MEDIUM/HIGH findings. One account-wide compromise.
      </p>

      <h2>Crown jewel path analysis</h2>

      <p>
        Not all attack paths matter equally. A path that reaches a development environment with synthetic
        test data is not the same as a path that reaches your production payment processor or your customer
        data lake. Crown jewel path analysis starts from the resources you care most about — your crown
        jewels — and works backwards to find every path that leads to them.
      </p>

      <p>
        Crown jewels are identified through a combination of:
      </p>

      <ul>
        <li><strong>Resource tags</strong> — if your team already tags production databases and PII stores, those tags can automatically designate crown jewels.</li>
        <li><strong>Data classification signals</strong> — S3 buckets with names matching PII or financial data patterns, RDS instances serving production applications.</li>
        <li><strong>Manual designation</strong> — security teams can explicitly mark specific resources as crown jewels during onboarding.</li>
        <li><strong>Risk scoring</strong> — resources that aggregate connections (databases serving multiple services) score higher automatically.</li>
      </ul>

      <p>
        Once crown jewels are designated, attack path analysis runs a reverse graph traversal: starting from
        each crown jewel, what resources can reach it, and through what chain of permissions and network paths?
        The result is a ranked list of paths sorted by likelihood of exploitation and blast radius.
      </p>

      <h2>How Onam implements attack path analysis</h2>

      <p>
        Onam's attack path engine is built on a property graph stored in Neo4j. Every cloud resource —
        EC2 instances, IAM roles, S3 buckets, Lambda functions, security groups, VPCs, subnets, load balancers —
        is represented as a node. Relationships between resources are represented as typed edges.
      </p>

      <p>
        The key relationship types are:
      </p>

      <ul>
        <li><code>CAN_ASSUME</code> — one IAM principal can assume another role (trust policy allows it)</li>
        <li><code>HAS_PERMISSION</code> — an IAM principal has a specific action on a resource</li>
        <li><code>NETWORK_REACHABLE</code> — a resource is network-accessible from another resource or from the internet</li>
        <li><code>RUNS_ON</code> — a workload runs on a compute resource and inherits its instance role</li>
        <li><code>EXPOSES</code> — a resource (load balancer, API Gateway) exposes another resource to a broader network scope</li>
      </ul>

      <p>
        Attack path discovery runs a breadth-first search (BFS) across this graph, starting from external
        entry points — internet-accessible endpoints, publicly accessible storage, misconfigured STS endpoints —
        and traversing the graph to find all reachable crown jewel nodes. Each discovered path is scored using
        a composite function of:
      </p>

      <ul>
        <li>Number of hops (shorter paths are higher priority)</li>
        <li>Exploitability of each step (CVE with public exploit vs. requires valid credentials)</li>
        <li>Sensitivity of the target resource</li>
        <li>Whether any compensating controls exist along the path (monitoring, WAF, GuardDuty)</li>
      </ul>

      <h2>MITRE ATT&CK tagging on every path step</h2>

      <p>
        Each step in an attack path is tagged with the MITRE ATT&CK technique it represents. This does two things:
        it grounds the abstract graph traversal in threat intelligence that security teams and CISOs recognize,
        and it connects your attack path findings to your compliance posture for frameworks like NIST CSF and
        CIS Controls that reference ATT&CK.
      </p>

      <p>
        A path step that exploits IMDSv1 to steal credentials is tagged T1552.005 (Unsecured Credentials: Cloud
        Instance Metadata API). A step that uses <code>iam:PassRole</code> for privilege escalation is tagged
        T1548.005. A step that exfiltrates data from S3 is tagged T1530.
      </p>

      <p>
        This tagging means that when you present an attack path finding to an engineering team, you can say:
        "This is a five-step privilege escalation path from an internet-exposed Lambda to your production database,
        using T1078 → T1548 → T1530. Here are the three changes that break the path at step two."
      </p>

      <h2>What to fix first: breaking the chain vs. hardening the target</h2>

      <p>
        When you have an identified attack path, you have two remediation strategies. You can harden the target
        (make the crown jewel harder to access), or you can break the chain (remove a link in the path so the
        attacker cannot traverse it).
      </p>

      <p>
        Breaking the chain is almost always the right answer. Hardening the target is valuable — encryption,
        access logging, strict IAM policies on the database itself — but it does not eliminate the path. If the
        chain is intact, a sufficiently motivated attacker will find a way to the end.
      </p>

      <p>
        Finding the optimal break point means identifying the link that:
      </p>

      <ul>
        <li>Has the lowest remediation cost (a one-line IAM policy change beats a network re-architecture)</li>
        <li>Blocks the most paths simultaneously (a single overly permissive role may appear in a dozen paths)</li>
        <li>Has no compensating control already in place</li>
      </ul>

      <p>
        Onam's path analysis surfaces exactly this: for each discovered attack path, it identifies the minimum
        cut — the smallest set of changes that severs all paths to a given crown jewel.
      </p>

      <h2>Making the case to engineering</h2>

      <p>
        The practical challenge in attack path remediation is not technical — it is organisational. A "MEDIUM"
        severity finding does not motivate an engineering team to drop their sprint work. An attack path that
        demonstrates a five-step route from the internet to production customer data does.
      </p>

      <p>
        Attack path visualisations exist precisely for this reason. When you can show an engineer an interactive
        graph where each node is a resource they recognise and each edge is a permission they can verify in the
        AWS console, the remediation priority becomes self-evident. You are not asking them to trust a risk score.
        You are showing them the exact sequence an attacker would follow.
      </p>

      <p>
        This is why attack path analysis is not a CSPM feature — it is a communication tool. It translates
        the abstract language of cloud misconfiguration into the concrete language of "here is how you get
        breached, here is what to change."
      </p>
    </>
  )
}
