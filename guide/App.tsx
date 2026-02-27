import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LIGHT_THEME, DARK_THEME } from './constants/theme';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import QuickStartPage from './pages/QuickStartPage';
import FaqPage from './pages/FaqPage';
import StudentManagementTutorial from './pages/tutorials/StudentManagementTutorial';
import BehaviorRecordingTutorial from './pages/tutorials/BehaviorRecordingTutorial';
import WhiteboardTutorial from './pages/tutorials/WhiteboardTutorial';
import AiCommentTutorial from './pages/tutorials/AiCommentTutorial';
import EvaluationTagsTutorial from './pages/tutorials/EvaluationTagsTutorial';
import AbsenceTrackingTutorial from './pages/tutorials/AbsenceTrackingTutorial';
import ThemeSettingsTutorial from './pages/tutorials/ThemeSettingsTutorial';
import CsvExportTutorial from './pages/tutorials/CsvExportTutorial';
import SemesterArchiveTutorial from './pages/tutorials/SemesterArchiveTutorial';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('guide-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('guide-dark-mode', String(isDarkMode));
  }, [isDarkMode]);

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeProvider value={theme}>
      <HashRouter>
        <Layout isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quick-start" element={<QuickStartPage />} />
            <Route path="/tutorial/students" element={<StudentManagementTutorial />} />
            <Route path="/tutorial/behavior" element={<BehaviorRecordingTutorial />} />
            <Route path="/tutorial/whiteboard" element={<WhiteboardTutorial />} />
            <Route path="/tutorial/ai-comment" element={<AiCommentTutorial />} />
            <Route path="/tutorial/tags" element={<EvaluationTagsTutorial />} />
            <Route path="/tutorial/absence" element={<AbsenceTrackingTutorial />} />
            <Route path="/tutorial/theme" element={<ThemeSettingsTutorial />} />
            <Route path="/tutorial/export" element={<CsvExportTutorial />} />
            <Route path="/tutorial/archive" element={<SemesterArchiveTutorial />} />
            <Route path="/faq" element={<FaqPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}
