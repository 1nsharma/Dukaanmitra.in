import React, { useState } from "react";
import { auth } from "../../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup" | "forgot" | "instructions";

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const changeMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  // Google Sign-In (Popup)
  const handleGooglePopup = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      console.error("Google Sign-In Popup error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(
          `Domain not authorized. Please add "${window.location.hostname}" to Authorized Domains in your Firebase console under Authentication > Settings.`,
        );
      } else {
        setError(err.message || "Google Sign-In failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In (Redirect fallback)
  const handleGoogleRedirect = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      console.error("Google Redirect error:", err);
      setError(err.message || "Google Redirect Sign-In failed.");
      setLoading(false);
    }
  };

  // Email / Password Authentication
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "signup" && !fullName) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: fullName,
          });
        }
        setSuccessMessage(
          "Account created successfully! Synchronizing system...",
        );
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Email authentication failed:", err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password. Please verify your credentials.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Email/Password provider is disabled. Please enable it in the Firebase console > Authentication > Sign-in method.",
        );
      } else {
        setError(
          err.message ||
            "Authentication failed. Make sure your Firebase credentials are correct.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Password Reset Link
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo bypass (forces matching dummy account generation)
  const handleDemoBypass = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const demoEmail = "demo@dukaanmitra.in";
    const demoPassword = "demoUser1234";

    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      setSuccessMessage("Logged in as Demo Merchant!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      // If user does not exist, auto-create it
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        try {
          const uCred = await createUserWithEmailAndPassword(
            auth,
            demoEmail,
            demoPassword,
          );
          if (uCred.user) {
            await updateProfile(uCred.user, {
              displayName: "Demo Indian Merchant",
            });
          }
          setSuccessMessage(
            "Demo profile generated and signed in successfully!",
          );
          setTimeout(() => {
            onClose();
          }, 1500);
        } catch (createErr: any) {
          console.error("Bypass generation failed:", createErr);
          if (createErr.code === "auth/operation-not-allowed") {
            setError(
              "Email/Password auth is disabled. Enable it in your Firebase console so you can log in.",
            );
          } else {
            setError(
              "Could not auto-generate demo user. Please use manual registration.",
            );
          }
        }
      } else {
        setError(err.message || "Demo login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-slate-100">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full italic">
              Terminal authentication v2.0
            </span>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase mt-2 tracking-tight">
              {mode === "login" && "Merchant Portal Sign In"}
              {mode === "signup" && "Create Partner Account"}
              {mode === "forgot" && "Recover Credentials"}
              {mode === "instructions" && "Configuration Guide"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="max-h-[75vh] overflow-y-auto p-8 space-y-6">
          {/* Messages Alerts */}
          {error && (
            <div className="flex gap-3 bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl text-rose-700 text-xs font-bold leading-relaxed">
              <AlertCircle size={20} className="shrink-0 text-rose-500" />
              <div>
                <p>{error}</p>
                {error.includes("authorized") && (
                  <button
                    onClick={() => changeMode("instructions")}
                    className="text-indigo-600 underline font-black uppercase tracking-wider text-[10px] mt-2 block hover:text-indigo-800"
                  >
                    View Setup Instructions
                  </button>
                )}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex gap-3 bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl text-emerald-700 text-xs font-bold items-center">
              <CheckCircle size={20} className="shrink-0 text-emerald-500" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Core Sign in Forms */}
          {mode !== "instructions" && (
            <div className="space-y-6">
              {/* Google Integration Buttons */}
              {(mode === "login" || mode === "signup") && (
                <div className="space-y-3">
                  <button
                    onClick={handleGooglePopup}
                    disabled={loading}
                    className="w-full h-14 bg-white hover:bg-slate-50 border-[3px] border-slate-900 rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-slate-800 transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.57 14.96 1 12 1 7.35 1 3.39 3.65 1.39 7.5l3.85 2.99c.92-2.76 3.51-4.45 6.76-4.45z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.61z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.24 14.51c-.24-.72-.38-1.49-.38-2.3c0-.81.14-1.58.38-2.3L1.39 6.92C.5 8.71 0 10.7 0 12.79c0 2.08.5 4.07 1.39 5.86l3.85-4.14z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.11.75-2.53 1.19-4.26 1.19-3.25 0-5.84-1.69-6.76-4.45l-3.85 2.99C3.39 20.35 7.35 23 12 23z"
                      />
                    </svg>
                    Continue with Google (Popup)
                  </button>

                  <div className="flex items-center justify-between gap-2 px-2">
                    <button
                      onClick={handleGoogleRedirect}
                      disabled={loading}
                      className="text-[10px] text-slate-400 hover:text-indigo-600 hover:underline uppercase font-black tracking-widest flex items-center gap-1"
                    >
                      Google Redirect Fallback
                    </button>
                    <button
                      onClick={() => changeMode("instructions")}
                      className="text-[10px] text-indigo-500 hover:text-indigo-700 hover:underline uppercase font-black tracking-widest flex items-center gap-1"
                    >
                      <HelpCircle size={12} /> Debug Google Login
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-x-0 h-[3px] bg-slate-100" />
                    <span className="relative z-10 bg-white px-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                      Or bypass / use secure credentials
                    </span>
                  </div>
                </div>
              )}

              {/* Email / Password Forms */}
              <form
                onSubmit={
                  mode === "forgot" ? handlePasswordReset : handleEmailAuth
                }
                className="space-y-4"
              >
                {mode === "signup" && (
                  <Input
                    label="Full Name / दुकान का नाम"
                    placeholder="E.g., Amit Sharma / Sharma General Store"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    leftIcon={<User size={18} />}
                    required
                  />
                )}

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  leftIcon={<Mail size={18} />}
                  required
                />

                {mode !== "forgot" && (
                  <Input
                    label="Secure Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    leftIcon={<Lock size={18} />}
                    required
                  />
                )}

                {/* Sub-text links */}
                <div className="flex justify-between items-center px-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {mode === "login" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => changeMode("forgot")}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        Forgot Password?
                      </button>
                      <button
                        type="button"
                        onClick={() => changeMode("signup")}
                        className="text-indigo-600 hover:underline"
                      >
                        Create Account
                      </button>
                    </>
                  ) : mode === "signup" ? (
                    <>
                      <span>Already a partner?</span>
                      <button
                        type="button"
                        onClick={() => changeMode("login")}
                        className="text-indigo-600 hover:underline"
                      >
                        Sign In Instead
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => changeMode("login")}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        Back to Login
                      </button>
                      <button
                        type="button"
                        onClick={() => changeMode("signup")}
                        className="text-indigo-600 hover:underline"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  isLoading={loading}
                >
                  {mode === "login" && "Access Console"}
                  {mode === "signup" && "Register Now"}
                  {mode === "forgot" && "Request Reset Link"}
                </Button>
              </form>

              {/* Seamless Bypass Option */}
              {(mode === "login" || mode === "signup") && (
                <div className="mt-8 pt-6 border-t-[3px] border-dashed border-slate-100 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border border-emerald-200">
                    <Cpu size={14} className="animate-spin" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                      Instant Sandbox Environment
                    </span>
                  </div>
                  <Button
                    onClick={handleDemoBypass}
                    disabled={loading}
                    variant="secondary"
                    size="sm"
                    className="w-full bg-slate-900 shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]"
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Quick Sandbox Login (Instant Test)
                  </Button>
                  <p className="text-[10px] text-slate-400 font-bold text-center mt-3 max-w-sm leading-relaxed">
                    Stuck in pop-ups or deploying on local / Vercel? Bypass auth
                    limitations instantly using Indian Test Merchant sandbox
                    credentials.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Instructions Mode */}
          {mode === "instructions" && (
            <div className="space-y-6 text-slate-600 leading-relaxed text-xs font-medium">
              <div className="flex gap-4 p-5 bg-indigo-50/70 rounded-2xl border-2 border-indigo-100">
                <ShieldAlert className="w-10 h-10 text-indigo-600 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-black text-xs text-indigo-900 uppercase tracking-wider">
                    Authorize Custom Domains in Firebase Console
                  </h4>
                  <p className="text-[11px] leading-relaxed">
                    Google Sign-In will fail with{" "}
                    <code className="bg-white px-1.5 py-0.5 rounded border">
                      auth/unauthorized-domain
                    </code>{" "}
                    on your live Vercel site unless authorized first.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-black uppercase tracking-widest text-[10px] text-slate-900">
                  Step-by-Step Fix:
                </h5>
                <ol className="list-decimal list-inside space-y-3 p-1">
                  <li>
                    Log in to the{" "}
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline font-black"
                    >
                      Firebase Console
                    </a>
                    .
                  </li>
                  <li>
                    Select your project:{" "}
                    <strong className="text-slate-800 font-black bg-slate-100 px-1 py-0.5 rounded">
                      amit-ahi
                    </strong>
                    .
                  </li>
                  <li>
                    Go to{" "}
                    <strong className="text-slate-800 font-black">
                      Authentication &gt; Settings &gt; Authorized Domains
                    </strong>
                    .
                  </li>
                  <li>
                    Click{" "}
                    <strong className="text-slate-800 font-black">
                      Add domain
                    </strong>{" "}
                    and insert these URLs:
                    <ul className="list-disc list-inside ml-6 mt-1.5 space-y-1 font-mono text-[11px] text-indigo-600">
                      <li>dukaanmitra.in</li>
                      <li>dukaanmitra.vercel.app</li>
                      <li>{window.location.hostname}</li>
                    </ul>
                  </li>
                  <li>
                    Go to <strong>Authentication &gt; Sign-in method</strong>,
                    click <strong>Add new provider</strong>, and enable{" "}
                    <strong>Email/Password</strong> to let users log in without
                    Google!
                  </li>
                </ol>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => changeMode("login")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Back to Login
                </Button>
                <Button
                  onClick={handleGoogleRedirect}
                  size="sm"
                  className="flex-1"
                >
                  Retry (Redirect)
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
