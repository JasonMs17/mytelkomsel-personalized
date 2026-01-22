import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''

interface UserNeeds {
  need_total: number
  need_video: number
  need_game: number
  need_social: number
  need_work: number
}

interface UserPriceBehaviour {
  max_price: number
  price_sensitivity: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface UserLifecycle {
  lifecycle_status: 'ACTIVE' | 'WARNING' | 'CHURN_RISK'
}

interface SAWWeights {
  w_cost: number
  w_total: number
  w_video: number
  w_game: number
}

interface CoverageScores {
  cov_total: number
  cov_video: number
  cov_game: number
  score_cost: number
}

interface RecommendedPackage {
  package_id: string
  name: string
  type: 'REGULAR' | 'COMBO' | 'APP_ONLY'
  price: number
  days: number
  main_gb: number
  video_gb: number
  game_gb: number
  price_per_day: number
  coverage: CoverageScores
  score: number
  score_percent: number
  explanation: string
}

interface AnalyzeRequest {
  userProfile: {
    needs: UserNeeds
    price_behaviour: UserPriceBehaviour
    lifecycle: UserLifecycle
  }
  sawDebug: {
    weights: SAWWeights
    candidates_count: number
    filtered_count: number
    fallback_used: boolean
    fallback_reason?: string
  }
  topRecommendation: RecommendedPackage
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()

    if (!body.userProfile || !body.topRecommendation || !body.sawDebug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { userProfile, sawDebug, topRecommendation } = body

    // Build system prompt
    const systemPrompt = `Kamu adalah asisten rekomendasi paket internet. Jelaskan dengan singkat dan mudah dimengerti (2-3 kalimat) mengapa paket ini adalah pilihan terbaik untuk user. Fokus pada:
1. Kebutuhan data user terpenuhi dengan baik (video, game, social, work)
2. Harga yang terjangkau dan sesuai budget
3. Value yang diterima user

Jangan gunakan istilah teknis atau parameter seperti SAW, score cost, coverage score, bobot, dll. Hanya jelaskan dengan bahasa sederhana mengapa paket ini bagus untuk user.`

    // Build user prompt dengan data yang lebih sederhana
    const userPrompt = `Kebutuhan User per Bulan:
- Kebutuhan Total: ${userProfile.needs.need_total} GB
- Video (YouTube, Netflix, dll): ${userProfile.needs.need_video} GB
- Gaming: ${userProfile.needs.need_game} GB
- Social Media (WhatsApp, dll): ${userProfile.needs.need_social} GB
- Work (Zoom, Email, dll): ${userProfile.needs.need_work} GB
- Budget Maximum: Rp${userProfile.price_behaviour.max_price.toLocaleString('id-ID')}

Paket yang Direkomendasikan: ${topRecommendation.name}
- Harga: Rp${topRecommendation.price.toLocaleString('id-ID')}/bulan
- Durasi: ${topRecommendation.days} hari
- Total Kuota: ${topRecommendation.main_gb + topRecommendation.video_gb + topRecommendation.game_gb} GB
- Kuota Video Bonus: ${topRecommendation.video_gb} GB
- Kuota Gaming Bonus: ${topRecommendation.game_gb} GB

Penjelasan Mengapa Paket Ini Bagus:
- Memenuhi ${(topRecommendation.coverage.cov_total * 100).toFixed(0)}% dari total kebutuhan user (${topRecommendation.main_gb + topRecommendation.video_gb + topRecommendation.game_gb} GB dari ${userProfile.needs.need_total} GB)
- Video: memenuhi ${(topRecommendation.coverage.cov_video * 100).toFixed(0)}% kebutuhan user
- Gaming: memenuhi ${(topRecommendation.coverage.cov_game * 100).toFixed(0)}% kebutuhan user
- Harganya Rp${topRecommendation.price.toLocaleString('id-ID')} yang lebih murah dari budget maksimal Rp${userProfile.price_behaviour.max_price.toLocaleString('id-ID')}

Jelaskan dengan singkat mengapa paket ini adalah pilihan terbaik dalam bahasa yang mudah dipahami user biasa. Fokus pada benefit buat user, bukan technical details.`

    console.log('Calling Groq API for analysis')

    try {
      const groq = new Groq({
        apiKey: GROQ_API_KEY,
      })

      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        stream: false,
      })

      const analysis = completion.choices[0]?.message?.content || 'Tidak ada analisis tersedia'

      console.log('Groq analysis received:', analysis.substring(0, 200))

      return NextResponse.json({
        analysis: analysis,
        saw_summary: {
          weights: sawDebug.weights,
          coverage: topRecommendation.coverage,
          score_percent: topRecommendation.score_percent,
        },
      })
    } catch (groqError) {
      console.error('Groq API error:', groqError)
      return NextResponse.json(
        { 
          error: 'Failed to get analysis from Groq', 
          details: groqError instanceof Error ? groqError.message : 'Unknown error' 
        },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to analyze recommendation', details: errorMessage },
      { status: 500 }
    )
  }
}
