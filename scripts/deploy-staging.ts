import { RocketRideStagingService } from '../lib/rocketride-staging';

async function main() {
  console.log('🚀 RocketRide Staging Process Integration & Deployment CLI\n');

  const stagingService = new RocketRideStagingService();

  try {
    const health = stagingService.getStagingHealth();
    console.log(`Environment Target: ${health.environment.toUpperCase()}`);
    console.log(`Staging Host Endpoint: ${health.stagingUrl}`);
    console.log(`Hackathon Promo Code: ${health.promoCode}`);
    console.log(`Discovered Pipe Definitions: ${health.pipeCount} files (${health.validPipeCount} valid)\n`);

    console.log('📦 Deploying declarative .pipe pipelines to RocketRide Cloud Staging...');
    const result = await stagingService.deployToStaging();

    console.log('\n--- Deployment Logs ---');
    for (const log of result.logs) {
      console.log(log);
    }
    console.log('------------------------\n');

    console.log('✅ DEPLOYMENT SUCCESSFUL!');
    console.log(`Deployment ID: ${result.deploymentId}`);
    console.log(`Active Target URL: ${result.stagingUrl}`);
    console.log(`Pipes Deployed: ${result.pipesCount}`);
    console.log(`Promo Status: ${result.promoStatus}\n`);
  } catch (err: any) {
    console.error('\n❌ DEPLOYMENT FAILED:');
    console.error(err.message);
    process.exit(1);
  }
}

main();
