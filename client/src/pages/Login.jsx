import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotView, setIsForgotView] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setResetSent(true);
        }, 800);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 px-4 py-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-24 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.35fr_1fr] items-center">
                <section className="space-y-8 rounded-[36px] border border-slate-200/50 bg-gradient-to-br from-slate-100 to-white p-10 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                    <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary ring-1 ring-primary/15">
                        Student Edition
                    </span>
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">Modern finance made simple.</h1>
                        <p className="max-w-xl text-slate-600 text-base sm:text-lg leading-8">
                            Track expenses, stay on budget, and visualize your spending with stunning analytics — all in one fresh student dashboard.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-5 shadow-lg shadow-slate-900/10">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Smart insights</p>
                            <p className="mt-3 text-base font-semibold text-slate-900">See expense trends at a glance.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-5 shadow-lg shadow-slate-900/10">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Secure login</p>
                            <p className="mt-3 text-base font-semibold text-slate-900">Password protection with instant validation.</p>
                        </div>
                    </div>
                </section>

                <div className="relative rounded-[32px] border border-slate-200/50 bg-white p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                    <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-80" />
                    <div className="relative space-y-6 pt-6">
                        <div className="text-center">
                            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Welcome back</p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900">Sign in to your account</h2>
                            <p className="mt-2 text-slate-400">Secure access to your student expense tracker.</p>
                        </div>

                        {successMessage && !isForgotView && (
                            <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                                {successMessage}
                            </div>
                        )}
                        {error && !isForgotView && (
                            <div className="rounded-3xl border border-rose-500/10 bg-rose-500/10 p-4 text-sm text-rose-200">
                                {error}
                            </div>
                        )}

                        {!isForgotView && (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="input w-full placeholder:text-slate-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="student@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            className="input w-full placeholder:text-slate-500 pr-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => { setIsForgotView(true); setError(''); }}
                                        className="text-primary hover:text-sky-300 font-semibold"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <button type="submit" className="btn btn-primary w-full py-3 text-base font-semibold shadow-xl shadow-primary/20">
                                    Sign In
                                </button>
                            </form>
                        )}

                        {isForgotView && (
                            <div className="space-y-5">
                                {resetSent ? (
                                    <div className="space-y-4 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20">
                                            <Mail size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Check your email</h3>
                                        <p className="text-slate-400">A reset link has been sent to <span className="font-semibold text-white">{email}</span>.</p>
                                        <button
                                            onClick={() => { setIsForgotView(false); setResetSent(false); }}
                                            className="btn btn-secondary w-full py-3"
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleForgotSubmit} className="space-y-5">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-300">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                className="input w-full placeholder:text-slate-500"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your registered email"
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-full py-3">
                                            Send Reset Link
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsForgotView(false)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <ArrowLeft size={16} /> Back to Login
                                            </span>
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {!isForgotView && (
                            <p className="text-center text-sm text-slate-400 pt-2">
                                Don’t have an account?{' '}
                                <Link to="/register" className="text-primary font-semibold hover:text-sky-300">
                                    Sign up
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
