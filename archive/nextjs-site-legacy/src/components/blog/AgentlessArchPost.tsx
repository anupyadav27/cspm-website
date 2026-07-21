export function AgentlessArchPost() {
  return (
    <>
      <p>
        The most common question we get from security engineers evaluating Onam is some variation of:
        "How can you possibly check 1,900+ rules across 40 cloud services without installing anything?"
      </p>

      <p>
        It is a reasonable question. Most security tools that claim "agentless" operation are either scanning
        at a shallow level, missing entire service categories, or quietly requiring agents for the rules that
        actually matter. This post explains exactly how Onam's agentless architecture works — and where its
        limits are.
      </p>

      <h2>The core principle: cloud control planes are APIs</h2>

      <p>
        Everything in a cloud environment has a configuration state. That state is stored and served by the cloud
        provider's control plane — the management layer that sits above your actual workloads. AWS, Azure, GCP,
        and other clouds expose this configuration state through read-only APIs.
      </p>

      <p>
        An S3 bucket's public access settings, encryption configuration, and lifecycle policy are all returned by
        <code>GetBucketAcl</code>, <code>GetBucketEncryption</code>, and <code>GetBucketLifecycleConfiguration</code>.
        A security group's inbound rules are returned by <code>DescribeSecurityGroups</code>. An IAM user's MFA
        status is returned by <code>GetLoginProfile</code> and <code>ListMFADevices</code>.
      </p>

      <p>
        Nearly every security configuration that matters can be read from these control plane APIs. That is the
        foundation of agentless CSPM.
      </p>

      <h2>How Onam's discovery phase works</h2>

      <p>
        Before we can check rules, we need to know what resources exist. The discovery phase enumerates every
        resource across all configured cloud accounts.
      </p>

      <p>
        For AWS, this means calling the List/Describe APIs for each service category in each region across every
        account. <code>DescribeInstances</code> for EC2, <code>ListBuckets</code> for S3,
        <code>DescribeDBInstances</code> for RDS, <code>ListFunctions</code> for Lambda, and so on for 40+ service
        categories. For an account with 2,000 resources across 5 regions, this generates roughly 150–200 API calls.
      </p>

      <p>
        Discovery output is normalised into a unified resource schema — a standard representation that captures
        the resource type, region, account, ARN, and all configuration attributes relevant to security evaluation.
        This normalised schema is what the rule evaluation engine operates against.
      </p>

      <h2>How rule evaluation works</h2>

      <p>
        Each of our 1,900+ rules is a declarative check against one or more attributes in the normalised resource
        schema. The check returns PASS, FAIL, or NOT_APPLICABLE.
      </p>

      <p>
        A rule like "S3 buckets must have server-side encryption enabled" evaluates the
        <code>encryption.rules[0].apply_server_side_encryption_by_default.sse_algorithm</code> attribute in the
        normalised S3 bucket schema. If the attribute is present and set to AES256 or aws:kms, the rule passes.
        If it is absent or set to NONE, it fails.
      </p>

      <p>
        Rules are authored in YAML — a human-readable format that non-engineers can review. Each rule specifies:
      </p>

      <ul>
        <li>The resource type it applies to</li>
        <li>The condition expression that determines PASS/FAIL</li>
        <li>The severity and compliance framework mappings</li>
        <li>The remediation steps (CLI, Terraform, console)</li>
      </ul>

      <p>
        This YAML-first approach means adding a new rule for a new cloud service does not require changes to the
        core evaluation engine — just a new YAML file with the right schema.
      </p>

      <h2>Network topology requires cross-resource correlation</h2>

      <p>
        Simple single-resource checks (is this bucket encrypted? is MFA enabled for this user?) can be evaluated
        purely from the resource's own configuration. But effective network exposure — the question of whether a
        resource is actually reachable from the internet — requires correlating multiple resources.
      </p>

      <p>
        Determining whether an EC2 instance is internet-accessible requires knowing: is it in a public subnet?
        Does its subnet's route table have a route to an internet gateway? Do the NACLs on that subnet allow
        inbound traffic on the relevant port? Does the security group allow inbound traffic from 0.0.0.0/0?
        Is there a load balancer in front of it?
      </p>

      <p>
        This is why network security analysis runs as a separate phase after discovery, with access to the full
        normalised resource graph. The graph allows us to traverse VPC → subnet → route table → internet gateway
        relationships and compute effective exposure rather than just checking individual resource configurations.
      </p>

      <h2>Where agentless has limits</h2>

      <p>
        Agentless works for everything that lives in the cloud control plane. It does not work for everything.
      </p>

      <p>
        <strong>OS-level vulnerability scanning</strong> requires enumerating installed packages and kernel
        version — information that is not exposed by cloud APIs. For EC2 instances, this requires a lightweight
        agent (deployed via AWS Systems Manager). Container image scanning, by contrast, can be done agentlessly
        by pulling and analysing the image from the registry.
      </p>

      <p>
        <strong>Runtime workload behavior</strong> — what processes are running, what network connections are
        active at runtime, what system calls a container is making — requires an agent or eBPF-based monitor
        running on the host. CSPM rule evaluation covers the configuration surface; runtime behavior is a
        different, complementary layer.
      </p>

      <p>
        <strong>Data plane access patterns</strong> — reading the actual contents of S3 objects, database rows,
        or file system data — is not something Onam does. Data classification is based on metadata signals:
        naming patterns, tags, schema metadata, and resource configuration. This is sufficient for most DSPM
        use cases but will not detect sensitive data stored in an unexpectedly named bucket.
      </p>

      <h2>Why agentless matters for security teams</h2>

      <p>
        The operational argument for agentless is usually framed around deployment complexity: no agents to
        install, no software versions to manage, no compatibility issues with operating systems. That is true,
        but there is a more important argument.
      </p>

      <p>
        Agents expand your attack surface. An agent running on every EC2 instance in your fleet is a piece
        of software with elevated privileges that needs to be patched, monitored, and secured. If the agent
        itself has a vulnerability — and security tool agents have had plenty — every host it runs on is
        at risk. An agentless scanner that never touches your hosts has exactly zero footprint to exploit.
      </p>

      <p>
        For organisations that operate in regulated environments — healthcare, financial services, government —
        this is not an abstract concern. It is a compliance question: does this tool expand my system boundary
        in a way that requires additional controls?
      </p>

      <p>
        Agentless architecture answers that question with a clear no.
      </p>
    </>
  )
}
