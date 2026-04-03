import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Loader2, AlertCircle, Lock, ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/api"

const NewPasswordPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const email = location.state?.email || ""

    // Password validation criteria
    const passwordRequirements = [
        { id: 'length', label: 'At least 6 characters', valid: password.length >= 6 },
        { id: 'uppercase', label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
        { id: 'lowercase', label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(password) },
        { id: 'number', label: 'One number (0-9)', valid: /[0-9]/.test(password) },
        { id: 'special', label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(password) },
    ]

    const allRequirementsMet = passwordRequirements.every(req => req.valid)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!password) {
            setError("Please enter a password")
            return
        }

        if (!allRequirementsMet) {
            setError("Please meet all password requirements")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            const response = await authService.resetPassword(email, password)

            if (response.status === 'success' || response.message) {
                setSuccess(true)
                // Navigate to login after successful password reset
                setTimeout(() => {
                    navigate('/login', { state: { passwordReset: true } })
                }, 1500)
            }
        } catch (err) {
            setError(err.message || 'Failed to reset password. Please try again.')
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
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Set a Strong Password</h2>
                    <p className="text-lg text-gray-600">Create a new password for your account.</p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="mb-10 lg:hidden flex justify-center">
                        <img src="/logo.svg" alt="PawMedic" className="w-12 h-12" />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">New Password</h1>
                        <p className="text-gray-500">Set a strong password for your account.</p>
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
                            Password reset successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">New Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12 bg-gray-50/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={success}
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
                            <div className="mt-3 space-y-1">
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
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12 bg-gray-50/50"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={success}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-none transition-all disabled:opacity-50"
                            disabled={loading || !allRequirementsMet || success}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center justify-center gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPasswordPage
