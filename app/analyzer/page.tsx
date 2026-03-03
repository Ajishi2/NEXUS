import Header from '@/components/header'
import ResumeUploader from '@/components/resume-uploader'
import Link from 'next/link'

export default function AnalyzerPage() {
  return (
    <main className="min-h-screen w-full bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Optimize Your Resume for ATS
          </h1>
          <p className="text-white/60 text-lg">
            Upload your resume and get an instant ATS score to improve your chances of passing applicant tracking systems
          </p>
        </div>

        {/* Uploader Component */}
        <ResumeUploader />

        {/* Info Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/5 border border-white/20 rounded-lg p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-white font-bold mb-2">ATS Optimization</h3>
            <p className="text-white/60 text-sm">Get your ATS score and find out how resume-friendly your document is</p>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-lg p-6">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="text-white font-bold mb-2">Job Matching</h3>
            <p className="text-white/60 text-sm">Compare your resume against job descriptions for specific role alignment</p>
          </div>
          <div className="bg-white/5 border border-white/20 rounded-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-white font-bold mb-2">Detailed Analysis</h3>
            <p className="text-white/60 text-sm">Get actionable insights and recommendations to improve your resume</p>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center pb-12">
        <Link
          href="/"
          className="text-white/60 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
