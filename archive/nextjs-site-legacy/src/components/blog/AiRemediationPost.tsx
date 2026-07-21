export function AiRemediationPost() {
  return (
    <>
      <p>
        The average mean time to remediate (MTTR) for cloud security findings is 47 days, according to
        data collected across enterprise cloud programs. That number has not changed meaningfully in five years,
        despite cloud security tooling improving substantially over the same period.
      </p>

      <p>
        The tools got better at finding things. The bottleneck was never finding — it was fixing.
        A security team that surfaces 500 findings per week and has engineering bandwidth to fix 20
        will always have an accumulating backlog, regardless of how well-tuned the detection is.
      </p>

      <p>
        AI-powered remediation addresses the bottleneck directly. Not by reducing finding volume — the
        findings are real and need to be fixed — but by reducing the time between "identified" and
        "resolved" for each one.
      </p>

      <h2>Why generic LLM suggestions fail</h2>

      <p>
        The obvious approach is to pipe findings into a general-purpose LLM and ask it to produce a fix.
        This works poorly in practice, for a specific reason: cloud security remediation is context-dependent
        in ways that a general LLM cannot know without being told.
      </p>

      <p>
        Consider a finding: "Lambda function <code>payment-processor-prod</code> has a role with
        <code>s3:GetObject</code> on <code>*</code>." A generic LLM will suggest: "Restrict the IAM role
        to only the specific S3 bucket the function needs to access." Technically correct. But which bucket?
        What is the ARN? Are there multiple buckets? Is the function deployed by Terraform, CloudFormation,
        or CDK? Is the role shared with other functions?
      </p>

      <p>
        A context-aware fix engine knows the answers to these questions because it has already discovered
        the Lambda function, its associated role, the S3 buckets it actually accesses (from CloudTrail
        analysis), the IaC stack that deployed it, and the other resources that share the role. The fix
        it generates is not generic guidance — it is a specific, deployable policy change with the correct
        ARN, condition keys, and IaC format.
      </p>

      <h2>Three AI remediation capabilities</h2>

      <h3>1. SecOps Fix: cloud-aware code fixes for misconfigurations</h3>

      <p>
        SecOps Fix generates remediation for cloud misconfigurations — the findings that come from CSPM
        posture evaluation. Each generated fix is context-aware in four dimensions:
      </p>

      <p>
        <strong>IAM context.</strong> The fix knows the full effective permission set of the resource,
        what permissions are actually used (from CloudTrail), and what the least-privilege replacement
        policy should be. It does not guess at the correct scope — it computes it.
      </p>

      <p>
        <strong>Network context.</strong> The fix knows the resource's network exposure: whether it is
        internet-facing, which security groups govern it, whether a WAF exists, and what the correct
        security group rule change looks like. For a "port 22 open to 0.0.0.0/0" finding, the fix
        generates the specific security group rule to remove and, if a VPN CIDR is detected in other
        rules, suggests the replacement rule scoped to that CIDR.
      </p>

      <p>
        <strong>IaC context.</strong> SecOps Fix detects whether the resource is managed by Terraform,
        CloudFormation, CDK, or Pulumi and generates the fix in the appropriate format. For a
        CloudFormation-managed S3 bucket without versioning, it generates the CloudFormation Properties
        diff. For a Terraform-managed bucket, it generates the HCL stanza change. This means the fix
        can go directly into a pull request.
      </p>

      <p>
        <strong>Blast radius context.</strong> Before generating a fix, SecOps Fix checks whether the
        resource being changed is shared with other workloads and whether the proposed change would affect
        those workloads. If a security group change would break a dependency, the fix notes this and
        offers an alternative approach.
      </p>

      <h3>2. Vulnerability Fix: Ansible playbooks for CVE remediation</h3>

      <p>
        The traditional workflow for CVE remediation in cloud workloads is: CVSS alert appears, security
        team sends to DevOps, DevOps writes a runbook, runbook is reviewed, runbook is executed. For a
        team managing hundreds of CVEs per month, the runbook-writing step alone is a significant bottleneck.
      </p>

      <p>
        Onam's Vulnerability Fix engine generates Ansible playbooks that remediate CVEs without manual
        runbook writing. For each CVE finding, it:
      </p>

      <ul>
        <li>Identifies the affected package and version from the vulnerability scan results</li>
        <li>Looks up the target version (the patched release) from the NVD advisory</li>
        <li>Generates an Ansible playbook that updates the specific package on the affected host</li>
        <li>Includes pre-flight checks (verify the package exists, verify the host is the right OS family) and post-flight validation (verify the patched version is installed)</li>
        <li>Annotates the playbook with the CVE ID, CVSS score, and KEV status so the audit trail is self-documenting</li>
      </ul>

      <p>
        The generated playbook is idempotent — running it multiple times produces the same result. It is
        also scoped to the minimum required privilege: it does not request root unless the package manager
        requires it, and it does not restart services unless the patch requires it.
      </p>

      <p>
        For container image vulnerabilities, the fix output is different: instead of an Ansible playbook,
        it generates a Dockerfile patch that updates the base image or specific package layer, and optionally
        opens a pull request to the image repository with the change.
      </p>

      <h3>3. Threat Narratives: attack chain stories for CISOs and boards</h3>

      <p>
        The third AI remediation capability addresses a different kind of bottleneck: communication.
      </p>

      <p>
        Attack path analysis produces a graph — nodes and edges, resource IDs, MITRE technique codes.
        This output is precise and actionable for a security engineer. It is impenetrable to a CISO
        preparing a board presentation or a GRC team filing a regulatory response.
      </p>

      <p>
        Threat Narratives converts the attack path graph into a natural-language description of the attack
        chain. Given a Neo4j subgraph representing a five-step privilege escalation path, the engine generates:
      </p>

      <blockquote>
        <p>
          "An attacker who gains access to the API Gateway endpoint for the <strong>checkout-service</strong>
          Lambda function can exploit the SSRF vulnerability in the Node.js web framework (CVE-2024-37890)
          to retrieve temporary credentials from the EC2 Instance Metadata Service. These credentials belong
          to the <strong>checkout-lambda-exec</strong> execution role, which holds IAM PassRole permission
          on the <strong>platform-deploy</strong> role. Using this permission, the attacker can create a
          new Lambda function with the deployment role attached, gaining the ability to read from all S3
          buckets in the account including <strong>customer-data-prod</strong> which contains 2.3 million
          customer records. This path combines Initial Access (T1078.004), Credential Access (T1552.005),
          and Privilege Escalation (T1548.005) into a five-step chain requiring no prior account access."
        </p>
      </blockquote>

      <p>
        This narrative can be copied directly into a CISO report, an incident response ticket, or a
        regulatory filing. It requires no translation by a security engineer. The graph data and the
        human-readable story are generated from the same source, so they are always in sync.
      </p>

      <h2>Typical MTTR reduction</h2>

      <p>
        Measuring the MTTR impact of AI remediation requires separating finding types, because the
        reduction varies significantly by category.
      </p>

      <p>
        For IAM misconfiguration findings, context-aware fix generation reduces the time from finding
        to deployable fix from an average of 4–8 hours of engineer investigation and policy authoring to
        15–30 minutes of review and approval. Most of that reduction comes from eliminating the investigation
        phase — the engineer receives a specific, justified policy change rather than an abstract "reduce scope"
        recommendation.
      </p>

      <p>
        For OS-level CVE findings, Ansible playbook generation reduces the runbook writing phase from
        1–4 hours to near-zero. The remaining time is review (15 minutes) and execution, which is often
        automated through existing configuration management pipelines.
      </p>

      <p>
        For security communication (threat narratives), the reduction is not in MTTR — it is in the
        time-to-decision for escalation. An attack path that would have required an hour of security
        engineer time to translate into a board presentation is now a 10-minute review of the generated narrative.
      </p>

      <h2>Privacy and safety: no code leaves your VPC</h2>

      <p>
        AI remediation generates fixes that reference your specific resource IDs, ARNs, IAM role names,
        and IaC configurations. These are sensitive artifacts. Sending them to a third-party LLM API
        is not acceptable for most enterprise cloud programs operating under SOC 2, ISO 27001, or
        government cloud frameworks.
      </p>

      <p>
        All fix generation in Onam runs on dedicated model inference endpoints deployed in your cloud
        environment. The inference endpoint has no outbound internet access — it can only receive API
        calls from within your VPC and return responses. No cloud configuration data, no resource
        identifiers, and no generated fix content is transmitted to Onam's infrastructure or to any
        third-party LLM provider.
      </p>

      <p>
        This is not a product constraint — it is an architectural requirement. The inference endpoint
        is part of the security boundary, not outside it.
      </p>

      <h2>Making AI remediation part of the workflow</h2>

      <p>
        The most common mistake in AI remediation rollout is treating it as a replacement for security
        engineering judgment. It is not. Every generated fix requires review before deployment. The AI
        understands the IaC format, the least-privilege scope, and the resource context — it does not
        understand your team's operational constraints, your change management process, or the business
        reasons a particular configuration might be intentional.
      </p>

      <p>
        The right workflow is: AI generates → engineer reviews → engineer approves → automated deployment.
        The AI eliminates the generation phase. It does not eliminate the judgment phase, and it should not.
      </p>

      <p>
        For teams that implement this workflow rigorously, the 47-day MTTR becomes an artefact of the
        pre-AI era. The remaining cycle time is not investigation and authoring — it is review, approval,
        and change management. Those timelines are bounded by process, not by engineer capacity. And
        process timelines can be shortened through policy, not through headcount.
      </p>
    </>
  )
}
