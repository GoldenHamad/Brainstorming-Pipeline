import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, GitBranch, BarChart3, BookOpen, User, ChevronDown } from 'lucide-react';
import './Header.css';

export function Header() {
    const location = useLocation();
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;
    const isResourcesActive = () => location.pathname.startsWith('/resources');

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setResourcesOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                        <span className="logo-title">Advisory</span>
                        <span className="logo-subtitle">AI Ideas</span>
                    </div>
                </Link>

                <nav className="header-nav">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/submit"
                        className={`nav-link ${isActive('/submit') ? 'active' : ''}`}
                    >
                        <Plus size={18} />
                        <span>Submit Idea</span>
                    </Link>
                    <Link
                        to="/pipeline"
                        className={`nav-link ${isActive('/pipeline') ? 'active' : ''}`}
                    >
                        <GitBranch size={18} />
                        <span>Pipeline</span>
                    </Link>
                    <Link
                        to="/analytics"
                        className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                    >
                        <BarChart3 size={18} />
                        <span>Analytics</span>
                    </Link>

                    {/* Resources Dropdown */}
                    <div className="nav-dropdown" ref={dropdownRef}>
                        <button
                            className={`nav-link nav-dropdown-trigger ${isResourcesActive() ? 'active' : ''}`}
                            onClick={() => setResourcesOpen(!resourcesOpen)}
                        >
                            <BookOpen size={18} />
                            <span>Resources</span>
                            <ChevronDown size={14} className={`dropdown-arrow ${resourcesOpen ? 'open' : ''}`} />
                        </button>
                        {resourcesOpen && (
                            <div className="nav-dropdown-menu">
                                <Link
                                    to="/resources/prompts"
                                    className="dropdown-item"
                                    onClick={() => setResourcesOpen(false)}
                                >
                                    Prompt Library
                                </Link>
                                <Link
                                    to="/resources/prompts/submit"
                                    className="dropdown-item"
                                    onClick={() => setResourcesOpen(false)}
                                >
                                    Submit Prompt
                                </Link>
                                <Link
                                    to="/resources/prompts/review"
                                    className="dropdown-item"
                                    onClick={() => setResourcesOpen(false)}
                                >
                                    Review Queue
                                </Link>
                            </div>
                        )}
                    </div>
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
