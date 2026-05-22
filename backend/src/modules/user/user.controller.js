import userService from './user.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const userController = {
  getAllUsers: asyncHandler(async (req, res, next) => {
    const { role, status, branch, page, limit } = req.query;

    const filters = { role, status, branch };
    const pagination = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };

    const result = await userService.getAllUsers(filters, pagination);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  getUserById: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  updateUser: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await userService.updateUser(userId, updateData);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  deleteUser: asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const result = await userService.deleteUser(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  }),
};

export default userController;
