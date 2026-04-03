import { FileText, Shield, Gavel, UserCheck, AlertCircle, Ban } from 'lucide-react'

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-100/50 overflow-hidden border border-emerald-50">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-16 text-center relative overflow-hidden">
                        <Gavel className="absolute -bottom-10 -right-10 h-64 w-64 text-white/10 rotate-12" />
                        <Gavel className="absolute -top-10 -left-10 h-48 w-48 text-white/10 -rotate-12" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6">
                                <FileText className="h-4 w-4 mr-2" />
                                Updated March 2026
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Terms of Service</h1>
                            <p className="text-emerald-50 text-lg max-w-2xl mx-auto">
                                Please read these terms carefully before using PawMedic. By using our service, you agree to these conditions.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 sm:p-12 space-y-12">
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                By accessing or using PawMedic, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions in this document, you may not use our services. We reserve the right to updates these terms at any time.
                            </p>
                        </section>

                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <UserCheck className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
                            </div>
                            <div className="space-y-4 text-gray-600 leading-relaxed font-medium">
                                <p>To use certain features, you must register for an account. You agree to:</p>
                                <ul className="grid gap-3">
                                    {[
                                        "Provide accurate and current information during registration",
                                        "Maintain the security of your account and password",
                                        "Notify us immediately of any unauthorized use of your account",
                                        "Accept responsibility for all activities that occur under your account"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="h-5 w-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <div className="h-2 w-2 bg-emerald-600 rounded-full"></div>
                                            </div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Use of Services</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                PawMedic is a tool designed to help you track your pet's healthcare. While we use AI to help provide medical insights, our services are <strong>not a substitute for professional veterinary advice</strong>. Always consult a qualified veterinarian for serious pet health concerns.
                            </p>
                        </section>

                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                    <Ban className="h-6 w-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Prohibited Conduct</h2>
                            </div>
                            <div className="text-gray-600 leading-relaxed font-medium">
                                <p>You agree not to engage in any of the following:</p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>Using the service for any illegal purpose</li>
                                    <li>Attempting to interfere with the proper working of the service</li>
                                    <li>Uploading viruses or malicious code</li>
                                    <li>Providing false information about yourself or your pets</li>
                                </ul>
                            </div>
                        </section>

                        <div className="pt-10 border-t border-gray-100">
                            <div className="bg-emerald-50 rounded-3xl p-8 text-center sm:text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Liability Limitation</h3>
                                <p className="text-gray-600 font-medium">
                                    PawMedic and its team shall not be liable for any indirect, incidental, or consequential damages resulting from your use or inability to use our services.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermsPage
