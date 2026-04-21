"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { User, Bell, Shield, CreditCard, Save, Eye, EyeOff, Camera, Mail, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api-client";

export default function SettingsPage({ role }: { role: "brand" | "creator" }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { value: "profile", label: "Profile", icon: <User size={16} /> },
    { value: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { value: "security", label: "Security", icon: <Shield size={16} /> },
    { value: "billing", label: role === "brand" ? "Billing" : "Payouts", icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role={role} />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
        </div>

        <div className="flex gap-8">
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.value ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-white"
                  }`}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-2xl">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold mb-6">{role === "brand" ? "Brand profile" : "Creator profile"}</h2>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {role === "brand" ? "G" : "S"}
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-border rounded-full flex items-center justify-center shadow-sm">
                      <Camera size={14} className="text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <div className="font-medium">{role === "brand" ? "Glow Skincare Co." : "@shermaine.sg"}</div>
                    <div className="text-sm text-gray-500">PNG or JPG, up to 5MB</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{role === "brand" ? "Company name" : "Display name"}</label>
                    <input type="text" defaultValue={role === "brand" ? "Glow Skincare Co." : "Shermaine Tan"}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary" />
                  </div>
                  {role === "brand" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Industry</label>
                        <select className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary bg-white">
                          <option>Beauty & Cosmetics</option>
                          <option>Fashion & Apparel</option>
                          <option>Food & Beverage</option>
                          <option>Tech & Gadgets</option>
                          <option>Health & Wellness</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Website</label>
                        <input type="url" defaultValue="https://glowskincare.sg"
                          className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Bio</label>
                        <textarea defaultValue="Lifestyle & beauty creator in SG."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Languages</label>
                        <div className="flex flex-wrap gap-2">
                          {["English", "Mandarin"].map((l) => (
                            <span key={l} className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary font-medium">
                              {l} ×
                            </span>
                          ))}
                          <button className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border text-gray-400 hover:border-primary hover:text-primary">
                            + Add
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <input type="email" defaultValue="user@example.com"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone (SG)</label>
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} className="text-gray-400" />
                      <input type="tel" defaultValue="+65 9123 4567"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border flex items-center justify-end gap-3">
                  {saved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 size={14} /> Saved</span>}
                  <button
                    onClick={async () => {
                      setSaving(true);
                      setSaved(false);
                      try {
                        await api.users.updateProfile({ name: role === "brand" ? "Sarah Chen" : "Shermaine Tan" });
                        setSaved(true);
                        setTimeout(() => setSaved(false), 3000);
                      } catch { alert("Failed to save"); }
                      finally { setSaving(false); }
                    }}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold mb-6">Notification preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "New campaign opportunities", desc: "When new campaigns match your categories", def: true },
                    { label: "Application updates", desc: "When your application status changes", def: true },
                    { label: "New messages", desc: "When you receive a new message", def: true },
                    { label: "Payment notifications", desc: "When a payment is released", def: true },
                    { label: "Weekly digest", desc: "Summary of your activity every Monday", def: true },
                    { label: "Marketing emails", desc: "Product updates and tips", def: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.def} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-6">Change password</h2>
                  <div className="space-y-4">
                    {passwordError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{passwordError}</div>}
                    {passwordSuccess && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-1"><CheckCircle2 size={14} /> Password updated successfully</div>}
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Current password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} placeholder="Current password"
                          value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary pr-12" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">New password</label>
                      <input type="password" placeholder="At least 8 characters"
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Confirm new password</label>
                      <input type="password" placeholder="Re-enter new password"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary" />
                    </div>
                    <button
                      disabled={passwordSaving}
                      onClick={async () => {
                        setPasswordError("");
                        setPasswordSuccess(false);
                        if (newPassword !== confirmPassword) { setPasswordError("Passwords don't match"); return; }
                        if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
                        setPasswordSaving(true);
                        try {
                          await api.users.changePassword({ currentPassword, newPassword });
                          setPasswordSuccess(true);
                          setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                        } catch (err) { setPasswordError(err instanceof Error ? err.message : "Failed to update password"); }
                        finally { setPasswordSaving(false); }
                      }}
                      className="px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                    >
                      {passwordSaving && <Loader2 size={16} className="animate-spin" />}
                      {passwordSaving ? "Updating..." : "Update password"}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-2">Two-factor authentication</h2>
                  <p className="text-sm text-gray-600 mb-4">Add an extra layer of security.</p>
                  <button className="px-5 py-2.5 border-2 border-primary text-primary rounded-xl text-sm font-medium hover:bg-primary hover:text-white transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {activeTab === "billing" && role === "brand" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-4">Current plan</h2>
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div>
                      <div className="font-bold text-lg">Growth plan</div>
                      <div className="text-sm text-gray-600">S$299 / month</div>
                    </div>
                    <button className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-surface">
                      Upgrade
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-4">Payment method</h2>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">Visa •••• 4242</div>
                        <div className="text-xs text-gray-500">Expires 12/28</div>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:underline">Change</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && role === "creator" && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold mb-4">Payout method</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Payments from brands are sent to your bank account. PayNow is supported for instant transfers.
                </p>
                <div className="space-y-3">
                  <div className="p-4 border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">PayNow (Phone)</div>
                        <div className="text-xs text-gray-500">+65 •••• 4567</div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Primary</span>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Bank transfer</div>
                        <div className="text-xs text-gray-500">DBS •••• 1234</div>
                      </div>
                      <button className="text-xs text-primary hover:underline">Edit</button>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 border border-dashed border-border rounded-xl text-sm font-medium text-gray-500 hover:border-primary hover:text-primary">
                  + Add payout method
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
