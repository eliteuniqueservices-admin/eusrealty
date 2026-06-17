"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("credentials"); // 'credentials' | 'otp'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (step === "credentials") {
      try {
        const response = await fetch("/api/auth/login-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || "Invalid credentials. Please try again.");
          setLoading(false);
          return;
        }

        if (data.status === "OTP_REQUIRED") {
          setStep("otp");
          setLoading(false);
        }
      } catch (err) {
        console.error("Login verification failed:", err);
        setError("Network error. Please try again.");
        setLoading(false);
      }
    } else {
      try {
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          otp: otp,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid or expired verification code.");
          setLoading(false);
        } else {
          router.push("/admin/dashboard");
          router.refresh();
        }
      } catch (err) {
        console.error("OTP login failed:", err);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
              <Building2 size={32} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">
              EUS<span className="text-blue-500">ADMIN</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              {step === "credentials" ? "Secure Gateway Access" : "Two-Factor Authentication"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            {step === "credentials" ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      placeholder="admin@eusrealty.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 text-center font-medium leading-relaxed">
                  We have dispatched a 6-digit verification code to <span className="text-slate-200 font-bold">{form.email}</span>. Please input it below to complete authorization.
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-600 tracking-[0.5em] text-center text-lg font-black focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-2 transition-all mt-6 ${
                loading ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
              }`}
            >
              {loading
                ? step === "credentials"
                  ? "Verifying..."
                  : "Authorizing..."
                : step === "credentials"
                ? "Request Access"
                : "Confirm Verification"}
              {!loading && <ArrowRight size={18} />}
            </button>

            {step === "otp" && (
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-300 mt-2 block transition-colors"
              >
                ← Back to credentials
              </button>
            )}
          </form>
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-6">
          Protected by EusRealty Secure Architecture
        </p>
      </div>
    </div>
  );
}
