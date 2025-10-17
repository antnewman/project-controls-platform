import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import RiskAnalysis from './pages/RiskAnalysis';
import WBSGenerator from './pages/WBSGenerator';
import IntegratedWorkflow from './pages/IntegratedWorkflow';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/wbs-generator" element={<WBSGenerator />} />
          <Route path="/integrated" element={<IntegratedWorkflow />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
