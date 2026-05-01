import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    phone: String,
    role: {
      type: String,
      default: 'USER',
    },
    status: {
      type: String,
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);

export default UserModel;
