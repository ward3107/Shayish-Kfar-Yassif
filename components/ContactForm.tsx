import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Public contact form. POSTs to /api/contact which emails the owner via
 * Resend if configured, else logs to Vercel function logs. Always shows the
 * visitor a success confirmation once the API returns 200 — the "email
 * disabled" degraded mode is handled server-side and doesn't surface here.
 *
 * Includes a honeypot field (`website`) to trap dumb bots without adding
 * a captcha; the API silently 200s any submission with a filled honeypot.
 */
const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });
      if (res.status === 429) {
        setStatus('error');
        setErrorMsg(t('contact.form.rateLimited'));
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(data?.error || t('contact.form.errorGeneric'));
        return;
      }
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
      setErrorMsg(t('contact.form.errorNetwork'));
    }
  };

  if (status === 'sent') {
    return (
      <div className="border border-accent/40 bg-accent/10 rounded-sm p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-accent" size={40} />
        <h3 className="text-2xl font-serif text-light mb-2">{t('contact.form.thanksTitle')}</h3>
        <p className="text-muted text-sm">{t('contact.form.thanksBody')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-xs uppercase tracking-widest text-accent hover:text-light transition-colors underline underline-offset-4"
        >
          {t('contact.form.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="cf-name" className="block text-xs uppercase tracking-widest text-muted mb-2">
          {t('contact.form.name')}
        </label>
        <input
          id="cf-name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === 'sending'}
          autoComplete="name"
          className="w-full bg-secondary border border-divider rounded-sm px-4 py-3 text-light focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="cf-email" className="block text-xs uppercase tracking-widest text-muted mb-2">
          {t('contact.form.email')}
        </label>
        <input
          id="cf-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'sending'}
          autoComplete="email"
          dir="ltr"
          className="w-full bg-secondary border border-divider rounded-sm px-4 py-3 text-light focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-xs uppercase tracking-widest text-muted mb-2">
          {t('contact.form.message')}
        </label>
        <textarea
          id="cf-message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === 'sending'}
          className="w-full bg-secondary border border-divider rounded-sm px-4 py-3 text-light focus:outline-none focus:border-accent transition-colors disabled:opacity-50 resize-y min-h-[120px]"
        />
        <div className="text-[10px] text-muted mt-1 text-end">{message.length} / 5000</div>
      </div>

      {/* Honeypot — hidden from users, filled by dumb bots. */}
      <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
        <label>
          Do not fill this in:
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-2 text-red-400 text-sm border border-red-500/30 bg-red-500/10 rounded-sm p-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !name || !email || message.length < 10}
        className="w-full flex items-center justify-center gap-2 bg-accent text-primary font-bold uppercase tracking-widest text-sm py-4 rounded-sm hover:bg-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={16} />
        {status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
      </button>
    </form>
  );
};

export default ContactForm;
