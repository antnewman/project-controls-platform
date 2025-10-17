import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import RiskAnalysis from './pages/RiskAnalysis';
import WBSGenerator from './pages/WBSGenerator';
import IntegratedWorkflow from './pages/IntegratedWorkflow';
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';

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
          <Route path="/test" element={<Test />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
