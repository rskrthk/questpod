export async function POST(request) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on server' }), { status: 500 });
  }

  try {
    const body = await request.json();
    const { mimeType, base64Audio } = body || {};
    if (!base64Audio || !mimeType) {
      return new Response(JSON.stringify({ error: 'Missing audio payload or mimeType' }), { status: 400 });
    }

    const models = [
      'gemini-2.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ];

    const maxRetries = 3;
    const baseDelayMs = 500;
    let lastErr = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const model = models[attempt] || models[0];
      try {
        const payload = {
          contents: [
            {
              parts: [
                { text: 'Generate an accurate transcript of the speech.' },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Audio,
                  },
                },
              ],
            },
          ],
        };

        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!resp.ok) {
          const isOverloaded = resp.status === 503 || resp.status === 429;
          const errText = await resp.text();
          if (isOverloaded && attempt < maxRetries - 1) {
            const delay = baseDelayMs * Math.pow(2, attempt);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          throw new Error(`Gemini transcription failed (${resp.status}): ${errText}`);
        }

        const data = await resp.json();
        const transcript =
          data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n').trim() || '';

        return new Response(JSON.stringify({ transcript, model }), { status: 200 });
      } catch (err) {
        lastErr = err;
      }
    }

    return new Response(JSON.stringify({ error: lastErr?.message || 'Transcription failed after retries' }), { status: 502 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || 'Unexpected server error' }), { status: 500 });
  }
}