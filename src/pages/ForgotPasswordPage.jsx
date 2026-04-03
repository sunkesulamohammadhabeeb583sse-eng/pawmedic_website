import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, AlertCircle, Lock, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/api"

const ForgotPasswordPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await authService.forgotPassword(email)

            if (response.status === 'success' || response.message) {
                setSuccess(true)
                // Navigate to OTP verification after short delay
                setTimeout(() => {
                    navigate('/verify-otp', { state: { email, purpose: 'forgot-password' } })
                }, 1500)
            }
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please check your email and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex font-sans bg-white">
            {/* Left Image Section */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-50 opacity-50" />
                <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
                    <Lock className="w-48 h-48 mb-8 text-emerald-600" />
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Reset Your Password</h2>
                    <p className="text-lg text-gray-600">Enter your email to receive a verification code.</p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="mb-10 lg:hidden flex justify-center">
                        <img src="/logo.svg" alt="PawMedic" className="w-12 h-12" />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                        <p className="text-gray-500">Enter your email to receive a verification code.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm flex items-center rounded-xl font-medium">
                            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-sm flex items-center rounded-xl font-medium">
                            <Lock className="h-5 w-5 mr-3 flex-shrink-0" />
                            OTP sent to your email! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 pl-12 bg-gray-50/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-none transition-all"
                            disabled={loading || success}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Remember your password?{" "}
                        <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 ml-1 flex items-center justify-center gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
