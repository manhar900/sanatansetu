import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// POST /api/translate — auto-translates content using z-ai-web-dev-sdk.
// Falls back gracefully to the original text when the SDK is unavailable.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const title: string = typeof body?.title === 'string' ? body.title : ''
    const description: string =
      typeof body?.description === 'string' ? body.description : ''
    const bodyText: string = typeof body?.body === 'string' ? body.body : ''
    const sourceLang: string = body?.sourceLang || 'English'
    const targetLang: string = body?.targetLang || 'English'

    if (targetLang === sourceLang) {
      return NextResponse.json({ title, description, body: bodyText })
    }

    const payload = JSON.stringify({ title, description, body: bodyText }, null, 2)

    const prompt = `You are a careful translator for a sacred Hindu religious content library.
Translate the following JSON object from ${sourceLang} to ${targetLang}.
- Preserve the spiritual tone, transliteration conventions, and any Sanskrit terms.
- If a field is empty, return it empty.
- Return ONLY a JSON object with the same keys: "title", "description", "body".
- Do NOT include any explanation or markdown fences.

Input:
${payload}`

    let resultTitle = title
    let resultDescription = description
    let resultBody = bodyText

    try {
      const zai = await ZAI.create()
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a precise multilingual translator specialized in Hindu religious texts.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      })
      const content: string = completion.choices?.[0]?.message?.content ?? ''
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (typeof parsed.title === 'string') resultTitle = parsed.title
        if (typeof parsed.description === 'string') resultDescription = parsed.description
        if (typeof parsed.body === 'string') resultBody = parsed.body
      }
    } catch (sdkErr) {
      console.error('z-ai-web-dev-sdk translate error:', sdkErr)
      // Graceful fallback — return original strings so the UI keeps working.
    }

    return NextResponse.json({
      title: resultTitle,
      description: resultDescription,
      body: resultBody,
    })
  } catch (error) {
    console.error('POST /api/translate error:', error)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
