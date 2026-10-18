import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Check, Copy, Download, Heart, ImagePlus, MessageCircle, X } from 'lucide-react';
import { useSelections } from '../contexts/SelectionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT, whatsappLink } from '../constants';
import { parseSharedSelection, selectionLink, selectionMessage } from '../lib/selections';
import { selectionCopy, selectionCountLabel } from '../lib/selectionCopy';
import { selectionAsset } from '../lib/selectionAssets';
import { prepareSelectionSheets } from '../lib/selectionSheets';
import { SelectionHeart } from '../components/SelectionControls';

export default function Favorites() {
  const { refs: personal, toggle, persisted } = useSelections();
  const { language } = useLanguage();
  const location = useLocation();
  const c = selectionCopy[language];
  const shared = useMemo(() => parseSharedSelection(location.hash), [location.hash]);
  const refs = shared ? shared.refs : personal;
  const key = `${language}:${refs.join(',')}`;
  const items = useMemo(() => refs.map(ref => selectionAsset(ref, language)), [key]);
  const url = selectionLink(window.location.origin, refs);
  const [name, setName] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [attempt, setAttempt] = useState(0);
  const [sheetState, setSheetState] = useState<{ key: string; files: File[]; urls: string[]; error: boolean }>({ key: '', files: [], urls: [], error: false });
  const [shareError, setShareError] = useState(false);
  const [sharing, setSharing] = useState(false);
  const message = selectionMessage({ intro: c.message, nameLabel: c.messageName, name, labels: items.map(item => `${item.label} [${item.code}]`), linkLabel: c.messageLink, url });
  const ready = sheetState.key === key && sheetState.files.length > 0;
  let canShare = false;
  try { canShare = ready && !!navigator.share && !!navigator.canShare?.({ files: sheetState.files }); } catch { /* download fallback */ }

  useEffect(() => { document.title = `${shared ? c.shared : c.title} | Shayish Kfar Yassif`; }, [shared, c]);
  useEffect(() => { setCopyState('idle'); setShareError(false); }, [key]);
  useEffect(() => {
    const controller = new AbortController();
    let urls: string[] = [];
    setSheetState({ key, files: [], urls: [], error: false });
    if (items.length) prepareSelectionSheets(items, c.title, CONTACT.phoneDisplay, controller.signal).then(files => {
      if (controller.signal.aborted) return;
      urls = files.map(file => URL.createObjectURL(file));
      setSheetState({ key, files, urls, error: false });
    }).catch(() => { if (!controller.signal.aborted) setSheetState({ key, files: [], urls: [], error: true }); });
    return () => { controller.abort(); urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [key, attempt]);

  const sharePhotos = async () => {
    if (!canShare || sharing) return;
    setSharing(true); setShareError(false);
    try {
      // Files are prepared before the click, preserving mobile user activation.
      await navigator.share({ title: c.title, text: message, files: sheetState.files });
    } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setShareError(true); }
    finally { setSharing(false); }
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); setCopyState('copied'); } catch { setCopyState('error'); }
  };

  return <div className="selections-page">
    <header className="selections-heading"><p className="selections-eyebrow">{c.eyebrow}</p><h1>{shared ? c.shared : c.title}<span>{items.length.toString().padStart(2, '0')}</span></h1><p>{c.intro}</p></header>
    {shared?.invalid ? <div className="selections-empty"><p role="alert">{c.invalid}</p><Link className="selection-action" to="/favorites">{c.personal}</Link></div> : !items.length ? <div className="selections-empty"><Heart size={42} aria-hidden="true" /><h2>{c.empty}</h2><p>{c.emptyBody}</p><Link className="selection-action selection-primary" to="/gallery">{c.browse}<ArrowUpRight size={18} /></Link></div> : <>
      <button type="button" className="selection-action selection-primary selection-mobile-send" onClick={() => { document.getElementById('selection-send')?.scrollIntoView(); document.getElementById('selection-name')?.focus({ preventScroll: true }); }}><MessageCircle size={19} />{c.review}</button>
      <div className="selections-layout">
        <section aria-label={shared ? c.shared : c.title}>
          <div className="selections-grid">{items.map((item, index) => <figure className="selection-card" key={item.ref}>
            <div className="selection-card-image"><img src={item.image} alt={item.label} loading={index < 4 ? 'eager' : 'lazy'} />
              {shared ? <SelectionHeart item={item.ref} label={item.label} /> : <button type="button" className="selection-heart" aria-label={`${c.remove}: ${item.label}`} onClick={() => toggle(item.ref)}><X size={20} aria-hidden="true" /></button>}
              <span className="selection-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <figcaption><strong>{item.label}</strong><small dir="ltr">{item.code}</small></figcaption>
          </figure>)}</div>
          <Link className="selection-continue" to={shared ? '/favorites' : '/gallery'}>{shared ? c.personal : c.browse}<ArrowUpRight size={18} /></Link>
          {!shared && <p className="selection-note" role={persisted ? undefined : 'status'}>{persisted ? c.saved : c.storage}</p>}
        </section>
        <aside className="selection-send" id="selection-send">
          <div className="selection-send-heading"><Heart size={22} /><h2>{items.length} {selectionCountLabel(language, items.length)}</h2></div>
          <label htmlFor="selection-name">{c.name}</label><input id="selection-name" name="name" autoComplete="given-name" maxLength={80} value={name} onChange={event => setName(event.target.value)} placeholder={c.namePlaceholder} />
          <a className="selection-action selection-primary" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer"><MessageCircle size={21} aria-hidden="true" />{c.send}</a>
          <p className="selection-note">{c.directHint}</p>
          <div className="selection-photo-share"><h3><ImagePlus size={20} />{c.photoTitle}</h3>
            <p className="selection-note">{canShare ? c.photoHint : c.downloadHint} <bdi dir="ltr">{CONTACT.phoneDisplay}</bdi></p>
            {!ready && !sheetState.error && <p className="selection-note" role="status">{c.preparing}</p>}
            {sheetState.key === key && sheetState.error && <><p className="selection-note" role="status">{c.photoError}</p><button type="button" className="selection-action" onClick={() => setAttempt(value => value + 1)}>{c.retry}</button></>}
            {canShare && <button type="button" className="selection-action" onClick={sharePhotos} disabled={sharing}><ImagePlus size={19} />{c.share}</button>}
            {ready && <div className="selection-downloads">{sheetState.files.map((file, index) => <a key={file.name} className="selection-download" href={sheetState.urls[index]} download={file.name}><img src={sheetState.urls[index]} alt={`${c.download} ${index + 1}`} /><span><Download size={16} />{c.download} {index + 1}</span></a>)}</div>}
            {shareError && <p className="selection-note" role="status">{c.shareError}</p>}
          </div>
          <button type="button" className="selection-action" onClick={copyLink}>{copyState === 'copied' ? <Check size={18} /> : <Copy size={18} />}{copyState === 'copied' ? c.copied : c.copy}</button>
          <span className="sr-only" role="status">{copyState === 'copied' ? c.copied : copyState === 'error' ? c.copyError : ''}</span>
          {copyState === 'error' && <p className="selection-note">{c.copyError}</p>}
          <label className="sr-only" htmlFor="selection-link">{c.link}</label><input className="selection-link" id="selection-link" readOnly value={url} dir="ltr" onFocus={event => event.target.select()} />
        </aside>
      </div>
    </>}
  </div>;
}
