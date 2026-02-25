/**
 * Background Music Player
 *
 * Features:
 * - Auto-play (after user interaction due to browser restrictions)
 * - Volume control
 * - Play/Pause toggle
 * - Visual animation when playing
 * - localStorage persistence
 * - Accessible controls
 *
 * USAGE: Add <BackgroundMusic /> to Layout
 */

import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // 30% default volume
  const [showVolume, setShowVolume] = useState(false);
  const [volumeAnnouncement, setVolumeAnnouncement] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeSliderRef = useRef<HTMLInputElement>(null);

  // Free ambient music URL (you can replace with your own file)
  // Using a calm ambient track from a free source
  const MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3';
  // Alternative: Place your audio file in /public/music/ and reference as '/music/your-file.mp3'

  useEffect(() => {
    // Create audio element
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    const savedState = localStorage.getItem('backgroundMusic');

    if (hasVisited && savedState === 'playing') {
      // Returning user who had music playing - try to auto-play
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else if (!hasVisited) {
      // First visit - set up one-time interaction listener
      const enableAutoPlay = () => {
        localStorage.setItem('hasVisitedBefore', 'true');
        audio.play().then(() => {
          setIsPlaying(true);
          localStorage.setItem('backgroundMusic', 'playing');
        }).catch(() => {
          // Still blocked, user will need to click the button
        });
        // Remove the listener after first interaction
        document.removeEventListener('click', enableAutoPlay);
        document.removeEventListener('keydown', enableAutoPlay);
        document.removeEventListener('touchstart', enableAutoPlay);
      };

      // Add listeners for first interaction
      document.addEventListener('click', enableAutoPlay, { once: true });
      document.addEventListener('keydown', enableAutoPlay, { once: true });
      document.addEventListener('touchstart', enableAutoPlay, { once: true });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('backgroundMusic', 'paused');
    } else {
      audioRef.current.play().catch(e => {
        console.log('Play failed:', e);
      });
      setIsPlaying(true);
      localStorage.setItem('backgroundMusic', 'playing');
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const newVolume = volume === 0 ? 0.3 : 0;
    setVolume(newVolume);
    setVolumeAnnouncement(newVolume === 0 ? 'Muted' : 'Unmuted');
  };

  // Announce volume changes for screen readers
  useEffect(() => {
    if (volumeAnnouncement) {
      const timer = setTimeout(() => setVolumeAnnouncement(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [volumeAnnouncement]);

  return (
    <>
      <audio
        ref={audioRef as React.RefObject<HTMLAudioElement>}
        loop
        preload="auto"
      />

      {/* Music Control Button */}
      <div className="fixed top-24 left-6 z-50">
        <div className="relative">
          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
            aria-label={isPlaying ? 'Pause music - Click to stop' : 'Play music - Click to start'}
            aria-pressed={isPlaying}
            className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
              isPlaying
                ? 'bg-accent text-white hover:scale-110 opacity-50 hover:opacity-100'
                : 'bg-white text-accent border-2 border-accent hover:scale-110 opacity-50 hover:opacity-100'
            }`}
          >
            {isPlaying ? (
              // Pause icon (when playing)
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              // Music icon (when paused)
              <Music size={24} />
            )}

            {/* Animated sound waves when playing */}
            {isPlaying && (
              <>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </>
            )}
          </button>

          {/* Volume Control Popup */}
          {showVolume && (
            <div
              className="absolute bottom-full left-0 mb-2 p-3 bg-white border border-neutral-300 rounded-lg shadow-xl min-w-[140px]"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
              role="dialog"
              aria-label="Volume control"
            >
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                  aria-pressed={volume === 0}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <span className="text-xs text-gray-600 font-bold" aria-live="polite">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                ref={volumeSliderRef}
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                }}
                aria-label="Music volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(volume * 100)}
                aria-valuetext={`${Math.round(volume * 100)} percent`}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-accent"
              />
              {/* Screen reader announcement */}
              <div role="status" aria-live="polite" className="sr-only">
                {volumeAnnouncement}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BackgroundMusic;
