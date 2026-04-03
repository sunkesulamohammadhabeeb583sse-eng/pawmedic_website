import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import {
    Plus,
    X,
    Syringe,
    Loader2,
    Trash2,
    Edit,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    ChevronDown,
    AlertCircle,
    PawPrint
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { usePets } from "@/hooks/usePets"
import { useVaccinations } from "@/hooks/useVaccinations"

const VaccinationsPage = () => {
    const [searchParams] = useSearchParams()
    const petIdFromQuery = searchParams.get("petId")

    const { pets, loading: loadingPets } = usePets()
    const [selectedPet, setSelectedPet] = useState(null)
    const {
        vaccinations,
        loading: loadingVaccinations,
        fetchVaccinations,
        addVaccination,
        updateVaccination,
        deleteVaccination,
        error
    } = useVaccinations(selectedPet?.id)

    const [showAddModal, setShowAddModal] = useState(false)
    const [editingVaccination, setEditingVaccination] = useState(null)
    const [deletingVaccination, setDeletingVaccination] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        next_due_date: "",
        veterinarian: "",
        clinic: "",
        batch_number: "",
        notes: "",
        status: "completed"
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [showFilters, setShowFilters] = useState(false)

    const filteredVaccinations = vaccinations.filter(v => {
        const matchesSearch = !searchQuery ||
            v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.veterinarian?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === "all" || v.status === filterStatus
        return matchesSearch && matchesStatus
    })

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
            fetchVaccinations(selectedPet.id)
        }
    }, [selectedPet, fetchVaccinations])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingVaccination) {
                await updateVaccination(editingVaccination.id, formData)
            } else {
                await addVaccination(formData)
            }
            setShowAddModal(false)
            setEditingVaccination(null)
            resetForm()
        } catch (err) {
            console.error("Failed to save vaccination:", err)
        }
    }

    const handleDelete = async () => {
        if (!deletingVaccination) return
        try {
            await deleteVaccination(deletingVaccination.id)
            setDeletingVaccination(null)
        } catch (err) {
            console.error("Failed to delete vaccination:", err)
        }
    }

    const openEditModal = (vaccination) => {
        setEditingVaccination(vaccination)
        setFormData({
            name: vaccination.name || "",
            date: vaccination.date || "",
            next_due_date: vaccination.next_due_date || "",
            veterinarian: vaccination.veterinarian || "",
            clinic: vaccination.clinic || "",
            batch_number: vaccination.batch_number || "",
            notes: vaccination.notes || "",
            status: vaccination.status || "completed"
        })
        setShowAddModal(true)
    }

    const resetForm = () => {
        setFormData({
            name: "",
            date: "",
            next_due_date: "",
            veterinarian: "",
            clinic: "",
            batch_number: "",
            notes: "",
            status: "completed"
        })
    }

    const isVaccinationDue = (nextDueDate) => {
        if (!nextDueDate) return false
        const dueDate = new Date(nextDueDate)
        const today = new Date()
        const diffTime = dueDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays <= 30
    }

    const isVaccinationOverdue = (nextDueDate) => {
        if (!nextDueDate) return false
        const dueDate = new Date(nextDueDate)
        const today = new Date()
        return dueDate < today
    }

    const getPetEmoji = (type) => {
        const typeMap = {
            "Dog": "🐕", "Cat": "🐈", "Bird": "🐦", "Rabbit": "🐰",
            "Hamster": "🐹", "Fish": "🐠", "Turtle": "🐢", "Horse": "🐴"
        }
        return typeMap[type] || "🐾"
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vaccinations</h1>
                    <p className="text-gray-600 mt-1">Keep track of medical immunization history</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setEditingVaccination(null); setShowAddModal(true) }}
                    className="bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-100 h-10 rounded-xl transition-all active:scale-95"
                    disabled={!selectedPet}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Record New Dose
                </Button>
            </div>

            {/* Pet Quick Switcher */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-2 mb-8 overflow-x-auto no-scrollbar">
                {loadingPets ? (
                    <div className="flex items-center space-x-3 px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                        <span className="text-sm font-medium text-gray-500">Loading pet profiles...</span>
                    </div>
                ) : pets.length > 0 ? (
                    pets.map((pet) => (
                        <button
                            key={pet.id}
                            onClick={() => setSelectedPet(pet)}
                            className={`flex items-center space-x-3 px-5 py-2.5 rounded-xl transition-all ${selectedPet?.id === pet.id
                                ? "bg-teal-500 text-white shadow-lg shadow-teal-100"
                                : "text-gray-600 hover:bg-gray-50 bg-transparent font-medium"
                                }`}
                        >
                            <span className="text-xl">{getPetEmoji(pet.type)}</span>
                            <span className="font-bold whitespace-nowrap">{pet.name}</span>
                        </button>
                    ))
                ) : (
                    <div className="flex-1 text-center py-2 text-gray-400 text-sm italic">
                        No pets found to track vaccinations.
                    </div>
                )}
            </div>

            {/* Search & Filters */}
            {selectedPet && (
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by vaccine or vet..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200"
                        />
                    </div>
                    <div className="relative">
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 rounded-xl border-gray-200 px-6 justify-between min-w-[150px]">
                            <Filter className="h-4 w-4 mr-2" />
                            {filterStatus === "all" ? "All Status" : filterStatus}
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border shadow-xl z-20 py-2 min-w-[160px]">
                                {["all", "completed", "scheduled", "overdue"].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setShowFilters(false) }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors capitalize ${filterStatus === status ? "text-teal-600 font-bold bg-teal-50" : "text-gray-700"}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center shadow-sm">
                    <AlertCircle className="h-5 w-5 mr-3" />
                    <span className="font-semibold">{error}</span>
                </div>
            )}

            {selectedPet ? (
                loadingVaccinations ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-teal-500 mb-4" />
                        <p className="text-gray-500 font-medium font-serif">Retrieving records for {selectedPet.name}...</p>
                    </div>
                ) : filteredVaccinations.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredVaccinations.map((vaccination) => (
                            <div key={vaccination.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
                                <div className={`absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 opacity-5 rounded-full ${isVaccinationOverdue(vaccination.next_due_date) ? "bg-red-500" : "bg-teal-500"
                                    }`} />

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-start space-x-5">
                                        <div className={`p-4 rounded-2xl shadow-sm ${isVaccinationOverdue(vaccination.next_due_date)
                                            ? "bg-red-50 text-red-600"
                                            : "bg-teal-50 text-teal-600"
                                            }`}>
                                            <Syringe className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-900 leading-tight">
                                                {vaccination.name}
                                            </h3>
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-50/50 p-2 rounded-lg">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    Administered: <span className="text-gray-900 ml-1">
                                                        {new Date(vaccination.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                    </span>
                                                </div>

                                                {vaccination.next_due_date && (
                                                    <div className={`flex items-center text-sm font-bold p-2 rounded-lg shadow-sm border ${isVaccinationOverdue(vaccination.next_due_date)
                                                        ? "bg-red-50 text-red-600 border-red-100" :
                                                        isVaccinationDue(vaccination.next_due_date)
                                                            ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                            "bg-teal-50/30 text-teal-700 border-teal-50"
                                                        }`}>
                                                        <AlertCircle className="h-4 w-4 mr-2" />
                                                        Next Due: {new Date(vaccination.next_due_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                        {isVaccinationOverdue(vaccination.next_due_date) && <span className="ml-auto text-[10px] uppercase">Overdue</span>}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Veterinarian</p>
                                                        <p className="text-sm font-bold text-gray-800">{vaccination.veterinarian || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Clinic</p>
                                                        <p className="text-sm font-bold text-gray-800 truncate" title={vaccination.clinic}>{vaccination.clinic || "—"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(vaccination)}
                                            className="p-2.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all shadow-sm bg-white border border-gray-100"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeletingVaccination(vaccination)}
                                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-gray-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                {(vaccination.notes || vaccination.batch_number) && (
                                    <div className="mt-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500/20" />
                                        {vaccination.batch_number && (
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Batch: {vaccination.batch_number}</p>
                                        )}
                                        {vaccination.notes && (
                                            <p className="text-sm text-gray-600 italic leading-relaxed">"{vaccination.notes}"</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-inner">
                        <div className="bg-teal-50 h-20 w-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-12">
                            <Syringe className="h-10 w-10 text-teal-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Immunity records are empty</h3>
                        <p className="text-gray-600 mb-8 max-w-sm mx-auto">Track {selectedPet.name}'s vaccinations to ensure they are protected from local diseases and seasonal illnesses.</p>
                        <Button
                            onClick={() => { resetForm(); setEditingVaccination(null); setShowAddModal(true) }}
                            className="bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-100 px-8 h-12 rounded-xl transition-all active:scale-95 font-bold"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Log First Dose
                        </Button>
                    </div>
                )
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="bg-gray-50 h-24 w-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <PawPrint className="h-12 w-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a pet profile</h3>
                    <p className="text-gray-600 max-w-xs mx-auto font-medium">Choose a pet from the switcher above to manage their specific vaccination logs.</p>
                </div>
            )}

            {/* Modals */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/20">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-emerald-50/30">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {editingVaccination ? "Edit Entry" : "New Vaccination"}
                                </h2>
                                <p className="text-xs text-emerald-600 font-black uppercase tracking-[0.2em] mt-1">{selectedPet?.name}'s Medical Record</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-3 bg-white text-gray-400 hover:text-gray-900 rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-90"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-1 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vaccine Name <span className="text-red-500">*</span></label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Rabies, Parvovirus"
                                    className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Date <span className="text-red-500">*</span></label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Next Due (Optional)</label>
                                    <Input
                                        type="date"
                                        value={formData.next_due_date}
                                        onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                                        className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Veterinarian</label>
                                    <Input
                                        value={formData.veterinarian}
                                        onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                                        placeholder="Dr. Gregory"
                                        className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinic Name</label>
                                    <Input
                                        value={formData.clinic}
                                        onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                                        placeholder="Central Vet Clinic"
                                        className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Batch / Lot Number</label>
                                <Input
                                    value={formData.batch_number}
                                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                                    placeholder="LOT #123X45"
                                    className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white font-bold text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Observation Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Any mild reactions, special instructions, etc..."
                                    rows={3}
                                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all resize-none font-medium text-sm"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl border-gray-200 text-gray-500 font-bold hover:bg-gray-50"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-14 rounded-2xl bg-teal-500 hover:bg-teal-600 shadow-xl shadow-teal-100 font-black text-lg text-white"
                                >
                                    {editingVaccination ? "Update Log" : "Commit Record"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deletingVaccination && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setDeletingVaccination(null)}></div>
                    <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full animate-in zoom-in-95 duration-200 text-center">
                        <div className="h-20 w-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                            <Trash2 className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Erase Record?</h3>
                        <p className="text-gray-500 font-medium mb-8">This medical entry will be permanently removed from {selectedPet?.name}'s history.</p>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 h-14 rounded-2xl font-black text-lg shadow-xl shadow-red-100"
                            >
                                Confirm Delete
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setDeletingVaccination(null)}
                                className="h-12 rounded-xl border-gray-100 text-gray-400 font-bold"
                            >
                                Nevermind
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default VaccinationsPage
