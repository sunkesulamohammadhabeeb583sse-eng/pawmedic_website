import { Shield, Eye, Lock, FileText, Bell, Share2 } from 'lucide-react'

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-100/50 overflow-hidden border border-emerald-50">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-16 text-center relative overflow-hidden">
                        <Shield className="absolute -bottom-10 -right-10 h-64 w-64 text-white/10 rotate-12" />
                        <Shield className="absolute -top-10 -left-10 h-48 w-48 text-white/10 -rotate-12" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6">
                                <Lock className="h-4 w-4 mr-2" />
                                Secure & Private
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
                            <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                                Last updated: March 25, 2026. Your privacy is our priority. Learn how we handle your data with care.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Information Collection</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                                <p>
                                    At PawMedic, we collect information to provide better services to all our users. This includes:
                                </p>
                                <ul className="grid sm:grid-cols-2 gap-4 mt-4">
                                    <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <span className="text-emerald-600 font-bold block mb-1">Personal Data</span>
                                        Name, email address, and phone number used for account creation and communication.
                                    </li>
                                    <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <span className="text-emerald-600 font-bold block mb-1">Pet Information</span>
                                        Details about your pets including breed, age, and medical history for accurate tracking.
                                    </li>
                                    <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <span className="text-emerald-600 font-bold block mb-1">Usage Information</span>
                                        Data on how you interact with our app to improve our features and user interface.
                                    </li>
                                    <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <span className="text-emerald-600 font-bold block mb-1">Device Data</span>
                                        Technical information about your device to ensure compatibility and security.
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">How We Use Data</h2>
                            </div>
                            <div className="text-gray-600 leading-relaxed font-medium space-y-4">
                                <p>Your data helps us maintain and improve PawMedic. We use it to:</p>
                                <div className="grid gap-3">
                                    {[
                                        "Provide, maintain and improve our services",
                                        "Personalize your experience and pet health tracking",
                                        "Send you technical notices, updates, and security alerts",
                                        "Respond to your comments, questions and requests",
                                        "Monitor and analyze trends, usage and activities"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <Lock className="h-6 w-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                We use industry-standard encryption and security measures to protect your data. Your information is stored on secure servers and access is restricted to authorized personnel only. We continuously monitor our systems for potential vulnerabilities and attacks.
                            </p>
                        </section>

                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                    <Share2 className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Data Sharing</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                We do not sell your personal data. We may share information with trusted third-party service providers who assist us in operating our website and providing our services, as long as those parties agree to keep this information confidential.
                            </p>
                        </section>

                        <div className="pt-10 border-t border-gray-100">
                            <div className="bg-emerald-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Have questions about your privacy?</h3>
                                    <p className="text-gray-600 font-medium">Our team is here to help you understand your rights.</p>
                                </div>
                                <a href="mailto:privacy@pawmedic.com" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPage
