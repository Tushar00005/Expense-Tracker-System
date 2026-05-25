import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import {
    LayoutDashboard,
    Receipt,
    PieChart,
    LogOut,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Expenses', path: '/expenses', icon: Receipt },
        { name: 'Analytics', path: '/analytics', icon: PieChart },
    ];

    const NavLink = ({ item, mobile = false }) => (
        <Link
            to={item.path}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                location.pathname === item.path
                    ? isDark
                        ? "bg-[#1DA1F2] text-white shadow-lg shadow-[#1DA1F2]/20"
                        : "bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/20"
                    : isDark
                        ? "text-slate-300 hover:bg-[#0B1120]"
                        : "text-slate-700 hover:bg-[#E2E8F0]"
            )}
        >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
        </Link>
    );

    return (
        <div className={clsx(
            "flex h-screen overflow-hidden transition-colors duration-300",
            isDark ? "bg-[#050816] text-white" : "bg-[#F8FAFC] text-[#0F172A]"
        )}>
            {/* Sidebar (Desktop) */}
            <aside className={clsx(
                "hidden md:flex flex-col w-64 border-r transition-colors duration-300",
                isDark ? "bg-[#050816] border-[#111827]" : "bg-white border-[#E2E8F0]"
            )}>
                <div className="p-6 border-b border-[#111827] text-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ExpenseTracker
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink key={item.path} item={item} />
                    ))}
                </nav>

                <div className="p-4 border-t border-[#111827] space-y-2">
                    <button
                        onClick={toggleTheme}
                        className={clsx(
                            "flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isDark ? "text-slate-300 hover:bg-[#0B1120]" : "text-[#0F172A] hover:bg-[#E2E8F0]"
                        )}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                    <button
                        onClick={logout}
                        className={clsx(
                            "flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isDark ? "text-red-400 hover:bg-[#0B1120]" : "text-red-600 hover:bg-[#E2E8F0]"
                        )}
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>

                    <div className="px-4 py-2 text-xs text-slate-400 text-center">
                        Logged in as {user?.name}
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className={clsx(
                    "md:hidden flex items-center justify-between p-4 border-b transition-colors duration-300",
                    isDark ? "bg-[#050816] border-[#111827]" : "bg-[#F8FAFC] border-[#E2E8F0]"
                )}>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ExpenseTracker
                    </h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={clsx("p-2 transition-colors duration-200", isDark ? "text-slate-300" : "text-[#0F172A]")}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className={clsx(
                        "absolute inset-0 z-50 p-4 transition-all duration-300 md:hidden flex flex-col",
                        isDark ? "bg-[#050816]" : "bg-[#F8FAFC]"
                    )}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className={clsx(isDark ? 'text-slate-400' : 'text-[#0F172A]')} />
                            </button>
                        </div>
                        <nav className="space-y-2 flex-1">
                            {navItems.map((item) => (
                                <NavLink key={item.path} item={item} mobile />
                            ))}
                        </nav>
                        <div className="mt-auto space-y-2">
                            <button
                                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-[#0B1120] transition-all"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                                <span className="font-medium">Switch Theme</span>
                            </button>
                            <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-[#0B1120] transition-all">
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Scrollable */}
                <main className={clsx(
                    "flex-1 overflow-y-auto p-4 md:p-8 relative transition-colors duration-300",
                    isDark ? "bg-[#050816]" : "bg-[#F8FAFC]"
                )}>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
