import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Download, Smartphone, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { statsService } from "@/services/api"

const Hero = () => {
    const [stats, setStats] = useState({ pets: 2543, users: 1821, scans: 4750, accuracy: 96.5 })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsService.getPublicStats()
                if (response.status === 'success' && response.data) {
                    setStats(response.data)
                }
            } catch (error) {
                console.error("Error fetching stats:", error)
            }
        }
        fetchStats()
    }, [])
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                            <Zap className="h-4 w-4 mr-2" />
                            AI-Powered Pet Healthcare
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Keep Your Pets
                            <span className="block bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                Healthy & Happy
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                            The complete pet healthcare companion. Track vaccinations, monitor weight,
                            analyze diseases with AI, and get expert health tips — all in one place.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-lg px-8 py-6">
                                <Download className="mr-2 h-5 w-5" />
                                Download App
                            </Button>
                            <Link to="/signup">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                                    Learn More
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
                            <div>
                                <div className="text-3xl font-bold text-emerald-600">{stats.pets.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">No. of Pets</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-emerald-600">{stats.users.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">No. of Users</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-emerald-600">{stats.scans.toLocaleString()}+</div>
                                <div className="text-sm text-gray-500">Scans Done</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-emerald-600">{stats.accuracy}%</div>
                                <div className="text-sm text-gray-500">Accuracy</div>
                            </div>
                        </div>
                    </div>

                    {/* App Preview */}
                    <div className="relative hidden lg:block">
                        <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-4 shadow-2xl">
                            {/* Notch */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-full"></div>

                            {/* Screen */}
                            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                                {/* App Header */}
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 pt-10 text-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg">My Pets</h3>
                                        <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <div className="w-12 h-12 bg-amber-300 rounded-full border-4 border-white"></div>
                                        <div className="w-12 h-12 bg-blue-300 rounded-full border-4 border-white"></div>
                                        <div className="w-12 h-12 bg-green-300 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold text-green-800">+2</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="p-4">
                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                                                <Zap className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <span className="text-xs text-gray-600">Scan</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                                                <Shield className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <span className="text-xs text-gray-600">Vaccines</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                                                <Smartphone className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <span className="text-xs text-gray-600">Weight</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-1">
                                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <span className="text-xs text-gray-600">Records</span>
                                        </div>
                                    </div>

                                    {/* Health Tips */}
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Today's Health Tip</h4>
                                        <p className="text-sm text-gray-600">Regular exercise helps maintain your pet's healthy weight and mental stimulation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-8 -right-8 bg-white p-4 rounded-2xl shadow-xl animate-bounce">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Vaccination Due</div>
                                    <div className="text-xs text-gray-500">Max needs DHPP vaccine</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
