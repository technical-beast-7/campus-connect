import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Script to fix authority users that don't have categories set
 * This will prompt each authority user without categories to set their category
 */

const fixAuthorityCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all authority users without categories or with empty categories
    const authoritiesWithoutCategories = await User.find({
      role: 'authority',
      $or: [
        { categories: { $exists: false } },
        { categories: { $size: 0 } }
      ]
    });

    console.log(`\n📊 Found ${authoritiesWithoutCategories.length} authority users without categories\n`);

    if (authoritiesWithoutCategories.length === 0) {
      console.log('✅ All authority users have categories assigned!');
      process.exit(0);
    }

    // List all authorities that need fixing
    console.log('Authority users that need categories:');
    authoritiesWithoutCategories.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Department: ${user.department}`);
    });

    console.log('\n⚠️  These users need to have categories assigned.');
    console.log('📝 You can either:');
    console.log('   1. Update them manually in MongoDB Compass');
    console.log('   2. Have them re-register with the new registration form');
    console.log('   3. Run this script with --auto flag to set default categories\n');

    // Check if --auto flag is provided
    if (process.argv.includes('--auto')) {
      console.log('🔧 Auto-fixing: Setting default category based on department...\n');

      for (const user of authoritiesWithoutCategories) {
        // Try to guess category from department name
        let defaultCategory = 'other';
        const dept = user.department.toLowerCase();
        
        if (dept.includes('maintenance')) defaultCategory = 'maintenance';
        else if (dept.includes('canteen') || dept.includes('food')) defaultCategory = 'canteen';
        else if (dept.includes('hostel') || dept.includes('accommodation')) defaultCategory = 'hostel';
        else if (dept.includes('transport')) defaultCategory = 'transport';
        else if (dept.includes('classroom') || dept.includes('academic')) defaultCategory = 'classroom';

        user.categories = [defaultCategory];
        await user.save();
        
        console.log(`✅ Updated ${user.name}: categories = ["${defaultCategory}"]`);
      }

      console.log('\n✅ All authority users have been updated!');
    } else {
      console.log('💡 To auto-fix with default categories, run:');
      console.log('   node scripts/fix-authority-categories.js --auto\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run the script
fixAuthorityCategories();
