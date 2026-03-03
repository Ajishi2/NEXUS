import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from 'fs'
import * as path from 'path'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

// Extract text from PDF (basic implementation)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error('PDF parsing error:', error)
    throw new Error('Failed to parse PDF')
  }
}

// Extract text from DOCX
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error('DOCX parsing error:', error)
    throw new Error('Failed to parse DOCX')
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get('resume') as File
    const jobDescription = formData.get('jobDescription') as string | null

    if (!resumeFile) {
      return NextResponse.json(
        { error: 'No resume file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await resumeFile.arrayBuffer())

    // Extract text based on file type
    let resumeText = ''
    if (resumeFile.type === 'application/pdf') {
      resumeText = await extractTextFromPDF(buffer)
    } else if (resumeFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await extractTextFromDOCX(buffer)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    // Build the prompt for Gemini
    let analysisPrompt = `
Analyze this resume and provide a detailed assessment. Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "atsScore": <number 0-100>,
  "summary": "<brief summary of the resume>",
  "skills": [<array of skills found>],
  "experience": "<brief overview of experience>",
  "education": "<education details or empty string>",
  "strengths": [<array of 3-5 key strengths>],
  "improvements": [<array of 3-5 areas to improve>],
  "jobMatchScore": <number 0-100 or null if no job description>,
  "jobMatchDetails": "<details about fit to job description or empty string>"
}

Resume:
${resumeText}
`

    if (jobDescription) {
      analysisPrompt += `

Job Description to match against:
${jobDescription}

Consider the job description when calculating jobMatchScore and provide jobMatchDetails.`
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(analysisPrompt)
    const responseText = result.response.text()

    // Parse the response - remove markdown code blocks if present
    let jsonStr = responseText.trim()
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.substring(7)
    }
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.substring(3)
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.substring(0, jsonStr.length - 3)
    }
    jsonStr = jsonStr.trim()

    const analysis = JSON.parse(jsonStr)

    return NextResponse.json({
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      skills: analysis.skills,
      experience: analysis.experience,
      education: analysis.education,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      jobMatchScore: analysis.jobMatchScore,
      jobMatchDetails: analysis.jobMatchDetails,
    })
  } catch (error) {
    console.error('Error analyzing resume:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}
