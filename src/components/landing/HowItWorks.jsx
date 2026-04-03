import { Download, Scan, TrendingUp, Smile } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const steps = [
    {
        number: "01",
        icon: Download,
        title: "Download & Sign Up",
        description: "Download the PawMedic app from the App Store or Play Store and create your account in minutes.",
        highlight: "Free to Start",
    },
    {
        number: "02",
        icon: Scan,
        title: "Add Your Pets",
        description: "Add your furry friends by adding their photos, breed, age, and other important details.",
        highlight: "Unlimited Pets",
    },
    {
        number: "03",
        icon: TrendingUp,
        title: "Track & Monitor",
        description: "Start tracking vaccinations, weight, daily activities, and use AI to analyze health concerns.",
        highlight: "Real-time Updates",
    },
    {
        number: "04",
        icon: Smile,
        title: "Keep Them Healthy",
        description: "Get personalized reminders, health tips, and expert advice to keep your pets thriving.",
        highlight: "Peace of Mind",
    },
]

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-blue-100 text-blue-700">How It Works</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Get Started in 4 Simple Steps
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Start providing better care for your pets in just a few minutes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-200 to-emerald-400 -z-10"></div>
                            )}

                            <Card className="border-0 shadow-lg bg-gradient-to-b from-white to-gray-50 h-full">
                                <CardContent className="p-6 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg mb-4">
                                        {step.number}
                                    </div>

                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                        <step.icon className="h-8 w-8 text-emerald-600" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {step.description}
                                    </p>

                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                        {step.highlight}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.64 1.26 3.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            <span>Available on iOS</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            <span>Available on Android</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
