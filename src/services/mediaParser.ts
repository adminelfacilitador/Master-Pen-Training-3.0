// Media Parser and Webview Stream Resolver
// Optimizes external streaming (YouTube, Cloudflare, Google Storage, Vimeo, Slides, PDFs)
// Saves 100% database space and avoids overcharging Firebase Storage

export interface ParsedMedia {
  provider: 'youtube' | 'cloudflare' | 'vimeo' | 'slides' | 'pdf' | 'audio' | 'video_direct';
  embedUrl: string;
  isIframe: boolean;
  isVideoTag: boolean;
  isAudioTag: boolean;
  originalUrl: string;
}

export function parseMediaUrl(url: string, declaredType?: string): ParsedMedia {
  if (!url || typeof url !== 'string') {
    return {
      provider: 'video_direct',
      embedUrl: '',
      isIframe: false,
      isVideoTag: true,
      isAudioTag: false,
      originalUrl: ''
    };
  }

  const cleanUrl = url.trim();

  // 1. YouTube Detection
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
      isIframe: true,
      isVideoTag: false,
      isAudioTag: false,
      originalUrl: cleanUrl
    };
  }

  // 2. Cloudflare Stream Detection
  if (cleanUrl.includes('cloudflarestream.com') || cleanUrl.includes('videodelivery.net')) {
    let embed = cleanUrl;
    if (!cleanUrl.includes('/iframe') && !cleanUrl.endsWith('.m3u8')) {
      embed = cleanUrl.replace(/\/watch$/, '') + '/iframe';
    }
    return {
      provider: 'cloudflare',
      embedUrl: embed,
      isIframe: true,
      isVideoTag: false,
      isAudioTag: false,
      originalUrl: cleanUrl
    };
  }

  // 3. Vimeo Detection
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&title=0&byline=0&portrait=0`,
      isIframe: true,
      isVideoTag: false,
      isAudioTag: false,
      originalUrl: cleanUrl
    };
  }

  // 4. Google Slides Presentation
  if (cleanUrl.includes('docs.google.com/presentation')) {
    let embed = cleanUrl;
    if (cleanUrl.includes('/edit') || cleanUrl.includes('/pub')) {
      embed = cleanUrl.replace(/\/edit.*$/, '/embed?start=false&loop=false&delayms=3000').replace(/\/pub.*$/, '/embed?start=false&loop=false&delayms=3000');
    }
    return {
      provider: 'slides',
      embedUrl: embed,
      isIframe: true,
      isVideoTag: false,
      isAudioTag: false,
      originalUrl: cleanUrl
    };
  }

  // 5. PDF Documents
  if (cleanUrl.endsWith('.pdf') || declaredType === 'document_pdf') {
    return {
      provider: 'pdf',
      embedUrl: cleanUrl,
      isIframe: true,
      isVideoTag: false,
      isAudioTag: false,
      originalUrl: cleanUrl
    };
  }

  // 6. Audio tracks
  if (cleanUrl.endsWith('.mp3') || cleanUrl.endsWith('.ogg') || cleanUrl.endsWith('.wav') || cleanUrl.endsWith('.m4a') || declaredType === 'audio_track') {
    return {
      provider: 'audio',
      embedUrl: cleanUrl,
      isIframe: false,
      isVideoTag: false,
      isAudioTag: true,
      originalUrl: cleanUrl
    };
  }

  // 7. Default direct video (MP4, WebM, Google Cloud Storage, signed URL)
  return {
    provider: 'video_direct',
    embedUrl: cleanUrl,
    isIframe: false,
    isVideoTag: true,
    isAudioTag: false,
    originalUrl: cleanUrl
  };
}
