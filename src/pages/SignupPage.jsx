import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, AlertCircle, PawPrint, Check,X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"

const SignupPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Password validation criteria
    const passwordRequirements = [
        { id: 'length', label: 'At least 6 characters', valid: formData.password.length >= 6 },
        { id: 'uppercase', label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(formData.password) },
        { id: 'lowercase', label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(formData.password) },
        { id: 'number', label: 'One number (0-9)', valid: /[0-9]/.test(formData.password) },
        { id: 'special', label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(formData.password) },
    ]

    const allRequirementsMet = passwordRequirements.every(req => req.valid)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        // Check password requirements
        if (!allRequirementsMet) {
            setError("Please meet all password requirements: at least 6 characters, one uppercase, one lowercase, one number, and one special character")
            return
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            setError("Phone number must be exactly 10 digits")
            return
        }

        if (!agreeTerms) {
            setError("Please agree to the terms and conditions")
            return
        }

        setLoading(true)

        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim()
            const { authService } = await import("@/services/api")
            const response = await authService.register(fullName, formData.email, formData.password, formData.phone)

            if (response.status === 'success' || response.token) {
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex font-sans bg-white overflow-x-hidden">
            {/* Left Form Section */}
            <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="mb-8 lg:hidden flex justify-center">
                        <img src="/logo.svg" alt="PawMedic" className="w-12 h-12" />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h1>
                        <p className="text-gray-500 font-medium">Join PawMedic and start caring for your pets today.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm flex items-center rounded-xl font-medium">
                            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">First Name</label>
                                <Input
                                    name="firstName"
                                    placeholder="Habeeb"
                                    className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-colors"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                <Input
                                    name="lastName"
                                    placeholder="Doe"
                                    className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-colors"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-colors"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone Mobile (Optional)</label>
                            <Input
                                name="phone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-colors"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 characters"
                                        className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12 bg-gray-50/50 transition-colors"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {/* Password Requirements */}
                                {formData.password && (
                                    <div className="mt-2 space-y-1">
                                        {passwordRequirements.map((req) => (
                                            <div
                                                key={req.id}
                                                className={`flex items-center gap-2 text-xs ${req.valid ? 'text-emerald-600' : 'text-gray-400'
                                                    }`}
                                            >
                                                {req.valid ? (
                                                    <Check className="h-3 w-3" />
                                                ) : (
                                                    <X className="h-3 w-3" />
                                                )}
                                                <span>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                <Input
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repeat password"
                                    className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-colors"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 pt-4">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 h-5 w-5 rounded-md border-gray-200 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                I agree to the <Link to="/terms" className="font-semibold text-gray-900 border-b-2 border-emerald-500/30 hover:border-emerald-500 transition-colors pb-0.5">Terms</Link> and <Link to="/privacy" className="font-semibold text-gray-900 border-b-2 border-emerald-500/30 hover:border-emerald-500 transition-colors pb-0.5">Privacy Policy</Link>.
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-base font-bold rounded-xl bg-gray-900 hover:bg-emerald-600 text-white shadow-none transition-all mt-4"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-gray-900 font-bold hover:text-emerald-600 underline decoration-2 underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-500">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Brand Section */}
            <div className="hidden lg:flex w-[40%] bg-emerald-50 flex-col justify-between p-12 relative overflow-hidden">
                <PawPrint className="absolute -bottom-24 -right-24 h-96 w-96 text-emerald-600/5 rotate-12" />

                <div>
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <img src="/logo.svg" alt="PawMedic" className="h-10 w-10" />
                        <span className="text-2xl font-bold text-gray-900">PawMedic</span>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-sm mt-12 mb-12 relative z-10 transition-all">
                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">Your Pet's Journey Starts Here</h2>
                    <p className="text-emerald-800/80 text-lg font-medium">Join our community to access smart vaccination, daily tracking, and AI disease scanning for your furry friends.</p>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white relative z-10">
                    <p className="text-gray-600 text-lg leading-relaxed font-medium mb-6">"PawMedic transformed how I care for my Golden Retriever. The vaccination reminders and symptom checker give me peace of mind."</p>
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">H</div>
                        <div>
                            <p className="font-bold text-gray-900 leading-tight">Habeeb</p>
                            <div className="flex space-x-1 mt-1 text-amber-400">
                                {[...Array(5)].map((_, i) => <Check key={i} className="h-3 w-3" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
