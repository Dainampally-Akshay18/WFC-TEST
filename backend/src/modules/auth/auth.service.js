import User from './auth.model.js';
import { generateToken } from '../../utils/generateToken.js';
import { hashPassword, comparePassword } from '../../utils/hashPassword.js';
import { sendEmail, sendPasswordResetEmail } from '../../services/email.service.js';
import crypto from 'crypto';

/**
 * ============================================
 * AUTH SERVICE - ALL BUSINESS LOGIC
 * ============================================
 */

export const authService = {
  /**
   * 📝 SIGNUP - Create new user account
   * Role defaults to USER, Status defaults to PENDING
   */
  async signup(name, email, password, branch) {
    try {
      // ✅ Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // ✅ Validate branch for non-admin users
      if (!branch) {
        throw new Error('Branch is required for user signup');
      }

      // ✅ Hash password
      const hashedPassword = await hashPassword(password);

      // ✅ Create user with defaults
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Default role
        status: 'PENDING', // Requires admin approval
        branch,
      });

      await newUser.save();

      // ✅ Return safe data (no password)
      return {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        message: 'Account created. Awaiting admin approval.',
      };
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  },

  /**
   * 🔐 LOGIN - Authenticate user
   * Only approved users can login
   */
  async login(email, password) {
    try {
      // ✅ Find user and include password (it's hidden by default)
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // ✅ CRITICAL: Check if user is approved
      if (user.status !== 'APPROVED') {
        throw new Error('Your account is not approved yet. Please wait for admin approval.');
      }

      // ✅ Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // ✅ Generate JWT token
      const token = generateToken({
        userId: user._id,
        role: user.role,
        branch: user.branch,
      });

      return {
        token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          branch: user.branch,
        },
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  },

  /**
   * 📧 FORGOT PASSWORD - Generate reset token and send email
   * SECURITY: Never reveal if email exists
   */
  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });

      // IMPORTANT: Always return success, even if user doesn't exist
      // This prevents email enumeration attacks
      const response = {
        message: 'If this email exists, a password reset link has been sent.',
      };

      if (!user) {
        return response;
      }

      // ✅ Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      // ✅ Set expiry to 15 minutes
      const resetExpiry = Date.now() + 15 * 60 * 1000;

      // ✅ Save token to database
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = resetExpiry;
      await user.save();

      // ✅ Send email with reset link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      const emailContent = `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password.</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `;

      await sendEmail(
        user.email,
        'Password Reset Request',
        emailContent
      );

      return response;
    } catch (error) {
      throw new Error(`Forgot password failed: ${error.message}`);
    }
  },

  /**
   * 🔑 RESET PASSWORD - Verify token and set new password
   */
  async resetPassword(resetToken, newPassword) {
    try {
      // ✅ Hash token to compare with database
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      // ✅ Find user with valid token and expiry
      const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: Date.now() },
      }).select('+resetPasswordToken +resetPasswordExpires');

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // ✅ Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // ✅ Update user and clear reset fields
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return {
        message: 'Password reset successful. You can now login with your new password.',
      };
    } catch (error) {
      throw new Error(`Reset password failed: ${error.message}`);
    }
  },

  /**
   * ✅ APPROVE USER - Admin approves pending user
   */
  async approveUser(userId, adminId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.status === 'APPROVED') {
        throw new Error('User is already approved');
      }

      // ✅ Update status
      user.status = 'APPROVED';
      user.approvedAt = new Date();
      user.createdBy = adminId;
      await user.save();

      // ✅ Send approval email
      const emailContent = `
        <h2>Account Approved</h2>
        <p>Your account has been approved! You can now login.</p>
      `;

      await sendEmail(user.email, 'Account Approved', emailContent);

      return {
        message: 'User approved successfully',
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
        },
      };
    } catch (error) {
      throw new Error(`Approve user failed: ${error.message}`);
    }
  },

  /**
   * ❌ REJECT USER - Admin rejects pending user
   */
  async rejectUser(userId, adminId, reason = null) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.status !== 'PENDING') {
        throw new Error('Only pending users can be rejected');
      }

      // ✅ Update status
      user.status = 'REJECTED';
      user.createdBy = adminId;
      if (reason) {
        user.rejectionReason = reason;
      }
      await user.save();

      // ✅ Send rejection email
      const emailContent = `
        <h2>Account Rejected</h2>
        <p>Unfortunately, your account application was rejected.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ''}
      `;

      await sendEmail(user.email, 'Account Rejection', emailContent);

      return {
        message: 'User rejected successfully',
      };
    } catch (error) {
      throw new Error(`Reject user failed: ${error.message}`);
    }
  },

  /**
   * 🔄 PROMOTE USER - Promote USER to LEADER (MASTER_ADMIN only)
   */
  async promoteUser(userId, adminId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== 'USER') {
        throw new Error('Only users can be promoted to leader');
      }

      // ✅ Promote to LEADER
      user.role = 'LEADER';
      user.createdBy = adminId;
      await user.save();

      // ✅ Send promotion email
      const emailContent = `
        <h2>Promotion</h2>
        <p>You have been promoted to Leader.</p>
      `;

      await sendEmail(user.email, 'You\'ve been promoted', emailContent);

      return {
        message: 'User promoted to leader successfully',
        user: {
          userId: user._id,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      throw new Error(`Promote user failed: ${error.message}`);
    }
  },

  /**
   * 📊 GET PENDING USERS - Admin view pending approvals
   */
  async getPendingUsers() {
    try {
      const pendingUsers = await User.find({ status: 'PENDING' }).select('-password');

      return {
        count: pendingUsers.length,
        users: pendingUsers,
      };
    } catch (error) {
      throw new Error(`Get pending users failed: ${error.message}`);
    }
  },

  /**
   * 👤 GET USER BY ID - Retrieve user profile
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Get user failed: ${error.message}`);
    }
  },

  /**
   * 📝 UPDATE USER PROFILE - User updates their info
   */
  async updateUserProfile(userId, updateData) {
    try {
      // ✅ Only allow safe fields to be updated
      const allowedFields = ['name'];
      const filteredData = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      const user = await User.findByIdAndUpdate(userId, filteredData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      return {
        message: 'Profile updated successfully',
        user,
      };
    } catch (error) {
      throw new Error(`Update profile failed: ${error.message}`);
    }
  },
};

export default authService;
