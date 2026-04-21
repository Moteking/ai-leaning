"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Building2, Video, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"brand" | "creator">("brand");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    handle: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        company: role === "brand" ? formData.company : undefined,
        handle: role === "creator" ? formData.handle : undefined,
      });
      router.push(role === "brand" ? "/dashboard/brand" : "/dashboard/creator");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl">
              Cast<span className="text-primary">SG</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Start free, no credit card required</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setRole("brand")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                role === "brand" ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"
              }`}
            >
              <Building2 size={24} className={role === "brand" ? "text-primary" : "text-gray-400"} />
              <div className="text-left">
                <div className="font-medium text-sm">Brand</div>
                <div className="text-xs text-gray-500">Run campaigns</div>
              </div>
            </button>
            <button
              onClick={() => setRole("creator")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                role === "creator" ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"
              }`}
            >
              <Video size={24} className={role === "creator" ? "text-primary" : "text-gray-400"} />
              <div className="text-left">
                <div className="font-medium text-sm">Creator</div>
                <div className="text-xs text-gray-500">Get paid campaigns</div>
              </div>
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">{role === "brand" ? "Your name" : "Display name"}</label>
              <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm"
                placeholder={role === "brand" ? "John Tan" : "Your name"} />
            </div>

            {role === "brand" ? (
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input type="text" value={formData.company} onChange={(e) => updateField("company", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm"
                  placeholder="Your company name" />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Primary social handle</label>
                <input type="text" value={formData.handle} onChange={(e) => updateField("handle", e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm"
                  placeholder="@yourhandle" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm"
                placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => updateField("password", e.target.value)} required minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm pr-12"
                  placeholder="At least 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg text-white py-3 rounded-xl font-medium text-center hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="text-white text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            {role === "brand" ? "Find the right creators" : "Get paid for your content"}
          </h2>
          <p className="text-white/80 leading-relaxed">
            {role === "brand"
              ? "Browse 2,500+ verified Singapore creators across every platform and category."
              : "Access paid campaign opportunities from top Singapore brands. 100% free for creators."}
          </p>
        </div>
      </div>
    </div>
  );
}
