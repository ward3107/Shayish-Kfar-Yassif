import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  LogOut,
  Image as ImageIcon,
  Film,
  Lock,
  AlertCircle,
  CheckCircle2,
  X,
  Camera,
  Download,
  Edit3,
  Star,
} from 'lucide-react';
import type { MediaItem } from '../types/media';

// Must match CATEGORIES in lib/cloudinary.ts. Duplicated here because the
// admin ships in the client bundle and can't import server-only code.
const CATEGORIES = ['kitchens', 'bathrooms', 'walls', 'stairs', 'slabs', 'special'] as const;
type Category = typeof CATEGORIES[number];

// Hebrew labels for the owner-facing category dropdown (matches the public
// gallery filter labels in translations.ts → gallery.cat.*).
const CAT_LABELS: Record<Category, string> = {
  kitchens: 'מטבחים ואיים',
  bathrooms: 'חדרי רחצה וכיורים',
  walls: 'קירות כוח וקמינים',
  stairs: 'מדרגות ופרטי פנים',
  slabs: 'לוחות אבן וחומרי גלם',
  special: 'עבודות מיוחדות',
};

// Helpers to read the same metadata the server writes.
const getCategory = (item: MediaItem): Category | '' => {
  const tag = item.tags.find((t) => t.startsWith('cat:'));
  const slug = tag?.slice(4) as Category | undefined;
  return slug && (CATEGORIES as readonly string[]).includes(slug) ? (slug as Category) : '';
};
const getFeaturedOrder = (item: MediaItem): number | null => {
  const tag = item.tags.find((t) => t.startsWith('featured:'));
  if (!tag) return null;
  const n = Number(tag.slice(9));
  return Number.isFinite(n) ? n : null;
};

/**
 * Owner admin panel — mobile-first, PWA-installable.
 *   - GET /api/admin/session   → { authenticated: boolean }
 *   - POST /api/admin/login    { password } → HttpOnly cookie (30-day session)
 *   - POST /api/admin/logout
 *   - GET /api/admin/list      → { items: MediaItem[] }
 *   - POST /api/admin/delete   { publicId, resourceType }
 *
 * Uploads go direct to Cloudinary via an unsigned upload preset — no secret
 * ever touches the browser.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
const UPLOAD_FOLDER = (import.meta.env.VITE_CLOUDINARY_GALLERY_FOLDER as string | undefined) || 'shayish/gallery';

type UploadJob = {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
};

// A minimal shape for the beforeinstallprompt event (not in lib.dom yet).
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const formatBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

const Admin: React.FC = () => {
  useEffect(() => {
    document.title = 'Admin | Shayish Kfar Yassif';
    // Belt-and-suspenders: robots.txt and vercel.json X-Robots-Tag already
    // block /admin, but a stray meta tag makes it explicit for any crawler
    // that reads the SPA-rendered HTML.
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d: { authenticated: boolean }) => setAuthed(!!d.authenticated))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-light">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return authed ? <Dashboard onLogout={() => setAuthed(false)} /> : <Login onSuccess={() => setAuthed(true)} />;
};

/* ------------------------------ Login ------------------------------ */

const Login: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-secondary border border-divider rounded-sm p-8 space-y-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <Lock className="text-accent" size={22} />
          <h1 className="text-2xl font-serif text-light">Owner login</h1>
        </div>
        <p className="text-muted text-sm">
          Enter the admin password to manage the gallery. Session stays active 30 days on this device.
        </p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-primary border border-divider rounded-sm px-4 py-4 text-lg text-light focus:outline-none focus:border-accent"
          autoComplete="current-password"
        />
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={pending || !password}
          className="w-full bg-accent text-primary font-bold uppercase tracking-widest text-sm py-4 rounded-sm hover:bg-light transition-colors disabled:opacity-50"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

/* ---------------------------- Dashboard ---------------------------- */

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const configOk = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  // PWA install prompt capture
  useEffect(() => {
    const alreadyStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(alreadyStandalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    const installedHandler = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/list');
      if (res.status === 401) return onLogout();
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  }, [onLogout]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    // After sign-out, send the owner back to the public site instead of
    // parking them on the empty login form. Full navigation (not router
    // push) also clears any in-memory admin state and re-triggers the
    // marketing Layout's normal mount lifecycle.
    window.location.href = '/';
  };

  const upload = useCallback(
    (files: FileList | File[]) => {
      if (!configOk) return;
      const list = Array.from(files);
      if (list.length === 0) return;
      const newJobs: UploadJob[] = list.map((f) => ({
        id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2)}`,
        file: f,
        progress: 0,
        status: 'pending',
      }));
      setJobs((prev) => [...prev, ...newJobs]);

      // Cap concurrency so a batch of 4K videos on flaky mobile does not
      // saturate the connection and time everything out at once.
      const MAX_CONCURRENT = 3;
      const queue = [...newJobs];
      let inFlight = 0;

      const runOne = (job: UploadJob) => {
        const isVideo = job.file.type.startsWith('video/');
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isVideo ? 'video' : 'image'}/upload`;
        const form = new FormData();
        form.append('file', job.file);
        form.append('upload_preset', UPLOAD_PRESET!);
        form.append('folder', UPLOAD_FOLDER);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return;
          const pct = Math.round((e.loaded / e.total) * 100);
          setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, progress: pct, status: 'uploading' } : j)));
        };
        const finish = () => {
          inFlight -= 1;
          pump();
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, progress: 100, status: 'done' } : j)));
            void refresh();
          } else {
            let msg = `HTTP ${xhr.status}`;
            try {
              const parsed = JSON.parse(xhr.responseText);
              msg = parsed?.error?.message ?? msg;
            } catch { /* ignore */ }
            setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: 'error', error: msg } : j)));
          }
          finish();
        };
        xhr.onerror = () => {
          setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: 'error', error: 'Network error' } : j)));
          finish();
        };
        xhr.send(form);
      };

      const pump = () => {
        while (inFlight < MAX_CONCURRENT && queue.length > 0) {
          const next = queue.shift()!;
          inFlight += 1;
          runOne(next);
        }
      };
      pump();
    },
    [configOk, refresh]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer?.files?.length) upload(e.dataTransfer.files);
    },
    [upload]
  );

  const doDelete = async (item: MediaItem) => {
    setConfirmDelete(null);
    setItems((prev) => (prev ? prev.filter((i) => i.publicId !== item.publicId) : prev));
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ publicId: item.publicId, resourceType: item.resourceType }),
      });
      if (res.status === 401) return onLogout();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
      void refresh();
    }
  };

  // Optimistically update local state (grid re-renders with new caption /
  // category / pin star immediately), then persist to Cloudinary. On error,
  // roll back by refetching.
  const doSaveEdit = async (
    item: MediaItem,
    patch: { alt: string; category: Category | ''; featuredOrder: number | null }
  ) => {
    setEditing(null);
    setItems((prev) =>
      prev
        ? prev.map((i) =>
            i.publicId === item.publicId
              ? {
                  ...i,
                  context: { ...i.context, alt: patch.alt },
                  tags: [
                    ...i.tags.filter((t) => !t.startsWith('cat:') && !t.startsWith('featured:')),
                    ...(patch.category ? [`cat:${patch.category}`] : []),
                    ...(patch.featuredOrder !== null
                      ? [`featured:${String(patch.featuredOrder).padStart(3, '0')}`]
                      : []),
                  ],
                }
              : i
          )
        : prev
    );
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          publicId: item.publicId,
          resourceType: item.resourceType,
          alt: patch.alt,
          category: patch.category,
          featuredOrder: patch.featuredOrder,
        }),
      });
      if (res.status === 401) return onLogout();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
      void refresh();
    }
  };

  const promptInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === 'accepted') setInstalled(true);
    setInstallEvent(null);
  };

  const activeJobs = jobs.filter((j) => j.status !== 'done');
  const filtered = useMemo(
    () => (items ?? []).filter((i) => filter === 'all' || i.resourceType === filter),
    [items, filter]
  );

  return (
    <div className="min-h-screen bg-primary text-light">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-secondary/95 backdrop-blur-md border-b border-divider">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-serif truncate">Gallery admin</h1>
            <p className="text-[10px] md:text-xs text-muted mt-0.5 truncate">
              {items ? `${items.length} items` : 'Loading…'} · <code className="text-accent">{UPLOAD_FOLDER}</code>
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors px-2 py-2"
            aria-label="Sign out"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* PWA install prompt (Android/desktop Chrome) */}
        {installEvent && !installed && (
          <div className="flex items-center gap-3 border border-accent/40 bg-accent/10 rounded-sm p-4">
            <Download className="text-accent flex-shrink-0" size={22} />
            <div className="flex-1 text-sm">
              <div className="font-semibold text-light">Install as app</div>
              <div className="text-muted text-xs">One-tap access from your home screen. Stays signed in 30 days.</div>
            </div>
            <button
              onClick={promptInstall}
              className="bg-accent text-primary font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm hover:bg-light transition-colors"
            >
              Install
            </button>
          </div>
        )}

        {/* iOS instructions (Safari has no beforeinstallprompt) */}
        {!installed && !installEvent && /iPhone|iPad/i.test(navigator.userAgent) && (
          <div className="flex items-start gap-3 border border-divider bg-secondary/60 rounded-sm p-4 text-sm">
            <Download className="text-accent flex-shrink-0 mt-0.5" size={20} />
            <div className="text-muted">
              <span className="text-light font-semibold">Install on iPhone:</span> tap the Share button in Safari, then
              choose <span className="text-light">Add to Home Screen</span>. The app icon appears with your other apps.
            </div>
          </div>
        )}

        {!configOk && (
          <div className="border border-red-500/50 bg-red-500/10 rounded-sm p-4 text-sm">
            <div className="font-bold text-red-300 mb-1">Cloudinary not configured</div>
            <p className="text-muted">
              Set <code>VITE_CLOUDINARY_CLOUD_NAME</code> and <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> in Vercel env vars,
              then redeploy.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start justify-between gap-3 border border-red-500/50 bg-red-500/10 rounded-sm p-4 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-400 mt-0.5" size={18} />
              <span className="text-muted">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-muted hover:text-light" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload actions — mobile-first, huge tap targets */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
            className={`border-2 border-dashed rounded-sm p-8 md:p-10 text-center cursor-pointer transition-colors select-none ${
              configOk ? 'border-divider hover:border-accent bg-secondary/40 active:bg-secondary/70' : 'border-divider/40 opacity-60 cursor-not-allowed'
            }`}
          >
            <Upload className="mx-auto mb-3 text-accent" size={40} />
            <div className="text-light font-semibold text-base md:text-lg mb-1">
              Tap to choose photos or videos
            </div>
            <p className="text-muted text-xs md:text-sm">
              Or drag files here · multi-select supported
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && upload(e.target.files)}
              disabled={!configOk}
            />
          </div>

          {/* Camera shortcut — mobile only, opens native camera */}
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={!configOk}
            className={`md:hidden flex items-center justify-center gap-3 bg-accent text-primary rounded-sm p-5 font-bold uppercase tracking-widest text-sm transition-colors ${
              configOk ? 'hover:bg-light active:opacity-80' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Camera size={22} />
            Take a photo now
          </button>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files && upload(e.target.files)}
          />
        </div>

        {/* Upload queue */}
        {activeJobs.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs uppercase tracking-widest text-muted">Uploading</h2>
            {activeJobs.map((job) => (
              <div key={job.id} className="bg-secondary border border-divider rounded-sm p-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="truncate flex-1 pr-4">{job.file.name}</span>
                  <span className="text-muted text-xs">{formatBytes(job.file.size)}</span>
                </div>
                {job.status === 'error' ? (
                  <div className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {job.error}
                  </div>
                ) : (
                  <div className="h-1.5 bg-primary rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${job.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-2 border-b border-divider overflow-x-auto">
          {(['all', 'image', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px whitespace-nowrap ${
                filter === f ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-light'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {items === null ? (
          <div className="text-muted text-sm">Loading media…</div>
        ) : filtered.length === 0 ? (
          <div className="text-muted text-sm py-16 text-center border border-dashed border-divider rounded-sm">
            No {filter === 'all' ? 'media' : filter + 's'} yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((item) => (
              <div
                key={item.publicId}
                className="group relative aspect-square bg-secondary border border-divider rounded-sm overflow-hidden"
              >
                {item.resourceType === 'image' ? (
                  <img src={item.thumbUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black relative">
                    <video src={item.secureUrl} className="w-full h-full object-cover" muted playsInline />
                    <Film className="absolute text-accent opacity-70" size={32} />
                  </div>
                )}
                {/* Persistent pin-star badge (visible without hover) so the owner
                    can see at a glance which photos are featured. */}
                {getFeaturedOrder(item) !== null && (
                  <div
                    className="absolute top-2 start-2 z-10 bg-accent text-primary rounded-full p-1.5 shadow-lg"
                    title={`Pinned #${getFeaturedOrder(item)}`}
                  >
                    <Star size={12} fill="currentColor" strokeWidth={0} />
                  </div>
                )}
                {/* On mobile, controls are always visible (no hover). On desktop, appear on hover. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 md:p-3">
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/80">
                    {item.resourceType === 'image' ? <ImageIcon size={12} /> : <Film size={12} />}
                    <span>{item.format}</span>
                    <span className="ms-auto">{formatBytes(item.bytes)}</span>
                  </div>
                  <div className="self-end flex gap-2">
                    <button
                      onClick={() => setEditing(item)}
                      className="bg-black/70 text-white p-3 md:p-2 rounded-full hover:bg-black min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Edit caption, category, pin"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item)}
                      className="bg-red-500/90 text-white p-3 md:p-2 rounded-full hover:bg-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit metadata modal */}
      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => doSaveEdit(editing, patch)}
        />
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-secondary border border-divider rounded-sm p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-serif text-light mb-2 flex items-center gap-2">
              <AlertCircle className="text-red-400" size={18} /> Delete this file?
            </h3>
            <p className="text-muted text-sm mb-6">
              This removes it from Cloudinary permanently. The public gallery updates within a minute.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-3 text-sm text-muted hover:text-light">
                Cancel
              </button>
              <button
                onClick={() => doDelete(confirmDelete)}
                className="px-4 py-3 text-sm font-bold bg-red-500 text-white rounded-sm hover:bg-red-600"
              >
                <span className="flex items-center gap-1">
                  <Trash2 size={14} /> Delete
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast for finished uploads */}
      {jobs.some((j) => j.status === 'done') && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-auto flex items-center gap-2 bg-accent text-primary px-4 py-3 rounded-sm text-sm font-bold shadow-lg">
          <CheckCircle2 size={16} /> {jobs.filter((j) => j.status === 'done').length} uploaded
          <button
            onClick={() => setJobs((prev) => prev.filter((j) => j.status !== 'done'))}
            className="ms-2 hover:opacity-70"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ----------------------------- EditModal ------------------------------
   One dialog that edits caption / category / pin order for a single asset.
   Optimistic save: parent updates state immediately, then POSTs. */

const EditModal: React.FC<{
  item: MediaItem;
  onClose: () => void;
  onSave: (patch: { alt: string; category: Category | ''; featuredOrder: number | null }) => void;
}> = ({ item, onClose, onSave }) => {
  const [alt, setAlt] = useState(item.context.alt ?? '');
  const [category, setCategory] = useState<Category | ''>(getCategory(item));
  const [pinned, setPinned] = useState(getFeaturedOrder(item) !== null);
  const [order, setOrder] = useState<number>(getFeaturedOrder(item) ?? 10);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      alt: alt.trim(),
      category,
      featuredOrder: pinned ? Math.max(0, Math.min(999, Math.round(order))) : null,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit media"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 md:p-6"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-secondary border border-divider rounded-sm p-5 md:p-6 max-w-md w-full space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif text-light">Edit details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-light p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview thumb */}
        <div className="flex gap-3">
          {item.resourceType === 'image' ? (
            <img src={item.thumbUrl} alt="" className="w-20 h-20 object-cover rounded-sm border border-divider" />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-black rounded-sm border border-divider">
              <Film className="text-accent" size={24} />
            </div>
          )}
          <div className="text-xs text-muted min-w-0 pt-1">
            <div className="uppercase tracking-widest mb-1">{item.resourceType} · {item.format}</div>
            <div className="truncate">{item.publicId}</div>
          </div>
        </div>

        {/* Caption / alt */}
        <div>
          <label htmlFor="edit-alt" className="block text-xs uppercase tracking-widest text-muted mb-2">
            Caption <span className="normal-case tracking-normal text-muted/70">(shown on the public gallery, also used as image alt text)</span>
          </label>
          <input
            id="edit-alt"
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            maxLength={200}
            autoFocus
            placeholder="אי מטבח משיש — כפר יאסיף"
            className="w-full bg-primary border border-divider rounded-sm px-3 py-3 text-sm text-light focus:outline-none focus:border-accent"
          />
          <div className="text-[10px] text-muted mt-1 text-end">{alt.length} / 200</div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="edit-cat" className="block text-xs uppercase tracking-widest text-muted mb-2">
            Category
          </label>
          <select
            id="edit-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | '')}
            className="w-full bg-primary border border-divider rounded-sm px-3 py-3 text-sm text-light focus:outline-none focus:border-accent"
          >
            <option value="">— none —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CAT_LABELS[c]}</option>
            ))}
          </select>
        </div>

        {/* Pin */}
        <div className="border border-divider rounded-sm p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="w-5 h-5 accent-accent"
            />
            <span className="text-sm text-light font-semibold flex items-center gap-2">
              <Star size={14} className={pinned ? 'text-accent' : 'text-muted'} fill={pinned ? 'currentColor' : 'none'} />
              Pin to top of public gallery
            </span>
          </label>
          {pinned && (
            <div className="flex items-center gap-3 ps-8">
              <label htmlFor="edit-order" className="text-xs uppercase tracking-widest text-muted whitespace-nowrap">
                Order
              </label>
              <input
                id="edit-order"
                type="number"
                min={0}
                max={999}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-24 bg-primary border border-divider rounded-sm px-3 py-2 text-sm text-light focus:outline-none focus:border-accent"
              />
              <span className="text-xs text-muted">lower first (0-999)</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 text-sm text-muted hover:text-light"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-sm font-bold bg-accent text-primary rounded-sm hover:bg-light transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
