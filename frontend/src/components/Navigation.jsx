import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    // 🔥 FIX: Sync navbar with login/logout using route change
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/about', label: 'About', icon: 'ℹ️' },
        { path: '/contact', label: 'Contact', icon: '📧' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-xl border-b-2 border-slate-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl">📦</span>
                        </div>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                            Scanventory
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    isActive(link.path)
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                                }`}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}

                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive('/login')
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                                    }`}
                                >
                                    🔐 Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive('/signup')
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                                    }`}
                                >
                                    👤 Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/profile"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive('/profile')
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                                    }`}
                                >
                                    👤 Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-red-500 transition-all"
                                >
                                    🚪 Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200"
                    >
                        <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-semibold ${
                                        isActive(link.path)
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                            : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {link.icon} {link.label}
                                </Link>
                            ))}

                            {!user ? (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>🔐 Login</Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>👤 Sign Up</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>👤 Profile</Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-left px-4 py-3 text-red-500"
                                    >
                                        🚪 Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;
