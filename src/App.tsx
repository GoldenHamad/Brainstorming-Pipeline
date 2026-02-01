import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ToastProvider } from './components/Toast';

// Ideas - Primary Feature
import { IdeasDashboard } from './pages/IdeasDashboard';
import { SubmitIdeaPage } from './pages/SubmitIdeaPage';
import { PipelinePage } from './pages/PipelinePage';
import { IdeaDetailPage } from './pages/IdeaDetailPage';
import { IdeasAnalyticsPage } from './pages/IdeasAnalyticsPage';

// Prompts - Resources (Secondary)
import { PromptLibraryPage } from './pages/PromptLibraryPage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { SubmitPage } from './pages/SubmitPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { AnalyticsPage } from './pages/AnalyticsPage';

function App() {
    return (
        <HashRouter>
            <ToastProvider>
                <div className="app">
                    <Header />
                    <main className="page-wrapper">
                        <Routes>
                            {/* Ideas - Primary Routes */}
                            <Route path="/" element={<IdeasDashboard />} />
                            <Route path="/submit" element={<SubmitIdeaPage />} />
                            <Route path="/pipeline" element={<PipelinePage />} />
                            <Route path="/idea/:id" element={<IdeaDetailPage />} />
                            <Route path="/analytics" element={<IdeasAnalyticsPage />} />

                            {/* Resources - Prompt Library (Secondary) */}
                            <Route path="/resources/prompts" element={<PromptLibraryPage />} />
                            <Route path="/resources/prompts/:id" element={<PromptDetailPage />} />
                            <Route path="/resources/prompts/submit" element={<SubmitPage />} />
                            <Route path="/resources/prompts/review" element={<ReviewQueuePage />} />
                            <Route path="/resources/prompts/analytics" element={<AnalyticsPage />} />
                        </Routes>
                    </main>
                </div>
            </ToastProvider>
        </HashRouter>
    );
}

export default App;
