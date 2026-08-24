import { db } from '../lib/db';

export async function seedDemoDatabase() {
  console.log('🌱 Seeding FranchiseGuard AI Demo Dataset...');

  // 1. Create Organization
  const org = await db.organization.upsert({
    where: { slug: 'burgercraft-corporate' },
    update: {},
    create: {
      name: 'BurgerCraft National Franchises Inc.',
      slug: 'burgercraft-corporate',
    },
  });

  // 2. Create Users
  const opsUser = await db.user.upsert({
    where: { email: 'ops.manager@burgercraft.com' },
    update: {},
    create: {
      email: 'ops.manager@burgercraft.com',
      name: 'Sarah Jenkins (Franchise Ops Manager)',
      passwordHash: 'demo123hash',
      role: 'OPS_MANAGER',
      organizationId: org.id,
    },
  });

  // 3. Create Brand Standards Catalog
  const brandStandardsSpecs = [
    { code: 'CLEAN-001', title: 'Store Entrance & Window Cleanliness', category: 'Cleanliness', description: 'Storefront glass, entrance doors, and sidewalk must be free of debris, smudges, and litter.', severity: 'MEDIUM', hours: 48 },
    { code: 'FOOD-002', title: 'Food Prep Temperature Control & Labeling', category: 'Food Safety', description: 'Refrigerated prep units must hold ingredients at <= 41°F with clear expiration date labels.', severity: 'CRITICAL', hours: 12 },
    { code: 'BRAND-014', title: 'Exterior Logo Signage & Illumination', category: 'Branding', description: 'Primary exterior brand logo must be fully illuminated with zero damaged acrylic panels.', severity: 'HIGH', hours: 72 },
    { code: 'UNIFORM-003', title: 'Staff Uniform & Hygiene Compliance', category: 'Uniform', description: 'All floor staff must wear approved branded aprons, non-slip shoes, and hair restraints.', severity: 'LOW', hours: 24 },
    { code: 'SAFETY-005', title: 'Emergency Exit Corridor Clearance', category: 'Safety', description: 'Emergency exit doors and corridors must remain 100% unobstructed by boxes or inventory.', severity: 'CRITICAL', hours: 6 },
    { code: 'EQUIP-008', title: 'Deep Fryer & Exhaust Hood Maintenance', category: 'Equipment', description: 'Exhaust hood filters must undergo bi-weekly degreasing with fire suppression tags up to date.', severity: 'HIGH', hours: 24 },
  ];

  const createdStandards = [];
  for (const spec of brandStandardsSpecs) {
    const std = await db.standard.create({
      data: {
        code: spec.code,
        title: spec.title,
        category: spec.category,
        description: spec.description,
        severity: spec.severity,
        remediationHours: spec.hours,
        organizationId: org.id,
      },
    });
    createdStandards.push(std);
  }

  // 4. Create Franchise Owners (10 Owners)
  const regions = ['North East', 'South East', 'Midwest', 'Central', 'West Coast'];
  const owners = [];
  for (let i = 1; i <= 10; i++) {
    const owner = await db.franchiseOwner.create({
      data: {
        name: `Franchise Owner Group #${i}`,
        email: `owner${i}@franchisegroup.com`,
        phone: `+1 (555) 019-${1000 + i}`,
        companyName: `Apex Retail Ops #${i} LLC`,
        organizationId: org.id,
      },
    });
    owners.push(owner);
  }

  // 5. Create 50 Locations across Regions
  const cities = [
    { name: 'Boston', state: 'MA', region: 'North East' },
    { name: 'New York', state: 'NY', region: 'North East' },
    { name: 'Atlanta', state: 'GA', region: 'South East' },
    { name: 'Miami', state: 'FL', region: 'South East' },
    { name: 'Chicago', state: 'IL', region: 'Midwest' },
    { name: 'Detroit', state: 'MI', region: 'Midwest' },
    { name: 'Dallas', state: 'TX', region: 'Central' },
    { name: 'Denver', state: 'CO', region: 'Central' },
    { name: 'Los Angeles', state: 'CA', region: 'West Coast' },
    { name: 'Seattle', state: 'WA', region: 'West Coast' },
  ];

  const createdLocations = [];
  for (let idx = 1; idx <= 50; idx++) {
    const cityObj = cities[(idx - 1) % cities.length];
    const locCode = `LOC-${String(idx).padStart(3, '0')}`;

    // Highlight Location #042 as the Hero Critical Recurrent Location
    const isHeroLocation = idx === 42;
    const isHighRiskDemo = idx % 7 === 0;

    let riskScore = isHeroLocation ? 82.0 : isHighRiskDemo ? 64.0 : 18.0 + (idx % 15);
    let riskCategory = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW';
    let complianceScore = isHeroLocation ? 62.0 : isHighRiskDemo ? 75.0 : 94.0;

    const loc = await db.location.create({
      data: {
        code: locCode,
        name: `BurgerCraft #${idx} (${cityObj.name})`,
        address: `${100 + idx * 12} Main Street, Suite ${idx}`,
        city: cityObj.name,
        state: cityObj.state,
        region: cityObj.region,
        manager: `Manager ${cityObj.name} #${idx}`,
        complianceScore,
        riskScore,
        riskCategory,
        openingDate: new Date(2021, (idx % 12), 15),
        lastInspectionAt: new Date(Date.now() - (idx % 10) * 24 * 60 * 60 * 1000),
        nextInspectionAt: new Date(Date.now() + (isHeroLocation ? 2 : 14) * 24 * 60 * 60 * 1000),
        organizationId: org.id,
        ownerId: owners[idx % owners.length].id,
      },
    });

    createdLocations.push(loc);
  }

  // 6. Create Inspections, Media Assets, Violations, & Remediation Evidence (200+ Assets)
  for (const loc of createdLocations) {
    const isHeroLocation = loc.code === 'LOC-042';

    const inspection = await db.inspection.create({
      data: {
        locationId: loc.id,
        type: 'ROUTINE',
        status: 'COMPLETED',
        score: loc.complianceScore,
        completedAt: new Date(),
      },
    });

    // Create 4 Media Assets per location (50 * 4 = 200 Assets)
    for (let m = 1; m <= 4; m++) {
      const asset = await db.mediaAsset.create({
        data: {
          locationId: loc.id,
          inspectionId: inspection.id,
          fileName: `${loc.code}_inspection_photo_${m}.jpg`,
          fileType: 'IMAGE',
          mimeType: 'image/jpeg',
          fileUrl: `/uploads/inspection_assets/${loc.code}_photo_${m}.jpg`,
          capturedAt: new Date(Date.now() - m * 24 * 60 * 60 * 1000),
        },
      });

      await db.mediaAnalysis.create({
        data: {
          mediaAssetId: asset.id,
          summaryText: `Multimodal visual audit of ${loc.name} photo #${m}. Detected operational state and surface condition.`,
          detectedJson: JSON.stringify({ objects: ['storefront', 'signage', 'counter'], confidence: 0.94 }),
        },
      });

      // Attach Violations for Hero Location & High Risk Locations
      if (isHeroLocation || (loc.riskScore >= 60 && m <= 2)) {
        const std = createdStandards[(m - 1) % createdStandards.length];
        const isRecurring = isHeroLocation && std.code === 'CLEAN-001';

        const viol = await db.violation.create({
          data: {
            violationCode: `VIOL-${Math.floor(1000 + Math.random() * 9000)}`,
            locationId: loc.id,
            inspectionId: inspection.id,
            standardId: std.id,
            description: `Observed violation of ${std.title}: debris and smudges visible on primary store glass panel.`,
            severity: isRecurring ? 'CRITICAL' : std.severity,
            status: isRecurring ? 'NEEDS_REVIEW' : 'ACTION_REQUIRED',
            isRecurring,
            recurrenceCount: isRecurring ? 4 : 1,
            confidence: 94.0,
            aiExplanation: isRecurring
              ? 'RECURRENT FAILURE: Location LOC-042 failed Standard CLEAN-001 in 4 consecutive audits. Formal Cure Notice recommended.'
              : `Visual analysis confirmed compliance gap against ${std.title}.`,
          },
        });

        await db.violationEvidence.create({
          data: {
            violationId: viol.id,
            mediaAssetId: asset.id,
            snippetText: `Debris detected on storefront panel in asset ${asset.fileName}`,
            confidence: 0.94,
          },
        });

        // Create Corrective Action
        await db.correctiveAction.create({
          data: {
            actionCode: `ACT-${Math.floor(100 + Math.random() * 900)}`,
            violationId: viol.id,
            locationId: loc.id,
            title: `Remediate ${std.title}`,
            description: `Clean and restore ${std.title} according to brand specifications. Upload photo proof.`,
            dueAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
            status: isRecurring ? 'PENDING' : 'IN_PROGRESS',
          },
        });
      }
    }

    // 7. Create Customer Complaint & Review Feeds (100+ Reviews across locations)
    for (let c = 1; c <= 2; c++) {
      await db.customerFeedback.create({
        data: {
          locationId: loc.id,
          source: c === 1 ? 'Google Reviews' : 'Yelp',
          rating: isHeroLocation ? 1.5 : 4.2,
          reviewText: isHeroLocation
            ? 'Dirty storefront glass and sticky entrance floor. Third time I noticed this month!'
            : 'Great burgers and clean store environment.',
          sentiment: isHeroLocation ? 'NEGATIVE' : 'POSITIVE',
          category: 'Cleanliness',
        },
      });
    }
  }

  // 8. Create Sample Pipeline Run Record
  const heroLoc = createdLocations.find((l) => l.code === 'LOC-042') || createdLocations[0];
  await db.pipelineRun.create({
    data: {
      locationId: heroLoc.id,
      rocketrideRunId: `rr_audit_demo_${Date.now()}`,
      status: 'COMPLETED',
      progress: 100,
      currentStep: 'AUDIT_COMPLETED',
      totalAssets: 4,
      processedCount: 4,
      totalTokens: 38400,
      estimatedCost: 0.1152,
      executionMs: 12400,
    },
  });

  // 9. Audit Log
  await db.auditLog.create({
    data: {
      locationId: heroLoc.id,
      userId: opsUser.id,
      action: 'DEMO_DATASET_INITIALIZED',
      details: `Initialized FranchiseGuard AI demo dataset: 50 locations, 200+ media assets, 100+ customer complaint feeds. Hero critical location LOC-042 flagged with 4-time recurring violation.`,
    },
  });

  console.log(`✅ FranchiseGuard AI Demo Dataset Seeded! Total Locations: ${createdLocations.length}`);
  return { locationCount: createdLocations.length, heroLocationId: heroLoc.id };
}

if (require.main === module) {
  seedDemoDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}
