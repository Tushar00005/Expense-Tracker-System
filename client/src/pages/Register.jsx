import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import clsx from 'clsx';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [strength, setStrength] = useState({ score: 0, label: '', color: 'bg-slate-200' });
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!password) {
            setStrength({ score: 0, label: '', color: 'bg-slate-200' });
            return;
        }

        let score = 0;
        if (password.length > 5) score += 1;
        if (password.length > 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (score <= 2) setStrength({ score: 1, label: 'Weak', color: 'bg-red-500' });
        else if (score <= 4) setStrength({ score: 2, label: 'Medium', color: 'bg-amber-500' });
        else setStrength({ score: 3, label: 'Strong', color: 'bg-emerald-500' });
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register(name, email, password);
            navigate('/login', {
                state: {
                    message: 'Account created successfully. Please sign in.',
                },
                replace: true,
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 px-4 py-10">
            <div className="pointer-events-none absolute left-0 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
                <div className="space-y-8 rounded-[36px] border border-slate-200/50 bg-gradient-to-br from-slate-100 to-white p-10 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                    <div className="inline-flex rounded-full bg-cyan-500/10 px-4 py-1 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-500/20">
                        New Student
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">Build smarter spending habits.</h1>
                        <p className="max-w-xl text-slate-600 leading-8 text-base sm:text-lg">
                            Create your account and start tracking your monthly budget, expense categories, and financial goals with a clean, intuitive dashboard.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-5 shadow-lg shadow-slate-900/10">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Fast setup</p>
                            <p className="mt-3 text-base font-semibold text-slate-900">Sign up in seconds and start tracking instantly.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-5 shadow-lg shadow-slate-900/10">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Secure data</p>
                            <p className="mt-3 text-base font-semibold text-slate-900">Your student finances stay safe and private.</p>
                        </div>
                    </div>
                </div>

                <div className="relative rounded-[32px] border border-slate-200/50 bg-white p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                    <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-80" />
                    <div className="relative space-y-6 pt-6">
                        <div className="text-center">
                            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Join now</p>
                            <h2 className="mt-3 text-3xl font-bold text-slate-900">Create your account</h2>
                            <p className="mt-2 text-slate-400">Start tracking expenses with smart insights.</p>
                        </div>

                        {error && (
                            <div className="rounded-3xl border border-rose-500/10 bg-rose-500/10 p-4 text-sm text-rose-200">
                                <X size={16} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input w-full placeholder:text-slate-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
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
                                {password && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                            <div
                                                className={clsx('h-full transition-all duration-300', strength.color)}
                                                style={{ width: `${(strength.score / 3) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={clsx('text-xs font-semibold uppercase', strength.color.replace('bg-', 'text-'))}>
                                            {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        className={clsx(
                                            'input w-full placeholder:text-slate-500 pr-10 transition-colors',
                                            confirmPassword && (password === confirmPassword
                                                ? 'border-emerald-500 focus:ring-emerald-500/20'
                                                : 'border-rose-500 focus:ring-rose-500/20')
                                        )}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    {confirmPassword && (
                                        <div className={clsx(
                                            'absolute right-3 top-1/2 -translate-y-1/2 transition-colors',
                                            password === confirmPassword ? 'text-emerald-500' : 'text-rose-500'
                                        )}>
                                            {password === confirmPassword ? <Check size={18} /> : <X size={18} />}
                                        </div>
                                    )}
                                </div>
                                {confirmPassword && (
                                    <p className={clsx('text-xs mt-1 transition-colors', password === confirmPassword ? 'text-emerald-400' : 'text-rose-400')}>
                                        {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                    </p>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-full py-3 text-base font-semibold shadow-xl shadow-primary/20">
                                Create Account
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-400 pt-2">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-semibold hover:text-sky-300">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
