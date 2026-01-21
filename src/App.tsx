import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ToastProvider } from './components/Toast';
import { HomePage } from './pages/HomePage';
import { PromptDetailPage } from './pages/PromptDetailPage';
import { SubmitPage } from './pages/SubmitPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { IdeasDashboard } from './pages/IdeasDashboard';
import { SubmitIdeaPage } from './pages/SubmitIdeaPage';
import { AssessmentQueuePage } from './pages/AssessmentQueuePage';
import { IdeaDetailPage } from './pages/IdeaDetailPage';
import { IdeasAnalyticsPage } from './pages/IdeasAnalyticsPage';

function App() {
    return (
        <HashRouter>
            <ToastProvider>
                <div className="app">
                    <Header />
                    <main className="page-wrapper">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/prompt/:id" element={<PromptDetailPage />} />
                            <Route path="/submit" element={<SubmitPage />} />
                            <Route path="/review" element={<ReviewQueuePage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                            <Route path="/ideas" element={<IdeasDashboard />} />
                            <Route path="/ideas/submit" element={<SubmitIdeaPage />} />
                            <Route path="/ideas/assess" element={<AssessmentQueuePage />} />
                            <Route path="/ideas/:id" element={<IdeaDetailPage />} />
                            <Route path="/ideas/analytics" element={<IdeasAnalyticsPage />} />
                        </Routes>
                    </main>
                </div>
            </ToastProvider>
        </HashRouter>
    );
}

export default App;
