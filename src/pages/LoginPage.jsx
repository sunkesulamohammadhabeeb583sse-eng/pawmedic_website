import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, AlertCircle, PawPrint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"

const LoginPage = () => {
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await login(email, password)
            if (response.status === 'success' || response.token) {
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message || 'Access denied. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex font-sans bg-white">
            {/* Left Image Section */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-50 opacity-50 block" />
                <div className="relative z-10 max-w-lg text-center flex flex-col items-center">
                    <PawPrint className="w-48 h-48 mb-8 text-emerald-600" />
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Pet's Digital Health Home</h2>
                    <p className="text-lg text-gray-600">Access medical records, daily care logs, and AI disease scanning instantly.</p>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    <div className="mb-10 lg:hidden flex justify-center">
                        <img src="/logo.svg" alt="PawMedic" className="w-12 h-12" />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-500">Enter your details to access your account.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm flex items-center rounded-xl font-medium">
                            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700 font-medium">Password</label>
                                <Link to="/forgot-password" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-12 w-full rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 pr-12 bg-gray-50/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-none transition-all"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-emerald-600 font-bold hover:text-emerald-700 ml-1">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
