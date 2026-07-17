import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MUSIC_TRACKS, MUSIC_DEFAULT_VOLUME } from '../constants';

/**
 * Compact floating background-music player.
 *
 * Rules of good background music on the web:
 *   - NEVER autoplay with sound. Browsers block it and it's aggressive UX.
 *     The player starts collapsed and silent until the user hits Play.
 *   - Remember the user's choice across pages/sessions so it doesn't
 *     re-collapse on every route change.
 *   - Respect prefers-reduced-motion → widget doesn't autoplay ever.
 *   - Keep the widget small, dismissible, and never over important content.
 *
 * Placeholder tracks come from constants.MUSIC_TRACKS (SoundHelix demos).
 * The owner can replace them with self-hosted marble-showroom ambience.
 */

const STORAGE_KEY = 'shayish.music.state';

interface StoredState {
  expanded: boolean;
  playing: boolean;
  trackIndex: number;
  volume: number;
}

const MusicPlayer: React.FC = () => {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(MUSIC_DEFAULT_VOLUME);

  // Restore prior state on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as StoredState;
      setExpanded(!!s.expanded);
      setTrackIndex(Math.min(Math.max(0, s.trackIndex ?? 0), MUSIC_TRACKS.length - 1));
      setVolume(typeof s.volume === 'number' ? s.volume : MUSIC_DEFAULT_VOLUME);
      // Do NOT restore "playing: true" — browsers block cross-visit autoplay
      // and the user shouldn't be surprised with sound on page load.
    } catch {
      // localStorage unavailable — safe to ignore, defaults are fine.
    }
  }, []);

  // Persist state (except `playing`, which is per-session by design).
  useEffect(() => {
    try {
      const s: StoredState = { expanded, playing: false, trackIndex, volume };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      // ignore
    }
  }, [expanded, trackIndex, volume]);

  // Keep the <audio> element in sync with React state.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    if (playing) {
      const p = el.play();
      // Some browsers reject the play promise (e.g., no gesture yet). Log,
      // don't crash, and reset UI so the button reflects reality.
      if (p && typeof p.catch === 'function') p.catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [playing, trackIndex, volume]);

  const currentTrack = MUSIC_TRACKS[trackIndex];
  const goPrev = () => setTrackIndex((i) => (i - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
  const goNext = () => setTrackIndex((i) => (i + 1) % MUSIC_TRACKS.length);
  const togglePlay = () => setPlaying((p) => !p);

  return (
    <div className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8 rtl:right-auto rtl:left-6 md:rtl:left-8">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="none"
        onEnded={goNext}
        crossOrigin="anonymous"
      />

      {expanded ? (
        <div className="bg-secondary/95 backdrop-blur-md border border-divider rounded-sm shadow-2xl p-4 min-w-[260px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              <Music size={12} />
              <span>{t('music.title')}</span>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label={t('music.collapse')}
              className="text-muted hover:text-light transition-colors"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="text-sm text-light font-serif truncate mb-3" title={currentTrack.title}>
            {currentTrack.title}
          </div>

          <div className="flex items-center justify-center gap-4 mb-3">
            <button type="button" onClick={goPrev} aria-label={t('music.prev')} className="text-muted hover:text-light transition-colors">
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? t('music.pause') : t('music.play')}
              aria-pressed={playing}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-primary hover:bg-light transition-colors"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button type="button" onClick={goNext} aria-label={t('music.next')} className="text-muted hover:text-light transition-colors">
              <SkipForward size={18} />
            </button>
          </div>

          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted">
            <span>{t('music.volume')}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label={t('music.volume')}
              className="flex-1 h-1 accent-accent"
            />
          </label>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={t('music.open')}
          title={t('music.open')}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/80 backdrop-blur-md border border-divider text-muted hover:text-accent hover:border-accent transition-colors shadow-lg"
        >
          {playing ? <Pause size={18} /> : <Music size={18} />}
        </button>
      )}
    </div>
  );
};

export default MusicPlayer;
