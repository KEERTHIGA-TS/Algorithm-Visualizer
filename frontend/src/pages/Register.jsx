// frontend/src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"; // Tailwind Heroicons

export default function Register() {
    const { register, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isValid, setIsValid] = useState(false);

    // Validate password live
    useEffect(() => {
        const pwd = form.password;
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwd) {
            setPasswordError("");
        } else if (!pwdRegex.test(pwd)) {
            setPasswordError("Password must be 8+ chars, include uppercase, lowercase, number & special char");
        } else {
            setPasswordError("");
        }
    }, [form.password]);

    // Validate email live
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email) {
            setEmailError("");
        } else if (!emailRegex.test(form.email)) {
            setEmailError("Invalid email format");
        } else {
            setEmailError("");
        }
    }, [form.email]);

    // Enable submit only if all valid
    useEffect(() => {
        setIsValid(
            form.name &&
            form.email &&
            form.password &&
            !emailError &&
            !passwordError
        );
    }, [form, emailError, passwordError]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        const success = await register(form.name, form.email, form.password);
        if (success) navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full bg-black/50 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-400">Join to track your algorithm learning progress</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input w-full px-6 py-3"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className={`input w-full px-6 py-3 ${emailError ? "border-red-500" : ""}`}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            className={`input w-full px-6 py-3 pr-12 ${passwordError ? "border-red-500" : ""}`}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                                Creating Account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
