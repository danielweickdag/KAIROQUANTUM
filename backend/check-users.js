const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking existing users...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isVerified: true,
      }
    });
    
    console.log('📊 Found users:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Username: ${user.username}, Name: ${user.firstName} ${user.lastName}, Verified: ${user.isVerified}`);
    });
    
    // Check specifically for demo users
    const demoByEmail = await prisma.user.findUnique({
      where: { email: 'demo@kairo.com' }
    });
    
    const demoByUsername = await prisma.user.findUnique({
      where: { username: 'demo_user' }
    });
    
    console.log('\n🎯 Demo user analysis:');
    console.log('Demo by email (demo@kairo.com):', demoByEmail ? `Found - ID: ${demoByEmail.id}` : 'Not found');
    console.log('Demo by username (demo_user):', demoByUsername ? `Found - ID: ${demoByUsername.id}, Email: ${demoByUsername.email}` : 'Not found');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();