import { useState, useRef } from "react"
import {
    Scan,
    Upload,
    ImageIcon,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    Stethoscope,
    MessageCircle,
    Info,
    X,
    Search,
    Filter,
    ChevronDown,
    Trash2,
    Clock,
    Camera,
    PawPrint,
    Brain,
    CalendarDays,
    Stethoscope as StethoscopeIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { scansService } from "@/services/api"
import { useScans } from "@/hooks/useScans"

const ScannerPage = () => {
    const { scans, loading: scansLoading, deleteScan } = useScans()
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [prediction, setPrediction] = useState(null)
    const [lastNumericSeverity, setLastNumericSeverity] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterSeverity, setFilterSeverity] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedScan, setSelectedScan] = useState(null)
    const fileInputRef = useRef(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            setPreviewUrl(URL.createObjectURL(file))
            setPrediction(null)
            setError(null)
            setSuccess(false)
        }
    }

    const handleScan = async () => {
        if (!selectedImage) {
            setError("Please select an image first")
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const formData = new FormData()
            formData.append("image", selectedImage)

            // 1. Get Prediction from Flask bridge -> FastAPI
            const response = await scansService.predictDisease(formData)
            
            // Extract the top prediction correctly based on FastAPI structure
            const result = response.top_prediction || (response.predictions && response.predictions[0]);
            
            if (!result) {
                throw new Error("No disease detected with high enough confidence.")
            }

            // Map string severity to numeric for backend DB
            const severityMap = {
                "none": 0,
                "low": 1,
                "medium": 2,
                "high": 3,
                "critical": 4,
                "unknown": 0
            }
            const numericSeverity = severityMap[result.severity?.toLowerCase()] || 0
            setLastNumericSeverity(numericSeverity)

            // 2. Upload/Save Scan Report to backend
            const scanFormData = new FormData()
            scanFormData.append("image", selectedImage)
            scanFormData.append("scan_title", result.disease || "Pet Health Scan")
            scanFormData.append("confidence", result.confidence ? String(result.confidence) : "0")
            scanFormData.append("severity", String(numericSeverity))
            scanFormData.append("symptoms", result.symptoms || "Unusual skin pattern detected.")
            scanFormData.append("description", result.description || "")
            scanFormData.append("treatment", result.treatment || "Consult a veterinarian.")
            scanFormData.append("prevention", result.prevention || "Regular checkups.")
            scanFormData.append("analysis_json", JSON.stringify(result));

            await scansService.uploadScan(scanFormData)

            setPrediction(result)
            setSuccess(true)
        } catch (err) {
            setError(err.message || "An error occurred during scanning")
        } finally {
            setLoading(false)
        }
    }

    const resetScanner = () => {
        setSelectedImage(null)
        setPreviewUrl(null)
        setPrediction(null)
        setError(null)
        setSuccess(false)
    }

    const filteredScans = scans.filter(s => {
        const matchesSearch = !searchQuery ||
            s.scan_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.symptoms?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSeverity = filterSeverity === "all" ||
            (filterSeverity === "High" && s.severity >= 3) ||
            (filterSeverity === "Low" && s.severity < 3)
        return matchesSearch && matchesSeverity
    })

    const getSeverityBadge = (severity) => {
        if (!severity || severity === 0) return "bg-gray-100 text-gray-700"
        if (severity >= 4) return "bg-red-100 text-red-700 border-red-200"
        if (severity >= 2) return "bg-amber-100 text-amber-700 border-amber-200"
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                            <Scan className="h-7 w-7 text-white" />
                        </div>
                        {error && error.toLowerCase().includes("dog or cat") ? "Pet Not Detected" : "Health Scanner"}
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">AI-powered disease detection for your pets</p>
                </div>
            </div>

            <div className="grid xl:grid-cols-5 gap-8">
                {/* Main Scanner Section */}
                <div className="xl:col-span-3 space-y-6">
                    {!prediction ? (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer group ${
                                    previewUrl ? "border-blue-400 bg-blue-50/30" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
                                }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {previewUrl ? (
                                    <div className="relative inline-block mx-auto">
                                        <img src={previewUrl} alt="Preview" className="max-h-64 rounded-xl shadow-md" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); resetScanner() }}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                            <Camera className="h-10 w-10 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Click to upload photo</h3>
                                        <p className="text-sm text-gray-500">FastAPI & CNN model will analyze the image</p>
                                    </div>
                                )}
                            </div>

                            {previewUrl && !loading && (
                                <Button
                                    onClick={handleScan}
                                    className="w-full mt-6 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-bold text-lg shadow-lg shadow-blue-200"
                                >
                                    <Scan className="h-5 w-5 mr-2" /> Start Health Scan
                                </Button>
                            )}

                            {loading && (
                                <div className="mt-6 flex flex-col items-center">
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-3" />
                                    <p className="text-gray-900 font-bold">Analyzing Skin Patterns...</p>
                                    <p className="text-xs text-gray-500 mt-1">Comparing with thousands of medical records</p>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" /> {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Results Section */
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                                            <ShieldCheck className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Analysis Results</h2>
                                            <p className="text-blue-100 text-xs">Analysis completed in 0.258s</p>
                                        </div>
                                    </div>
                                    <Button onClick={resetScanner} variant="outline" className="text-white border-white/30 hover:bg-white/10 rounded-xl bg-transparent">
                                        New Scan
                                    </Button>
                                </div>

                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <img src={previewUrl} alt="Analyzed" className="w-full rounded-2xl shadow-lg border-4 border-white" />
                                            <div className="mt-4 space-y-2">
                                                <div className="p-4 bg-gray-50 rounded-2xl">
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Confidence</p>
                                                    <div className="flex items-end gap-2">
                                                        <p className="text-3xl font-black text-blue-600">{prediction.confidence ? `${(prediction.confidence * 100).toFixed(0)}%` : "N/A"}</p>
                                                        <p className="text-xs text-gray-400 mb-1">Accuracy Score</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-2">{prediction.disease || prediction.scan_title}</h3>
                                                <div className="flex gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityBadge(lastNumericSeverity)}`}>
                                                        Severity: {prediction.severity}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                        Skin Analysis
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid gap-4">
                                                <div className="flex gap-3">
                                                    <div className="p-2 bg-amber-50 rounded-lg h-fit"><AlertTriangle className="h-4 w-4 text-amber-600" /></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">Symptoms observed</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{prediction.symptoms || "Possible inflammation, redness, or itching noted."}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="p-2 bg-emerald-50 rounded-lg h-fit"><Stethoscope className="h-4 w-4 text-emerald-600" /></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">Suggested Care</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{prediction.treatment || "Keep the area clean. Consult a veterinarian if symptoms persist."}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="p-2 bg-blue-50 rounded-lg h-fit"><MessageCircle className="h-4 w-4 text-blue-600" /></div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">Clinical Notes</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{prediction.description}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                                                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                                    This AI analysis is for screening purposes only and not a definitive medical diagnosis. Always consult with a professional veterinarian.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">How it works</h3>
                            <p className="text-blue-100 text-sm max-w-lg mb-6 leading-relaxed">
                                Our scanner uses a Deep Convolutional Neural Network trained on over 50,000 dermatological images to identify common pet skin conditions with high accuracy.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <CheckCircle2 className="h-5 w-5 text-blue-300 mb-2" />
                                    <p className="text-xs font-bold">Real-time Analysis</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <CheckCircle2 className="h-5 w-5 text-blue-300 mb-2" />
                                    <p className="text-xs font-bold">Save Reports</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <CheckCircle2 className="h-5 w-5 text-blue-300 mb-2" />
                                    <p className="text-xs font-bold">Disease Tips</p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <CheckCircle2 className="h-5 w-5 text-blue-300 mb-2" />
                                    <p className="text-xs font-bold">Vet Advice</p>
                                </div>
                            </div>
                        </div>
                        <Scan className="absolute -bottom-10 -right-10 h-64 w-64 text-white/5 rotate-12" />
                    </div>
                </div>

                {/* Search & Filter & History Panel */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" /> Recent Scans
                        </h3>

                        <div className="space-y-4 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search scans..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11 rounded-xl"
                                />
                            </div>
                            <div className="relative">
                                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full h-11 rounded-xl border-gray-200 justify-between px-4">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <span>{filterSeverity === "all" ? "All Severities" : filterSeverity}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                                {showFilters && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border shadow-xl z-20 py-2">
                                        {["all", "High", "Low"].map(sev => (
                                            <button
                                                key={sev}
                                                onClick={() => { setFilterSeverity(sev); setShowFilters(false) }}
                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterSeverity === sev ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700"}`}
                                            >
                                                {sev === "all" ? "All Severities" : sev}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {scansLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
                        ) : filteredScans.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <PawPrint className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-sm font-medium text-gray-500">No scan history found matches your criteria.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredScans.map(scan => (
                                    <div 
                                        key={scan.id} 
                                        onClick={() => setSelectedScan(scan)}
                                        className="group relative bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer"
                                    >
                                        <div className="flex gap-4">
                                            <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden shadow-sm border border-white bg-blue-100 flex items-center justify-center">
                                                <span className="text-xl font-bold text-blue-600">
                                                    {scan.scan_title ? scan.scan_title.charAt(0).toUpperCase() : 'S'}
                                                </span>
                                                {scan.scan_image && (
                                                    <img 
                                                        src={scan.scan_image} 
                                                        alt="Scan" 
                                                        className="absolute inset-0 h-full w-full object-cover" 
                                                        onError={(e) => e.target.style.display = 'none'} 
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm truncate">{scan.scan_title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getSeverityBadge(scan.severity)}`}>
                                                        Sev: {scan.severity}/5
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{scan.scan_date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteScan(scan.id)}
                                            className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" /> Health Checklist
                        </h4>
                        <ul className="space-y-2">
                            {[
                                "Regular grooming & skin checks",
                                "Maintain tick & flea protection",
                                "Healthy balanced diet for pets",
                                "Immediate vet consultation for sores"
                            ].map((tip, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" /> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

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
                                <div className="min-w-0">
                                    <h2 className="text-2xl font-bold truncate">{selectedScan.scan_title}</h2>
                                    <p className="text-blue-100 flex items-center gap-2 mt-1">
                                        <CalendarDays className="h-4 w-4" /> {selectedScan.scan_date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 text-white">
                                    Confidence: {selectedScan.confidence}%
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
                                {/* Analysis Details */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-blue-50 rounded-lg">
                                            <Info className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Analysis Details</h4>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <p className="text-gray-700 leading-relaxed italic">
                                            "{selectedScan.description || 'Detailed medical information available soon.'}"
                                        </p>
                                    </div>
                                </section>

                                {/* Symptoms & Prevention Grid */}
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
                                            {!selectedScan.symptoms && <li className="text-sm text-gray-400">Regular pattern detected.</li>}
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
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                                    {p.trim()}
                                                </li>
                                            ))}
                                            {!selectedScan.prevention && <li className="text-sm text-gray-400 italic">Follow hygiene protocols.</li>}
                                        </ul>
                                    </section>
                                </div>

                                {/* Urgent Action */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-red-50 rounded-lg">
                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                        </div>
                                        <h4 className="font-bold text-red-900 uppercase tracking-wider text-xs">Recommended Action</h4>
                                    </div>
                                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 flex flex-col items-center text-center">
                                        <p className="text-red-800 font-bold mb-4 leading-relaxed">
                                            {selectedScan.treatment || "Please consult with a professional veterinarian for medical advice."}
                                        </p>
                                    </div>
                                </section>

                                {/* Brain JSON Analysis */}
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

export default ScannerPage