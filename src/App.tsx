import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import RiskAnalysis from './pages/RiskAnalysis';
import WBSGenerator from './pages/WBSGenerator';
import LessonsLibrary from './pages/LessonsLibrary';
import IntegratedWorkflow from './pages/IntegratedWorkflow';
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';
import LessonsSMEAgent from './components/lessons/LessonsSMEAgent';

function AppContent() {
  const location = useLocation();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/risk-analysis" element={<RiskAnalysis />} />
        <Route path="/wbs-generator" element={<WBSGenerator />} />
        <Route path="/lessons-library" element={<LessonsLibrary />} />
        <Route path="/integrated" element={<IntegratedWorkflow />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<Test />} />
      </Routes>

      {/* Floating Lessons SME Agent - available on all pages */}
      <LessonsSMEAgent context={{ currentPage: location.pathname }} />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
