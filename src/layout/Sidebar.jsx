import { Link, useLocation } from "react-router-dom"
import {
    PawPrint,
    Scan,
    Scale,
    Syringe,
    Activity,
    FileText,
    Bell,
    Heart,
    Settings,
    LogOut,
    X
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation()
    const { logout } = useAuth()

    const menuItems = [
        { icon: PawPrint, label: "My Pets", path: "/pets", color: "bg-emerald-100 text-emerald-600" },
        { icon: Scan, label: "Disease Scanner", path: "/scanner", color: "bg-blue-100 text-blue-600" },
        { icon: Scale, label: "Weight Tracker", path: "/weight", color: "bg-purple-100 text-purple-600" },
        { icon: Syringe, label: "Vaccinations", path: "/vaccinations", color: "bg-teal-100 text-teal-600" },
        { icon: Activity, label: "Activity", path: "/activity", color: "bg-orange-100 text-orange-600" },
        { icon: FileText, label: "Health Records", path: "/records", color: "bg-pink-100 text-pink-600" },
        { icon: Heart, label: "Daily Care", path: "/daily-care", color: "bg-red-100 text-red-600" },
        { icon: Bell, label: "Reminders", path: "/reminders", color: "bg-amber-100 text-amber-600" },
    ]

    const NavContent = () => (
        <>
            <div className="flex items-center space-x-2 px-6 py-5 border-b">
                <Link to="/dashboard" className="flex items-center space-x-2" onClick={onClose}>
                    <img src="/logo.svg" alt="PawMedic" className="h-10 w-10" />
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                        PawMedic
                    </span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path
                            ? "bg-emerald-50 text-emerald-600 shadow-sm"
                            : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
                            }`}
                        onClick={onClose}
                    >
                        <div className={`p-2 rounded-lg ${item.color} transition-transform group-hover:scale-110`}>
                            <item.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="px-4 py-4 border-t">

                <button
                    onClick={() => {
                        onClose && onClose();
                        logout();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                        <div className="absolute top-4 right-4 lg:hidden">
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <NavContent />
                    </div>
                </div>
            )}
        </>
    )
}

export default Sidebar
