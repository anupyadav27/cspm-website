---
title: "How we check thousands of rules without agents: the architecture behind Onam"
published: false
description: "A technical deep-dive into how Onam scans dozens of cloud services across 7 clouds using only read-only access — no agents, no network changes, no con"
tags: cloudsecurity, security, cloud, devops
canonical_url: https://www.onamsecurity.com/resources/blog/agentless-cloud-security-architecture
---
The most common question we get from security engineers evaluating Onam is some variation of: "How can you possibly check thousands of rules across dozens of cloud services without installing anything?"

It is a reasonable question. Most security tools that claim "agentless" operation are either scanning at a shallow level, missing entire service categories, or quietly requiring agents for the rules that actually matter. This post explains exactly how Onam's agentless architecture works across all seven supported clouds — AWS, Azure, GCP, OCI, Alibaba Cloud, IBM Cloud, and Kubernetes — and where its limits are.

## The core principle: cloud control planes are APIs

Everything in a cloud environment has a configuration state. That state is stored and served by the cloud provider's control plane — the management layer that sits above your actual workloads. AWS, Azure, GCP, and the other clouds expose this configuration state through read-only APIs.

An S3 bucket's public access settings, encryption configuration, and lifecycle policy are all returned by `GetBucketAcl`, `GetBucketEncryption`, and `GetBucketLifecycleConfiguration`. A security group's inbound rules are returned by `DescribeSecurityGroups`. An IAM user's MFA status is returned by `GetLoginProfile` and `ListMFADevices`.

Nearly every security configuration that matters can be read from these control plane APIs. That is the foundation of agentless CSPM: Onam connects with a read-only IAM role, service principal, or service account — nothing is installed in your environment.

![Onam's agentless architecture: read-only API access to each cloud control plane](/diagrams/arch-overview.svg)

## How the discovery phase works

Before we can check rules, we need to know what resources exist. The discovery phase enumerates every resource across all configured cloud accounts.

For AWS, this means calling the List/Describe APIs for each service category in each region across every account: `DescribeInstances` for EC2, `ListBuckets` for S3, `DescribeDBInstances` for RDS, `ListFunctions` for Lambda, and so on across dozens of service categories. For an account with a couple of thousand resources across five regions, this generates a few hundred API calls.

Discovery output is normalised into a unified resource schema — a standard representation that captures the resource type, region, account, ARN, and all configuration attributes relevant to security evaluation. This normalised schema is what the rule evaluation engine operates against.

![The scan pipeline: discovery, normalisation, rule evaluation, and correlation](/diagrams/arch-scan-pipeline.svg)

## How rule evaluation works

Each rule in Onam's library is a declarative check against one or more attributes in the normalised resource schema. The check returns PASS, FAIL, or NOT_APPLICABLE.

A rule like "S3 buckets must have server-side encryption enabled" evaluates the `encryption.rules[0].apply_server_side_encryption_by_default.sse_algorithm` attribute in the normalised S3 bucket schema. If the attribute is present and set to AES256 or aws:kms, the rule passes. If it is absent or set to NONE, it fails.

Rules are authored in YAML — a human-readable format that non-engineers can review. Each rule specifies:

- The resource type it applies to.
- The condition expression that determines PASS or FAIL.
- The severity (Critical, High, Medium, Low, Info) and compliance framework mappings.
- The remediation steps — CLI, Terraform, console.

This YAML-first approach means adding a new rule for a new cloud service does not require changes to the core evaluation engine — just a new YAML file with the right schema.

## Network topology requires cross-resource correlation

Simple single-resource checks — is this bucket encrypted? is MFA enabled for this user? — can be evaluated purely from the resource's own configuration. But effective network exposure — whether a resource is actually reachable from the internet — requires correlating multiple resources.

Determining whether an EC2 instance is internet-accessible requires knowing: is it in a public subnet? Does its subnet's route table have a route to an internet gateway? Do the NACLs on that subnet allow inbound traffic on the relevant port? Does the security group allow inbound traffic from 0.0.0.0/0? Is there a load balancer in front of it?

This is why network security analysis runs as a separate phase after discovery, with access to the full normalised resource graph. The graph allows us to traverse VPC, subnet, route table, and internet gateway relationships and compute effective exposure rather than just checking individual resource configurations.

## Where agentless has limits

Agentless works for everything that lives in the cloud control plane. It does not work for everything, and it is worth being precise about the boundaries.

**OS-level vulnerability scanning** requires enumerating installed packages and kernel versions — information that is not exposed by cloud APIs. For EC2 instances, this requires a lightweight agent, deployed via AWS Systems Manager. Container image scanning, by contrast, can be done agentlessly by pulling and analysing the image from the registry.

**Runtime workload behavior** — what processes are running, what network connections are active, what system calls a container is making — requires an agent or eBPF-based monitor running on the host. CSPM rule evaluation covers the configuration surface; runtime behavior is a different, complementary layer.

**Data plane access patterns** — reading the actual contents of S3 objects, database rows, or file system data — is not something Onam does. Data classification is based on metadata signals: naming patterns, tags, schema metadata, and resource configuration. This is sufficient for most DSPM use cases, but it will not detect sensitive data stored in an unexpectedly named bucket.

## Why agentless matters for security teams

The operational argument for agentless is usually framed around deployment complexity: no agents to install, no software versions to manage, no compatibility issues with operating systems. That is true, but there is a more important argument.

Agents expand your attack surface. An agent running on every EC2 instance in your fleet is a piece of software with elevated privileges that needs to be patched, monitored, and secured. If the agent itself has a vulnerability — and security tool agents have had plenty — every host it runs on is at risk.

> An agentless scanner that never touches your hosts has exactly zero footprint to exploit.

For organisations that operate in regulated environments — healthcare, financial services, government — this is not an abstract concern. It is a compliance question: does this tool expand my system boundary in a way that requires additional controls? Agentless architecture answers that question with a clear no.

To see the scan pipeline against one of your own accounts, [book a demo](/request-demo).

---

*Originally published on the [Onam Security blog](https://www.onamsecurity.com/resources/blog/agentless-cloud-security-architecture). Onam is a unified cloud security platform — CSPM, attack-path analysis, identity, data, and detection on one security graph across AWS, Azure, GCP and more. [See the platform.](https://www.onamsecurity.com/platform)*
