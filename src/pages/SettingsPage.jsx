import { useState } from "react"
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    LogOut,
    ChevronRight,
    Moon,
    Sun,
    Smartphone,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Save,
    Loader2,
    CheckCircle2,
    Info,
    Volume2,
    VolumeX,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "react-router-dom"

const SettingsPage = () => {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState("general")
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        reminders: true,
        reports: false,
        sound: true,
    })
    const [appearance, setAppearance] = useState({
        theme: "light",
        compactMode: false,
    })

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "security", label: "Security", icon: Shield },
    ]

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg">
                        <Settings className="h-7 w-7 text-white" />
                    </div>
                    Settings
                </h1>
                <p className="text-gray-500 mt-1 font-medium">Manage your app preferences and account</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        activeTab === tab.id
                                            ? "bg-emerald-50 text-emerald-700 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <tab.icon className="h-4.5 w-4.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="border-t p-4">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                            >
                                <LogOut className="h-4.5 w-4.5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    {/* General Settings */}
                    {activeTab === "general" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Name</p>
                                                <p className="text-sm text-gray-500">{user?.full_name || user?.name || "—"}</p>
                                            </div>
                                        </div>
                                        <Link to="/profile">
                                            <Button variant="outline" size="sm" className="rounded-lg font-medium">
                                                Edit <ChevronRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Email</p>
                                                <p className="text-sm text-gray-500">{user?.email || "—"}</p>
                                            </div>
                                        </div>
                                        <Link to="/profile">
                                            <Button variant="outline" size="sm" className="rounded-lg font-medium">
                                                Edit <ChevronRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Mobile</p>
                                                <p className="text-sm text-gray-500">{user?.mobile || "Not set"}</p>
                                            </div>
                                        </div>
                                        <Link to="/profile">
                                            <Button variant="outline" size="sm" className="rounded-lg font-medium">
                                                Edit <ChevronRight className="h-3 w-3 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Data & Storage</h3>
                                <p className="text-sm text-gray-500 mb-6">Manage your data and storage preferences</p>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Download className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Export Data</p>
                                                <p className="text-xs text-gray-500">Download all your pet data</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-lg font-medium">
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === "notifications" && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Notification Preferences</h3>
                            <p className="text-sm text-gray-500 mb-8">Choose how you want to be notified</p>
                            <div className="space-y-4">
                                {[
                                    { key: "email", label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
                                    { key: "push", label: "Push Notifications", desc: "Browser notifications", icon: Bell },
                                    { key: "reminders", label: "Vaccination Reminders", desc: "Get reminded about upcoming vaccinations", icon: Bell },
                                    { key: "reports", label: "Weekly Reports", desc: "Receive weekly pet health summaries", icon: Info },
                                    { key: "sound", label: "Sound Alerts", desc: "Play sound for notifications", icon: notifications.sound ? Volume2 : VolumeX },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                                                <p className="text-xs text-gray-500">{item.desc}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.key]}
                                                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === "appearance" && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Appearance</h3>
                            <p className="text-sm text-gray-500 mb-8">Customize how PawMedic looks</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-4">Theme</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { value: "light", label: "Light", icon: Sun, desc: "Clean & bright" },
                                            { value: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
                                            { value: "system", label: "System", icon: Smartphone, desc: "Match device" },
                                        ].map(theme => (
                                            <button
                                                key={theme.value}
                                                onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                                                className={`p-5 rounded-2xl border-2 transition-all text-center ${
                                                    appearance.theme === theme.value
                                                        ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <theme.icon className={`h-8 w-8 mx-auto mb-2 ${appearance.theme === theme.value ? "text-emerald-600" : "text-gray-400"}`} />
                                                <p className="font-bold text-gray-900 text-sm">{theme.label}</p>
                                                <p className="text-xs text-gray-500 mt-1">{theme.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Compact Mode</p>
                                        <p className="text-xs text-gray-500">Reduce spacing for more content</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={appearance.compactMode}
                                            onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Security</h3>
                                <p className="text-sm text-gray-500 mb-8">Manage your account security</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Lock className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Change Password</p>
                                                <p className="text-xs text-gray-500">Update your account password</p>
                                            </div>
                                        </div>
                                        <Button onClick={() => setShowPasswordForm(!showPasswordForm)} variant="outline" size="sm" className="rounded-lg font-medium">
                                            {showPasswordForm ? "Cancel" : "Change"}
                                        </Button>
                                    </div>

                                    {showPasswordForm && (
                                        <div className="p-5 bg-gray-50 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                                            <Input placeholder="Current password" type="password" className="h-11 rounded-xl" />
                                            <Input placeholder="New password" type="password" className="h-11 rounded-xl" />
                                            <Input placeholder="Confirm new password" type="password" className="h-11 rounded-xl" />
                                            <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold h-11">
                                                <Save className="h-4 w-4 mr-2" /> Update Password
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Shield className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                                                <p className="text-xs text-gray-500">Add extra security to your account</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">Coming Soon</span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Eye className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Login Sessions</p>
                                                <p className="text-xs text-gray-500">Manage your active sessions</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-lg font-medium">
                                            View <ChevronRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                                <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
                                <p className="text-sm text-red-600 mb-4">These actions are irreversible. Proceed with caution.</p>
                                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100 rounded-xl font-bold">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Confirmation */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 p-8 text-center">
                        <div className="bg-red-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="h-7 w-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sign Out?</h3>
                        <p className="text-sm text-gray-500 mb-6">You'll need to sign in again to access your account.</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={logout} className="flex-1 h-11 bg-red-600 hover:bg-red-700 rounded-xl font-bold">Sign Out</Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default SettingsPage
