import { Link } from 'react-router-dom';
import { AlertTriangle, Network, Workflow, ArrowRight, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { BRAND_TAGLINE } from '../lib/brand';

export default function Home() {
  const features = [
    {
      icon: <AlertTriangle className="h-12 w-12 text-primary-500" />,
      title: 'Risk Analysis',
      description:
        'Thoroughly analyze risk registers with SME heuristics. Receive quality scores and thoughtful feedback to ensure your risks are complete and well-defined.',
      href: '/risk-analysis',
      color: 'bg-orange-50',
    },
    {
      icon: <Network className="h-12 w-12 text-primary-500" />,
      title: 'WBS Generator',
      description:
        'Carefully transform project narratives into comprehensive Work Breakdown Structures. Methodically generate dependencies, resources, and milestones.',
      href: '/wbs-generator',
      color: 'bg-blue-50',
    },
    {
      icon: <Workflow className="h-12 w-12 text-primary-500" />,
      title: 'Integrated Workflow',
      description:
        'Complete end-to-end workflow: Generate WBS → Identify risks → Analyze quality. Build your project plan step by step, building something solid.',
      href: '/integrated',
      color: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-4">
              <Clock className="h-4 w-4" />
              <span>{BRAND_TAGLINE}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Project Controls{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                Intelligence Platform
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100">
              AI-powered project planning built carefully, designed for lasting results
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/integrated">
                <Button size="lg" variant="secondary" className="gap-2">
                  Build Your Project <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/risk-analysis">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Explore Risk Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-4">
              Reliable Tools for Project Success
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Take your time exploring AI-enhanced project controls. Each tool is designed for thorough analysis and sustainable planning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 group">
                <div className="space-y-4">
                  <div className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <Link to={feature.href}>
                    <Button variant="outline" className="w-full gap-2 group/btn">
                      Explore this tool
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container">
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
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to build lasting project controls?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Take your time exploring AI-powered tools designed for thorough risk analysis and thoughtful WBS creation
          </p>
          <Link to="/integrated">
            <Button size="lg" variant="secondary" className="gap-2">
              Begin Integrated Workflow <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
