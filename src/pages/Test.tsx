export default function Test() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test heading */}
        <h1 className="text-4xl font-bold text-slate-900">
          Tailwind Test Page
        </h1>

        {/* Test colors */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-700">Color Tests</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-20 bg-primary-500 rounded-lg flex items-center justify-center text-white font-medium">
              Primary
            </div>
            <div className="h-20 bg-slate-700 rounded-lg flex items-center justify-center text-white font-medium">
              Slate
            </div>
            <div className="h-20 bg-success rounded-lg flex items-center justify-center text-white font-medium">
              Success
            </div>
            <div className="h-20 bg-slate-50 border-2 border-slate-300 rounded-lg flex items-center justify-center text-slate-700 font-medium">
              Background
            </div>
          </div>
        </div>

        {/* Test buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-700">Button Tests</h2>
          <div className="flex gap-4">
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Primary Button
            </button>
            <button className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Secondary Button
            </button>
          </div>
        </div>

        {/* Test card */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-700">Card Test</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Test Card
            </h3>
            <p className="text-slate-600">
              If you can see this card with proper styling, shadows, and rounded corners, Tailwind is working correctly.
            </p>
          </div>
        </div>

        {/* Test Inter font */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-700">Font Test</h2>
          <p className="text-slate-600" style={{ fontFamily: 'Inter' }}>
            This text should be in Inter font. Compare it to system font below.
          </p>
          <p className="text-slate-600" style={{ fontFamily: 'system-ui' }}>
            This is system font for comparison.
          </p>
        </div>
      </div>
    </div>
  );
}
