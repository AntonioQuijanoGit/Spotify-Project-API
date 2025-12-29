export function shareGenre(genreId: string, genreName: string) {
  const url = `${window.location.origin}${window.location.pathname}?genre=${genreId}`;
  const text = `Check out ${genreName} on Music Explorer!`;
  
  if (navigator.share) {
    navigator.share({
      title: `${genreName} - Music Explorer`,
      text,
      url,
    }).catch(() => {
      // Fallback to clipboard
      copyToClipboard(url);
    });
  } else {
    copyToClipboard(url);
  }
}

export function shareSearch(query: string) {
  const url = `${window.location.origin}${window.location.pathname}?search=${encodeURIComponent(query)}`;
  const text = `Search results for "${query}" on Music Explorer`;
  
  if (navigator.share) {
    navigator.share({
      title: `Search: ${query} - Music Explorer`,
      text,
      url,
    }).catch(() => {
      copyToClipboard(url);
    });
  } else {
    copyToClipboard(url);
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function getShareUrl(type: 'genre' | 'search', value: string): string {
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  if (type === 'genre') {
    return `${baseUrl}?genre=${value}`;
  } else {
    return `${baseUrl}?search=${encodeURIComponent(value)}`;
  }
}




