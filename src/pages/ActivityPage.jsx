import { useState, useEffect } from "react"
import {
    Activity,
    Plus,
    Clock,
    Footprints,
    Moon,
    Brain,
    StickyNote,
    Loader2,
    Trash2,
    Search,
    Filter,
    ChevronDown,
    X,
    PawPrint,
    CalendarDays,
    TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { useRecords } from "@/hooks/useRecords"
import { usePets } from "@/hooks/usePets"

const ActivityPage = () => {
    const { records, loading, error, addActivity, deleteRecord, fetchRecords } = useRecords()
    const { pets } = usePets()
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterLevel, setFilterLevel] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [form, setForm] = useState({
        pet_id: "",
        activity_level: "Medium",
        walking_time: "",
        resting_time: "",
        behaviour_status: "Normal",
        notes: "",
        record_date: new Date().toISOString().split("T")[0]
    })

    const activityRecords = records.filter(r => r.type === "activity")

    const filteredRecords = activityRecords.filter(r => {
        const matchesSearch = !searchQuery ||
            r.activity_level?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.behaviour_status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterLevel === "all" || r.activity_level?.toLowerCase() === filterLevel.toLowerCase()
        return matchesSearch && matchesFilter
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addActivity(form)
            setShowForm(false)
            setForm({ pet_id: "", activity_level: "Medium", walking_time: "", resting_time: "", behaviour_status: "Normal", notes: "", record_date: new Date().toISOString().split("T")[0] })
        } catch { }
    }

    const handleDelete = async (id) => {
        try {
            await deleteRecord("activity", id)
            setDeleteId(null)
        } catch { }
    }

    const getLevelColor = (level) => {
        const colors = {
            "High": "bg-red-100 text-red-700 border-red-200",
            "Medium": "bg-amber-100 text-amber-700 border-amber-200",
            "Low": "bg-blue-100 text-blue-700 border-blue-200",
        }
        return colors[level] || "bg-gray-100 text-gray-700 border-gray-200"
    }

    const getBehaviourIcon = (status) => {
        const icons = {
            "Normal": "😊",
            "Excited": "🎉",
            "Calm": "😌",
            "Anxious": "😰",
            "Aggressive": "😠",
            "Lethargic": "😴"
        }
        return icons[status] || "🐾"
    }

    const stats = {
        total: activityRecords.length,
        highActivity: activityRecords.filter(r => r.activity_level === "High").length,
        avgWalking: activityRecords.length > 0 ? Math.round(activityRecords.reduce((sum, r) => sum + (parseInt(r.walking_time) || 0), 0) / activityRecords.length) : 0
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-200">
                            <Activity className="h-7 w-7 text-white" />
                        </div>
                        Activity Tracker
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Track your pet's daily activities and behaviour</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-200 rounded-xl font-bold h-12 px-6">
                    <Plus className="h-5 w-5 mr-2" /> Log Activity
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-100 rounded-xl">
                            <CalendarDays className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.total}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Entries</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-red-100 rounded-xl">
                            <TrendingUp className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.highActivity}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">High Activity</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-xl">
                            <Footprints className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.avgWalking}m</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg Walking</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-11 rounded-xl border-gray-200 font-medium px-4">
                        <Filter className="h-4 w-4 mr-2" />
                        {filterLevel === "all" ? "All Levels" : filterLevel}
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                    {showFilters && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border shadow-xl z-20 py-2 min-w-[160px]">
                            {["all", "High", "Medium", "Low"].map(level => (
                                <button
                                    key={level}
                                    onClick={() => { setFilterLevel(level); setShowFilters(false) }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterLevel === level ? "text-orange-600 font-bold bg-orange-50" : "text-gray-700"}`}
                                >
                                    {level === "all" ? "All Levels" : level}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Activity List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-500 mb-4" />
                    <p className="text-gray-500 font-medium">Loading activities...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">{error}</div>
            ) : filteredRecords.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-orange-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity className="h-12 w-12 text-orange-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Activities Found</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start tracking your pet's daily activities and behavior patterns.</p>
                    <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600 rounded-xl font-bold px-8 shadow-lg shadow-orange-200">
                        <Plus className="h-5 w-5 mr-2" /> Log First Activity
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRecords.map((record) => (
                        <div key={`${record.type}-${record.id}`} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">{getBehaviourIcon(record.behaviour_status)}</div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 text-lg">Activity & Behaviour</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getLevelColor(record.activity_level)}`}>
                                                {record.activity_level || "Medium"}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                            {record.walking_time && (
                                                <span className="flex items-center gap-1.5">
                                                    <Footprints className="h-3.5 w-3.5" /> Walk: {record.walking_time}
                                                </span>
                                            )}
                                            {record.resting_time && (
                                                <span className="flex items-center gap-1.5">
                                                    <Moon className="h-3.5 w-3.5" /> Rest: {record.resting_time}
                                                </span>
                                            )}
                                            {record.behaviour_status && (
                                                <span className="flex items-center gap-1.5">
                                                    <Brain className="h-3.5 w-3.5" /> {record.behaviour_status}
                                                </span>
                                            )}
                                        </div>
                                        {record.notes && (
                                            <p className="text-sm text-gray-600 mt-2 flex items-start gap-1.5">
                                                <StickyNote className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {record.notes}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {record.date || record.created_at}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDeleteId(record.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Activity Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Log Activity</h2>
                            <p className="text-sm text-gray-500 mt-1">Record your pet's activity & behaviour</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Pet</label>
                                <select
                                    value={form.pet_id}
                                    onChange={(e) => setForm({ ...form, pet_id: e.target.value })}
                                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:border-orange-400 focus:ring-orange-400 focus:outline-none"
                                >
                                    <option value="">Select pet (optional)</option>
                                    {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Activity Level</label>
                                    <select
                                        value={form.activity_level}
                                        onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
                                        className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:border-orange-400 focus:ring-orange-400 focus:outline-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Behaviour</label>
                                    <select
                                        value={form.behaviour_status}
                                        onChange={(e) => setForm({ ...form, behaviour_status: e.target.value })}
                                        className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:border-orange-400 focus:ring-orange-400 focus:outline-none"
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="Excited">Excited</option>
                                        <option value="Calm">Calm</option>
                                        <option value="Anxious">Anxious</option>
                                        <option value="Aggressive">Aggressive</option>
                                        <option value="Lethargic">Lethargic</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Walking Time</label>
                                    <Input
                                        placeholder="e.g., 30 mins"
                                        value={form.walking_time}
                                        onChange={(e) => setForm({ ...form, walking_time: e.target.value })}
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Resting Time</label>
                                    <Input
                                        placeholder="e.g., 2 hours"
                                        value={form.resting_time}
                                        onChange={(e) => setForm({ ...form, resting_time: e.target.value })}
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Date</label>
                                <Input
                                    type="date"
                                    value={form.record_date}
                                    onChange={(e) => setForm({ ...form, record_date: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Notes</label>
                                <textarea
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    rows={3}
                                    placeholder="Any observations..."
                                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-400 focus:ring-orange-400 focus:outline-none resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
                                <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl font-bold shadow-lg">Save Activity</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 p-8 text-center">
                        <div className="bg-red-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="h-7 w-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Activity?</h3>
                        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={() => handleDelete(deleteId)} className="flex-1 h-11 bg-red-600 hover:bg-red-700 rounded-xl font-bold">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default ActivityPage
