import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables (DATABASE_URL, etc.)
dotenv.config();

const prisma = new PrismaClient();

async function run() {
  const email = 'danielw@blvckdlphn.com';
  const password = 'Mougouli05172023!!#$$!!*';

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { 
        passwordHash, 
        isVerified: true,
        firstName: 'Daniel',
        lastName: 'Weickdag'
      },
    });
    console.log('✅ Updated admin user credentials and details for', email);
    return;
  }

  // Try to locate the original seeded demo user and update its email
  const originalSeedEmail = 'demo@kairo.com';
  const seededDemo = await prisma.user.findUnique({ where: { email: originalSeedEmail } });
  if (seededDemo) {
    await prisma.user.update({
      where: { email: originalSeedEmail },
      data: {
        email,
        passwordHash,
        isVerified: true,
      },
    });
    console.log(`✅ Renamed ${originalSeedEmail} to ${email} and updated credentials`);
    return;
  }

  // Fall back: create a new admin user with a unique username to avoid collisions
  const baseUsername = 'admin';
  let candidate = baseUsername;
  let suffix = 0;
  while (true) {
    const existingUsername = await prisma.user.findUnique({ where: { username: candidate } });
    if (!existingUsername) break;
    suffix += 1;
    candidate = `${baseUsername}_${suffix}`;
  }

  const user = await prisma.user.create({
    data: {
      email,
      username: candidate,
      firstName: 'Daniel',
      lastName: 'Weickdag',
      passwordHash,
      accountType: 'INDIVIDUAL',
      isVerified: true,
      isPublic: true,
    },
  });
  console.log('✅ Created admin user', { id: user.id, username: user.username });
}

run()
  .catch((e) => {
    console.error('❌ Failed to set admin credential:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });