import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Lightbulb } from 'lucide-react';
import { ideaService } from '../services/ideaService';
import { aiCapabilityAreas, businessFunctions, AICapabilityArea, BusinessFunction } from '../data/ideas';
import { useToast } from '../components/Toast';
import './SubmitIdeaPage.css';

interface FormData {
    title: string;
    description: string;
    aiCapabilityArea: AICapabilityArea | '';
    businessFunction: BusinessFunction | '';
    expectedBenefits: string;
    submitterName: string;
    submitterEmail: string;
}

interface FormErrors {
    [key: string]: string;
}

export function SubmitIdeaPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        aiCapabilityArea: '',
        businessFunction: '',
        expectedBenefits: '',
        submitterName: '',
        submitterEmail: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Idea name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
        if (!formData.aiCapabilityArea) newErrors.aiCapabilityArea = 'AI capability area is required';
        if (!formData.businessFunction) newErrors.businessFunction = 'Business function is required';
        if (!formData.submitterName.trim()) newErrors.submitterName = 'Your name is required';
        if (!formData.submitterEmail.trim()) {
            newErrors.submitterEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
            newErrors.submitterEmail = 'Invalid email format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        setSubmitting(true);

        try {
            await ideaService.submitIdea({
                title: formData.title,
                description: formData.description,
                aiCapabilityArea: formData.aiCapabilityArea as AICapabilityArea,
                businessFunction: formData.businessFunction as BusinessFunction,
                expectedBenefits: formData.expectedBenefits,
                submitterName: formData.submitterName,
                submitterEmail: formData.submitterEmail
            });

            showToast('Idea submitted successfully! It will be reviewed by the assessment team.', 'success');
            navigate('/ideas');
        } catch {
            showToast('Failed to submit idea. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="submit-idea-page">
            <div className="container">
                <div className="submit-idea-header">
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <div className="header-content">
                        <Lightbulb size={32} className="header-icon" />
                        <div>
                            <h1>Submit a New AI Use Case Idea</h1>
                            <p>Share your ideas for applying AI within KPMG. Submitted ideas will be assessed by the AI Strategy team.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="submit-idea-form">
                    <div className="form-section">
                        <h2>Idea Details</h2>

                        <div className="form-group">
                            <label htmlFor="title" className="form-label required">Idea Name</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`form-input ${errors.title ? 'error' : ''}`}
                                placeholder="E.g., Automated Contract Review System"
                            />
                            {errors.title && <span className="form-error">{errors.title}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label required">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`form-textarea ${errors.description ? 'error' : ''}`}
                                rows={5}
                                placeholder="Describe the AI use case in detail. What problem does it solve? How would it work?"
                            />
                            <span className="form-hint">Minimum 50 characters. Be specific about the use case.</span>
                            {errors.description && <span className="form-error">{errors.description}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="aiCapabilityArea" className="form-label required">AI Capability Area</label>
                                <select
                                    id="aiCapabilityArea"
                                    name="aiCapabilityArea"
                                    value={formData.aiCapabilityArea}
                                    onChange={handleInputChange}
                                    className={`form-select ${errors.aiCapabilityArea ? 'error' : ''}`}
                                >
                                    <option value="">Select capability area</option>
                                    {aiCapabilityAreas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                                {errors.aiCapabilityArea && <span className="form-error">{errors.aiCapabilityArea}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="businessFunction" className="form-label required">Target Business Function</label>
                                <select
                                    id="businessFunction"
                                    name="businessFunction"
                                    value={formData.businessFunction}
                                    onChange={handleInputChange}
                                    className={`form-select ${errors.businessFunction ? 'error' : ''}`}
                                >
                                    <option value="">Select function</option>
                                    {businessFunctions.map(fn => (
                                        <option key={fn} value={fn}>{fn}</option>
                                    ))}
                                </select>
                                {errors.businessFunction && <span className="form-error">{errors.businessFunction}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="expectedBenefits" className="form-label">Expected Benefits</label>
                            <textarea
                                id="expectedBenefits"
                                name="expectedBenefits"
                                value={formData.expectedBenefits}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows={3}
                                placeholder="What benefits would this AI use case deliver? (e.g., time savings, cost reduction, quality improvement)"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Your Information</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="submitterName" className="form-label required">Your Name</label>
                                <input
                                    type="text"
                                    id="submitterName"
                                    name="submitterName"
                                    value={formData.submitterName}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.submitterName ? 'error' : ''}`}
                                    placeholder="Full name"
                                />
                                {errors.submitterName && <span className="form-error">{errors.submitterName}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="submitterEmail" className="form-label required">Email Address</label>
                                <input
                                    type="email"
                                    id="submitterEmail"
                                    name="submitterEmail"
                                    value={formData.submitterEmail}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.submitterEmail ? 'error' : ''}`}
                                    placeholder="your.email@kpmg.com"
                                />
                                {errors.submitterEmail && <span className="form-error">{errors.submitterEmail}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                            <Send size={18} />
                            {submitting ? 'Submitting...' : 'Submit Idea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
