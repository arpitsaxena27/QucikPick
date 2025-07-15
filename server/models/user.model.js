import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, "username required"],
                  trim: true,
                  lowercase: true,
                  minlength: [3, "username should be of 3 characters"],
                  maxlength: [20, "username should be of 20 characters"],
            },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  trim: true,
                  lowercase: true,
                  validate: {
                        validator: function (v) {
                              return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                                    v
                              );
                        },
                        message: (props) =>
                              `${props.value} is not a valid email!`,
                  },
            },
            password: {
                  type: String,
                  required: true,
                  minlength: [8, "password should be of 8 characters"],
                  select: false, // Do not return password in queries by default
            },
            role: { type: String, enum: ["user", "retailer"], default: "user" },
            avatar: {
                  public_id: {
                        type: String,
                  },
                  secure_url: {
                        type: String,
                  },
            },
            // isActive: { type: Boolean, default: true },
            forgotPasswordToken: String,
            forgotPasswordExpiry: Date,
      },
      { timestamps: true }
);

userSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next();
      this.password = await bcrypt.hash(this.password, 10);
      next();
});

userSchema.methods.comparePassword = async function (password) {
      return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWTToken = function () {
      return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
      });
};

userSchema.methods.getResetPasswordToken = async function () {
      const resetToken=crypto.generateRandomBytes(20).toString("hex");
      this.forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
      return resetToken;
};

export const User = mongoose.model("User", userSchema);
