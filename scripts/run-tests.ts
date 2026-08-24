import fs from 'fs';
import path from 'path';
import { SpecialistAgentOrchestrator } from '../lib/agents';
import { chunkText } from '../lib/ingestion';

async function runAllTests() {
  console.log('🧪 Starting BidForge AI Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: RocketRide .pipe JSON Schema Validation
  console.log('Test 1: Validating RocketRide .pipe files...');
  const pipeFiles = [
    'rocketride/full_rfp_pipeline.pipe',
    'rocketride/ingestion.pipe',
    'rocketride/requirements.pipe',
    'rocketride/evidence.pipe',
    'rocketride/agents.pipe',
    'rocketride/validation.pipe',
    'rocketride/finalization.pipe',
  ];

  for (const pipeFile of pipeFiles) {
    const fullPath = path.join(process.cwd(), pipeFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ [FAIL] Missing pipe file: ${pipeFile}`);
      failed++;
      continue;
    }
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.name || !parsed.components) {
        throw new Error('Invalid .pipe structure');
      }
      console.log(`  ✓ ${pipeFile} - Valid JSON syntax & RocketRide components`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${pipeFile}: ${err.message}`);
      failed++;
    }
  }

  // Test 2: Semantic Chunking Engine
  console.log('\nTest 2: Testing Document Semantic Chunking Engine...');
  try {
    const sampleDocText = `SECTION 1: SECURITY CONTROLS\nAcme Telecom enforces AES-256 encryption at rest across all cloud databases.\nData in transit is protected using TLS 1.3 protocols.\n\nSECTION 2: COMPLIANCE\nSOC 2 Type II audit report available under NDA. ISO 27001 certified.`;
    const chunks = chunkText(sampleDocText, 200, 50);

    if (chunks.length > 0 && chunks[0].section.includes('SECURITY')) {
      console.log(`  ✓ Chunking engine produced ${chunks.length} chunks with section detection: "${chunks[0].section}"`);
      passed++;
    } else {
      throw new Error('Chunking failed section detection');
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] Chunking test: ${err.message}`);
    failed++;
  }

  // Test 3: Specialist Agent & Strict No-Evidence Rule
  console.log('\nTest 3: Testing Specialist Agent & Strict NO EVIDENCE Rule...');
  try {
    const orchestrator = new SpecialistAgentOrchestrator();

    // Scenario A: Missing Evidence
    const noEvidenceResult = await orchestrator.processRequirement(
      'REQ-TEST-001',
      'Does your product run on quantum computing hardware?',
      'Technical & Architecture',
      false,
      []
    );

    if (
      noEvidenceResult.answer.includes('Insufficient evidence') &&
      noEvidenceResult.status === 'unsupported' &&
      noEvidenceResult.confidence <= 50
    ) {
      console.log('  ✓ Strict No-Evidence Rule passed: Correctly flagged unsupported claim without hallucination.');
      passed++;
    } else {
      throw new Error('Failed No-Evidence rule check');
    }

    // Scenario B: High Confidence Evidence
    const evidenceResult = await orchestrator.processRequirement(
      'REQ-TEST-002',
      'Describe encryption at rest.',
      'Security',
      true,
      [
        {
          chunkId: 'chunk_1',
          documentId: 'doc_1',
          documentName: 'SOC 2 Audit Report.pdf',
          section: 'Encryption',
          pageNumber: 12,
          content: 'Acme Telecom enforces AES-256 encryption at rest.',
          relevanceScore: 0.95,
        },
        {
          chunkId: 'chunk_2',
          documentId: 'doc_2',
          documentName: 'ISO 27001 Security Statement.pdf',
          section: 'Data Protection',
          pageNumber: 4,
          content: 'Cloud databases encrypted using AES-256 keys.',
          relevanceScore: 0.92,
        },
      ]
    );

    if (evidenceResult.confidence >= 90 && evidenceResult.answer.includes('AES-256')) {
      console.log(`  ✓ High Confidence Evidence Grounding passed: Confidence ${evidenceResult.confidence}%, Answer: "${evidenceResult.answer.slice(0, 60)}..."`);
      passed++;
    } else {
      throw new Error('Failed Evidence Grounding check');
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] Specialist agent test: ${err.message}`);
    failed++;
  }

  console.log(`\n==========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
