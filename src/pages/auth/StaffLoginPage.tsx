import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";

const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Step workflow control: "login" -> "otp"
  const [step, setStep] = useState<"login" | "otp">("login");
  const [otpCode, setOtpCode] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(60);

  // CAPTCHA verification
  const [captchaQuestion, setCaptchaQuestion] = useState("4 + 3 = ?");
  const [captchaAnswer, setCaptchaAnswer] = useState("7");
  const [captchaInput, setCaptchaInput] = useState("");
  
  // UX flows
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [detectedRole, setDetectedRole] = useState<string | null>(null);
  const [cachedTargetPath, setCachedTargetPath] = useState("/dashboard");

  // Field validation errors
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; captcha?: string; otp?: string }>({});

  const loadCaptcha = async () => {
    try {
      const res = await api.request<{ question: string; answer: string }>("/auth/captcha");
      setCaptchaQuestion(res.question);
      setCaptchaAnswer(res.answer);
      setCaptchaInput("");
    } catch (e) {
      // Fallback
      setCaptchaQuestion("6 + 2 = ?");
      setCaptchaAnswer("8");
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  useEffect(() => {
    let timer: any;
    if (step === "otp" && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpCountdown]);

  const validateLogin = () => {
    const newErrors: typeof errors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "Email or Employee ID is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    if (captchaInput !== captchaAnswer) {
      newErrors.captcha = "Incorrect CAPTCHA answer";
      loadCaptcha();
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateLogin()) return;

    setIsLoading(true);
    try {
      const tokens = await api.request<{ access_token: string; refresh_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: identifier, password: password })
      });
      api.setTokens(tokens.access_token, tokens.refresh_token);

      const user = await api.request<{ username: string; email: string; role: string }>("/auth/me");
      setDetectedRole(user.role);

      let targetPath = "/dashboard";
      const normalizedRole = user.role.toLowerCase();
      if (normalizedRole.includes("system administrator") || normalizedRole.includes("it administrator") || normalizedRole.includes("it-admin")) {
        targetPath = "/dashboard/ops";
      } else if (normalizedRole.includes("hospital administrator") || normalizedRole.includes("admin")) {
        targetPath = "/dashboard/admin";
      } else if (normalizedRole.includes("doctor")) {
        targetPath = "/dashboard/doctor";
      } else if (normalizedRole.includes("receptionist") || normalizedRole.includes("reception")) {
        targetPath = "/dashboard/reception";
      } else if (normalizedRole.includes("laboratory technician") || normalizedRole.includes("lab")) {
        targetPath = "/dashboard/lab";
      } else if (normalizedRole.includes("pharmacist") || normalizedRole.includes("pharmacy")) {
        targetPath = "/dashboard/pharmacy";
      }

      setCachedTargetPath(targetPath);
      
      // Proceed to OTP step
      setStep("otp");
      setOtpCountdown(60);
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
      loadCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otpCode.length < 6) {
      setErrors({ otp: "Enter a valid 6-digit OTP code" });
      return;
    }

    setIsLoading(true);
    try {
      await api.request(`/auth/verify-otp?otp=${otpCode}&email=${identifier}`, {
        method: "POST"
      });

      setSuccess("Authentication verified successfully.");
      setTimeout(() => {
        navigate(cachedTargetPath);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid OTP verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Staff Login — CHC Bharno HMS</title>
      </Helmet>
      
      <AuthLayout 
        title="Staff Portal" 
        subtitle={step === "login" ? "Access the Hospital Management System dashboard." : "Multifactor identity verification verification."}
      >
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl mb-6 flex items-start gap-3 animate-fade-in-up">
            <CheckCircle2 className="text-emerald-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="font-bold text-sm">{success}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Role Verified: <span className="font-semibold">{detectedRole}</span>. Loading dashboard...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-2xl mb-6 flex items-start gap-3 animate-fade-in-up">
            <AlertCircle className="text-rose-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm">{error}</p>
            </div>
          </div>
        )}

        {step === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Username/Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Hospital Email / Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  disabled={isLoading}
                  placeholder="dr.priya@chcbharno.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              {errors.identifier && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Math CAPTCHA Panel */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600 uppercase">Solve Equation (CAPTCHA)</label>
                <button type="button" onClick={loadCaptcha} className="text-blue-600 p-1 hover:bg-slate-100 rounded">
                  <RefreshCw size={12} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg select-none text-slate-700">
                  {captchaQuestion}
                </span>
                <input
                  type="text"
                  placeholder="Answer"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none"
                />
              </div>
              {errors.captcha && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.captcha}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center py-3 text-sm font-semibold rounded-xl text-white shadow-md"
            >
              {isLoading ? "Authenticating Credentials..." : "Authenticate Staff"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-5 animate-fade-in">
            {/* OTP Instructions */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 text-blue-800 text-xs rounded-xl">
              Verification code sent to <span className="font-bold">{identifier}</span>. Enter the 6-digit OTP code (demo: <span className="font-bold">123456</span>) to proceed.
            </div>

            {/* OTP input field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center tracking-[1em] font-mono text-xl py-3 rounded-xl border border-slate-200 bg-white focus:outline-none"
                required
              />
              {errors.otp && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.otp}
                </p>
              )}
            </div>

            {/* Resend button / countdown timer */}
            <div className="flex justify-between items-center text-xs text-slate-500">
              {otpCountdown > 0 ? (
                <span>Resend OTP code in {otpCountdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setOtpCountdown(60)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Resend Verification OTP
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-slate-500 hover:text-slate-700"
              >
                Back to credentials
              </button>
            </div>

            {/* Verify OTP Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center py-3 text-sm font-semibold rounded-xl text-white shadow-md"
            >
              {isLoading ? "Verifying..." : "Verify OTP & Access Dashboard"}
            </button>
          </form>
        )}

        <div className="flex justify-center pt-2">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors py-2">
            <ArrowLeft size={12} /> Back to Homepage
          </Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default StaffLoginPage;
