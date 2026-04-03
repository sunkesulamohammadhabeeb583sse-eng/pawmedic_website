import { useState } from "react"
import { Link } from "react-router-dom"
import {
    PawPrint,
    Plus,
    Edit,
    Trash2,
    Scale,
    Syringe,
    Search,
    Filter,
    ChevronDown,
    Loader2,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/layout"
import { usePets } from "@/hooks/usePets"

const PetsPage = () => {
    const { pets, loading, error, addPet, updatePet, deletePet } = usePets()
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingPet, setEditingPet] = useState(null)
    const [deletingPet, setDeletingPet] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        type: "Dog",
        breed: "",
        age: "",
        dob: "",
        gender: "Male",
        weight: "",
        color: "",
        microchip_id: "",
        notes: ""
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [showFilters, setShowFilters] = useState(false)

    const filteredPets = pets.filter(pet => {
        const matchesSearch = !searchQuery ||
            pet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pet.breed?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === "all" || pet.type === filterType
        return matchesSearch && matchesType
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const petData = {
                ...formData,
                weight: formData.weight ? parseFloat(formData.weight) : null,
            }

            if (editingPet) {
                await updatePet(editingPet.id, petData)
            } else {
                await addPet(petData)
            }

            setShowAddModal(false)
            setEditingPet(null)
            resetForm()
        } catch (err) {
            console.error("Failed to save pet:", err)
        }
    }

    const handleDelete = async () => {
        if (!deletingPet) return
        try {
            await deletePet(deletingPet.id)
            setDeletingPet(null)
        } catch (err) {
            console.error("Failed to delete pet:", err)
        }
    }

    const openEditModal = (pet) => {
        setEditingPet(pet)
        setFormData({
            name: pet.name || "",
            type: pet.type || "Dog",
            breed: pet.breed || "",
            age: pet.age || "",
            dob: pet.dob || "",
            gender: pet.gender || "Male",
            weight: pet.weight?.toString() || "",
            color: pet.color || "",
            microchip_id: pet.microchip_id || "",
            notes: pet.notes || ""
        })
        setShowAddModal(true)
    }

    const resetForm = () => {
        setFormData({
            name: "",
            type: "Dog",
            breed: "",
            age: "",
            dob: "",
            gender: "Male",
            weight: "",
            color: "",
            microchip_id: "",
            notes: ""
        })
    }

    const getPetEmoji = (type) => {
        const typeMap = {
            "Dog": "🐕",
            "Cat": "🐈",
            "Bird": "🐦",
            "Rabbit": "🐰",
            "Hamster": "🐹",
            "Fish": "🐠",
            "Turtle": "🐢",
            "Horse": "🐴"
        }
        return typeMap[type] || "🐾"
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Pets</h1>
                    <p className="text-gray-600 mt-1">Manage and track your furry friends' health</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setEditingPet(null); setShowAddModal(true) }}
                    className="mt-4 sm:mt-0 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Pet
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search pets by name or breed..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 rounded-xl border-gray-200 px-6 font-medium">
                        <Filter className="h-4 w-4 mr-2" />
                        {filterType === "all" ? "All Types" : filterType}
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                    {showFilters && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border shadow-xl z-20 py-2 min-w-[160px]">
                            {["all", "Dog", "Cat", "Bird", "Rabbit", "Hamster"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => { setFilterType(type); setShowFilters(false) }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${filterType === type ? "text-emerald-600 font-bold bg-emerald-50" : "text-gray-700"}`}
                                >
                                    {type === "all" ? "All Types" : type}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center">
                    <div className="h-2 w-2 bg-red-600 rounded-full mr-3 animate-pulse"></div>
                    {error}
                </div>
            )}

            {/* Pet List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
                    <p className="text-gray-500 font-medium">Loading your pets...</p>
                </div>
            ) : filteredPets.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPets.map((pet) => (
                        <div key={pet.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                        {getPetEmoji(pet.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900">{pet.name}</h3>
                                        <div className="flex items-center text-gray-600 text-sm mt-0.5">
                                            <span>{pet.breed || pet.type}</span>
                                            <span className="mx-2 text-gray-300">•</span>
                                            <span>{pet.age || "Age unknown"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-1 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(pet)}
                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeletingPet(pet)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50">
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                    <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg">
                                        <span className="text-gray-500">Gender</span>
                                        <span className="font-semibold text-gray-900">{pet.gender}</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg">
                                        <span className="text-gray-500">Weight</span>
                                        <span className="font-semibold text-gray-900">{pet.weight ? `${pet.weight} kg` : "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg">
                                        <span className="text-gray-500">Color</span>
                                        <span className="font-semibold text-gray-900 truncate max-w-[80px] text-right">{pet.color || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg">
                                        <span className="text-gray-500">Microchip</span>
                                        <span className="font-semibold text-gray-900 truncate max-w-[80px] text-right">{pet.microchip_id || "—"}</span>
                                    </div>
                                </div>
                            </div>

                            {pet.notes && (
                                <p className="mt-4 text-sm text-gray-600 italic line-clamp-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                                    "{pet.notes}"
                                </p>
                            )}

                            <div className="mt-6 flex gap-3">
                                <Link to={`/weight?petId=${pet.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full h-10 rounded-xl hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all">
                                        <Scale className="h-4 w-4 mr-2" />
                                        Weight
                                    </Button>
                                </Link>
                                <Link to={`/vaccinations?petId=${pet.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full h-10 rounded-xl hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 transition-all">
                                        <Syringe className="h-4 w-4 mr-2" />
                                        Vaccines
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-inner">
                    <div className="bg-emerald-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <PawPrint className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your pet family is empty</h3>
                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">Add your first pet to start tracking their vaccinations, weight, and health records.</p>
                    <Button
                        onClick={() => { resetForm(); setEditingPet(null); setShowAddModal(true) }}
                        className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 px-8 h-12 rounded-xl transition-all active:scale-95"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Your First Pet
                    </Button>
                </div>
            )}

            {/* Modals are kept similar but refined */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b flex items-center justify-between bg-emerald-50/30">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingPet ? "Edit Pet Profile" : "New Pet Profile"}
                                </h2>
                                <p className="text-sm text-gray-500">Fill in the details for your pet</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 bg-white text-gray-400 hover:text-gray-600 rounded-full shadow-sm border border-gray-100 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Pet Name <span className="text-red-500">*</span></label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Buddy"
                                        className="h-12 rounded-xl focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Animal Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    >
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                        <option value="Hamster">Hamster</option>
                                        <option value="Fish">Fish</option>
                                        <option value="Turtle">Turtle</option>
                                        <option value="Horse">Horse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Breed</label>
                                    <Input
                                        value={formData.breed}
                                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                        placeholder="e.g., Poodle"
                                        className="h-12 rounded-xl focus:ring-emerald-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Age</label>
                                    <Input
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="e.g., 2 years"
                                        className="h-12 rounded-xl focus:ring-emerald-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Date of Birth</label>
                                    <Input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="h-12 rounded-xl focus:ring-emerald-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Weight (kg)</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        placeholder="e.g., 12.5"
                                        className="h-12 rounded-xl focus:ring-emerald-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Color</label>
                                    <Input
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="e.g., Brown"
                                        className="h-12 rounded-xl focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Any allergies, medical history, or dietary requirements..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-600 font-medium"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-100 font-bold"
                                >
                                    {editingPet ? "Update Profile" : "Create Profile"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingPet && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeletingPet(null)}></div>
                    <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <Trash2 className="h-10 w-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete {deletingPet.name}'s Profile?</h3>
                            <p className="text-gray-600 mb-8 px-4 leading-relaxed">
                                This will permanently remove all medical history, vaccinations, and weight records for this pet. This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl font-medium border-gray-200 hover:bg-gray-50"
                                    onClick={() => setDeletingPet(null)}
                                >
                                    No, Keep it
                                </Button>
                                <Button
                                    className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 font-bold"
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default PetsPage
