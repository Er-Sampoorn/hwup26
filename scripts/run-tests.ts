import fs from 'fs';
import path from 'path';
import { FranchiseAgentOrchestrator, calculateLocationRiskScore } from '../lib/agents';

async function runFranchiseGuardTests() {
  console.log('🧪 Starting FranchiseGuard AI Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: RocketRide .pipe JSON Schema Validation
  console.log('Test 1: Validating RocketRide .pipe files for FranchiseGuard AI...');
  const pipeFiles = [
    'rocketride/full_audit_pipeline.pipe',
    'rocketride/media_ingestion.pipe',
    'rocketride/inspection_pipeline.pipe',
    'rocketride/violation_detection.pipe',
    'rocketride/risk_scoring.pipe',
    'rocketride/recurrence_analysis.pipe',
    'rocketride/human_review.pipe',
    'rocketride/reinspection.pipe',
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

  // Test 2: Multi-Factor Risk Score Calculation Formula
  console.log('\nTest 2: Testing Multi-Factor Location Risk Formula...');
  try {
    const mockViolations = [
      { severity: 'CRITICAL', isRecurring: true },
      { severity: 'HIGH', isRecurring: true },
      { severity: 'MEDIUM', isRecurring: false },
    ];
    const riskResult = calculateLocationRiskScore(mockViolations, 3, 2);

    if (riskResult.score >= 80 && riskResult.category === 'CRITICAL') {
      console.log(`  ✓ Multi-Factor Risk Formula passed: Score ${riskResult.score}/100, Category: ${riskResult.category}, Drivers: ${riskResult.drivers.length}`);
      passed++;
    } else {
      throw new Error(`Risk formula miscalculated score: ${riskResult.score}`);
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] Risk formula test: ${err.message}`);
    failed++;
  }

  // Test 3: Specialist Agent & Recurrence Detection Engine
  console.log('\nTest 3: Testing Specialist Agent & Recurrence Detection Engine...');
  try {
    const orchestrator = new FranchiseAgentOrchestrator();

    const auditResult = await orchestrator.auditLocationMedia(
      'LOC-042',
      'media_asset_042',
      'CLEAN-001',
      'Store entrance glass contains visible litter and dark smudges.',
      3 // Previous 3 failures
    );

    if (
      auditResult.isRecurring === true &&
      auditResult.recurrenceCount === 4 &&
      auditResult.recommendedAction.includes('FORMAL CURE NOTICE')
    ) {
      console.log(`  ✓ Recurrence Detection passed: Flagged 4x recurring failure and recommended Formal Cure Notice.`);
      passed++;
    } else {
      throw new Error('Recurrence detection failed to trigger formal default warning');
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] Recurrence test: ${err.message}`);
    failed++;
  }

  // Test 4: RocketRide Staging Process Integration & Deployment Verification
  console.log('\nTest 4: Testing RocketRide Staging Process Integration & Deployment...');
  try {
    const { RocketRideStagingService } = await import('../lib/rocketride-staging');
    const stagingService = new RocketRideStagingService();
    const health = stagingService.getStagingHealth();

    if (health.status === 'ONLINE' && health.pipeCount > 0 && health.promoCode === 'INDIAHACK') {
      const depResult = await stagingService.deployToStaging();
      if (depResult.success && depResult.pipesCount === health.pipeCount) {
        console.log(`  ✓ RocketRide Staging Integration passed: Target '${health.stagingUrl}', Promo Code '${health.promoCode}', Deployed ${depResult.pipesCount} .pipe files successfully.`);
        passed++;
      } else {
        throw new Error('Staging deployment returned unsuccessful response');
      }
    } else {
      throw new Error('Staging health check failed or promo code missing');
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] Staging integration test: ${err.message}`);
    failed++;
  }

  console.log(`\n==========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runFranchiseGuardTests();
