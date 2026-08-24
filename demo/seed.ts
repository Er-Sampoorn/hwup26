import { db } from '../lib/db';

export async function seedDemoDatabase() {
  console.log('🌱 Seeding BidForge AI Demo Dataset...');

  // 1. Create Organization
  const org = await db.organization.upsert({
    where: { slug: 'acme-telecom' },
    update: {},
    create: {
      name: 'Acme Telecom Systems',
      slug: 'acme-telecom',
    },
  });

  // 2. Create Users
  const reviewerUser = await db.user.upsert({
    where: { email: 'john.doe@acmetelecom.com' },
    update: {},
    create: {
      email: 'john.doe@acmetelecom.com',
      name: 'John Doe (Lead Reviewer)',
      passwordHash: 'demo123hash',
      role: 'REVIEWER',
      organizationId: org.id,
    },
  });

  // 3. Create Supporting Evidence Documents & Chunks (20+ Documents)
  const evidenceDocSpecs = [
    { title: 'SOC 2 Type II Security Audit Report (2025)', category: 'Security', section: 'Encryption & Controls', content: 'Acme Telecom enforces AES-256 encryption for all data at rest across cloud databases, S3 storage buckets, and backups. Data in transit is protected using TLS 1.3/1.2 protocols. Multi-factor authentication (MFA) is strictly required for all administrative access. Penetration testing is conducted bi-annually by NCC Group.', page: 12 },
    { title: 'ISO 27001:2022 Certification Statement', category: 'Security', section: 'Information Security System', content: 'Acme Telecom holds valid ISO/IEC 27001:2022 certification covering all cloud infrastructure, software development lifecycles, and customer operations. Certificate Number: IS 694028, renewed through December 2027.', page: 4 },
    { title: 'Master Service Level Agreement (SLA)', category: 'SLAs & Support', section: 'Uptime & Credits', content: 'Acme Telecom guarantees 99.95% uptime availability calculated monthly. Service credits of 10% monthly fees are issued for uptime between 99.0%-99.9%, and 25% for uptime below 99.0%. Critical P1 incident response time is 15 minutes with 24/7/365 dedicated NOC support.', page: 8 },
    { title: 'Global Data Processing Agreement (DPA)', category: 'Legal & Compliance', section: 'GDPR & Privacy', content: 'Full compliance with EU GDPR, UK GDPR, and CCPA. Data subjects retain rights to data portability and complete deletion within 30 days. Data residency guarantees EU-only hosting within Frankfurt and Dublin AWS data centers upon customer request.', page: 19 },
    { title: 'Enterprise Product Architecture Guide', category: 'Technical & Architecture', section: 'Scalability & API', content: 'The system utilizes microservices architecture built on Kubernetes (EKS) with horizontal auto-scaling supporting up to 50,000 requests per second. GraphQL and RESTful APIs are provided with rate limits of 10,000 calls/min per client organization.', page: 15 },
    { title: 'Commercial Pricing & Tiering Manual', category: 'Commercial & Pricing', section: 'Enterprise Rates', content: 'Enterprise License Fee: $120,000/year base platform including 500 seats. Additional user seats are $18/user/month billed annually. Professional services for onboarding are fixed at $25,000.', page: 3 },
    { title: 'Disaster Recovery & Business Continuity Plan', category: 'Security', section: 'RPO / RTO', content: 'Recovery Point Objective (RPO) is < 5 minutes for database replication. Recovery Time Objective (RTO) is < 1 hour for total failover to secondary AWS region.', page: 22 },
    { title: 'Vulnerability Management & Patching Policy', category: 'Security', section: 'Patch Lifecycles', content: 'Critical security patches are deployed within 24 hours of release. High severity patches within 7 days. Automated static code analysis (SAST) and dependency vulnerability scans run on every pull request.', page: 9 },
    { title: 'Third-Party Vendor Risk Management Policy', category: 'Legal & Compliance', section: 'Subprocessor Audit', content: 'All third-party subprocessors undergo rigorous annual security assessments, background checks, and SOC 2 verification before approval.', page: 6 },
    { title: 'Employee Security Awareness & Training Manual', category: 'Security', section: 'Personnel Security', content: 'Mandatory security awareness training is required upon hire and annually thereafter. Monthly simulated phishing campaigns are conducted across all employees.', page: 2 },
    { title: 'Identity & Access Management (IAM) Spec', category: 'Technical & Architecture', section: 'SSO & SAML', content: 'Native integration with SAML 2.0, Okta, Azure AD / Microsoft Entra ID, PingIdentity, and Google Workspace SSO. Just-In-Time (JIT) user provisioning and SCIM 2.0 user lifecycle syncing supported.', page: 11 },
    { title: 'Data Retention & Destruction Policy', category: 'Legal & Compliance', section: 'Lifecycle Management', content: 'Customer data is retained for the duration of contract active term plus 30 days grace period. DoD 5220.22-M sanitization standards applied upon hard deletion.', page: 14 },
    { title: 'Incident Response & Breach Notification Plan', category: 'Security', section: 'Breach Escalation', content: 'In the event of a confirmed security incident or data breach, affected customers will be notified within 24 hours in compliance with legal and regulatory mandates.', page: 7 },
    { title: 'Network Security & Firewall Architecture', category: 'Technical & Architecture', section: 'Zero Trust', content: 'Zero Trust Network Architecture (ZTNA) enforced across all infrastructure. Cloudflare Magic Transit DDoS protection and Web Application Firewall (WAF) deployed globally.', page: 18 },
    { title: 'Audit Trail & Logging Specifications', category: 'Security', section: 'Immutable Logs', content: 'All system transactions, administrative changes, and user authentication events generate immutable audit logs exported to Datadog and AWS CloudTrail with 7-year retention.', page: 10 },
    { title: 'Customer Onboarding & Migration Framework', category: 'General Capabilities', section: 'Implementation', content: 'Standard customer deployment timeline is 4 to 6 weeks guided by a dedicated Technical Account Manager (TAM) and Solutions Architect.', page: 5 },
    { title: 'AI Ethics & Model Safety Guidelines', category: 'Technical & Architecture', section: 'Model Training', content: 'Customer enterprise data is strictly isolated and NEVER used to train shared public foundation models or third-party AI systems.', page: 8 },
    { title: 'Environmental, Social & Governance (ESG) Report', category: 'General Capabilities', section: 'Sustainability', content: 'Acme Telecom targets Net-Zero carbon operations by 2030, utilizing 100% renewable energy for primary data center workloads.', page: 3 },
    { title: 'Physical Security Standards & Access Controls', category: 'Security', section: 'Data Center Security', content: 'Data centers are hosted in Tier III+ facilities with biometric access control, 24/7 armed guards, and video surveillance with 90-day retention.', page: 13 },
    { title: 'Multi-Tenant Isolation & Sandbox Architecture', category: 'Technical & Architecture', section: 'Tenant Separation', content: 'Logical multi-tenancy enforced at the database level with row-level tenant IDs, separate KMS encryption keys, and isolated sandbox environments for testing.', page: 16 },
  ];

  for (const docSpec of evidenceDocSpecs) {
    const doc = await db.evidenceDocument.create({
      data: {
        title: docSpec.title,
        fileName: docSpec.title.toLowerCase().replace(/[^\w]/g, '_') + '.pdf',
        fileType: 'PDF',
        category: docSpec.category,
        organizationId: org.id,
      },
    });

    await db.evidenceChunk.create({
      data: {
        evidenceDocumentId: doc.id,
        content: docSpec.content,
        section: docSpec.section,
        pageNumber: docSpec.page,
        chunkIndex: 0,
      },
    });
  }

  // 4. Create Project
  const project = await db.project.create({
    data: {
      name: 'Acme Telecom Enterprise RFP 2026',
      customer: 'Global Banking Group Inc.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      rfpType: 'RFP',
      description: 'Comprehensive procurement questionnaire for enterprise core banking infrastructure migration and security compliance.',
      status: 'IN_REVIEW',
      organizationId: org.id,
    },
  });

  // 5. Create RFP Master Container & Document
  const rfp = await db.rfp.create({
    data: {
      title: 'Global Banking Group - Cloud Core RFP.pdf',
      projectId: project.id,
    },
  });

  await db.rfpDocument.create({
    data: {
      fileName: 'Global_Banking_Group_Cloud_Core_RFP_v2.pdf',
      fileType: 'PDF',
      fileSize: 4850120,
      filePath: '/uploads/Global_Banking_Group_Cloud_Core_RFP_v2.pdf',
      parsedText: 'Global Banking Group Enterprise Core Infrastructure RFP Specification document...',
      rfpId: rfp.id,
    },
  });

  // 6. Generate 100+ Realistic Requirements
  const categories = ['Security', 'SLAs & Support', 'Technical & Architecture', 'Commercial & Pricing', 'Legal & Compliance', 'General Capabilities'];

  const requirementTemplates = [
    { cat: 'Security', q: 'Describe encryption at rest and in transit protocols across all system layers.', mand: true },
    { cat: 'Security', q: 'Does your company hold current ISO 27001:2022 or SOC 2 Type II certifications? Provide certificate numbers.', mand: true },
    { cat: 'Security', q: 'Describe your vulnerability management, SAST scanning, and emergency patching lifecycles.', mand: false },
    { cat: 'Security', q: 'State your Recovery Point Objective (RPO) and Recovery Time Objective (RTO) for disaster recovery failover.', mand: true },
    { cat: 'Security', q: 'What is your security incident and data breach customer notification SLA?', mand: true },
    { cat: 'SLAs & Support', q: 'Provide your guaranteed monthly uptime SLA percentage and service credit refund structure.', mand: true },
    { cat: 'SLAs & Support', q: 'Describe support ticket response times for Critical (P1), High (P2), and Normal (P3) incidents.', mand: true },
    { cat: 'Legal & Compliance', q: 'Describe compliance with EU GDPR, CCPA, and provide details on EU data residency options.', mand: true },
    { cat: 'Legal & Compliance', q: 'Explain your customer data retention, grace period, and sanitization/destruction policies.', mand: false },
    { cat: 'Technical & Architecture', q: 'Detail your Identity and Access Management (IAM) capabilities including SAML 2.0, Okta, and SCIM provisioning.', mand: true },
    { cat: 'Technical & Architecture', q: 'Explain how tenant data isolation and separate encryption KMS keys are maintained in multi-tenant environments.', mand: true },
    { cat: 'Technical & Architecture', q: 'Describe API rate limits, supported GraphQL/REST endpoints, and maximum concurrent request throughput.', mand: false },
    { cat: 'Commercial & Pricing', q: 'Provide baseline annual platform license costs, per-user seat pricing, and implementation fees.', mand: true },
    { cat: 'General Capabilities', q: 'Describe standard implementation onboarding duration and dedicated customer success resources provided.', mand: false },
    { cat: 'General Capabilities', q: 'Does your system support AI model training privacy guarantees preventing customer data leakage?', mand: true },
    // UNSUPPORTED / MISSING EVIDENCE DEMO REQUIREMENTS
    { cat: 'Technical & Architecture', q: 'Does your system support native on-premises deployment on IBM z/OS Mainframe hardware via COBOL connectors?', mand: false },
    { cat: 'Commercial & Pricing', q: 'Will supplier commit to fixed 10-year capped price lock with zero inflation indexation clause?', mand: true },
  ];

  let reqIndex = 1;
  const createdReqs = [];

  // Generate 105 total requirements by repeating/expanding templates
  for (let i = 0; i < 7; i++) {
    for (const t of requirementTemplates) {
      const codeStr = `REQ-${String(reqIndex).padStart(3, '0')}`;
      const isMissingEvidenceDemo = t.q.includes('z/OS Mainframe') || t.q.includes('10-year capped price lock');

      const isHighConfidence = !isMissingEvidenceDemo && reqIndex % 3 !== 0;
      const isMandatoryReview = t.mand || t.cat === 'Commercial & Pricing' || t.cat === 'Legal & Compliance';

      let status = 'verified';
      let confidence = isHighConfidence ? 92.0 + (reqIndex % 7) : 74.0;
      let risk = isMandatoryReview ? 'high' : 'low';
      let answer = '';

      if (isMissingEvidenceDemo) {
        status = 'unsupported';
        confidence = 35.0;
        risk = 'high';
        answer = 'Insufficient evidence — human review required.';
      } else if (isMandatoryReview || !isHighConfidence) {
        status = 'needs_review';
        answer = `Evidence verified from company knowledge base. ${t.q.slice(0, 40)}... (Mandatory reviewer sign-off required for ${t.cat}).`;
      } else {
        answer = `Fully compliant. Standard operational procedures and documentation confirm complete support for: ${t.q}`;
      }

      const req = await db.requirement.create({
        data: {
          reqCode: codeStr,
          projectId: project.id,
          question: i > 0 ? `${t.q} (Ref variation ${i + 1})` : t.q,
          mandatory: t.mand,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          answer,
          confidence,
          risk,
          status,
          reasoningSummary: isMissingEvidenceDemo
            ? 'No matching evidence found in company knowledge base. Flagged for human review.'
            : `Evidence matched from ${t.cat} documentation. Evaluated by specialist agent.`,
        },
      });

      createdReqs.push(req);
      reqIndex++;
    }
  }

  // 7. Link Evidence to Requirements & Create Audit Logs
  const chunks = await db.evidenceChunk.findMany({ take: 10 });
  for (let idx = 0; idx < Math.min(30, createdReqs.length); idx++) {
    if (createdReqs[idx].status !== 'unsupported') {
      await db.requirementEvidence.create({
        data: {
          requirementId: createdReqs[idx].id,
          chunkId: chunks[idx % chunks.length].id,
          relevanceScore: 0.92,
        },
      });
    }
  }

  // 8. Create Sample Pipeline Run Execution Record
  await db.pipelineRun.create({
    data: {
      projectId: project.id,
      rocketrideRunId: `rr_run_demo_${Date.now()}`,
      status: 'COMPLETED',
      progress: 100,
      currentStep: 'PROPOSAL_FINALIZATION',
      totalRequirements: createdReqs.length,
      processedCount: createdReqs.length,
      totalTokens: 42890,
      estimatedCost: 0.1245,
      executionMs: 14200,
    },
  });

  // 9. Create Audit Trail Logs
  await db.auditLog.create({
    data: {
      projectId: project.id,
      userId: reviewerUser.id,
      action: 'DEMO_DATASET_INITIALIZED',
      details: `Initialized Acme Telecom Enterprise RFP dataset with ${createdReqs.length} requirements and 20 evidence documents.`,
    },
  });

  console.log(`✅ Demo Dataset Successfully Seeded! Project ID: ${project.id}`);
  return { projectId: project.id, requirementCount: createdReqs.length };
}

// Execute if called directly from CLI
if (require.main === module) {
  seedDemoDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
