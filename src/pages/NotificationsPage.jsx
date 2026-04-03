import { useState, useEffect } from "react"
import { Bell, Calendar, AlertTriangle, CheckCircle, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { vaccinationsService } from "@/services/api"
import { format, isPast, isToday, addDays, parseISO } from "date-fns"
import { useNavigate } from "react-router-dom"

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await vaccinationsService.getNotifications()
                if (response.status === "success") {
                    setNotifications(response.data)
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchNotifications()
    }, [])

    const getStatusInfo = (dateStr) => {
        const date = parseISO(dateStr)
        if (isPast(date) && !isToday(date)) {
            return {
                label: "Overdue",
                color: "bg-red-100 text-red-600 border-red-200",
                icon: AlertTriangle
            }
        }
        if (isToday(date)) {
            return {
                label: "Due Today",
                color: "bg-amber-100 text-amber-600 border-amber-200",
                icon: Clock
            }
        }
        return {
            label: "Upcoming",
            color: "bg-emerald-100 text-emerald-600 border-emerald-200",
            icon: Calendar
        }
    }

    if (isLoading) {
        return (
            <div className="pt-24 pb-12 min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-emerald-100 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-24 pb-12 min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Health Alerts</h1>
                        <p className="text-slate-500 mt-2 font-medium">Manage your pet's upcoming and overdue care reminders</p>
                    </div>
                    <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-200">
                        <Bell className="h-6 w-6 text-white" />
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">All clear!</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            You're all caught up with your pet's healthcare. No upcoming or overdue vaccinations found.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => {
                            const status = getStatusInfo(notif.date)
                            return (
                                <div 
                                    key={notif.id}
                                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 group cursor-pointer"
                                    onClick={() => navigate(`/pets?id=${notif.pet_id}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex space-x-4">
                                            <div className={`p-3 rounded-xl ${status.color}`}>
                                                <status.icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Vaccination Alert</span>
                                                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${status.color} border`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{notif.name}</h3>
                                                <p className="text-slate-600 mt-1 font-medium italic">
                                                    Scheduled for <span className="text-slate-900 font-bold">{notif.pet_name}</span> on {format(parseISO(notif.date), 'PPPP')}
                                                </p>
                                                <div className="mt-4 flex items-center space-x-4">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 font-bold"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors mt-2" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="mt-12 bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-200">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Automated Email Reminders</h3>
                        <p className="text-emerald-50 opacity-90 max-w-lg mb-6 leading-relaxed">
                            We've also sent detailed health reports to your registered email for any overdue items. Check your inbox to stay informed!
                        </p>
                        <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 rounded-xl border-none shadow-lg">
                            Update Notification Preferences
                        </Button>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-emerald-700 rounded-full opacity-30 blur-2xl"></div>
                </div>
            </div>
        </div>
    )
}

export default NotificationsPage
