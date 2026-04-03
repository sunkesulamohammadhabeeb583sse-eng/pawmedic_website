import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, PawPrint, User, Bell } from "lucide-react"
import Sidebar from "./Sidebar"
import { useAuth } from "@/hooks/useAuth"
import { vaccinationsService } from "@/services/api"

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await vaccinationsService.getNotifications()
                setNotifications(response.data || [])
            } catch (error) {
                console.error("Error fetching notifications:", error)
            }
        }

        if (user) {
            fetchNotifications()
            // Refresh every 5 minutes
            const interval = setInterval(fetchNotifications, 5 * 60 * 1000)
            return () => clearInterval(interval)
        }
    }, [user])

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Top Header - Mobile and Desktop Header */}
                <header className="bg-white border-b sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 -ml-2 text-gray-600 hover:text-emerald-600 focus:outline-none"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <Link to="/dashboard" className="flex items-center ml-2 space-x-2">
                                <img src="/logo.svg" alt="PawMedic" className="h-8 w-8" />
                                <span className="font-bold text-gray-900">PawMedic</span>
                            </Link>
                        </div>

                        {/* Desktop Search or breadcrumbs could go here */}
                        <div className="hidden lg:block">
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                {window.location.pathname.split('/').pop() || 'Dashboard'}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <Link to="/reminders" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <Bell className="h-6 w-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-3 w-3 bg-red-500 border-2 border-white rounded-full"></span>
                                )}
                            </Link>

                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.full_name || user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <Link to="/profile" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                                    <User className="h-5 w-5" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
