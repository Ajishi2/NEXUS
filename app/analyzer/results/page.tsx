'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AnalysisResult {
  atsScore: number
  summary: string
  skills: string[]
  experience: string
  education: string
  strengths: string[]
  improvements: string[]
  jobMatchScore: number | null
  jobMatchDetails: string
}

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('resumeAnalysis')
    if (stored) {
      setAnalysis(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">No analysis results found</p>
          <Link href="/analyzer" className="text-purple-400 hover:text-purple-300">
            Go back to analyzer
          </Link>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Resume Analysis Results</h1>
          <p className="text-white/60">Your comprehensive ATS score and recommendations</p>
        </div>

        {/* ATS Score Card */}
        <div className="bg-white/5 border border-white/20 rounded-lg p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">ATS Score</h2>
            <div className={`text-5xl font-bold ${getScoreColor(analysis.atsScore)}`}>
              {analysis.atsScore}
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                analysis.atsScore >= 80
                  ? 'bg-green-500'
                  : analysis.atsScore >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${analysis.atsScore}%` }}
            />
          </div>
          <p className="text-white/60 mt-4">{analysis.summary}</p>
        </div>

        {/* Job Match Score (if available) */}
        {analysis.jobMatchScore !== null && (
          <div className="bg-white/5 border border-white/20 rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Job Match Score</h2>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.jobMatchScore)}`}>
                {analysis.jobMatchScore}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  analysis.jobMatchScore >= 80
                    ? 'bg-green-500'
                    : analysis.jobMatchScore >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${analysis.jobMatchScore}%` }}
              />
            </div>
            <p className="text-white/60 mt-4">{analysis.jobMatchDetails}</p>
          </div>
        )}

        {/* Skills */}
        {analysis.skills.length > 0 && (
          <div className="bg-white/5 border border-white/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Skills Detected</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm border border-purple-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        <div className="bg-white/5 border border-white/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Strengths</h2>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3 text-white/80">
                <span className="text-green-400 mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white/5 border border-white/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Areas to Improve</h2>
          <ul className="space-y-3">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-3 text-white/80">
                <span className="text-yellow-400 mt-1">!</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience & Education */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Experience</h2>
            <p className="text-white/80 leading-relaxed">{analysis.experience}</p>
          </div>
          {analysis.education && (
            <div className="bg-white/5 border border-white/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Education</h2>
              <p className="text-white/80 leading-relaxed">{analysis.education}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/analyzer"
            className="glowing-btn"
          >
            ANALYZE ANOTHER
          </Link>
        </div>
      </div>
    </div>
  )
}
