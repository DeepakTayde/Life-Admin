import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial demo data...');

  // Create demo user: deepakTayde
  const email = 'deepakTayde@example.com';
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: 'deepak tayde' },
    create: {
      email,
      name: 'deepak tayde',
      passwordHash,
    },
  });

  console.log(`Created/updated user: ${user.name} (${user.email})`);

  // Clear existing demo documents for a clean slate
  await prisma.document.deleteMany({
    where: { userId: user.id },
  });

  // Calculate dynamic dates around now so they always test status accurately
  const now = new Date();

  // Expiring in 17 days (Expiring Soon)
  const expiringSoonDate1 = new Date(now);
  expiringSoonDate1.setDate(now.getDate() + 17);

  // Expiring in 25 days (Expiring Soon)
  const expiringSoonDate2 = new Date(now);
  expiringSoonDate2.setDate(now.getDate() + 25);

  // Expired 15 days ago (Expired)
  const expiredDate1 = new Date(now);
  expiredDate1.setDate(now.getDate() - 15);

  // Active in 2 years
  const activeDate1 = new Date(now);
  activeDate1.setFullYear(now.getFullYear() + 2);

  // Active in 1 year
  const activeDate2 = new Date(now);
  activeDate2.setFullYear(now.getFullYear() + 1);

  // Active in 5 years
  const activeDate3 = new Date(now);
  activeDate3.setFullYear(now.getFullYear() + 5);

  const demoDocuments = [
    {
      userId: user.id,
      title: 'Car Insurance',
      category: 'INSURANCE' as const,
      documentNumber: 'POL-984210',
      issueDate: new Date('2025-10-20'),
      expiryDate: expiringSoonDate1,
      notes: 'HDFC ERGO Comprehensive with Zero Dep cover. Contact agent 2 weeks prior.',
    },
    {
      userId: user.id,
      title: 'International Passport',
      category: 'IDENTITY' as const,
      documentNumber: 'Z9841203',
      issueDate: new Date('2021-10-12'),
      expiryDate: expiringSoonDate2,
      notes: 'Renew 6 months before expiry for visa & international travel requirements.',
    },
    {
      userId: user.id,
      title: 'Vehicle Pollution Check (PUC)',
      category: 'VEHICLE' as const,
      documentNumber: 'PUC-2026-901',
      issueDate: new Date('2026-03-10'),
      expiryDate: expiredDate1,
      notes: 'Expired! Get vehicle emissions checked at nearest certified fuel station.',
    },
    {
      userId: user.id,
      title: 'Driving Licence',
      category: 'CERTIFICATION' as const,
      documentNumber: 'DL-0420190123456',
      issueDate: new Date('2019-03-15'),
      expiryDate: activeDate1,
      notes: 'Valid across all states and union territories. Permanent smart card.',
    },
    {
      userId: user.id,
      title: 'Health Insurance Family Floater',
      category: 'INSURANCE' as const,
      documentNumber: 'HLT-5510293',
      issueDate: new Date('2025-11-01'),
      expiryDate: activeDate2,
      notes: '10 Lakhs sum insured + 50 Lakhs super top-up with cashless hospital network.',
    },
    {
      userId: user.id,
      title: 'Vehicle Registration Certificate (RC)',
      category: 'VEHICLE' as const,
      documentNumber: 'MH-12-AB-1234',
      issueDate: new Date('2020-05-10'),
      expiryDate: activeDate3,
      notes: 'Original smart card kept safely in the glove box folder.',
    },
    {
      userId: user.id,
      title: 'National Identity Card',
      category: 'IDENTITY' as const,
      documentNumber: 'ID-8839-2019',
      issueDate: new Date('2018-01-01'),
      expiryDate: null, // No expiry document
      notes: 'Permanent identification record. Does not expire.',
    },
  ];

  for (const doc of demoDocuments) {
    await prisma.document.create({ data: doc });
  }

  console.log(`Successfully seeded ${demoDocuments.length} demo documents for ${user.email}!`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
