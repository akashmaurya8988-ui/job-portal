"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { fetchUserProfile } = useAuth();
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill in all required personal details.");
      return;
    }
    if (role === "recruiter" && !formData.companyName.trim()) {
      setError("Please enter your Company Name.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      const uid = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: formData.fullName.trim(),
      });

      // 1. Save User document in Firestore 'users' collection
      await setDoc(doc(db, "users", uid), {
        uid,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role,
        phone: formData.phone.trim(),
        skills: [],
        education: "",
        profileImage: "",
        createdAt: serverTimestamp(),
      });

      // 2. If Recruiter, create starter Company document in 'companies' collection
      if (role === "recruiter") {
        const companyRef = doc(collection(db, "companies"));
        await setDoc(companyRef, {
          companyId: companyRef.id,
          recruiterId: uid,
          companyName: formData.companyName.trim(),
          description: "",
          website: "",
          location: "",
          createdAt: serverTimestamp(),
        });
      }

      await fetchUserProfile(uid);
      router.push("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Choose your role to get started on JobConnect
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setRole("student");
              setError("");
            }}
            className={`p-4 rounded-xl border-2 text-left transition ${
              role === "student"
                ? "border-blue-600 bg-blue-50/70"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <GraduationCap
              className={`w-6 h-6 mb-2 ${
                role === "student" ? "text-blue-600" : "text-slate-500"
              }`}
            />
            <p className="text-sm font-bold text-slate-900">Student</p>
            <p className="text-xs text-slate-500 mt-0.5">Find jobs &amp; apply</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("recruiter");
              setError("");
            }}
            className={`p-4 rounded-xl border-2 text-left transition ${
              role === "recruiter"
                ? "border-blue-600 bg-blue-50/70"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <Briefcase
              className={`w-6 h-6 mb-2 ${
                role === "recruiter" ? "text-blue-600" : "text-slate-500"
              }`}
            />
            <p className="text-sm font-bold text-slate-900">Recruiter</p>
            <p className="text-xs text-slate-500 mt-0.5">Post jobs &amp; hire</p>
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3.5 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Akash Maurya"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {role === "recruiter" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="TechNova Systems Pvt Ltd"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              `Create ${role === "student" ? "Student" : "Recruiter"} Account`
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}