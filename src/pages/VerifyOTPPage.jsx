import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Loader2, AlertCircle, Lock, ArrowLeft, Mail, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/api"

const VerifyOTPPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)

    const email = location.state?.email || ""
    const purpose = location.state?.purpose || "forgot-password"

    useEffect(() => {
        // Start countdown timer
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleResend = async () => {
        setResendTimer(60)
        setCanResend(false)
        setError("")

        try {
            // Call the forgot password API to resend OTP
            await authService.forgotPassword(email)
        } catch (err) {
            setError("Failed to resend OTP. Please try again.")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!otp.trim()) {
            setError("Please enter the OTP")
            return
        }

        if (otp.length < 4) {
            setError("Please enter a valid OTP")
            return
        }

        setLoading(true)

        try {
            const response = await authService.verifyOtp(email, otp)

            if (response.status === 'success' || response.message) {
                setOtpVerified(true)
                // Navigate to new password page after successful verification
                setTimeout(() => {
                    navigate('/new-password', { state: { email, purpose: 'forgot-password' } })
                }, 1000)
            }
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.')
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
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Verify Your Identity</h2>
                    <p className="text-lg text-gray-600">Enter the OTP sent to your email address.</p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="mb-10 lg:hidden flex justify-center">
                        <img src="/logo.svg" alt="PawMedic" className="w-12 h-12" />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
                        <p className="text-gray-500">Enter the 6-digit code sent to your email.</p>
                        {email && (
                            <p className="text-sm text-emerald-600 font-medium mt-2">{email}</p>
                        )}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm flex items-center rounded-xl font-medium">
                            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {otpVerified && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-sm flex items-center rounded-xl font-medium">
                            <Lock className="h-5 w-5 mr-3 flex-shrink-0" />
                            OTP verified successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">OTP Code</label>
                            <Input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 text-center text-lg tracking-widest"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                                disabled={otpVerified}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-none transition-all"
                            disabled={loading || otpVerified}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify OTP"}
                        </Button>
                    </form>

                    <div className="mt-8 space-y-4">
                        {!canResend ? (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <Timer className="h-4 w-4" />
                                <span>Resend OTP in {resendTimer}s</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="w-full text-sm text-emerald-600 font-bold hover:text-emerald-700 flex items-center justify-center gap-1"
                            >
                                Resend OTP
                            </button>
                        )}

                        <div className="text-center text-sm font-medium text-gray-500">
                            <Link to="/forgot-password" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center justify-center gap-1">
                                <ArrowLeft className="h-4 w-4" /> Change Email
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyOTPPage
