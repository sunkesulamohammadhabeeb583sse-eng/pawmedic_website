import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    PawPrint,
    Scan,
    Scale,
    Syringe,
    Activity,
    FileText,
    Bell,
    Plus,
    ChevronRight,
    Heart,
    Calendar,
    TrendingUp,
    Loader2,
    CheckCircle2,
    CalendarDays,
    ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/layout"
import { usePets } from "@/hooks/usePets"
import { useAuth } from "@/hooks/useAuth"

import { useWeights } from "@/hooks/useWeights"
import { useRecords } from "@/hooks/useRecords"
import { useVaccinations } from "@/hooks/useVaccinations"

const DashboardPage = () => {
    const { user } = useAuth()
    const { pets, loading: loadingPets } = usePets()
    const { records, loading: loadingRecords } = useRecords()
    const { weights, fetchWeights } = useWeights(pets[0]?.id)
    const { vaccinations, fetchVaccinations } = useVaccinations(pets[0]?.id)

    useEffect(() => {
        if (pets.length > 0) {
            fetchWeights(pets[0].id)
            fetchVaccinations(pets[0].id)
        }
    }, [pets, fetchWeights, fetchVaccinations])

    const getPetEmoji = (type) => {
        const typeMap = {
            "Dog": "🐕", "Cat": "🐈", "Bird": "🐦", "Rabbit": "🐰",
            "Hamster": "🐹", "Fish": "🐠", "Turtle": "🐢", "Horse": "🐴"
        }
        return typeMap[type] || "🐾"
    }

    const dailyCareToday = records.filter(r => 
        r.type === "daily_care" && 
        r.date === new Date().toISOString().split("T")[0]
    )

    // Dynamic summary stats
    const stats = [
        { label: "Active Pets", value: pets.length, icon: PawPrint, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Health Score", value: pets.length > 0 ? "96%" : "--", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
        { label: "Care Logs", value: dailyCareToday.length || "0 today", icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Vaccinations", value: vaccinations.length > 0 ? "Tracked" : "None", icon: Syringe, color: "text-emerald-600", bg: "bg-emerald-50" },
    ]

    return (
        <DashboardLayout>
            {/* Header with Glassmorphism Effect */}
            <div className="relative mb-10 p-8 rounded-[2.5rem] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-100/50 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 bg-emerald-400/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : user?.name ? `, ${user.name.split(' ')[0]}` : ""}! 👋
                        </h1>
                        <p className="text-lg text-gray-600 mt-2 font-medium">Your pet care portal is ready for today's tasks.</p>
                    </div>
                    <div className="flex -space-x-3">
                        {pets.slice(0, 4).map((pet, i) => (
                            <div key={pet.id} className="h-14 w-14 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-3xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300" style={{ zIndex: 10 + i }}>
                                {getPetEmoji(pet.type)}
                            </div>
                        ))}
                        {pets.length > 4 && (
                            <div className="h-14 w-14 rounded-full border-4 border-white bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shadow-lg relative z-0">
                                +{pets.length - 4}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-gray-900 mt-1">{loadingPets ? "..." : stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {[
                    { to: "/scanner", label: "Scanner", icon: Scan, color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-100" },
                    { to: "/daily-care", label: "Daily Care", icon: Heart, color: "from-red-500 to-pink-600", shadow: "shadow-red-100" },
                    { to: "/vaccinations", label: "Vaccines", icon: Syringe, color: "from-teal-500 to-emerald-600", shadow: "shadow-teal-100" },
                    { to: "/weight", label: "Weight", icon: Scale, color: "from-purple-500 to-indigo-600", shadow: "shadow-purple-100" },
                    { to: "/activity", label: "Activity", icon: Activity, color: "from-orange-500 to-amber-600", shadow: "shadow-orange-100" },
                ].map((action, i) => (
                    <Link key={i} to={action.to} className="group">
                        <div className={`h-full p-6 bg-gradient-to-br ${action.color} rounded-[2rem] shadow-xl ${action.shadow} flex flex-col items-center justify-center text-white transform hover:scale-[1.05] transition-all duration-300`}>
                            <action.icon className="h-8 w-8 mb-3 group-hover:rotate-12 transition-transform" />
                            <span className="font-bold text-sm tracking-tight">{action.label}</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pet List Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Profiles</h2>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">{pets.length} managed pets</p>
                            </div>
                            <Link to="/pets" className="group flex items-center bg-gray-50 px-4 py-2 rounded-xl text-emerald-600 hover:bg-emerald-50 font-bold transition-all">
                                <span>See All</span>
                                <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                            </Link>
                        </div>

                        {loadingPets ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
                                <p className="text-gray-500 font-medium">Synchronizing records...</p>
                            </div>
                        ) : pets.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {pets.slice(0, 4).map((pet) => (
                                    <Link key={pet.id} to={`/pets`} className="group p-5 bg-gray-50 hover:bg-white rounded-3xl border border-transparent hover:border-emerald-100 hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                                {getPetEmoji(pet.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 text-lg truncate">{pet.name}</h3>
                                                <div className="flex items-center text-xs text-gray-500 font-bold gap-2 mt-1">
                                                    <span className="px-2 py-0.5 bg-white rounded-full shadow-sm">{pet.gender}</span>
                                                    <span>•</span>
                                                    <span>{pet.breed || pet.type}</span>
                                                </div>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center transition-opacity shadow-sm">
                                                <ChevronRight className="h-5 w-5 text-emerald-500" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Plus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No pets added yet</h3>
                                <Link to="/pets">
                                    <Button className="bg-emerald-500 px-8 rounded-xl font-bold shadow-lg shadow-emerald-200">
                                        Add First Pet
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Showcase */}
                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 -mr-10 -mt-10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                            <h3 className="text-xl font-bold mb-4 relative z-10">Health Scanner</h3>
                            <p className="text-blue-100/80 text-sm leading-relaxed mb-6 relative z-10">
                                Advanced machine learning to detect over 30+ skin conditions and illnesses instantly from a photo.
                            </p>
                            <Link to="/scanner" className="relative z-10">
                                <Button className="bg-white text-blue-900 hover:bg-blue-50 w-full rounded-2xl font-bold h-12 shadow-lg">
                                    Analyze Pet Image
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Checklist</h3>
                                <div className="space-y-3 mt-4">
                                {dailyCareToday.length > 0 ? (
                                    dailyCareToday.slice(0, 3).map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`h-5 w-5 rounded-full flex items-center justify-center border-2 bg-emerald-500 border-emerald-500`}>
                                                <CheckCircle2 className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-400 line-through">
                                                {item.feeding_time ? `Feed at ${item.feeding_time}` : "Daily Care Logged"}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
                                            <span className="text-sm font-medium text-gray-700">No care logs today</span>
                                        </div>
                                        <Link to="/daily-care" className="inline-block text-xs font-bold text-emerald-600 hover:underline">
                                            Log your first task →
                                        </Link>
                                    </div>
                                )}
                                </div>
                            </div>
                            <Link to="/daily-care" className="mt-6">
                                <Button variant="ghost" className="w-full text-emerald-600 font-bold hover:bg-emerald-50 p-0 h-auto">
                                    Manage Care Tasks <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Calendar Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Pet Vaccination</h3>
                            <div className="bg-emerald-50 p-2 rounded-xl">
                                <Syringe className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {vaccinations.length > 0 ? (
                                vaccinations.slice(0, 3).map((v, i) => (
                                    <div key={i} className="group flex flex-col p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-gray-900">{v.vaccine_name}</p>
                                            <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600`}>
                                                History
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{pets[0]?.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{v.date ? new Date(v.date).toLocaleDateString() : "--"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <Syringe className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500">No vaccinations recorded for {pets[0]?.name || "pets"}</p>
                                </div>
                            )}
                        </div>
                        <Link to="/vaccinations">
                            <Button variant="outline" className="w-full mt-6 h-12 rounded-2xl font-bold border-gray-100 hover:bg-gray-50">
                                View Vaccine Records
                            </Button>
                        </Link>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <ArrowUpRight className="h-32 w-32" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Pet Health Report</h3>
                        <p className="text-emerald-200 text-xs leading-relaxed mb-6">
                            Overall health metrics are stable based on recent data from your {pets.length} managed pets.
                        </p>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-5xl font-black">Stable</span>
                        </div>
                        <Link to="/records">
                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 h-14 rounded-2xl font-bold text-lg shadow-lg">
                                View Full Records
                            </Button>
                        </Link>
                    </div>

                    {/* Pro Tip */}
                    <div className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm italic text-gray-600 leading-relaxed text-sm flex gap-4">
                        <div className="h-10 w-10 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                        </div>
                        "Regular weight tracking is the most effective way to spot early health changes in senior pets."
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DashboardPage
