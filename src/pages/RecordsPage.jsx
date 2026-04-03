import { useState } from "react"
import {
    FileText,
    Loader2,
    Search,
    Filter,
    ChevronDown,
    X,
    Clock,
    Activity,
    Heart,
    Scan,
    Trash2,
    Syringe,
    Droplets,
    Sparkles,
    Pill,
    Footprints,
    Brain,
    CalendarDays,
    BarChart3,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { useRecords } from "@/hooks/useRecords"
import { useScans } from "@/hooks/useScans"
import {
    Syringe as SyringeIcon,
    Stethoscope,
    AlertCircle,
    Info,
    ShieldCheck,
    Check
} from "lucide-react"

const RecordsPage = () => {
    const { records, loading: recordsLoading, deleteRecord } = useRecords()
    const { scans, loading: scansLoading } = useScans()
    const [activeTab, setActiveTab] = useState("logs") // "logs" or "scans"
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [deleteInfo, setDeleteInfo] = useState(null)
    const [selectedScan, setSelectedScan] = useState(null)

    const loading = recordsLoading || scansLoading

    // Separate records and scans
    const healthLogs = records.map(r => ({ ...r, source: "record" }))
        .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))

    const scanReports = scans.map(s => ({
        id: s.id,
        type: "scan",
        name: `${s.scan_title} Scan`,
        date: s.scan_date,
        scan_title: s.scan_title,
        confidence: s.confidence,
        severity: s.severity,
        symptoms: s.symptoms,
        description: s.description,
        treatment: s.treatment,
        prevention: s.prevention,
        analysis_json: s.analysis_json,
        created_at: s.created_at,
        source: "scan"
    })).sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))

    const currentRecords = activeTab === "logs" ? healthLogs : scanReports

    const filteredRecords = currentRecords.filter(r => {
        const matchesSearch = !searchQuery ||
            r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.scan_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.behaviour_status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesFilter = filterType === "all" || r.type === filterType
        return matchesSearch && matchesFilter
    })

    const handleDelete = async () => {
        if (!deleteInfo) return
        try {
            if (deleteInfo.source === "record") {
                const recordType = deleteInfo.type === "daily_care" ? "daily-care" : "activity"
                await deleteRecord(recordType, deleteInfo.id)
            }
            setDeleteInfo(null)
        } catch { }
    }

    const getTypeConfig = (type) => {
        const configs = {
            "daily_care": { icon: Heart, color: "text-red-600", bg: "bg-red-100", label: "Daily Care", badge: "bg-red-50 text-red-700 border-red-200" },
            "activity": { icon: Activity, color: "text-orange-600", bg: "bg-orange-100", label: "Activity", badge: "bg-orange-50 text-orange-700 border-orange-200" },
            "scan": { icon: Scan, color: "text-blue-600", bg: "bg-blue-100", label: "Scan Report", badge: "bg-blue-50 text-blue-700 border-blue-200" },
        }
        return configs[type] || { icon: FileText, color: "text-gray-600", bg: "bg-gray-100", label: "Record", badge: "bg-gray-50 text-gray-700 border-gray-200" }
    }

    const stats = {
        total: records.length + scans.length,
        scans: scans.length,
        dailyCare: records.filter(r => r.type === "daily_care").length,
        activities: records.filter(r => r.type === "activity").length,
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg shadow-pink-200">
                            <FileText className="h-7 w-7 text-white" />
                        </div>
                        Health Records
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your pet's health history and diagnostic reports</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-xl"><BarChart3 className="h-5 w-5 text-pink-600" /></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.total}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl"><Scan className="h-5 w-5 text-blue-600" /></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.scans}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Scans</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-xl"><Heart className="h-5 w-5 text-red-600" /></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.dailyCare}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Daily Care</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-xl"><Activity className="h-5 w-5 text-orange-600" /></div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stats.activities}</p>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Activities</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 w-fit">
                <button
                    onClick={() => { setActiveTab("logs"); setFilterType("all"); }}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "logs" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                >
                    <Activity className="h-4 w-4" />
                    Activity Logs
                </button>
                <button
                    onClick={() => { setActiveTab("scans"); setFilterType("all"); }}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "scans" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                >
                    <Scan className="h-4 w-4" />
                    Scan Reports
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={`Search ${activeTab === "logs" ? "health logs" : "scan reports"}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:border-pink-400 focus:ring-pink-400"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                {activeTab === "logs" && (
                    <div className="relative">
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-11 rounded-xl border-gray-200 font-medium px-4">
                            <Filter className="h-4 w-4 mr-2" />
                            {filterType === "all" ? "All Logs" : getTypeConfig(filterType).label}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border shadow-xl z-20 py-2 min-w-[180px]">
                                {[
                                    { value: "all", label: "All Logs" },
                                    { value: "daily_care", label: "Daily Care" },
                                    { value: "activity", label: "Activity" }
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setFilterType(opt.value); setShowFilters(false) }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterType === opt.value ? "text-pink-600 font-bold bg-pink-50" : "text-gray-700"}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Records List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-pink-500 mb-4" />
                    <p className="text-gray-500 font-medium">Loading {activeTab === "logs" ? "records" : "scans"}...</p>
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="text-center py-20">
                    <div className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 ${activeTab === "logs" ? "bg-pink-50" : "bg-blue-50"}`}>
                        {activeTab === "logs" ? <FileText className="h-12 w-12 text-pink-300" /> : <Scan className="h-12 w-12 text-blue-300" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No {activeTab === "logs" ? "Records" : "Scans"} Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        {activeTab === "logs" 
                            ? "Daily care logs and activity tracking will appear here." 
                            : "Diagnoses and scan results from the AI scanner will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredRecords.map((record, idx) => {
                        const config = getTypeConfig(record.type)
                        const TypeIcon = config.icon
                        return (
                            <div 
                                key={`${record.type}-${record.id}-${idx}`} 
                                onClick={() => record.type === "scan" && setSelectedScan(record)}
                                className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group ${record.type === "scan" ? "cursor-pointer" : ""}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${config.bg} shrink-0`}>
                                        <TypeIcon className={`h-5 w-5 ${config.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-bold text-gray-900">{record.name || record.scan_title || "Record"}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badge}`}>{config.label}</span>
                                        </div>

                                        {record.type === "scan" && (
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                {record.confidence && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">Confidence: {record.confidence}</span>}
                                                {record.severity > 0 && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${record.severity >= 3 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>Severity: {record.severity}/5</span>}
                                            </div>
                                        )}

                                        {record.type === "daily_care" && (
                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                {record.feeding_time && <span className="flex items-center gap-1 text-xs text-gray-500"><Droplets className="h-3 w-3" /> Fed: {record.feeding_time}</span>}
                                                {record.water_given && <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><Droplets className="h-3 w-3" /> Water ✓</span>}
                                                {record.cleaning_done && <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"><Sparkles className="h-3 w-3" /> Clean ✓</span>}
                                                {record.medicine_given && <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full"><Pill className="h-3 w-3" /> Medicine ✓</span>}
                                            </div>
                                        )}

                                        {record.type === "activity" && (
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                {record.activity_level && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${record.activity_level === "High" ? "bg-red-50 text-red-700" : record.activity_level === "Low" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{record.activity_level}</span>}
                                                {record.walking_time && <span className="flex items-center gap-1 text-xs"><Footprints className="h-3 w-3" /> {record.walking_time}</span>}
                                                {record.behaviour_status && <span className="flex items-center gap-1 text-xs"><Brain className="h-3 w-3" /> {record.behaviour_status}</span>}
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {record.date || record.created_at}
                                        </p>
                                    </div>
                                    {record.source === "record" && (
                                        <button
                                            onClick={() => setDeleteInfo(record)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteInfo(null)} />
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 p-8 text-center">
                        <div className="bg-red-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="h-7 w-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Record?</h3>
                        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteInfo(null)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={handleDelete} className="flex-1 h-11 bg-red-600 hover:bg-red-700 rounded-xl font-bold">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Scan Details Modal */}
            {selectedScan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedScan(null)} />
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                            <button 
                                onClick={() => setSelectedScan(null)}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Scan className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedScan.scan_title}</h2>
                                    <p className="text-blue-100 flex items-center gap-2 mt-1">
                                        <CalendarDays className="h-4 w-4" /> {selectedScan.date || selectedScan.created_at}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 text-white">
                                    Confidence: {selectedScan.confidence}
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                                    selectedScan.severity >= 3 ? "bg-red-500" : "bg-amber-500"
                                }`}>
                                    Severity: {selectedScan.severity}/5
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                {/* Description Section */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-blue-50 rounded-lg">
                                            <Info className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Analysis Details</h4>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-gray-700 leading-relaxed italic">
                                            "{selectedScan.description || 'No description available for this condition.'}"
                                        </p>
                                    </div>
                                </section>

                                {/* Symptoms & Treatment Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-amber-50 rounded-lg">
                                                <Stethoscope className="h-4 w-4 text-amber-600" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Symptoms</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {(selectedScan.symptoms || "").split(',').map((s, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                                                    {s.trim()}
                                                </li>
                                            ))}
                                            {!selectedScan.symptoms && <li className="text-sm text-gray-400">No specific symptoms recorded.</li>}
                                        </ul>
                                    </section>
                                    
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-emerald-50 rounded-lg">
                                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Prevention</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {(selectedScan.prevention || "").split('\n').map((p, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                                    {p.trim()}
                                                </li>
                                            ))}
                                            {!selectedScan.prevention && <li className="text-sm text-gray-400 italic">Follow standard hygiene practices.</li>}
                                        </ul>
                                    </section>
                                </div>

                                 {/* Urgent Care / Treatment */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-red-50 rounded-lg">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                        </div>
                                        <h4 className="font-bold text-red-900 uppercase tracking-wider text-xs">Recommended Action</h4>
                                    </div>
                                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 flex flex-col items-center text-center">
                                        <p className="text-red-800 font-bold mb-4 leading-relaxed">
                                            {selectedScan.treatment || "Please consult with a qualified veterinarian for professional diagnosis and treatment."}
                                        </p>
                                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-red-200">
                                            Find Nearby Clinics
                                        </Button>
                                    </div>
                                </section>

                                {/* Advanced JSON Analysis */}
                                {selectedScan.analysis_json && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-gray-100 rounded-lg">
                                                <Brain className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Advanced Model Insights</h4>
                                        </div>
                                        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-inner overflow-x-auto">
                                            <pre className="text-xs font-mono text-emerald-400">
                                                {typeof selectedScan.analysis_json === 'string' 
                                                    ? selectedScan.analysis_json 
                                                    : JSON.stringify(selectedScan.analysis_json, null, 2)}
                                            </pre>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50 border-t flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedScan(null)} className="rounded-xl px-8 h-11 font-bold text-gray-600">
                                Close Details
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}


export default RecordsPage
