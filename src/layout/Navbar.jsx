import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, PawPrint, User, LogOut, LayoutDashboard, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authService, vaccinationsService } from "@/services/api"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userName, setUserName] = useState("")
    const [notificationCount, setNotificationCount] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = async () => {
            const token = localStorage.getItem("token")
            const user = localStorage.getItem("user")
            setIsAuthenticated(!!token)
            if (user) {
                const userData = JSON.parse(user)
                const name = userData.full_name || userData.name || userData.first_name || "User"
                setUserName(name)
                
                // Fetch notification count if authenticated
                try {
                    const res = await vaccinationsService.getNotifications()
                    if (res.status === "success") {
                        setNotificationCount(res.data.length)
                    }
                } catch (err) {
                    console.error("Failed to fetch notifications:", err)
                }
            }
        }
        checkAuth()

        // Listen for storage changes (e.g., login/logout in other tabs)
        window.addEventListener("storage", checkAuth)
        return () => window.removeEventListener("storage", checkAuth)
    }, [])

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (err) {
            console.error("Logout error:", err)
        }
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setIsAuthenticated(false)
        setUserName("")
        navigate("/")
    }

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "About", href: "#about" },
        { name: "Contact", href: "#contact" },
    ]

    const dashboardLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Pets", href: "/pets", icon: PawPrint },
        { name: "Profile", href: "/profile", icon: User },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
                        <img src="/logo.svg" alt="PawMedic" className="h-10 w-10" />
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                            PawMedic
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            dashboardLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-gray-600 hover:text-emerald-600 font-medium transition-colors flex items-center space-x-1"
                                >
                                    <link.icon className="h-4 w-4" />
                                    <span>{link.name}</span>
                                </Link>
                            ))
                        ) : (
                            navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))
                        )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                <Link to="/notifications" className="relative group">
                                    <div className="p-2 rounded-full hover:bg-slate-100 transition-all">
                                        <Bell className="h-6 w-6 text-slate-600 group-hover:text-emerald-600" />
                                        {notificationCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                                        )}
                                    </div>
                                </Link>
                                <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-emerald-100 p-2 rounded-full">
                                        <User className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{userName}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg transition-all",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
            >
                <div className="px-4 py-4 space-y-4">
                    {isAuthenticated ? (
                        <>
                            <div className="pb-4 border-b">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-emerald-100 p-2 rounded-full">
                                            <User className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">{userName}</span>
                                    </div>
                                    <Link 
                                        to="/notifications" 
                                        className="relative p-2 rounded-xl bg-slate-50 border border-slate-100"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Bell className="h-5 w-5 text-slate-600" />
                                        {notificationCount > 0 && (
                                            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 border-2 border-white rounded-full" />
                                        )}
                                    </Link>
                                </div>
                            </div>
                            {dashboardLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="block text-gray-600 hover:text-emerald-600 font-medium py-2 flex items-center space-x-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <link.icon className="h-5 w-5" />
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                            <div className="pt-4 border-t">
                                <Button
                                    variant="ghost"
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                                    onClick={() => {
                                        handleLogout()
                                        setIsOpen(false)
                                    }}
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block text-gray-600 hover:text-emerald-600 font-medium py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 border-t space-y-2">
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full">Sign In</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
