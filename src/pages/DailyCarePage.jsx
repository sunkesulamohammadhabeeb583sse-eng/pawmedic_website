import { useState } from "react"
import {
    Heart,
    Plus,
    Loader2,
    Search,
    Filter,
    ChevronDown,
    X,
    Clock,
    Trash2,
    Droplets,
    Sparkles,
    Pill,
    UtensilsCrossed,
    CalendarDays,
    CheckCircle2,
    XCircle,
    TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { useRecords } from "@/hooks/useRecords"
import { usePets } from "@/hooks/usePets"
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend,
    Cell
} from 'recharts';

const DailyCarePage = () => {
    const { records, loading, error, addDailyCare, deleteRecord } = useRecords()
    const { pets } = usePets()
    const [showForm, setShowForm] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterDate, setFilterDate] = useState("")
    const [deleteId, setDeleteId] = useState(null)
    const [form, setForm] = useState({
        pet_id: "",
        feeding_time: "08:00 AM",
        water_given: false,
        cleaning_done: false,
        medicine_given: false,
        record_date: new Date().toISOString().split("T")[0]
    })

    const dailyCareRecords = records.filter(r => r.type === "daily_care")

    const filteredRecords = dailyCareRecords.filter(r => {
        const matchesSearch = !searchQuery ||
            r.feeding_time?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.date?.includes(searchQuery)
        const matchesDate = !filterDate || r.date === filterDate
        return matchesSearch && matchesDate
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addDailyCare(form)
            setShowForm(false)
            setForm({ pet_id: "", feeding_time: "08:00 AM", water_given: false, cleaning_done: false, medicine_given: false, record_date: new Date().toISOString().split("T")[0] })
        } catch { }
    }

    const handleDelete = async (id) => {
        try {
            await deleteRecord("daily-care", id)
            setDeleteId(null)
        } catch { }
    }

    const stats = {
        total: dailyCareRecords.length,
        waterGiven: dailyCareRecords.filter(r => r.water_given).length,
        medicineGiven: dailyCareRecords.filter(r => r.medicine_given).length,
        cleaningDone: dailyCareRecords.filter(r => r.cleaning_done).length,
    }

    const todayRecords = dailyCareRecords.filter(r => r.date === new Date().toISOString().split("T")[0])

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-200">
                            <Heart className="h-7 w-7 text-white" />
                        </div>
                        Daily Care
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Track feeding, water, cleaning, and medication</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-200 rounded-xl font-bold h-12 px-6">
                    <Plus className="h-5 w-5 mr-2" /> Log Care
                </Button>
            </div>

            {/* Today's Quick Summary */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-100 p-6 mb-8">
                <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-4">Today's Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <UtensilsCrossed className="h-6 w-6 text-red-500 mx-auto mb-2" />
                        <p className="text-xl font-extrabold text-gray-900">{todayRecords.length}</p>
                        <p className="text-xs text-gray-500 font-medium">Feedings</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-xl font-extrabold text-gray-900">{todayRecords.filter(r => r.water_given).length}</p>
                        <p className="text-xs text-gray-500 font-medium">Water</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <Sparkles className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        <p className="text-xl font-extrabold text-gray-900">{todayRecords.filter(r => r.cleaning_done).length}</p>
                        <p className="text-xs text-gray-500 font-medium">Cleaned</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <Pill className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-xl font-extrabold text-gray-900">{todayRecords.filter(r => r.medicine_given).length}</p>
                        <p className="text-xs text-gray-500 font-medium">Medicine</p>
                    </div>
                </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Activity Trend</h3>
                        <p className="text-sm text-gray-500 font-medium">Weekly care routine overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Water</span></div>
                        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Clean</span></div>
                        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-purple-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Med</span></div>
                    </div>
                </div>

                <div className="h-[250px] w-full">
                    {dailyCareRecords.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={(() => {
                                    const last7Days = [...Array(7)].map((_, i) => {
                                        const d = new Date();
                                        d.setDate(d.getDate() - (6 - i));
                                        return d.toISOString().split('T')[0];
                                    });
                                    
                                    return last7Days.map(date => {
                                        const dayRecords = dailyCareRecords.filter(r => r.date === date);
                                        return {
                                            date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
                                            water: dayRecords.filter(r => r.water_given).length,
                                            cleaning: dayRecords.filter(r => r.cleaning_done).length,
                                            medicine: dayRecords.filter(r => r.medicine_given).length,
                                        };
                                    });
                                })()}
                                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                                barGap={8}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ fontWeight: 800, fontSize: '12px', padding: '2px 0' }}
                                    labelStyle={{ fontWeight: 700, marginBottom: '4px', color: '#94a3b8' }}
                                />
                                <Bar dataKey="water" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="cleaning" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                                <Bar dataKey="medicine" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <TrendingUp className="h-10 w-10 text-gray-200 mb-2" />
                            <p className="text-sm text-gray-400">Log some activities to see trends</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search care logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-400 focus:ring-red-400"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                <Input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="h-11 rounded-xl border-gray-200 w-auto sm:w-44"
                    placeholder="Filter by date"
                />
                {filterDate && (
                    <Button variant="outline" onClick={() => setFilterDate("")} className="h-11 rounded-xl">
                        <X className="h-4 w-4 mr-1" /> Clear
                    </Button>
                )}
            </div>

            {/* Records List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-red-500 mb-4" />
                    <p className="text-gray-500 font-medium">Loading care logs...</p>
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-red-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="h-12 w-12 text-red-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Care Logs Found</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start logging your pet's daily care routine.</p>
                    <Button onClick={() => setShowForm(true)} className="bg-red-500 hover:bg-red-600 rounded-xl font-bold px-8 shadow-lg shadow-red-200">
                        <Plus className="h-5 w-5 mr-2" /> Log First Care
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRecords.map((record) => (
                        <div key={`dc-${record.id}`} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="font-bold text-gray-900 text-lg">Daily Care Log</h3>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <CalendarDays className="h-3 w-3" /> {record.date}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                                            <UtensilsCrossed className="h-4 w-4 text-amber-600" />
                                            <div>
                                                <p className="text-xs text-amber-600 font-bold">Feeding</p>
                                                <p className="text-sm text-gray-700 font-medium">{record.feeding_time || "—"}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 p-3 rounded-xl border ${record.water_given ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"}`}>
                                            <Droplets className={`h-4 w-4 ${record.water_given ? "text-blue-600" : "text-gray-400"}`} />
                                            <div>
                                                <p className={`text-xs font-bold ${record.water_given ? "text-blue-600" : "text-gray-400"}`}>Water</p>
                                                <p className="text-sm font-medium">{record.water_given ? <CheckCircle2 className="h-4 w-4 text-blue-600" /> : <XCircle className="h-4 w-4 text-gray-300" />}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 p-3 rounded-xl border ${record.cleaning_done ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}>
                                            <Sparkles className={`h-4 w-4 ${record.cleaning_done ? "text-emerald-600" : "text-gray-400"}`} />
                                            <div>
                                                <p className={`text-xs font-bold ${record.cleaning_done ? "text-emerald-600" : "text-gray-400"}`}>Cleaning</p>
                                                <p className="text-sm font-medium">{record.cleaning_done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-gray-300" />}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 p-3 rounded-xl border ${record.medicine_given ? "bg-purple-50 border-purple-100" : "bg-gray-50 border-gray-100"}`}>
                                            <Pill className={`h-4 w-4 ${record.medicine_given ? "text-purple-600" : "text-gray-400"}`} />
                                            <div>
                                                <p className={`text-xs font-bold ${record.medicine_given ? "text-purple-600" : "text-gray-400"}`}>Medicine</p>
                                                <p className="text-sm font-medium">{record.medicine_given ? <CheckCircle2 className="h-4 w-4 text-purple-600" /> : <XCircle className="h-4 w-4 text-gray-300" />}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDeleteId(record.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-4 shrink-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Daily Care Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Log Daily Care</h2>
                            <p className="text-sm text-gray-500 mt-1">Record your pet's care routine</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Pet</label>
                                <select
                                    value={form.pet_id}
                                    onChange={(e) => setForm({ ...form, pet_id: e.target.value })}
                                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:border-red-400 focus:ring-red-400 focus:outline-none"
                                >
                                    <option value="">Select pet (optional)</option>
                                    {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Feeding Time</label>
                                <Input
                                    value={form.feeding_time}
                                    onChange={(e) => setForm({ ...form, feeding_time: e.target.value })}
                                    placeholder="e.g., 08:00 AM"
                                    className="h-11 rounded-xl"
                                />
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
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700">Care Checklist</label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.water_given}
                                        onChange={(e) => setForm({ ...form, water_given: e.target.checked })}
                                        className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Droplets className="h-5 w-5 text-blue-500" />
                                    <span className="font-medium text-gray-700">Water Given</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.cleaning_done}
                                        onChange={(e) => setForm({ ...form, cleaning_done: e.target.checked })}
                                        className="w-5 h-5 rounded-lg border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <Sparkles className="h-5 w-5 text-emerald-500" />
                                    <span className="font-medium text-gray-700">Cleaning Done</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.medicine_given}
                                        onChange={(e) => setForm({ ...form, medicine_given: e.target.checked })}
                                        className="w-5 h-5 rounded-lg border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <Pill className="h-5 w-5 text-purple-500" />
                                    <span className="font-medium text-gray-700">Medicine Given</span>
                                </label>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
                                <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl font-bold shadow-lg">Save Log</Button>
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Care Log?</h3>
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

export default DailyCarePage
