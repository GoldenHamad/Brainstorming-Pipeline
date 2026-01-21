import { Link, useLocation } from 'react-router-dom';
import { Search, Plus, LayoutDashboard, ClipboardCheck, User, Lightbulb } from 'lucide-react';
import './Header.css';

export function Header() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-container container">
                <Link to="/" className="header-logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="8" fill="#00338D" />
                            <path d="M10 12L16 20L10 28H14L20 20L14 12H10Z" fill="white" />
                            <path d="M18 12L24 20L18 28H22L30 17H26L22 12H18Z" fill="white" />
                            <path d="M26 20L30 28H26L24 24L26 20Z" fill="white" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="logo-title">KPMG</span>
                        <span className="logo-subtitle">Prompt Datastore</span>
                    </div>
                </Link>

                <nav className="header-nav">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        <Search size={18} />
                        <span>Browse</span>
                    </Link>
                    <Link
                        to="/submit"
                        className={`nav-link ${isActive('/submit') ? 'active' : ''}`}
                    >
                        <Plus size={18} />
                        <span>Submit</span>
                    </Link>
                    <Link
                        to="/review"
                        className={`nav-link ${isActive('/review') ? 'active' : ''}`}
                    >
                        <ClipboardCheck size={18} />
                        <span>Review</span>
                    </Link>
                    <Link
                        to="/analytics"
                        className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Analytics</span>
                    </Link>
                    <Link
                        to="/ideas"
                        className={`nav-link ${location.pathname.startsWith('/ideas') ? 'active' : ''}`}
                    >
                        <Lightbulb size={18} />
                        <span>Ideas</span>
                    </Link>
                </nav>

                <div className="header-actions">
                    <button className="user-menu">
                        <User size={20} />
                        <span className="user-name">Demo User</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
