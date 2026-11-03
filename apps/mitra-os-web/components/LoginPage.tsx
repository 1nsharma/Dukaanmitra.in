import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  Store,
  CheckCircle2,
  Crown,
  KeyRound,
  AlertCircle
} from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

interface LoginPageProps {
  onLoginSuccess?: (role: "merchant" | "superadmin", storeId?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInstantDemoLogin = (roleType: "merchant" | "superadmin") => {
    localStorage.setItem("dm_demo_auth", JSON.stringify({
      authenticated: true,
      role: roleType,
      storeId: "sharma-kirana-demo",
      user: {
        displayName: roleType === "merchant" ? "Sharma Ji (Kirana Store)" : "DukaanMitra Lead Engineer",
        email: roleType === "merchant" ? "sharma.kirana@dukaanmitra.in" : "admin@dukaanmitra.in",
        uid: roleType === "merchant" ? "usr_demo_merchant_1" : "usr_demo_admin_1"
      }
    }));

    if (onLoginSuccess) {
      onLoginSuccess(roleType, "sharma-kirana-demo");
    }

    if (roleType === "superadmin") {
      navigate("/bible");
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err: any) {
      console.warn("Google sign in notice:", err);
      if (err.code === "auth/unauthorized-domain") {
        setErrorMsg("Domain authentication pending in Firebase console. Please use 1-Click Instant Demo Login below.");
      } else {
        setErrorMsg(err.message || "Sign-in failed. Please use 1-Click Instant Demo Login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter email and password.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Use 1-Click Demo Login to preview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-6 flex items-center justify-center font-sans">
      <Helmet>
        <title>Login & Access Portal | DukaanMitra AI Business OS</title>
        <meta
          name="description"
          content="Login to your DukaanMitra merchant console, access your AI Munim dashboard, or launch a live 1-click demo."
        />
      </Helmet>

      <div className="w-full max-w-md space-y-8">
        {/* Branding Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600 mx-auto flex items-center justify-center font-black text-3xl italic text-white shadow-xl shadow-indigo-600/30">
            D
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            DukaanMitra Login
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Universal AI Business OS for Bharat MSMEs • <span className="text-indigo-400">dukaanmitra.in</span>
          </p>
        </div>

        {/* 1-Click Instant Access Banner (Primary Recommended Path) */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border-2 border-indigo-500/50 rounded-2xl p-6 space-y-4 shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-wider text-white">
              Instant 1-Click Demo Access
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            No signup or password required! Explore the full production merchant console, inventory insights, and digital Khata instantly:
          </p>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => handleInstantDemoLogin("merchant")}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Launch Demo Merchant Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleInstantDemoLogin("superadmin")}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>SuperAdmin & Engineering Bible</span>
            </button>
          </div>
        </div>

        {/* Traditional Auth Form (Email / Google) */}
        <Card className="bg-slate-900 border border-slate-800 p-6 space-y-5 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Merchant Account Login
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">Mobile / Email</label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="9829012345 or shop@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">PIN / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              {loading ? "Authenticating..." : "Sign In to Store"}
            </Button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-slate-500 text-[10px] font-black uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </Card>

        {/* Plan Feature Summary Footer */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>DukaanMitra Secure Auth Gateway • End-to-end encrypted</p>
          <div className="flex justify-center gap-4 text-slate-400">
            <a href="/pricing" className="hover:text-indigo-400">Plans (₹0 / ₹299 / ₹599)</a>
            <span>•</span>
            <a href="/terms" className="hover:text-indigo-400">Terms of Service</a>
            <span>•</span>
            <a href="/privacy" className="hover:text-indigo-400">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
