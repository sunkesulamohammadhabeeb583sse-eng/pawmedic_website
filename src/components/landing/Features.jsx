import {
    ScanFace,
    Scale,
    Syringe,
    Activity,
    FileText,
    Brain,
    Heart,
    Bell,
    Pill,
    Clock,
    Calendar,
    AlertCircle,
    Scan
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
    {
        icon: Scan,
        title: "AI Disease Detection",
        description: "Upload photos of skin conditions or wounds and get instant AI-powered analysis with treatment recommendations.",
        badge: "AI Powered",
        color: "emerald",
    },
    {
        icon: Brain,
        title: "Symptom Checker",
        description: "Describe your pet's symptoms and get AI-powered insights about possible conditions with severity levels.",
        badge: "Smart",
        color: "blue",
    },
    {
        icon: Scale,
        title: "Weight Tracking",
        description: "Track your pet's weight over time with visual charts and get alerts for unhealthy weight changes.",
        badge: "Analytics",
        color: "purple",
    },
    {
        icon: Pill,
        title: "Vaccination Manager",
        description: "Never miss a vaccination. Get reminders for upcoming shots and maintain complete vaccination records.",
        badge: "Reminders",
        color: "teal",
    },
    {
        icon: Activity,
        title: "Activity Monitoring",
        description: "Monitor your pet's daily activities and behavior patterns to ensure they stay healthy and active.",
        badge: "24/7",
        color: "orange",
    },
    {
        icon: FileText,
        title: "Health Records",
        description: "Keep all your pet's health records organized in one place - medical history, prescriptions, and more.",
        badge: "Organized",
        color: "pink",
    },
    {
        icon: Heart,
        title: "Daily Care Logs",
        description: "Log daily activities like meals, walks, medications, and grooming sessions for comprehensive care.",
        badge: "Complete",
        color: "red",
    },
    {
        icon: Bell,
        title: "Smart Reminders",
        description: "Get timely notifications for medications, vet appointments, vaccinations, and care activities.",
        badge: "Reliable",
        color: "amber",
    },
]

const Features = () => {
    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-emerald-100 text-emerald-700">Features</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Everything Your Pet Needs
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
                        A comprehensive suite of tools designed to help you provide the best care for your furry friends. 
                        Currently perfectly optimized for <strong className="text-emerald-700">cats and dogs</strong> — with <em className="text-teal-600 font-medium">rabbits, parrots</em>, and more coming soon!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
                        >
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    <Badge variant="secondary" className={`text-xs bg-${feature.color}-50 text-${feature.color}-700`}>
                                        {feature.badge}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
