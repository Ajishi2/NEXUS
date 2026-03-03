'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResumeUploader() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const isValid = file.type === 'application/pdf' || 
                     file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      if (!isValid) {
        setError('Please upload a PDF or DOCX file')
        return
      }
      setResumeFile(file)
      setError('')
    }
  }

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Please upload a resume')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription)
      }

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to analyze resume')
      }

      const data = await response.json()
      
      // Store results in sessionStorage and navigate
      sessionStorage.setItem('resumeAnalysis', JSON.stringify(data))
      router.push('/analyzer/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Resume Upload */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Upload Your Resume</h2>
          <p className="text-white/60">Supported formats: PDF, DOCX</p>
          
          <div className="relative border-2 border-dashed border-white/20 rounded-lg p-8 hover:border-white/40 transition-colors cursor-pointer bg-white/5">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-white/80">
                {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-white/40 text-sm mt-2">PDF or DOCX up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Job Description (Optional) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Job Description (Optional)</h2>
          <p className="text-white/60">Paste the job description to get an ATS score specific to that role</p>
          
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full h-48 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 p-4 focus:outline-none focus:border-white/40 resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!resumeFile || loading}
          className="glowing-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'ANALYZING...' : 'ANALYZE RESUME'}
        </button>
      </div>
    </div>
  )
}
