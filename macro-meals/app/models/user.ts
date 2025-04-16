import { Document, model, models, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
