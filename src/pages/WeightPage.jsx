import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import {
    Plus,
    X,
    Scale,
    Loader2,
    Trash2,
    TrendingUp,
    ChevronRight,
    Search,
    AlertCircle,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    PawPrint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { usePets } from "@/hooks/usePets"
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useWeights } from "@/hooks/useWeights"

const WeightPage = () => {
    const [searchParams] = useSearchParams()
    const petIdFromQuery = searchParams.get("petId")

    const { pets, loading: loadingPets } = usePets()
    const [selectedPet, setSelectedPet] = useState(null)
    const {
        weights,
        loading: loadingWeights,
        fetchWeights,
        addWeight,
        deleteWeight,
        error
    } = useWeights(selectedPet?.id)

    const [showAddModal, setShowAddModal] = useState(false)
    const [weightInput, setWeightInput] = useState("")
    const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0])

    useEffect(() => {
        if (pets.length > 0) {
            const pet = petIdFromQuery
                ? pets.find(p => p.id === parseInt(petIdFromQuery) || p.id === petIdFromQuery) || pets[0]
                : pets[0]
            setSelectedPet(pet)
        }
    }, [pets, petIdFromQuery])

    useEffect(() => {
        if (selectedPet) {
            fetchWeights(selectedPet.id)
        }
    }, [selectedPet, fetchWeights])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!weightInput) return
        try {
            await addWeight({
                weight: parseFloat(weightInput),
                date: dateInput
            })
            setShowAddModal(false)
            setWeightInput("")
            setDateInput(new Date().toISOString().split('T')[0])
        } catch (err) {
            console.error("Failed to save weight:", err)
        }
    }

    const handleDelete = async (weightId) => {
        try {
            await deleteWeight(weightId)
        } catch (err) {
            console.error("Failed to delete weight:", err)
        }
    }

    const getRecommendation = (type, currentWeight) => {
        if (type === "Dog") {
            return "Adult dogs typically should be weighed monthly."
        }
        return "Regular weight checks help monitor long-term health trends."
    }

    const getPetEmoji = (type) => {
        const typeMap = {
            "Dog": "🐕", "Cat": "🐈", "Bird": "🐦", "Rabbit": "🐰",
            "Hamster": "🐹", "Fish": "🐠", "Turtle": "🐢", "Horse": "🐴"
        }
        return typeMap[type] || "🐾"
    }

    const calculateChange = () => {
        if (weights.length < 2) return null
        const latest = parseFloat(weights[0].weight)
        const previous = parseFloat(weights[1].weight)
        const diff = latest - previous
        const percentChange = (diff / previous) * 100
        return {
            diff: diff.toFixed(1),
            percent: percentChange.toFixed(1),
            isIncrease: diff > 0
        }
    }

    const weightChange = calculateChange()

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Weight Tracker</h1>
                    <p className="text-gray-600 mt-1">Monitor growth and nutritional health</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-100 h-12 rounded-xl transition-all active:scale-95"
                    disabled={!selectedPet}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Entry
                </Button>
            </div>

            {/* Pet Quick Switcher */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-2 mb-8 overflow-x-auto no-scrollbar">
                {loadingPets ? (
                    <div className="flex items-center space-x-3 px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                        <span className="text-sm font-medium text-gray-500">Loading pet profiles...</span>
                    </div>
                ) : pets.length > 0 ? (
                    pets.map((pet) => (
                        <button
                            key={pet.id}
                            onClick={() => setSelectedPet(pet)}
                            className={`flex items-center space-x-3 px-5 py-2.5 rounded-xl transition-all ${selectedPet?.id === pet.id
                                    ? "bg-purple-500 text-white shadow-lg shadow-purple-100"
                                    : "text-gray-600 hover:bg-gray-50 bg-transparent"
                                }`}
                        >
                            <span className="text-xl">{getPetEmoji(pet.type)}</span>
                            <span className="font-bold whitespace-nowrap">{pet.name}</span>
                        </button>
                    ))
                ) : (
                    <div className="flex-1 text-center py-2 text-gray-400 text-sm italic">
                        No pets found.
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-5 w-5 mr-3" />
                    {error}
                </div>
            )}

            {selectedPet ? (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Insights & History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Card */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Health Insight</h2>
                                    <p className="text-sm text-gray-500 font-medium">Auto-generated based on recent logs</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-50 px-6 py-4 rounded-3xl border border-purple-100">
                                        <p className="text-[10px] uppercase font-bold text-purple-400 tracking-widest mb-1">Current Weight</p>
                                        <div className="flex items-end">
                                            <span className="text-3xl font-extrabold text-purple-600">{weights[0]?.weight || selectedPet.weight || "--"}</span>
                                            <span className="text-sm font-bold text-purple-400 ml-1 mb-1">KG</span>
                                        </div>
                                    </div>
                                    {weightChange && (
                                        <div className={`px-6 py-4 rounded-3xl border ${weightChange.isIncrease ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}>
                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Monthly Trend</p>
                                            <div className="flex items-center">
                                                {weightChange.isIncrease ? (
                                                    <ArrowUpRight className="h-5 w-5 text-amber-500 mr-1" />
                                                ) : (
                                                    <ArrowDownRight className="h-5 w-5 text-emerald-500 mr-1" />
                                                )}
                                                <span className={`text-xl font-bold ${weightChange.isIncrease ? "text-amber-600" : "text-emerald-600"}`}>
                                                    {weightChange.percent}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-600 flex items-start">
                                <TrendingUp className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                                <p className="text-sm leading-relaxed">
                                    {getRecommendation(selectedPet.type, weights[0]?.weight)} Consistency in measurement helps detect potential underlying health issues early.
                                </p>
                            </div>
                        </div>

                        {/* Weight Trend Chart */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Growth Trend</h2>
                                    <p className="text-sm text-gray-500 font-medium">Visualizing weight over time</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weight (KG)</span>
                                </div>
                            </div>

                            <div className="h-[300px] w-full">
                                {weights.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={[...weights].reverse().map(w => ({
                                                date: new Date(w.date || w.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                                                weight: parseFloat(w.weight)
                                            }))}
                                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
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
                                                contentStyle={{
                                                    borderRadius: '16px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                    padding: '12px'
                                                }}
                                                itemStyle={{ fontWeight: 800, color: '#6b21a8' }}
                                                labelStyle={{ fontWeight: 700, marginBottom: '4px', color: '#94a3b8' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="#a855f7"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorWeight)"
                                                animationDuration={1500}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <TrendingUp className="h-10 w-10 text-gray-200 mb-2" />
                                        <p className="text-sm text-gray-400">Need at least one log to show trend</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <h2 className="text-2xl font-bold text-gray-900">Historical Records</h2>
                            </div>
                            {loadingWeights ? (
                                <div className="p-20 flex flex-col items-center">
                                    <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
                                    <p className="text-gray-500 font-medium font-serif italic text-lg text-emerald-500">Wait a sec ...</p>
                                </div>
                            ) : weights.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-4 sm:px-8 py-5 text-left text-[10px] uppercase font-bold text-gray-400 tracking-widest">Date Reported</th>
                                                <th className="px-4 sm:px-8 py-5 text-left text-[10px] uppercase font-bold text-gray-400 tracking-widest">Measurement</th>
                                                <th className="px-4 sm:px-8 py-5 text-left text-[10px] uppercase font-bold text-gray-400 tracking-widest">Status</th>
                                                <th className="px-4 sm:px-8 py-5 text-right text-[10px] uppercase font-bold text-gray-400 tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {weights.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50/30 transition-colors group">
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 text-gray-300 mr-3" />
                                                            <span className="font-semibold text-gray-700">
                                                                {new Date(row.date || row.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <div className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
                                                            <span className="font-bold text-gray-900">{row.weight}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 ml-1">KG</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5">
                                                        <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold rounded-full border border-emerald-100">
                                                            Logged
                                                        </span>
                                                    </td>
                                                    <td className="px-4 sm:px-8 py-5 text-right">
                                                        <button
                                                            onClick={() => handleDelete(row.id)}
                                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <Scale className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No weight logs found for this profile.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Sidebar :P */}
                    <div className="space-y-8">
                        {/* Target Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-purple-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 -mr-10 -mt-10 rounded-full blur-2xl" />
                            <h3 className="text-xl font-bold mb-6 relative z-10">Target Tracking</h3>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-purple-200 mb-2">
                                        <span>Progress</span>
                                        <span>75%</span>
                                    </div>
                                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                        <p className="text-[10px] uppercase font-bold text-purple-200 mb-1">Start</p>
                                        <p className="text-xl font-bold">{weights[weights.length - 1]?.weight || "--"} <span className="text-xs">kg</span></p>
                                    </div>
                                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                        <p className="text-[10px] uppercase font-bold text-purple-200 mb-1">Goal</p>
                                        <p className="text-xl font-bold">-- <span className="text-xs">kg</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tip Card */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Pro Tip</h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                Weigh your pet at the same time of day (preferably before breakfast) for the most accurate tracking of weight trends.
                            </p>
                            <Button variant="outline" className="w-full rounded-xl border-gray-200 h-11 text-xs font-bold uppercase tracking-widest text-gray-500">
                                Nutrition Guide
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                    <PawPrint className="h-20 w-20 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900">Select a pet</h3>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-8">
                            <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
                                <Scale className="h-8 w-8 text-purple-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">New Weigh-in</h2>
                            <p className="text-sm text-gray-500 mt-1">Recording current mass for {selectedPet?.name}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={weightInput}
                                    onChange={(e) => setWeightInput(e.target.value)}
                                    placeholder="00.0"
                                    className="h-20 text-center text-4xl font-extrabold rounded-3xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-purple-500/20 transition-all no-spinner"
                                    required
                                    autoFocus
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-black text-gray-300 pointer-events-none">KG</div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Observation Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                                    <Input
                                        type="date"
                                        value={dateInput}
                                        onChange={(e) => setDateInput(e.target.value)}
                                        className="h-12 pl-12 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-14 rounded-2xl bg-purple-500 hover:bg-purple-600 shadow-xl shadow-purple-100 font-extrabold text-lg"
                                >
                                    Save Log
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default WeightPage
