import { useState, useMemo } from "react"
import {
    Bell,
    Calendar,
    Search,
    Filter,
    ChevronDown,
    X,
    Syringe,
    Clock,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    Plus,
    Loader2,
    PawPrint
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { usePets } from "@/hooks/usePets"
import { useVaccinations } from "@/hooks/useVaccinations"
import { useEffect } from "react"
import { vaccinationsService } from "@/services/api"

const RemindersPage = () => {
    const { pets, loading: petsLoading } = usePets()
    const [allVaccinations, setAllVaccinations] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    // Fetch vaccinations for all pets
    useEffect(() => {
        const fetchAll = async () => {
            if (pets.length === 0) return
            setLoading(true)
            try {
                const results = await Promise.all(
                    pets.map(async (pet) => {
                        try {
                            const res = await vaccinationsService.getVaccinations(pet.id)
                            return (res.data || []).map(v => ({ ...v, pet_name: v.pet_name || pet.name }))
                        } catch { return [] }
                    })
                )
                setAllVaccinations(results.flat())
            } catch (err) {
                console.error(err)
            }
            setLoading(false)
        }
        fetchAll()
    }, [pets])

    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    // Compute reminders
    const reminders = useMemo(() => {
        const items = []

        allVaccinations.forEach(v => {
            if (v.status === "upcoming") {
                const vaccDate = new Date(v.date)
                const diffDays = Math.ceil((vaccDate - today) / (1000 * 60 * 60 * 24))
                items.push({
                    ...v,
                    reminder_type: "vaccination",
                    priority: diffDays <= 0 ? "overdue" : diffDays <= 3 ? "urgent" : diffDays <= 7 ? "soon" : "upcoming",
                    days_remaining: diffDays,
                    reminder_text: diffDays <= 0 ? `Overdue by ${Math.abs(diffDays)} days` : diffDays === 0 ? "Due today!" : diffDays === 1 ? "Due tomorrow" : `Due in ${diffDays} days`
                })
            }
            if (v.next_due_date) {
                const nextDate = new Date(v.next_due_date)
                const diffDays = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24))
                if (diffDays > 0 && diffDays <= 30) {
                    items.push({
                        ...v,
                        id: `next-${v.id}`,
                        date: v.next_due_date,
                        reminder_type: "next_dose",
                        priority: diffDays <= 3 ? "urgent" : diffDays <= 7 ? "soon" : "upcoming",
                        days_remaining: diffDays,
                        reminder_text: diffDays === 1 ? "Next dose tomorrow" : `Next dose in ${diffDays} days`
                    })
                }
            }
        })

        return items.sort((a, b) => a.days_remaining - b.days_remaining)
    }, [allVaccinations])

    const filteredReminders = reminders.filter(r => {
        const matchesSearch = !searchQuery ||
            r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.pet_name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterStatus === "all" || r.priority === filterStatus
        return matchesSearch && matchesFilter
    })

    const getPriorityConfig = (priority) => {
        const configs = {
            "overdue": { color: "text-red-700", bg: "bg-red-100", border: "border-red-200", dot: "bg-red-500", label: "Overdue" },
            "urgent": { color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-200", dot: "bg-amber-500", label: "Urgent" },
            "soon": { color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200", dot: "bg-blue-500", label: "Soon" },
            "upcoming": { color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", dot: "bg-emerald-500", label: "Upcoming" },
        }
        return configs[priority] || configs.upcoming
    }

    // Calendar data
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const calendarDays = []
    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

    const getDayReminders = (day) => {
        if (!day) return []
        const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return reminders.filter(r => r.date === dateStr)
    }

    const stats = {
        overdue: reminders.filter(r => r.priority === "overdue").length,
        urgent: reminders.filter(r => r.priority === "urgent").length,
        upcoming: reminders.filter(r => r.priority === "upcoming" || r.priority === "soon").length,
        total: reminders.length
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-200">
                            <Bell className="h-7 w-7 text-white" />
                        </div>
                        Reminders
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Stay on top of vaccinations and care schedules</p>
                </div>
            </div>

            {/* Alert Banner */}
            {stats.overdue > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-center gap-4 animate-in slide-in-from-top-2">
                    <div className="p-3 bg-red-100 rounded-xl">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-800">Attention Required</h3>
                        <p className="text-sm text-red-600">{stats.overdue} vaccination(s) are overdue. Please schedule them soon.</p>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.overdue}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Overdue</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.urgent}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Urgent</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.upcoming}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Upcoming</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.total}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Reminders List */}
                <div className="lg:col-span-2">
                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search reminders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 rounded-xl border-gray-200 focus:border-amber-400 focus:ring-amber-400"
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
                                {filterStatus === "all" ? "All" : getPriorityConfig(filterStatus).label}
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                            {showFilters && (
                                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border shadow-xl z-20 py-2 min-w-[160px]">
                                    {[
                                        { value: "all", label: "All" },
                                        { value: "overdue", label: "Overdue" },
                                        { value: "urgent", label: "Urgent" },
                                        { value: "soon", label: "Soon" },
                                        { value: "upcoming", label: "Upcoming" }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setFilterStatus(opt.value); setShowFilters(false) }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterStatus === opt.value ? "text-amber-600 font-bold bg-amber-50" : "text-gray-700"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {loading || petsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-4" />
                            <p className="text-gray-500 font-medium">Loading reminders...</p>
                        </div>
                    ) : filteredReminders.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-amber-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Bell className="h-12 w-12 text-amber-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Reminders</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">All caught up! No upcoming vaccinations or reminders.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredReminders.map((reminder, idx) => {
                                const config = getPriorityConfig(reminder.priority)
                                return (
                                    <div key={`${reminder.id}-${idx}`} className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-300 ${config.border}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${config.bg} shrink-0`}>
                                                <Syringe className={`h-5 w-5 ${config.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="font-bold text-gray-900">{reminder.name}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <PawPrint className="h-3.5 w-3.5" /> {reminder.pet_name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" /> {reminder.date}
                                                    </span>
                                                </div>
                                                <p className={`text-sm font-bold mt-2 ${config.color}`}>
                                                    {reminder.reminder_text}
                                                </p>
                                            </div>
                                            <div className={`h-2.5 w-2.5 rounded-full ${config.dot} shrink-0 mt-2 animate-pulse`} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => {
                            if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1) }
                            else setSelectedMonth(m => m - 1)
                        }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronRight className="h-4 w-4 rotate-180" />
                        </button>
                        <h3 className="font-bold text-gray-900">
                            {monthNames[selectedMonth]} {selectedYear}
                        </h3>
                        <button onClick={() => {
                            if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1) }
                            else setSelectedMonth(m => m + 1)
                        }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                            <div key={i} className="text-xs font-bold text-gray-400 py-2">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                            const dayReminders = getDayReminders(day)
                            const isToday = day && selectedMonth === today.getMonth() && selectedYear === today.getFullYear() && day === today.getDate()
                            return (
                                <div key={idx} className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
                                    !day ? "" :
                                    isToday ? "bg-amber-500 text-white font-bold" :
                                    dayReminders.length > 0 ? "bg-amber-50 font-bold text-amber-800 border border-amber-200" :
                                    "text-gray-600 hover:bg-gray-50"
                                } transition-colors`}>
                                    {day}
                                    {dayReminders.length > 0 && !isToday && (
                                        <div className="absolute bottom-0.5 flex gap-0.5">
                                            {dayReminders.slice(0, 3).map((r, i) => (
                                                <div key={i} className={`h-1 w-1 rounded-full ${getPriorityConfig(r.priority).dot}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6 pt-4 border-t space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Legend</p>
                        {["overdue", "urgent", "soon", "upcoming"].map(priority => {
                            const config = getPriorityConfig(priority)
                            return (
                                <div key={priority} className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                                    <span className="text-xs text-gray-600 font-medium">{config.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default RemindersPage
