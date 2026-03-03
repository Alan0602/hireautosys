
export interface ATSResult {
    score: number
    skillsFound: string[]
    missingSkills: string[]
    tips: string[]
    summary: string
    status: 'High Match' | 'Medium Match' | 'Low Match'
    semanticAnalysis: string
    projects: { title: string; description: string; technologies?: string[] }[]
}

import { analyzeApplicationAI } from "@/app/actions/ats"

/**
 * Analyzes an application against required skills.
 * Uses Google Gemini AI via Server Actions.
 */
export async function analyzeApplication(
    requiredSkills: string[],
    resumeText: string
): Promise<ATSResult> {
    try {
        // Try AI-powered analysis first
        return await analyzeApplicationAI(requiredSkills, resumeText)
    } catch (error) {
        console.warn("AI Analysis failed, falling back to keyword matching:", error)

        // Fallback: keyword matching (existing logic)
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500))

        const resumeLower = resumeText.toLowerCase()
        const skillsFound: string[] = []
        const missingSkills: string[] = []

        requiredSkills.forEach(skill => {
            // Check if the skill (or close variants) appear in the resume
            const variations = [
                skill.toLowerCase(),
                skill.toLowerCase().replace(/\.js$/, ''),
                skill.toLowerCase().replace(/\s+/g, ''),
            ]
            const found = variations.some(v => resumeLower.includes(v))
            if (found) {
                skillsFound.push(skill)
            } else {
                missingSkills.push(skill)
            }
        })

        // Calculate score based on skill match ratio + small random variation
        const matchRatio = requiredSkills.length > 0
            ? skillsFound.length / requiredSkills.length
            : 0.5
        const baseScore = Math.round(matchRatio * 85) // Up to 85% from skills
        const bonusScore = Math.floor(Math.random() * 15) // Up to 15% bonus
        const score = Math.min(100, baseScore + bonusScore)

        // Status
        let status: ATSResult['status'] = 'Low Match'
        if (score >= 80) status = 'High Match'
        else if (score >= 60) status = 'Medium Match'

        // Generate improvement tips based on what's missing
        const tips: string[] = []
        if (missingSkills.length > 0) {
            tips.push(`Add experience or projects demonstrating: ${missingSkills.slice(0, 3).join(', ')}`)
        }
        if (score < 70) {
            tips.push('Include measurable achievements (e.g., "improved performance by 40%")')
        }
        if (missingSkills.length > requiredSkills.length * 0.5) {
            tips.push('Consider acquiring certifications in the key technologies listed')
        }
        if (tips.length === 0) {
            tips.push('Your resume is a strong match — well done!')
        }

        return {
            score,
            skillsFound,
            missingSkills,
            tips,
            summary: `Candidate demonstrates ${status.toLowerCase()} potential with a ${score}% match rate. ${skillsFound.length}/${requiredSkills.length} required skills identified.`,
            status,
            semanticAnalysis: "AI screening was unavailable. This is a basic keyword-based analysis.",
            projects: []
        }
    }
}
