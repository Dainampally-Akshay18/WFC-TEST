import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/modules/auth/auth.model.js';
import { hashPassword } from '../src/utils/hashPassword.js';
import connectDB from '../src/config/db.js';

dotenv.config();

/**
 * ============================================
 * SEED SCRIPT - Create MASTER_ADMIN
 * ============================================
 * 
 * Run: node scripts/seed-admin.js
 * 
 * Creates initial MASTER_ADMIN user
 * ONLY run this once during initial setup
 */

const seedAdmin = async () => {
  try {
    console.log('🌱 Starting seed script...');

    // Connect to MongoDB
    await connectDB();

    // Check if MASTER_ADMIN already exists
    const existingAdmin = await User.findOne({ role: 'MASTER_ADMIN' });

    if (existingAdmin) {
      console.log('⚠️  MASTER_ADMIN already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Hash password
    const password = process.env.MASTER_ADMIN_PASSWORD || 'Admin@123456';
    const hashedPassword = await hashPassword(password);

    // Create MASTER_ADMIN user
    const adminUser = new User({
      name: 'Master Admin',
      email: process.env.MASTER_ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      role: 'MASTER_ADMIN',
      status: 'APPROVED',
      approvedAt: new Date(),
      branch: null, // MASTER_ADMIN has no branch
    });

    await adminUser.save();

    console.log('✅ MASTER_ADMIN created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', password);
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password immediately after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed script error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
