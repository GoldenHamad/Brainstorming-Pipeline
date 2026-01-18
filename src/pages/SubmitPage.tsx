import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Info } from 'lucide-react';
import { promptService } from '../services/promptService';
import { Category, ComplexityLevel, AITool, OutputFormat } from '../data/prompts';
import { useToast } from '../components/Toast';
import './SubmitPage.css';

const categories: Category[] = [
    'Client Deliverables',
    'Internal Productivity',
    'Research & Analysis',
    'Data & Finance',
    'Creative & Marketing',
    'Technical'
];

const complexityLevels: ComplexityLevel[] = ['Beginner', 'Intermediate', 'Expert'];

const outputFormats: OutputFormat[] = [
    'Bullet points',
    'Table',
    'Narrative',
    'Structured narrative with bullet points',
    'Code',
    'JSON',
    'Markdown'
];

const aiTools: AITool[] = ['ChatGPT', 'Microsoft Copilot', 'Google Gemini', 'Claude', 'Internal AI'];

interface FormData {
    title: string;
    category: Category | '';
    prompt_text: string;
    output_format: OutputFormat | '';
    example_input: string;
    example_output: string;
    complexity_level: ComplexityLevel | '';
    best_practices: string;
    owner: string;
    tags: string;
    ai_tools: AITool[];
    submitter_name: string;
    submitter_email: string;
}

interface FormErrors {
    [key: string]: string;
}

export function SubmitPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: '',
        prompt_text: '',
        output_format: '',
        example_input: '',
        example_output: '',
        complexity_level: '',
        best_practices: '',
        owner: '',
        tags: '',
        ai_tools: [],
        submitter_name: '',
        submitter_email: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.prompt_text.trim()) newErrors.prompt_text = 'Prompt text is required';
        if (formData.prompt_text.length < 50) newErrors.prompt_text = 'Prompt text must be at least 50 characters';
        if (!formData.output_format) newErrors.output_format = 'Output format is required';
        if (!formData.complexity_level) newErrors.complexity_level = 'Complexity level is required';
        if (!formData.owner.trim()) newErrors.owner = 'Owner/Team is required';
        if (formData.ai_tools.length === 0) newErrors.ai_tools = 'Select at least one AI tool';
        if (!formData.submitter_name.trim()) newErrors.submitter_name = 'Your name is required';
        if (!formData.submitter_email.trim()) {
            newErrors.submitter_email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitter_email)) {
            newErrors.submitter_email = 'Invalid email format';
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

    const handleToolToggle = (tool: AITool) => {
        setFormData(prev => ({
            ...prev,
            ai_tools: prev.ai_tools.includes(tool)
                ? prev.ai_tools.filter(t => t !== tool)
                : [...prev.ai_tools, tool]
        }));
        if (errors.ai_tools) {
            setErrors(prev => ({ ...prev, ai_tools: '' }));
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
            const tagsArray = formData.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            await promptService.submitPrompt({
                title: formData.title,
                category: formData.category as Category,
                prompt_text: formData.prompt_text,
                output_format: formData.output_format as OutputFormat,
                example_input: formData.example_input || undefined,
                example_output: formData.example_output || undefined,
                complexity_level: formData.complexity_level as ComplexityLevel,
                best_practices: formData.best_practices || undefined,
                owner: formData.owner,
                tags: tagsArray,
                ai_tools: formData.ai_tools,
                submitter_name: formData.submitter_name,
                submitter_email: formData.submitter_email
            });

            showToast('Prompt submitted successfully! It will be reviewed by a Category Owner.', 'success');
            navigate('/');
        } catch {
            showToast('Failed to submit prompt. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="submit-page">
            <div className="container">
                <div className="submit-header">
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <h1>Submit a New Prompt</h1>
                    <p className="submit-description">
                        Share your effective AI prompts with the KPMG community.
                        Submitted prompts will be reviewed by a Category Owner before being published.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="submit-form">
                    <div className="form-section">
                        <h2>Basic Information</h2>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="title" className="form-label required">Prompt Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.title ? 'error' : ''}`}
                                    placeholder="E.g., Executive Summary Generator"
                                />
                                {errors.title && <span className="form-error">{errors.title}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="category" className="form-label required">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`form-select ${errors.category ? 'error' : ''}`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <span className="form-error">{errors.category}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="prompt_text" className="form-label required">Prompt Text</label>
                            <textarea
                                id="prompt_text"
                                name="prompt_text"
                                value={formData.prompt_text}
                                onChange={handleInputChange}
                                className={`form-textarea ${errors.prompt_text ? 'error' : ''}`}
                                rows={8}
                                placeholder="Enter the full prompt text. Use [PLACEHOLDERS] for variable content..."
                            />
                            <span className="form-hint">Minimum 50 characters. Use [BRACKETS] for placeholder values.</span>
                            {errors.prompt_text && <span className="form-error">{errors.prompt_text}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="output_format" className="form-label required">Expected Output Format</label>
                                <select
                                    id="output_format"
                                    name="output_format"
                                    value={formData.output_format}
                                    onChange={handleInputChange}
                                    className={`form-select ${errors.output_format ? 'error' : ''}`}
                                >
                                    <option value="">Select format</option>
                                    {outputFormats.map(format => (
                                        <option key={format} value={format}>{format}</option>
                                    ))}
                                </select>
                                {errors.output_format && <span className="form-error">{errors.output_format}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="complexity_level" className="form-label required">Complexity Level</label>
                                <select
                                    id="complexity_level"
                                    name="complexity_level"
                                    value={formData.complexity_level}
                                    onChange={handleInputChange}
                                    className={`form-select ${errors.complexity_level ? 'error' : ''}`}
                                >
                                    <option value="">Select level</option>
                                    {complexityLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                {errors.complexity_level && <span className="form-error">{errors.complexity_level}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Examples & Best Practices</h2>

                        <div className="form-group">
                            <label htmlFor="example_input" className="form-label">Example Input</label>
                            <textarea
                                id="example_input"
                                name="example_input"
                                value={formData.example_input}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows={3}
                                placeholder="Provide a sample input that demonstrates how to use this prompt..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="example_output" className="form-label">Example Output</label>
                            <textarea
                                id="example_output"
                                name="example_output"
                                value={formData.example_output}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows={3}
                                placeholder="Show what the expected output looks like..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="best_practices" className="form-label">Best Practices</label>
                            <textarea
                                id="best_practices"
                                name="best_practices"
                                value={formData.best_practices}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows={3}
                                placeholder="Share tips for getting the best results from this prompt..."
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Metadata</h2>

                        <div className="form-group">
                            <label className="form-label required">Compatible AI Tools</label>
                            <div className={`checkbox-group ${errors.ai_tools ? 'error' : ''}`}>
                                {aiTools.map(tool => (
                                    <label key={tool} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={formData.ai_tools.includes(tool)}
                                            onChange={() => handleToolToggle(tool)}
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span>{tool}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.ai_tools && <span className="form-error">{errors.ai_tools}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="owner" className="form-label required">Owner / Team</label>
                                <input
                                    type="text"
                                    id="owner"
                                    name="owner"
                                    value={formData.owner}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.owner ? 'error' : ''}`}
                                    placeholder="E.g., Strategy Practice"
                                />
                                {errors.owner && <span className="form-error">{errors.owner}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="tags" className="form-label">Tags</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Comma-separated tags"
                                />
                                <span className="form-hint">E.g., strategy, executive summary, client deliverable</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Your Information</h2>

                        <div className="info-banner">
                            <Info size={18} />
                            <p>Your contact information will be used to notify you about the review status.</p>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="submitter_name" className="form-label required">Your Name</label>
                                <input
                                    type="text"
                                    id="submitter_name"
                                    name="submitter_name"
                                    value={formData.submitter_name}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.submitter_name ? 'error' : ''}`}
                                    placeholder="Full name"
                                />
                                {errors.submitter_name && <span className="form-error">{errors.submitter_name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="submitter_email" className="form-label required">Email Address</label>
                                <input
                                    type="email"
                                    id="submitter_email"
                                    name="submitter_email"
                                    value={formData.submitter_email}
                                    onChange={handleInputChange}
                                    className={`form-input ${errors.submitter_email ? 'error' : ''}`}
                                    placeholder="your.email@kpmg.com"
                                />
                                {errors.submitter_email && <span className="form-error">{errors.submitter_email}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                            <Send size={18} />
                            {submitting ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
