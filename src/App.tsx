import { HashRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ToastProvider } from './components/Toast';
import { HomePage } from './pages/HomePage';
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
                            <Route path="/" element={<HomePage />} />
                            <Route path="/prompt/:id" element={<PromptDetailPage />} />
                            <Route path="/submit" element={<SubmitPage />} />
                            <Route path="/review" element={<ReviewQueuePage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                        </Routes>
                    </main>
                </div>
            </ToastProvider>
        </HashRouter>
    );
}

export default App;
