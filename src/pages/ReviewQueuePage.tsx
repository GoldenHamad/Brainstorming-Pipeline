import { useState, useEffect } from 'react';
import { Clock, Check, X, Eye, MessageSquare, User, Calendar } from 'lucide-react';
import { promptService } from '../services/promptService';
import { PromptEntry } from '../data/prompts';
import { useToast } from '../components/Toast';
import './ReviewQueuePage.css';

type Submission = PromptEntry & {
    submitter_name: string;
    submitter_email: string;
    submitted_at: string;
};

export function ReviewQueuePage() {
    const { showToast } = useToast();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [rejectionFeedback, setRejectionFeedback] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        const pending = await promptService.getPendingSubmissions();
        setSubmissions(pending as Submission[]);
        setLoading(false);
    };

    const handleApprove = async (submission: Submission) => {
        try {
            await promptService.approveSubmission(submission.prompt_id);
            showToast(`"${submission.title}" has been approved and published!`, 'success');
            setSubmissions(prev => prev.filter(s => s.prompt_id !== submission.prompt_id));
            setSelectedSubmission(null);
        } catch {
            showToast('Failed to approve submission', 'error');
        }
    };

    const handleReject = async () => {
        if (!selectedSubmission || !rejectionFeedback.trim()) {
            showToast('Please provide feedback for rejection', 'warning');
            return;
        }

        try {
            await promptService.rejectSubmission(selectedSubmission.prompt_id, rejectionFeedback);
            showToast(`"${selectedSubmission.title}" has been rejected`, 'info');
            setSubmissions(prev => prev.filter(s => s.prompt_id !== selectedSubmission.prompt_id));
            setSelectedSubmission(null);
            setShowRejectModal(false);
            setRejectionFeedback('');
        } catch {
            showToast('Failed to reject submission', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="review-page-loading">
                <div className="loading-spinner"></div>
                <p>Loading submissions...</p>
            </div>
        );
    }

    return (
        <div className="review-page">
            <div className="container">
                <header className="review-header">
                    <div className="review-header-content">
                        <h1>Review Queue</h1>
                        <p>Review and approve submitted prompts before they are published to the library.</p>
                    </div>
                    <div className="review-stats">
                        <div className="stat-badge">
                            <Clock size={18} />
                            <span>{submissions.length} pending</span>
                        </div>
                    </div>
                </header>

                <div className="review-layout">
                    {/* Submissions List */}
                    <div className="submissions-list">
                        {submissions.length === 0 ? (
                            <div className="empty-queue">
                                <Check size={48} />
                                <h3>All caught up!</h3>
                                <p>There are no pending submissions to review.</p>
                            </div>
                        ) : (
                            submissions.map(submission => (
                                <button
                                    key={submission.prompt_id}
                                    className={`submission-card ${selectedSubmission?.prompt_id === submission.prompt_id ? 'selected' : ''}`}
                                    onClick={() => setSelectedSubmission(submission)}
                                >
                                    <div className="submission-card-header">
                                        <span className="submission-category">{submission.category}</span>
                                        <span className="submission-time">
                                            <Clock size={12} />
                                            {formatDate(submission.submitted_at)}
                                        </span>
                                    </div>
                                    <h3 className="submission-title">{submission.title}</h3>
                                    <div className="submission-meta">
                                        <span className="submitter">
                                            <User size={14} />
                                            {submission.submitter_name}
                                        </span>
                                        <span className={`complexity badge-${submission.complexity_level.toLowerCase()}`}>
                                            {submission.complexity_level}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Review Panel */}
                    <div className="review-panel">
                        {selectedSubmission ? (
                            <>
                                <div className="review-panel-header">
                                    <h2>{selectedSubmission.title}</h2>
                                    <div className="review-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowRejectModal(true);
                                            }}
                                        >
                                            <X size={18} />
                                            Reject
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleApprove(selectedSubmission)}
                                        >
                                            <Check size={18} />
                                            Approve
                                        </button>
                                    </div>
                                </div>

                                <div className="review-content">
                                    <div className="review-meta-grid">
                                        <div className="meta-item">
                                            <span className="meta-label">Category</span>
                                            <span className="meta-value">{selectedSubmission.category}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Complexity</span>
                                            <span className={`meta-value badge-${selectedSubmission.complexity_level.toLowerCase()}`}>
                                                {selectedSubmission.complexity_level}
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Output Format</span>
                                            <span className="meta-value">{selectedSubmission.output_format}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Owner</span>
                                            <span className="meta-value">{selectedSubmission.owner}</span>
                                        </div>
                                    </div>

                                    <div className="review-section">
                                        <h3>
                                            <Eye size={18} />
                                            Prompt Text
                                        </h3>
                                        <pre className="prompt-preview">{selectedSubmission.prompt_text}</pre>
                                    </div>

                                    {selectedSubmission.best_practices && (
                                        <div className="review-section">
                                            <h3>Best Practices</h3>
                                            <p>{selectedSubmission.best_practices}</p>
                                        </div>
                                    )}

                                    <div className="review-section">
                                        <h3>AI Tools</h3>
                                        <div className="tools-list">
                                            {selectedSubmission.ai_tools.map(tool => (
                                                <span key={tool} className="tool-pill">{tool}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="review-section">
                                        <h3>Tags</h3>
                                        <div className="tags-list">
                                            {selectedSubmission.tags.map(tag => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="submitter-info">
                                        <h3>Submitted By</h3>
                                        <div className="submitter-details">
                                            <div className="submitter-avatar">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <p className="submitter-name">{selectedSubmission.submitter_name}</p>
                                                <p className="submitter-email">{selectedSubmission.submitter_email}</p>
                                                <p className="submitted-date">
                                                    <Calendar size={14} />
                                                    {formatDate(selectedSubmission.submitted_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <MessageSquare size={48} />
                                <h3>Select a submission</h3>
                                <p>Click on a submission from the list to review its details.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <h3>Reject Submission</h3>
                            <p>Please provide feedback explaining why this submission is being rejected.</p>
                            <textarea
                                value={rejectionFeedback}
                                onChange={(e) => setRejectionFeedback(e.target.value)}
                                placeholder="Enter feedback for the submitter..."
                                className="form-textarea"
                                rows={4}
                            />
                            <div className="modal-actions">
                                <button className="btn btn-ghost" onClick={() => setShowRejectModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleReject}
                                    disabled={!rejectionFeedback.trim()}
                                >
                                    Send Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
