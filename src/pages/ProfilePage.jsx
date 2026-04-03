import { useState, useEffect } from "react"
import {
    User,
    Camera,
    Mail,
    Phone,
    Calendar,
    Edit2,
    Save,
    X,
    Loader2,
    PawPrint,
    Shield,
    CheckCircle2,
    UserCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { useAuth } from "@/hooks/useAuth"
import { usePets } from "@/hooks/usePets"
import { usersService } from "@/services/api"

const ProfilePage = () => {
    const { user, checkAuth } = useAuth()
    const { pets } = usePets()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        age: "",
        gender: "",
        mobile: "",
    })

    useEffect(() => {
        if (user) {
            setForm({
                full_name: user.full_name || user.name || "",
                email: user.email || "",
                age: user.age || "",
                gender: user.gender || "",
                mobile: user.mobile || "",
            })
        }
    }, [user])

    const handleSave = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")
        if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
            setError("Phone number must be exactly 10 digits")
            setLoading(false)
            return
        }
        try {
            const response = await usersService.updateProfile(form)
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data))
                checkAuth()
            }
            setSuccess("Profile updated successfully!")
            setIsEditing(false)
            setTimeout(() => setSuccess(""), 3000)
        } catch (err) {
            setError(err.message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const getInitials = () => {
        const name = user?.full_name || user?.name || "U"
        return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-200">
                        <User className="h-7 w-7 text-white" />
                    </div>
                    My Profile
                </h1>
                <p className="text-gray-500 mt-1 font-medium">Manage your personal information</p>
            </div>

            {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-5 w-5" /> {success}
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium animate-in slide-in-from-top-2">{error}</div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Cover */}
                        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                    <span className="text-3xl font-extrabold bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                        {getInitials()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-16 pb-8 px-6 text-center">
                            <h2 className="text-xl font-bold text-gray-900">{user?.full_name || user?.name || "User"}</h2>
                            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                                    <Shield className="h-3 w-3 inline mr-1" /> Verified
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="border-t px-6 py-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                                    <PawPrint className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                                    <p className="text-xl font-extrabold text-gray-900">{pets.length}</p>
                                    <p className="text-xs text-gray-500 font-medium">Pets</p>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-xl">
                                    <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                                    <p className="text-xl font-extrabold text-gray-900">—</p>
                                    <p className="text-xs text-gray-500 font-medium">Days Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                                <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
                            </div>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl font-bold h-11 px-5">
                                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            ) : (
                                <Button onClick={() => { setIsEditing(false); setError("") }} variant="outline" className="rounded-xl font-bold h-11 px-5">
                                    <X className="h-4 w-4 mr-2" /> Cancel
                                </Button>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <UserCircle className="h-4 w-4 text-gray-400" /> Full Name
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={form.full_name}
                                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                            className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 text-base"
                                            required
                                        />
                                    ) : (
                                        <p className="h-12 flex items-center text-gray-900 font-medium px-3 bg-gray-50 rounded-xl">{form.full_name || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <Mail className="h-4 w-4 text-gray-400" /> Email
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 text-base"
                                            required
                                        />
                                    ) : (
                                        <p className="h-12 flex items-center text-gray-900 font-medium px-3 bg-gray-50 rounded-xl">{form.email || "—"}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-gray-400" /> Age
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={form.age}
                                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                                            placeholder="e.g., 25"
                                            className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 text-base"
                                        />
                                    ) : (
                                        <p className="h-12 flex items-center text-gray-900 font-medium px-3 bg-gray-50 rounded-xl">{form.age || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                                    {isEditing ? (
                                        <select
                                            value={form.gender}
                                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                            className="w-full h-12 rounded-xl border border-gray-200 px-3 text-base focus:border-emerald-400 focus:ring-emerald-400 focus:outline-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className="h-12 flex items-center text-gray-900 font-medium px-3 bg-gray-50 rounded-xl">{form.gender || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <Phone className="h-4 w-4 text-gray-400" /> Mobile
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={form.mobile}
                                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                            placeholder="e.g., +1234567890"
                                            className="h-12 rounded-xl border-gray-200 focus:border-emerald-400 text-base"
                                        />
                                    ) : (
                                        <p className="h-12 flex items-center text-gray-900 font-medium px-3 bg-gray-50 rounded-xl">{form.mobile || "—"}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl font-bold h-12 px-8 shadow-lg shadow-emerald-200">
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* My Pets Quick View */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">My Pets</h3>
                        {pets.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No pets registered yet.</p>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {pets.map(pet => (
                                    <div key={pet.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                                        <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
                                            🐾
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{pet.name}</h4>
                                            <p className="text-xs text-gray-500">{pet.breed} • {pet.age}</p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${pet.approval_status === "Approved" ? "bg-emerald-100 text-emerald-700" : pet.approval_status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                            {pet.approval_status || "Pending"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ProfilePage
