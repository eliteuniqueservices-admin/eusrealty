import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.toLowerCase()?.trim();
          const password = credentials?.password;
          const otp = credentials?.otp;

          if (!email || !password) {
            return null;
          }

          await dbConnect();
          const user = await User.findOne({ email });

          if (!user) {
            // Fallback hardcoded admin for development (with OTP support)
            const isMockAdmin = (email === "admin@eusrealty.com" || email === "rahulupadhyay0053@gmail.com") && (password === "admin123" || password === "Admin@123");
            if (isMockAdmin) {
              if (!otp) return null;
              if (global.tempOtp && global.tempOtp === otp && global.tempOtpExpires && global.tempOtpExpires > new Date()) {
                global.tempOtp = undefined;
                global.tempOtpExpires = undefined;
                return { id: "1", name: "Admin", email: email, role: "admin" };
              }
            }
            return null;
          }
          
          if (user.role !== "admin") {
            console.warn(`Auth blocked: User ${email} does not have admin role.`);
            return null;
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return null;

          // Enforce 2FA OTP check
          if (!otp) return null;
          if (user.otp === otp && user.otpExpires && user.otpExpires > new Date()) {
            // Clear OTP after successful use
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
          }

          console.warn(`Auth blocked: Invalid or expired OTP for user ${email}.`);
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          const email = credentials?.email?.toLowerCase()?.trim();
          const password = credentials?.password;
          const otp = credentials?.otp;
          const isMockAdmin = (email === "admin@eusrealty.com" || email === "rahulupadhyay0053@gmail.com") && (password === "admin123" || password === "Admin@123");
          if (isMockAdmin && otp) {
            if (global.tempOtp && global.tempOtp === otp && global.tempOtpExpires && global.tempOtpExpires > new Date()) {
              global.tempOtp = undefined;
              global.tempOtpExpires = undefined;
              return { id: "1", name: "Admin", email: email, role: "admin" };
            }
          }
          return null;
        }
      }
    })
  ],
});
