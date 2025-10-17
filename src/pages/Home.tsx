import { Link } from 'react-router-dom';
import { AlertTriangle, Network, Workflow, ArrowRight, Check } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

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
      icon: <Workflow className="h-10 w-10 text-primary-500" />,
      title: 'Integrated Workflow',
      description:
        'Complete end-to-end workflow: Generate WBS → Identify risks → Analyze quality. Build your project plan step by step, building something solid.',
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
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
              Project Controls{' '}
              <span className="text-primary-500">
                Intelligence Platform
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              AI-powered project planning built carefully, designed for lasting results
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
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

            {/* Key Points with Checkmarks */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-success-500" />
                  <span className="text-slate-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
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
                  <h3 className="text-2xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <Link to={feature.href}>
                    <Button variant="secondary" className="w-full gap-2 group/btn">
                      Explore this tool
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
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Ready to build lasting project controls?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Take your time exploring AI-powered tools designed for thorough risk analysis and thoughtful WBS creation
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
