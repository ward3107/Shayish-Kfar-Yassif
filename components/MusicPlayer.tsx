import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, ChevronDown, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import { MUSIC_TRACKS, MUSIC_DEFAULT_VOLUME } from '../constants';

/**
 * The site's single audio hub. One floating widget, bottom corner.
 *
 * It controls BOTH:
 *   - Background music (play/pause/skip/volume over MUSIC_TRACKS)
 *   - The opt-in marble-tap click SFX (via SoundContext) — folded in here
 *     so the whole site has exactly one audio entry point instead of a
 *     confusing second speaker button up in the header.
 *
 * Rules of good background music on the web:
 *   - NEVER autoplay with sound. Starts collapsed and silent until a click.
 *   - Persist expanded/volume across sessions; keep "playing" per-session so
 *     users are never surprised with sound on next visit (browsers block it
 *     anyway).
 */

const STORAGE_KEY = 'shayish.music.state';

interface StoredState {
  expanded: boolean;
  trackIndex: number;
  volume: number;
}

const MusicPlayer: React.FC = () => {
  const { t } = useLanguage();
  const { enabled: sfxEnabled, toggle: toggleSfx } = useSound();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(MUSIC_DEFAULT_VOLUME);
  const [error, setError] = useState(false);

  // Restore prior state on mount (never "playing" — see note above).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as StoredState;
      setExpanded(!!s.expanded);
      setTrackIndex(Math.min(Math.max(0, s.trackIndex ?? 0), MUSIC_TRACKS.length - 1));
      setVolume(typeof s.volume === 'number' ? s.volume : MUSIC_DEFAULT_VOLUME);
    } catch {
      // localStorage unavailable — defaults are fine.
    }
  }, []);

  // Persist state.
  useEffect(() => {
    try {
      const s: StoredState = { expanded, trackIndex, volume };
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
      // play() rejects if the browser blocks it (no gesture) or the source
      // fails to load. Reflect that back in the UI instead of lying.
      if (p && typeof p.catch === 'function') {
        p.then(() => setError(false)).catch(() => {
          setPlaying(false);
          setError(true);
        });
      }
    } else {
      el.pause();
    }
  }, [playing, trackIndex, volume]);

  const currentTrack = MUSIC_TRACKS[trackIndex];
  const goPrev = () => { setError(false); setTrackIndex((i) => (i - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length); };
  const goNext = () => { setError(false); setTrackIndex((i) => (i + 1) % MUSIC_TRACKS.length); };
  const togglePlay = () => { setError(false); setPlaying((p) => !p); };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-40">
      {/* No crossOrigin — we only play the stream, never analyse it, and
          the placeholder host (SoundHelix) doesn't send CORS headers, so
          crossOrigin would make the load fail outright. */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="none"
        onEnded={goNext}
        onError={() => { setError(true); setPlaying(false); }}
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

          {error && (
            <div className="flex items-center gap-2 text-[10px] text-red-400 mb-3">
              <AlertCircle size={12} />
              <span>{t('music.error')}</span>
            </div>
          )}

          <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted mb-3">
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

          {/* Click-sound (marble tap) SFX toggle — consolidated here so the
              whole site has one audio control, not two. */}
          <button
            type="button"
            onClick={toggleSfx}
            aria-pressed={sfxEnabled}
            className="flex items-center justify-between w-full pt-3 border-t border-divider text-[10px] uppercase tracking-widest text-muted hover:text-light transition-colors"
          >
            <span>{t('music.click_sounds')}</span>
            {sfxEnabled ? <Volume2 size={14} className="text-accent" /> : <VolumeX size={14} />}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={t('music.open')}
          title={t('music.open')}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/80 backdrop-blur-md border border-divider text-muted hover:text-accent hover:border-accent transition-colors shadow-lg"
        >
          {playing ? <Pause size={18} /> : <Music size={18} />}
        </button>
      )}
    </div>
  );
};

export default MusicPlayer;
