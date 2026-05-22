import User from '../auth/auth.model.js';

export const userService = {
  async getAllUsers(filters = {}, pagination = {}) {
    const { role, status, branch } = filters;
    const { page = 1, limit = 10 } = pagination;

    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (branch) query.branch = branch;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  async getUserById(userId) {
    const user = await User.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean();

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return user;
  },

  async updateUser(userId, updateData) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (user.role === 'MASTER_ADMIN' && updateData.role && updateData.role !== 'MASTER_ADMIN') {
      const error = new Error('Cannot change MASTER_ADMIN role');
      error.status = 403;
      throw error;
    }

    const allowedFields = ['name', 'branch', 'role', 'status'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    if (updates.status === 'APPROVED' && user.status !== 'APPROVED') {
      updates.approvedAt = new Date();
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean();

    return updatedUser;
  },

  async deleteUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (user.role === 'MASTER_ADMIN') {
      const error = new Error('Cannot delete MASTER_ADMIN account');
      error.status = 403;
      throw error;
    }

    await User.findByIdAndDelete(userId);

    return { message: 'User deleted successfully' };
  },
};

export default userService;
