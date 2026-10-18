import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Check, Download, ImagePlus, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { homeSlabs } from '../components/cinematic/slabs';
import { localPhoto } from '../lib/localPhotos';
import { visualizerCopy } from '../lib/visualizerCopy';
import { loadKitchenPhoto } from '../lib/visualizerPhoto';
import { validRegions, type Region } from '../lib/visualizer';
import SurfaceSelector from '../components/SurfaceSelector';
import VisualizerVerification from '../components/VisualizerVerification';
import './Visualizer.css';

export default function Visualizer() {
  const { language } = useLanguage();
  const c = visualizerCopy[language];
  const [params] = useSearchParams();
  const [status, setStatus] = useState<{enabled: boolean; preview: boolean; siteKey?: string} | null>(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [verificationVersion, setVerificationVersion] = useState(0);
  const [slabId, setSlabId] = useState(() => homeSlabs.find(s => s.id === params.get('slab'))?.id || homeSlabs[0].id);
  const [photo, setPhoto] = useState<Awaited<ReturnType<typeof loadKitchenPhoto>> | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [error, setError] = useState<keyof typeof c | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [comparison, setComparison] = useState(50);
  const [photoVersion, setPhotoVersion] = useState(0);
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef<string | null>(null);
  const uploadVersion = useRef(0);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const slab = homeSlabs.find(s => s.id === slabId)!;
  useEffect(() => {
    const abort = new AbortController();
    fetch(`/api/visualizer${params.get('preview') === '1' ? '?preview=1' : ''}`, { cache: 'no-store', signal: abort.signal })
      .then(r => r.ok ? r.json() : null).then(d => setStatus({enabled: d?.enabled === true, preview: d?.preview === true, siteKey: d?.siteKey})).catch(() => { if (!abort.signal.aborted) setStatus({enabled: false, preview: false}); });
    return () => abort.abort();
  }, [params.get('preview')]);
  useEffect(() => { document.title = `${c.nav} | Shayish Kfar Yassif`; }, [c.nav]);
  useEffect(() => () => { controller.current?.abort(); uploadVersion.current++; }, []);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result); }, [result]);
  useEffect(() => { if (result) resultHeading.current?.focus(); }, [result]);
  const resetResult = () => { setResult(null); setError(null); requestId.current = null; };
  const selectFile = async (file?: File) => {
    if (!file || inFlight.current) return;
    const version = ++uploadVersion.current;
    setLoadingPhoto(true); setError(null);
    try {
      const next = await loadKitchenPhoto(file);
      if (version !== uploadVersion.current) return;
      setPhoto(next); setRegions([]); setHasDraft(false); setConsent(false); setPhotoVersion(v => v + 1); resetResult();
    } catch { if (version === uploadVersion.current) setError('fileError'); }
    finally { if (version === uploadVersion.current) setLoadingPhoto(false); }
  };
  const generate = async () => {
    if (!photo || !consent || !verificationToken || hasDraft || inFlight.current || !status?.enabled || !validRegions(regions)) return;
    inFlight.current = true; setBusy(true); setError(null);
    controller.current = new AbortController();
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/visualizer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.current.signal,
        body: JSON.stringify({ requestId: requestId.current, slabId, photo: photo.url, regions, consent, verificationToken }) });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.error === 'quota' || data.error === 'quota_month') setError('quota');
        else if (data.error === 'verification_required') setError('verification');
        else if (data.error === 'duplicate') setError('duplicate');
        else if (data.error === 'disabled' || data.error === 'unavailable') { setError('disabled'); setStatus(s => s && { ...s, enabled: false }); }
        else if (data.error === 'invalid_selection') setError('selectionError');
        else setError('error');
        return;
      }
      if (!response.headers.get('Content-Type')?.startsWith('image/jpeg')) throw new Error();
      const blob = await response.blob();
      setResult(URL.createObjectURL(blob)); setComparison(50);
    } catch (failure) { if (!(failure instanceof DOMException && failure.name === 'AbortError')) setError('error'); }
    finally { inFlight.current = false; setBusy(false); setVerificationToken(''); setVerificationVersion(v => v + 1); }
  };

  if (status === null) return <div className="viz-page viz-unavailable" role="status">{c.loading}</div>;
  if (!status.enabled && !status.preview) return <div className="viz-page viz-unavailable"><LockKeyhole size={32} /><h1>{c.off}</h1><p>{c.offBody}</p><Link className="viz-action" to="/gallery">{c.browse}<ArrowUpRight size={18}/></Link></div>;

  return <div className="viz-page">
    {status.preview && !status.enabled && <div className="viz-preview" role="status"><LockKeyhole size={18}/>{c.preview}</div>}
    <header className="viz-heading"><p className="viz-eyebrow">{c.eyebrow}</p><h1>{c.title}</h1><p>{c.intro}</p></header>
    <div className="viz-workspace">
      <aside className="viz-stones" aria-labelledby="viz-stones-title"><h2 id="viz-stones-title">{c.slabs}</h2>
        <div className="viz-stone-list">{homeSlabs.map((s, index) => <button type="button" key={s.id} disabled={busy} className="viz-stone" aria-pressed={slabId === s.id} aria-label={`${s.name[language]} · ${index + 1}`} onClick={() => { setSlabId(s.id); resetResult(); }}>
          <img src={localPhoto(`/stone-slabs/edited/${s.id}.jpeg`)} alt="" loading={index < 4 ? 'eager' : 'lazy'} width="160" height="120"/><span><strong>{s.name[language]}</strong><small dir="ltr">{String(index + 1).padStart(2, '0')} / {s.tradeName}</small></span>{slabId === s.id && <Check size={18} aria-hidden="true"/>}
        </button>)}</div>
      </aside>
      <div className="viz-main">
        <section className="viz-upload" aria-labelledby="viz-upload-title"><div className="viz-section-heading"><h2 id="viz-upload-title">{c.upload}</h2>{photo && <button className="viz-text-button" type="button" disabled={busy || loadingPhoto} onClick={() => fileInput.current?.click()}>{c.change}</button>}</div>
          <input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || loadingPhoto} aria-label={c.choose} onChange={event => { void selectFile(event.target.files?.[0]); event.target.value = ''; }} />
          {!photo && <button type="button" className="viz-drop" disabled={busy || loadingPhoto} onClick={() => fileInput.current?.click()}><ImagePlus size={36} strokeWidth={1.3}/><strong>{loadingPhoto ? c.loading : c.choose}</strong><span>{c.uploadHint}</span></button>}
          <p className="viz-small">{c.local}</p>
        </section>
        {photo && !result && <SurfaceSelector key={photoVersion} photo={photo} regions={regions} onChange={next => { setRegions(next); resetResult(); }} language={language} disabled={busy || loadingPhoto} onDraft={setHasDraft}/>}
        {photo && !result && <section className="viz-generate">
          <div className="viz-chosen"><img src={localPhoto(`/stone-slabs/edited/${slab.id}.jpeg`)} alt=""/><strong>{slab.name[language]}</strong></div>
          <label className="viz-consent"><input type="checkbox" checked={consent} disabled={busy} onChange={e => setConsent(e.target.checked)}/><span>{c.consent}</span></label>
          <p className="viz-small">{c.privacy} <Link to="/privacy-policy" target="_blank">{c.privacyLink}</Link></p>
          {status.enabled && status.siteKey && consent && <VisualizerVerification key={verificationVersion} siteKey={status.siteKey} onToken={setVerificationToken} label={c.verification}/>}
          <button className="viz-action" type="button" disabled={!status.enabled || !consent || !verificationToken || !validRegions(regions) || hasDraft || busy || loadingPhoto} onClick={generate}>{busy ? <LoaderCircle className="viz-spinner" size={20}/> : <ArrowUpRight size={20}/>} {busy ? c.busy : c.generate}</button>
          <p className="viz-small">{c.note}</p>{busy && <p role="status" className="viz-progress">{c.busy}</p>}
        </section>}
        {error && <p className="viz-error" role="alert">{c[error]}</p>}
        {result && photo && <section className="viz-result" aria-labelledby="viz-result-title"><h2 id="viz-result-title" ref={resultHeading} tabIndex={-1}>{c.result}</h2>
          <div className="viz-comparison" dir="ltr"><img src={photo.url} alt={c.before} width={photo.width} height={photo.height}/><img className="viz-after" src={result} alt={c.after} style={{clipPath: `inset(0 0 0 ${comparison}%)`}}/><span className="viz-divider" style={{left: `${comparison}%`}}/><span className="viz-before-label">{c.before}</span><span className="viz-after-label">{c.after}</span></div>
          <label className="viz-range-label">{c.compare}<input dir="ltr" type="range" min="0" max="100" value={comparison} onChange={e => setComparison(Number(e.target.value))}/></label>
          <p className="viz-small">{c.note}</p><div className="viz-result-actions"><a className="viz-action" href={result} download={`kitchen-visualization-${slab.id}.jpg`}><Download size={18}/>{c.download}</a><button className="viz-text-button" onClick={() => { resetResult(); document.getElementById('viz-stones-title')?.scrollIntoView({block: 'center'}); }}>{c.another}</button></div>
        </section>}
      </div>
    </div>
  </div>;
}
