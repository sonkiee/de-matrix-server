import mongoose, { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  locations: Types.ObjectId[];

  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fname: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    lname: {
      type: String,
      required: [true, "Please provide a last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    locations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>("User", UserSchema);

export default User;
