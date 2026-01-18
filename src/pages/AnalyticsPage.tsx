import { useState, useEffect } from 'react';
import { TrendingUp, Users, Copy, FileText, Star, Download, Calendar } from 'lucide-react';
import { promptService } from '../services/promptService';
import { AnalyticsData } from '../data/prompts';
import './AnalyticsPage.css';

export function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            const data = await promptService.getAnalytics();
            setAnalytics(data);
            setLoading(false);
        };
        fetchAnalytics();
    }, [timeRange]);

    if (loading || !analytics) {
        return (
            <div className="analytics-loading">
                <div className="loading-spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    const maxCopies = Math.max(...analytics.daily_usage.map(d => d.copies));

    return (
        <div className="analytics-page">
            <div className="container">
                <header className="analytics-header">
                    <div className="analytics-header-content">
                        <h1>Analytics Dashboard</h1>
                        <p>Monitor platform usage, adoption metrics, and prompt performance.</p>
                    </div>
                    <div className="analytics-actions">
                        <div className="time-range-selector">
                            <button
                                className={timeRange === '7d' ? 'active' : ''}
                                onClick={() => setTimeRange('7d')}
                            >
                                7 Days
                            </button>
                            <button
                                className={timeRange === '30d' ? 'active' : ''}
                                onClick={() => setTimeRange('30d')}
                            >
                                30 Days
                            </button>
                            <button
                                className={timeRange === '90d' ? 'active' : ''}
                                onClick={() => setTimeRange('90d')}
                            >
                                90 Days
                            </button>
                        </div>
                        <button className="btn btn-secondary">
                            <Download size={18} />
                            Export Report
                        </button>
                    </div>
                </header>

                {/* KPI Cards */}
                <section className="kpi-section">
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <div className="kpi-icon users">
                                <Users size={24} />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{analytics.total_users.toLocaleString()}</span>
                                <span className="kpi-label">Total Users</span>
                            </div>
                            <span className="kpi-trend positive">+12% vs last month</span>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-icon prompts">
                                <FileText size={24} />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{analytics.total_prompts}</span>
                                <span className="kpi-label">Published Prompts</span>
                            </div>
                            <span className="kpi-trend positive">+3 this week</span>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-icon copies">
                                <Copy size={24} />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{analytics.total_copies.toLocaleString()}</span>
                                <span className="kpi-label">Total Copies</span>
                            </div>
                            <span className="kpi-trend positive">+8% vs last month</span>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-icon rating">
                                <Star size={24} />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{analytics.average_rating.toFixed(2)}</span>
                                <span className="kpi-label">Avg. Rating</span>
                            </div>
                            <span className="kpi-trend neutral">Stable</span>
                        </div>
                    </div>
                </section>

                {/* Charts Section */}
                <section className="charts-section">
                    <div className="chart-card">
                        <div className="chart-header">
                            <h2>
                                <TrendingUp size={20} />
                                Usage Trends
                            </h2>
                            <div className="chart-legend">
                                <span className="legend-item copies">
                                    <span className="legend-dot"></span>
                                    Copies
                                </span>
                                <span className="legend-item views">
                                    <span className="legend-dot"></span>
                                    Views
                                </span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <div className="bar-chart">
                                {analytics.daily_usage.map((day, index) => (
                                    <div key={index} className="bar-group">
                                        <div className="bar-container">
                                            <div
                                                className="bar copies-bar"
                                                style={{ height: `${(day.copies / maxCopies) * 100}%` }}
                                            >
                                                <span className="bar-tooltip">{day.copies} copies</span>
                                            </div>
                                        </div>
                                        <span className="bar-label">
                                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h2>
                                <Calendar size={20} />
                                Category Distribution
                            </h2>
                        </div>
                        <div className="category-chart">
                            {analytics.category_distribution.map((cat, index) => {
                                const totalPrompts = analytics.category_distribution.reduce((a, b) => a + b.count, 0);
                                const percentage = Math.round((cat.count / totalPrompts) * 100);
                                const colors = ['#00338D', '#483698', '#00A3A1', '#28A745', '#FF6B35', '#6C757D'];

                                return (
                                    <div key={cat.category} className="category-bar-item">
                                        <div className="category-bar-header">
                                            <span className="category-name">{cat.category}</span>
                                            <span className="category-count">{cat.count} prompts ({percentage}%)</span>
                                        </div>
                                        <div className="category-bar-track">
                                            <div
                                                className="category-bar-fill"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: colors[index % colors.length]
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Top Prompts Leaderboard */}
                <section className="leaderboard-section">
                    <div className="leaderboard-card">
                        <div className="leaderboard-header">
                            <h2>
                                <TrendingUp size={20} />
                                Top 10 Most Used Prompts
                            </h2>
                        </div>
                        <div className="leaderboard-table">
                            <div className="table-header">
                                <span className="col-rank">#</span>
                                <span className="col-title">Prompt Title</span>
                                <span className="col-copies">Copies</span>
                                <span className="col-bar"></span>
                            </div>
                            {analytics.top_prompts.map((prompt, index) => {
                                const maxTopCopies = analytics.top_prompts[0].copies;
                                const barWidth = (prompt.copies / maxTopCopies) * 100;

                                return (
                                    <div key={prompt.prompt_id} className="table-row">
                                        <span className="col-rank">
                                            <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                                        </span>
                                        <span className="col-title">{prompt.title}</span>
                                        <span className="col-copies">{prompt.copies.toLocaleString()}</span>
                                        <span className="col-bar">
                                            <div className="mini-bar">
                                                <div
                                                    className="mini-bar-fill"
                                                    style={{ width: `${barWidth}%` }}
                                                ></div>
                                            </div>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Quick Stats */}
                <section className="quick-stats-section">
                    <div className="quick-stat-card">
                        <h3>Pending Reviews</h3>
                        <span className="quick-stat-value">{analytics.total_submissions - analytics.total_prompts}</span>
                        <p>Submissions awaiting approval</p>
                    </div>
                    <div className="quick-stat-card">
                        <h3>This Week</h3>
                        <span className="quick-stat-value">
                            {analytics.daily_usage.reduce((a, b) => a + b.copies, 0).toLocaleString()}
                        </span>
                        <p>Prompt copies made</p>
                    </div>
                    <div className="quick-stat-card">
                        <h3>Adoption Rate</h3>
                        <span className="quick-stat-value">
                            {Math.round((analytics.total_copies / analytics.total_users) * 10) / 10}
                        </span>
                        <p>Avg. copies per user</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
