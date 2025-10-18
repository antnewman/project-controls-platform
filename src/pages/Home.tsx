import { Link } from 'react-router-dom';
import { AlertTriangle, Network, Workflow, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import Button from '../components/common/Button';

export default function Home() {
  const features = [
    {
      icon: <AlertTriangle className="h-10 w-10 text-primary-500" />,
      title: 'Risk Analysis',
      description:
        'Thoroughly analyze risk registers with SME heuristics. Receive quality scores and thoughtful feedback to ensure your risks are complete and well-defined.',
      href: '/risk-analysis',
    },
    {
      icon: <Network className="h-10 w-10 text-primary-500" />,
      title: 'WBS Generator',
      description:
        'Carefully transform project narratives into comprehensive Work Breakdown Structures. Methodically generate dependencies, resources, and milestones.',
      href: '/wbs-generator',
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary-500" />,
      title: 'Lessons Library',
      description:
        'Extract and organize lessons from Gateway reviews and assurance documents. Transform past insights into actionable intelligence with AI-powered categorization.',
      href: '/lessons-library',
    },
    {
      icon: <Workflow className="h-10 w-10 text-primary-500" />,
      title: 'Integrated Workflow',
      description:
        'Complete end-to-end workflow: Generate WBS → Identify risks → Review lessons → Analyze quality. Build your project plan step by step, building something solid.',
      href: '/integrated',
    },
  ];

  const keyPoints = [
    'AI-powered project planning tools',
    'Built for lasting results',
    'Comprehensive risk analysis',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Project Controls Intelligence Platform
          </h1>
          <p className="text-xl text-slate-600 mb-4 max-w-3xl mx-auto">
            AI-powered project planning with risk analysis, WBS generation, and lessons learned. Built carefully, designed for lasting results.
          </p>
          <p className="text-sm text-slate-500 italic mb-8">
            Steady progress. Lasting results.
          </p>

          {/* Green checkmarks with key features */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-slate-700">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="text-success w-5 h-5" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <Link to="/integrated">
              <Button size="lg" variant="primary" className="gap-2">
                Build Your Project <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/risk-analysis">
              <Button size="lg" variant="secondary">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Reliable Tools for Project Success
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Take your time exploring AI-enhanced project controls. Each tool is designed for thorough analysis and sustainable planning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary-50 group-hover:bg-primary-100 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <Link to={feature.href}>
                    <Button variant="secondary" className="w-full gap-2 group/btn">
                      Learn more
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">Thorough</div>
              <div className="text-slate-600">Risk Analysis</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">Reliable</div>
              <div className="text-slate-600">Results</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">100%</div>
              <div className="text-slate-600">CSV Compatible</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">Patient</div>
              <div className="text-slate-600">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Supporting Challenges 1, 2 & 4
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Complete project intelligence suite: Risk Analysis (Challenge 1), WBS Generation (Challenge 2), and Lessons Library (Challenge 4). Three challenges, one integrated platform.
          </p>
          <Link to="/integrated">
            <Button size="lg" variant="primary" className="gap-2">
              Begin Integrated Workflow <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
