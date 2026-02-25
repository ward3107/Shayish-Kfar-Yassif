/**
 * Music Player Component
 * Background music with shuffle, volume control, and track selection
 *
 * Features:
 * - 3 tracks with shuffle mode
 * - Play/pause, volume, skip controls
 * - Auto-play option (disabled by default)
 * - Persistent state
 * - Collapsible UI
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface Track {
  id: string;
  title: string;
  src: string;
  artist?: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  autoPlay?: boolean;
  shuffle?: boolean;
  loop?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  autoPlay = false,
  shuffle = true,
  loop = true,
  position = 'bottom-right'
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.08);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(shuffle);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create shuffled indices array
  const getShuffledIndices = () => {
    const indices = tracks.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  };

  const [shuffledIndices, setShuffledIndices] = useState<number[]>(getShuffledIndices());

  // Initialize audio
  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.loop = false;

      // Auto-play after user interaction (browser policy requires this)
      const handleUserInteraction = () => {
        setHasInteracted(true);
        if (autoPlay) {
          setIsPlaying(true);
        }
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };

      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);

      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };
    }
  }, [autoPlay]);

  // Load and play current track
  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      const actualIndex = isShuffleOn ? shuffledIndices[currentTrackIndex] : currentTrackIndex;

      // Pause any currently playing audio before loading new track
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }

      // Load new track
      audioRef.current.src = tracks[actualIndex].src;
      audioRef.current.load(); // Important: reload the audio element

      if (isPlaying) {
        // Small delay to ensure the new track is loaded
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(console.error);
        }
      }
    }
  }, [currentTrackIndex, shuffledIndices, isShuffleOn, hasInteracted, isPlaying, tracks]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && hasInteracted) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);

        // Progress tracking
        progressIntervalRef.current = setInterval(() => {
          if (audioRef.current) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
          }
        }, 100);
      } else {
        audioRef.current.pause();
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, hasInteracted]);

  // Handle track end
  const handleTrackEnd = () => {
    if (loop) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleTrackEnd);
      return () => audioRef.current?.removeEventListener('ended', handleTrackEnd);
    }
  }, [loop]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Control functions
  const togglePlay = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  // Properly change track with audio cleanup
  const changeTrack = (newIndex: number) => {
    if (audioRef.current) {
      // Pause current audio
      audioRef.current.pause();

      // Reset progress
      setProgress(0);

      // Update index
      setCurrentTrackIndex(newIndex);

      // The useEffect will handle loading the new track
    }
  };

  const playNext = () => {
    const maxIndex = tracks.length - 1;
    changeTrack(currentTrackIndex >= maxIndex ? 0 : currentTrackIndex + 1);
  };

  const playPrevious = () => {
    const maxIndex = tracks.length - 1;
    changeTrack(currentTrackIndex <= 0 ? maxIndex : currentTrackIndex - 1);
  };

  const toggleShuffle = () => {
    const newShuffleState = !isShuffleOn;
    setIsShuffleOn(newShuffleState);
    if (newShuffleState) {
      setShuffledIndices(getShuffledIndices());
      changeTrack(0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = (clickX / rect.width) * 100;
      audioRef.current.currentTime = (percentage / 100) * audioRef.current.duration;
      setProgress(percentage);
    }
  };

  // Get current track info
  const actualIndex = isShuffleOn ? shuffledIndices[currentTrackIndex] : currentTrackIndex;
  const currentTrack = tracks[actualIndex];

  // Position classes
  const positionClasses: Record<string, string> = {
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6',
    'top-left': 'top-6 left-6',
    'top-right': 'top-6 right-6'
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      {/* Collapsed player button */}
      {!isExpanded && (
        <button
          onClick={() => { setHasInteracted(true); setIsExpanded(true); }}
          className="flex items-center gap-3 bg-black/25 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 hover:bg-black/40 transition-all duration-300 group"
          aria-label={t('music.open_player')}
        >
          <div className={`w-8 h-8 rounded-full bg-accent flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
            {isPlaying ? (
              <Pause size={16} fill="white" />
            ) : (
              <Play size={16} fill="white" className="ml-0.5" />
            )}
          </div>
          <span className="text-sm font-medium hidden sm:block truncate max-w-[120px]">
            {currentTrack?.title}
          </span>
          <Volume2 size={16} className="text-white/70" />
        </button>
      )}

      {/* Expanded player */}
      {isExpanded && (
        <div className="bg-black/40 backdrop-blur-xl text-white rounded-2xl border border-white/20 p-4 w-72 sm:w-80 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                {isPlaying ? (
                  <Pause size={18} fill="white" />
                ) : (
                  <Play size={18} fill="white" className="ml-0.5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold truncate max-w-[150px]">{currentTrack?.title}</p>
                <p className="text-xs text-white/60">{currentTrack?.artist || 'Track ' + (actualIndex + 1)}</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label={t('music.collapse_player')}
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div
            className="relative h-1 bg-white/20 rounded-full mb-4 cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-all ${isShuffleOn ? 'bg-accent text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              aria-label={t('music.shuffle')}
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={playPrevious}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label={t('music.previous')}
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center hover:scale-105 transition-transform"
              aria-label={isPlaying ? t('music.pause') : t('music.play')}
            >
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
            </button>

            <button
              onClick={playNext}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label={t('music.next')}
            >
              <SkipForward size={20} />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label={isMuted ? t('music.unmute') : t('music.mute')}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              aria-label={t('music.volume')}
            />
            <span className="text-xs text-white/60 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Track list (compact) */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{t('music.playlist')}</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {tracks.map((track, index) => {
                const isCurrentTrack = index === actualIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      setHasInteracted(true);
                      const targetIndex = isShuffleOn ? shuffledIndices.indexOf(index) : index;
                      changeTrack(targetIndex);
                      setIsPlaying(true);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                      isCurrentTrack
                        ? 'bg-accent/20 text-accent'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">
                      {isCurrentTrack && isPlaying ? (
                        <Pause size={12} fill="currentColor" />
                      ) : (
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-white/40 truncate">{track.artist || 'Track ' + (index + 1)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
