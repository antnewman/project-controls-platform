import React, { useState } from 'react'
import {
  BookOpen,
  Upload,
  Search,
  Filter,
  Download,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Tag,
  Lightbulb,
  ArrowRight,
  MessageSquare
} from 'lucide-react'
import { extractLessonsFromDocument } from '../lib/anthropic'
import type { Lesson, LessonCategory } from '../lib/types'

export default function LessonsLibrary() {
  const [view, setView] = useState<'upload' | 'library' | 'detail'>('upload')
  const [uploading, setUploading] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<LessonCategory[]>([])

  const categories: LessonCategory[] = [
    'Procurement',
    'Governance',
    'Resourcing',
    'Risk Management',
    'Delivery & Execution',
    'Stakeholder Management',
    'Technical',
    'Commercial',
    'Quality',
    'Schedule',
    'Budget & Finance',
    'Communication',
    'Change Management',
    'Compliance'
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      // Read file
      const text = await file.text()

      // Extract lessons
      const result = await extractLessonsFromDocument(
        text,
        file.name,
        'gateway_review' // Could be detected or selected by user
      )

      // Convert extracted lessons to full lessons
      const fullLessons: Lesson[] = result.extractedLessons.map((el, idx) => ({
        id: `lesson-${Date.now()}-${idx}`,
        title: el.extractedLesson.title || 'Untitled Lesson',
        description: el.extractedLesson.description || '',
        category: el.extractedLesson.category || 'Delivery & Execution',
        source: result.documentName,
        sourceType: result.documentType as 'gateway_review' | 'nista' | 'project_closure' | 'assurance_report',
        dateIdentified: new Date().toISOString(),
        context: el.extractedLesson.context || '',
        observation: el.extractedLesson.observation || '',
        impact: el.extractedLesson.impact || '',
        recommendation: el.extractedLesson.recommendation || '',
        actionableSteps: el.extractedLesson.actionableSteps || [],
        tags: el.extractedLesson.tags || [],
        relatedPhases: el.extractedLesson.relatedPhases || [],
        relatedRiskCategories: el.extractedLesson.relatedRiskCategories || [],
        applicability: el.extractedLesson.applicability || 'universal',
        confidence: el.confidence,
        ...el.extractedLesson
      }))

      setLessons(fullLessons)
      setView('library')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to process document. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = searchQuery === '' ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(lesson.category)

    return matchesSearch && matchesCategory
  })

  const toggleCategory = (category: LessonCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-primary-100 rounded-2xl mb-4">
            <BookOpen className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Lessons Library
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Extract, organize, and apply lessons from past projects. Transform assurance reviews into actionable intelligence.
          </p>
        </div>

        {/* Stats */}
        {lessons.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {lessons.length}
              </div>
              <div className="text-sm text-slate-600">Total Lessons</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {new Set(lessons.map(l => l.category)).size}
              </div>
              <div className="text-sm text-slate-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {(lessons.reduce((sum, l) => sum + l.confidence, 0) / lessons.length).toFixed(1)}
              </div>
              <div className="text-sm text-slate-600">Avg Confidence</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {lessons.filter(l => l.confidence >= 8).length}
              </div>
              <div className="text-sm text-slate-600">High Quality</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg">
          {/* Upload View */}
          {view === 'upload' && (
            <div className="p-12">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
                  Upload Assurance Document
                </h2>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors">
                  <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Drop your document here
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Supported: PDF, DOCX, TXT (Gateway reviews, NISTA reports, project closure documents)
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.doc"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <span className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer inline-block transition-colors">
                      {uploading ? 'Processing...' : 'Choose File'}
                    </span>
                  </label>
                </div>

                {uploading && (
                  <div className="mt-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                    <p className="text-slate-600">
                      Analyzing document and extracting lessons...
                    </p>
                  </div>
                )}

                {/* Example lessons */}
                {lessons.length > 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setView('library')}
                      className="text-primary-500 hover:text-primary-600 font-medium"
                    >
                      View {lessons.length} extracted lessons →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Library View */}
          {view === 'library' && (
            <div className="p-8">
              {/* Search and Filter Bar */}
              <div className="mb-6 flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lessons..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setView('upload')}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Upload New
                </button>
              </div>

              {/* Category Filters */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">Filter by Category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-4">
                {filteredLessons.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No lessons found
                    </h3>
                    <p className="text-slate-600">
                      {searchQuery || selectedCategories.length > 0
                        ? 'Try adjusting your filters'
                        : 'Upload a document to extract lessons'}
                    </p>
                  </div>
                ) : (
                  filteredLessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="border border-slate-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedLesson(lesson)
                        setView('detail')
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {lesson.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lesson.confidence >= 8
                                ? 'bg-green-100 text-green-800'
                                : lesson.confidence >= 6
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              Confidence: {lesson.confidence}/10
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm mb-3">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {lesson.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {lesson.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(lesson.dateIdentified).toLocaleDateString()}
                        </span>
                      </div>

                      {lesson.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {lesson.tags.slice(0, 5).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {lesson.tags.length > 5 && (
                            <span className="px-2 py-1 text-slate-500 text-xs">
                              +{lesson.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center text-primary-500 font-medium text-sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Detail View */}
          {view === 'detail' && selectedLesson && (
            <div className="p-8">
              <button
                onClick={() => setView('library')}
                className="mb-6 text-primary-500 hover:text-primary-600 font-medium flex items-center gap-2"
              >
                ← Back to Library
              </button>

              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-slate-900 flex-1">
                      {selectedLesson.title}
                    </h1>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      selectedLesson.confidence >= 8
                        ? 'bg-green-100 text-green-800'
                        : selectedLesson.confidence >= 6
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      Confidence: {selectedLesson.confidence}/10
                    </span>
                  </div>

                  <p className="text-lg text-slate-600 mb-4">
                    {selectedLesson.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {selectedLesson.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {selectedLesson.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(selectedLesson.dateIdentified).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* AI Summary */}
                {selectedLesson.aiSummary && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-primary-500" />
                      <h3 className="font-semibold text-slate-900">AI Summary</h3>
                    </div>
                    <p className="text-slate-700">{selectedLesson.aiSummary}</p>
                  </div>
                )}

                {/* Context */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-500" />
                    Context
                  </h2>
                  <p className="text-slate-700 bg-slate-50 rounded-lg p-4">
                    {selectedLesson.context}
                  </p>
                </div>

                {/* Observation */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    What Happened
                  </h2>
                  <p className="text-slate-700 bg-slate-50 rounded-lg p-4">
                    {selectedLesson.observation}
                  </p>
                </div>

                {/* Impact */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    Impact
                  </h2>
                  <p className="text-slate-700 bg-red-50 rounded-lg p-4 border border-red-200">
                    {selectedLesson.impact}
                  </p>
                </div>

                {/* Recommendation */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Recommendation
                  </h2>
                  <p className="text-slate-700 bg-green-50 rounded-lg p-4 border border-green-200">
                    {selectedLesson.recommendation}
                  </p>
                </div>

                {/* Actionable Steps */}
                {selectedLesson.actionableSteps && selectedLesson.actionableSteps.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                      How to Apply This Lesson
                    </h2>
                    <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
                      <ol className="space-y-3">
                        {selectedLesson.actionableSteps.map((step, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
                              {idx + 1}
                            </span>
                            <span className="text-slate-700 flex-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* Related Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {selectedLesson.relatedPhases && selectedLesson.relatedPhases.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h3 className="font-semibold text-slate-900 mb-3">
                        Related Project Phases
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLesson.relatedPhases.map(phase => (
                          <span
                            key={phase}
                            className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-sm rounded"
                          >
                            {phase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLesson.relatedRiskCategories && selectedLesson.relatedRiskCategories.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-6">
                      <h3 className="font-semibold text-slate-900 mb-3">
                        Related Risk Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLesson.relatedRiskCategories.map(category => (
                          <span
                            key={category}
                            className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-sm rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {selectedLesson.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLesson.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-5 h-5" />
                    Export Lesson
                  </button>
                  <button className="flex-1 border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    Ask AI About This
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                About the Lessons Library
              </h3>
              <p className="text-slate-700 text-sm">
                This tool extracts lessons from Gateway reviews, NISTA reports, and other assurance documents.
                It uses AI to identify both explicit lessons (clearly stated) and implicit lessons (inferred from issues and recommendations).
                Lessons are categorised, tagged, and enriched with actionable guidance to help you avoid repeating past mistakes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
