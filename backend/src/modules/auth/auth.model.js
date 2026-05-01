import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: String,
  },
  { timestamps: true }
);

export const AuthModel = mongoose.model('Auth', authSchema);

export default AuthModel;
