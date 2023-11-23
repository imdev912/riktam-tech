import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  about: string;
  isAdmin: boolean;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, required: true },
    image: { type: String, trim: true, default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png" },
    about: { type: String, trim: true, default: "only important messages" },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;