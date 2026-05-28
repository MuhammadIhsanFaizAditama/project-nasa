const NASA_BASE = 'https://api.nasa.gov/planetary';
const NASA_IMAGE_BASE = 'https://images-api.nasa.gov';

export async function fetchApod(apiKey, date = null) {
  const key = apiKey || import.meta.env.VITE_NASA_KEY || 'DEMO_KEY';
  const dateParam = date ? `&date=${date}` : '';
  const res = await fetch(`${NASA_BASE}/apod?api_key=${key}${dateParam}`);
  if (!res.ok) throw new Error('Failed to fetch APOD');
  return res.json();
}

export async function fetchNasaImage(query) {
  try {
    const res = await fetch(`${NASA_IMAGE_BASE}/search?q=${encodeURIComponent(query)}&media_type=image&page_size=1`);
    if (!res.ok) return null;
    const data = await res.json();
    const items = data.collection?.items;
    if (!items || items.length === 0) return null;
    return items[0].links?.[0]?.href || null;
  } catch {
    return null;
  }
}

export async function searchNasaLibrary(query, mediaType = 'image,video') {
  const res = await fetch(`${NASA_IMAGE_BASE}/search?q=${encodeURIComponent(query)}&media_type=${mediaType}&page_size=24`);
  if (!res.ok) throw new Error('Failed to search NASA library');
  return res.json();
}

export async function getNasaAsset(nasaId) {
  const res = await fetch(`${NASA_IMAGE_BASE}/asset/${nasaId}`);
  if (!res.ok) throw new Error('Failed to get NASA asset');
  return res.json();
}

export async function translateToIndonesian(text) {
  try {
    // Pecah teks per 450 karakter berdasarkan kalimat
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
      if ((current + sentence).length > 450) {
        if (current) chunks.push(current.trim());
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current) chunks.push(current.trim());

    // Translate per chunk
    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|id`
        );
        if (!res.ok) return chunk;
        const data = await res.json();
        return data.responseData?.translatedText || chunk;
      })
    );

    return results.join(' ');
  } catch {
    return null;
  }
}
