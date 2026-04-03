import { useState, useEffect } from "react"
import { Users, Award, Heart, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { statsService } from "@/services/api"

const initialStats = [
    { icon: Users, id: 'users', value: "1,821+", label: "Pet Owners" },
    { icon: Award, id: 'rating', value: "4.8★", label: "App Rating" },
    { icon: Heart, id: 'scans', value: "4,750+", label: "Disease Scans" },
    { icon: Globe, id: 'countries', value: "10+", label: "Countries" },
]

const About = () => {
    const [displayStats, setDisplayStats] = useState(initialStats)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsService.getPublicStats()
                if (response.status === 'success' && response.data) {
                    setDisplayStats([
                        { icon: Users, id: 'users', value: `${response.data.users > 0 ? response.data.users.toLocaleString() : '1,821'}+`, label: "Pet Owners" },
                        { icon: Award, id: 'rating', value: "4.8★", label: "App Rating" },
                        { icon: Heart, id: 'scans', value: `${response.data.scans > 0 ? response.data.scans.toLocaleString() : '4,750'}+`, label: "Disease Scans" },
                        { icon: Globe, id: 'countries', value: "10+", label: "Countries" },
                    ])
                }
            } catch (error) {
                console.error("Error fetching stats:", error)
            }
        }
        fetchStats()
    }, [])

    return (
        <section id="about" className="py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            About PawMedic
                        </h2>
                        <p className="text-emerald-100 text-lg mb-6">
                            PawMedic was born from a simple belief: every pet deserves the best possible care.
                            We combine cutting-edge AI technology with veterinary expertise to give pet owners
                            powerful tools for keeping their furry companions healthy.
                        </p>
                        <p className="text-emerald-100 mb-8">
                            Our team consists of passionate pet owners, veterinarians, and AI specialists
                            working together to revolutionize pet healthcare. We understand the joy and
                            responsibility of pet ownership, and we're here to help you every step of the way.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            {displayStats.map((stat, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <stat.icon className="h-6 w-6 text-emerald-300" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-emerald-200 text-sm">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image/Visual */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                    <div className="text-4xl mb-2">🐕</div>
                                    <div className="text-emerald-200">Dogs</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                    <div className="text-4xl mb-2">🐈</div>
                                    <div className="text-emerald-200">Cats</div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center relative overflow-hidden group border border-white/10">
                                    <div className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full z-10 uppercase tracking-wider">Soon</div>
                                    <div className="text-4xl mb-2 opacity-50 sepia-[.3]">🐰</div>
                                    <div className="text-emerald-200/50 font-medium">Rabbits</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center relative overflow-hidden group border border-white/10">
                                    <div className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full z-10 uppercase tracking-wider">Soon</div>
                                    <div className="text-4xl mb-2 opacity-50 sepia-[.3]">🦜</div>
                                    <div className="text-emerald-200/50 font-medium">Birds</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Statement */}
                <div className="mt-16 text-center">
                    <Card className="bg-white/10 backdrop-blur-md border-0 inline-block">
                        <CardContent className="p-8">
                            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                            <p className="text-emerald-100 max-w-2xl">
                                To make premium pet healthcare accessible to every pet owner worldwide through
                                innovative technology and compassionate care.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default About
