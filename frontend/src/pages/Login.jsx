// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"; // Tailwind Heroicons

export default function Login() {
    const { login, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Live email validation
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("");
        } else if (!emailRegex.test(email)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    }, [email]);

    // Enable submit only if all valid
    useEffect(() => {
        setIsValid(email && password && !emailError);
    }, [email, password, emailError]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        // Check if password is empty
        if (!password) {
            setPasswordError("Password required");
            return;
        }

        // Clear error if password exists
        setPasswordError("");

        const success = await login(email, password);
        if (success) navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full bg-black/50 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">Sign in to track your progress</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className={`input w-full px-6 py-3 ${emailError ? "border-red-500" : ""}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                    </div>

                    {/* Password Field - Perfectly Centered Toggle */}
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            className={`input w-full px-6 py-3 pr-12 ${passwordError ? "border-red-500" : ""}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* ✅ Toggle Button - Perfectly Centered */}
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-gray-300 text-gray-400 transition-colors focus:outline-none ring-0"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            tabIndex={-1}
                        >
                            {passwordVisible ?
                                <EyeSlashIcon className="h-5 w-5" /> :
                                <EyeIcon className="h-5 w-5" />
                            }
                        </button>


                        {/* Error Message - Single instance */}
                        {passwordError && (
                            <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                        )}
                    </div>



                    {/* Submit Button */}
                    <button
                        className="btn w-full"
                        disabled={loading || !isValid}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
