const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixDemoUser() {
  try {
    console.log('🔧 Fixing demo user...');
    
    // Find the user with the wrong email
    const wrongEmailUser = await prisma.user.findUnique({
      where: { email: 'demo@kaire.com' }
    });
    
    if (wrongEmailUser) {
      console.log('Found user with wrong email:', wrongEmailUser.email);
      
      // Hash the correct password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('Mougouli05172023!!#$$!!*', saltRounds);
      
      // Update the user with correct email and password
      const updatedUser = await prisma.user.update({
        where: { id: wrongEmailUser.id },
        data: {
          email: 'demo@kairo.com',
          passwordHash: passwordHash,
          isVerified: true,
        }
      });
      
      console.log('✅ Demo user updated successfully:');
      console.log(`- ID: ${updatedUser.id}`);
      console.log(`- Email: ${updatedUser.email}`);
      console.log(`- Username: ${updatedUser.username}`);
      console.log(`- Verified: ${updatedUser.isVerified}`);
    } else {
      console.log('❌ User with wrong email not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDemoUser();