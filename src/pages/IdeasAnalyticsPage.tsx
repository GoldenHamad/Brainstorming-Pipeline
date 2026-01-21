import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, Lightbulb, ArrowRight, Download, PieChart } from 'lucide-react';
import { ideaService } from '../services/ideaService';
import { IdeasAnalytics, quadrantInfo } from '../data/ideas';
import { PriorityMatrix } from '../components/PriorityMatrix';
import { QuadrantBadge } from '../components/QuadrantBadge';
import './IdeasAnalyticsPage.css';

export function IdeasAnalyticsPage() {
    const [analytics, setAnalytics] = useState<IdeasAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            const data = await ideaService.getAnalytics();
            setAnalytics(data);
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    if (loading || !analytics) {
        return (
            <div className="analytics-loading">
                <div className="loading-spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    const totalAssessed = Object.values(analytics.byQuadrant).reduce((a, b) => a + b, 0);

    return (
        <div className="ideas-analytics-page">
            <div className="container">
                <header className="analytics-header">
                    <div>
                        <h1>Ideas Analytics</h1>
                        <p>Balanced scorecard and prioritization overview of AI use case ideas.</p>
                    </div>
                    <button className="btn btn-secondary">
                        <Download size={18} />
                        Export Report
                    </button>
                </header>

                {/* Balanced Scorecard KPIs */}
                <section className="kpi-section">
                    <h2><BarChart3 size={20} /> Balanced Scorecard</h2>
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <div className="kpi-icon" style={{ backgroundColor: 'rgba(0, 51, 141, 0.1)' }}>
                                <Lightbulb size={24} color="#00338D" />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{analytics.totalIdeas}</span>
                                <span className="kpi-label">Total Ideas</span>
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
                                <Target size={24} color="#28A745" />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{totalAssessed}</span>
                                <span className="kpi-label">Assessed</span>
                            </div>
                        </div>

                        <div className="kpi-card highlight-wins">
                            <div className="kpi-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
                                <TrendingUp size={24} color="#28A745" />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{analytics.byQuadrant.likely_wins}</span>
                                <span className="kpi-label">Likely Wins</span>
                            </div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.15)' }}>
                                <PieChart size={24} color="#997404" />
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-value">{analytics.byQuadrant.calculated_risks}</span>
                                <span className="kpi-label">Calculated Risks</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Priority Matrix */}
                <section className="matrix-section card">
                    <div className="section-header">
                        <h2>Priority Matrix</h2>
                        <Link to="/ideas" className="view-all-link">
                            View all ideas <ArrowRight size={16} />
                        </Link>
                    </div>
                    <PriorityMatrix ideas={analytics.assessedIdeas} />
                </section>

                {/* Quadrant Distribution */}
                <section className="distribution-section">
                    <h2>Quadrant Distribution</h2>
                    <div className="quadrant-cards">
                        {(Object.entries(quadrantInfo) as [keyof typeof quadrantInfo, typeof quadrantInfo[keyof typeof quadrantInfo]][]).map(([key, info]) => (
                            <div key={key} className="quadrant-card" style={{ borderColor: info.color }}>
                                <div className="quadrant-header">
                                    <QuadrantBadge quadrant={key} size="md" />
                                    <span className="quadrant-count">{analytics.byQuadrant[key]}</span>
                                </div>
                                <p className="quadrant-desc">{info.description}</p>
                                {analytics.assessedIdeas.filter(i => i.assessment?.quadrant === key).length > 0 && (
                                    <div className="quadrant-ideas">
                                        {analytics.assessedIdeas
                                            .filter(i => i.assessment?.quadrant === key)
                                            .slice(0, 3)
                                            .map(idea => (
                                                <Link key={idea.id} to={`/ideas/${idea.id}`} className="quadrant-idea-link">
                                                    {idea.title}
                                                </Link>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top Ideas by Value */}
                <section className="leaderboard-section card">
                    <h2>Top Ideas by Value Score</h2>
                    <div className="leaderboard">
                        <div className="leaderboard-header">
                            <span>Rank</span>
                            <span>Idea</span>
                            <span>Value</span>
                            <span>Feasibility</span>
                            <span>Quadrant</span>
                        </div>
                        {analytics.assessedIdeas
                            .sort((a, b) => (b.assessment?.valueScore || 0) - (a.assessment?.valueScore || 0))
                            .slice(0, 5)
                            .map((idea, index) => (
                                <Link key={idea.id} to={`/ideas/${idea.id}`} className="leaderboard-row">
                                    <span className="rank">#{index + 1}</span>
                                    <span className="idea-name">{idea.title}</span>
                                    <span className="score">{idea.assessment?.valueScore.toFixed(2)}</span>
                                    <span className="score">{idea.assessment?.feasibilityScore.toFixed(2)}</span>
                                    <QuadrantBadge quadrant={idea.assessment!.quadrant} size="sm" />
                                </Link>
                            ))}
                    </div>
                </section>

                {/* Breakdown by Function & Capability */}
                <div className="breakdown-grid">
                    <section className="card">
                        <h2>By Business Function</h2>
                        <div className="breakdown-list">
                            {analytics.byBusinessFunction
                                .sort((a, b) => b.count - a.count)
                                .map(item => (
                                    <div key={item.function} className="breakdown-item">
                                        <span className="breakdown-label">{item.function}</span>
                                        <div className="breakdown-bar-wrap">
                                            <div
                                                className="breakdown-bar"
                                                style={{ width: `${(item.count / analytics.totalIdeas) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="breakdown-count">{item.count}</span>
                                    </div>
                                ))}
                        </div>
                    </section>

                    <section className="card">
                        <h2>By AI Capability</h2>
                        <div className="breakdown-list">
                            {analytics.byCapabilityArea
                                .sort((a, b) => b.count - a.count)
                                .map(item => (
                                    <div key={item.area} className="breakdown-item">
                                        <span className="breakdown-label">{item.area}</span>
                                        <div className="breakdown-bar-wrap">
                                            <div
                                                className="breakdown-bar capability"
                                                style={{ width: `${(item.count / analytics.totalIdeas) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="breakdown-count">{item.count}</span>
                                    </div>
                                ))}
                        </div>
                    </section>
                </div>

                {/* Status Pipeline */}
                <section className="status-section card">
                    <h2>Idea Pipeline Status</h2>
                    <div className="status-pipeline">
                        <div className="pipeline-stage">
                            <span className="stage-count">{analytics.byStatus.submitted}</span>
                            <span className="stage-label">Submitted</span>
                        </div>
                        <div className="pipeline-arrow">→</div>
                        <div className="pipeline-stage">
                            <span className="stage-count">{analytics.byStatus.under_review}</span>
                            <span className="stage-label">Under Review</span>
                        </div>
                        <div className="pipeline-arrow">→</div>
                        <div className="pipeline-stage">
                            <span className="stage-count">{analytics.byStatus.assessed}</span>
                            <span className="stage-label">Assessed</span>
                        </div>
                        <div className="pipeline-arrow">→</div>
                        <div className="pipeline-stage highlight">
                            <span className="stage-count">{analytics.byStatus.prioritized}</span>
                            <span className="stage-label">Prioritized</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
