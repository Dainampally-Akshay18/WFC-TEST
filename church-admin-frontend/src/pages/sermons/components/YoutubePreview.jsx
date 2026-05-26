import React, { useState, useEffect } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { extractYoutubeVideoId, getYoutubeEmbedUrl, isValidYoutubeUrl } from '../utils/sermonHelpers';

const YoutubePreview = ({ youtubeLink, onVideoIdExtracted }) => {
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!youtubeLink) {
      setVideoId(null);
      setError(null);
      return;
    }

    if (!isValidYoutubeUrl(youtubeLink)) {
      setError('Invalid YouTube URL');
      setVideoId(null);
      return;
    }

    const id = extractYoutubeVideoId(youtubeLink);
    if (id) {
      setVideoId(id);
      setError(null);
      onVideoIdExtracted?.(id);
    } else {
      setError('Could not extract video ID');
      setVideoId(null);
    }
  }, [youtubeLink, onVideoIdExtracted]);

  if (!youtubeLink) {
    return (
      <div className="glass-card rounded-xl p-8 text-center border border-white/50 dark:border-white/10 animate-fade-in-up">
        <div className="text-5xl mb-2 opacity-30">🎬</div>
        <p className="text-[var(--text-muted)] text-sm">Enter a YouTube URL to preview video</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-4 bg-red-500/10 border border-red-500/30 animate-fade-in-up">
        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return null;
  }

  return (
    <div className="space-y-2 animate-fade-in-up">
      <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        Video Preview
      </p>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/20 border border-[var(--border-glass)]">
        <iframe
          width="100%"
          height="100%"
          src={`${getYoutubeEmbedUrl(videoId)}?autoplay=0`}
          title="YouTube Sermon Preview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        />
      </div>
    </div>
  );
};

export default YoutubePreview;
