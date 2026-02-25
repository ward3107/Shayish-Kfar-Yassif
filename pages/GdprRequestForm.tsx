/**
 * GDPR Data Subject Request Portal
 * Allows EU/EEA users to exercise their GDPR rights
 *
 * Rights covered:
 * - Article 15: Right of access
 * - Article 16: Right to rectification
 * - Article 17: Right to erasure ("right to be forgotten")
 * - Article 18: Right to restrict processing
 * - Article 20: Right to data portability
 * - Article 21: Right to object
 *
 * Response time: 30 days (extendable to 90 for complex requests)
 * Built: 2025-02-25
 */

import React, { useState } from 'react';
import { Send, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { doesGDPRApply, getGDPRInfo } from '../utils/gdprDetection';

type RequestLanguage = 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl' | 'pl';

type RequestType =
  | 'access'
  | 'correction'
  | 'deletion'
  | 'portability'
  | 'restriction'
  | 'objection';

interface GdprRequestFormProps {
  recipientEmail?: string;
  privacyPolicyUrl?: string;
}

const REQUEST_TYPES: Record<RequestType, { id: RequestType; article: string; icon: string; en: string; de: string; fr: string }> = {
  access: { id: 'access', article: 'Article 15', icon: '📋', en: 'Access Request - What data do you have about me?', de: 'Auskunftsersuchen - Welche Daten haben Sie über mich?', fr: 'Demande d\'accès - Quelles données avez-vous sur moi ?' },
  correction: { id: 'correction', article: 'Article 16', icon: '✏️', en: 'Correction Request - Please correct my data', de: 'Korrekturantrag - Bitte korrigieren Sie meine Daten', fr: 'Demande de rectification - Veuillez corriger mes données' },
  deletion: { id: 'deletion', article: 'Article 17', icon: '🗑️', en: 'Erasure Request - Delete my data ("Right to be Forgotten")', de: 'Löschantrag - Meine Daten löschen ("Recht auf Vergessenwerden")', fr: 'Demande d\'effacement - Supprimer mes données ("Droit à l\'oubli")' },
  portability: { id: 'portability', article: 'Article 20', icon: '📤', en: 'Data Portability - Send me my data in a machine-readable format', de: 'Datenübertragbarkeit - Senden Sie mir meine Daten im maschinenlesbaren Format', fr: 'Portabilité des données - Envoyez-moi mes données dans un format lisible par machine' },
  restriction: { id: 'restriction', article: 'Article 18', icon: '🔒', en: 'Restrict Processing - Limit how you use my data', de: 'Verarbeitung einschränken - Begrenzen Sie die Verwendung meiner Daten', fr: 'Limiter le traitement - Limitez l\'utilisation de mes données' },
  objection: { id: 'objection', article: 'Article 21', icon: '⛔', en: 'Object to Processing - I object to how you process my data', de: 'Widerspruch gegen die Verarbeitung - Ich widerspreche der Verarbeitung meiner Daten', fr: 'Opposition au traitement - Je m\'oppose au traitement de mes données' }
};

const translations: Record<RequestLanguage, {
  title: string;
  subtitle: string;
  notEUTitle: string;
  notEUMessage: string;
  gdprOnlyNote: string;
  yourDetails: string;
  selectRequest: string;
  requestType: string;
  email: string;
  confirmEmail: string;
  message: string;
  idNote: string;
  responseTime: string;
  responseTimeDays: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  errorMessage: string;
  rights: string;
  article: string;
  privacyPolicy: string;
}> = {
  en: {
    title: 'GDPR Data Subject Request Portal',
    subtitle: 'Exercise your rights under the General Data Protection Regulation (GDPR)',
    notEUTitle: 'GDPR Rights for EU/EEA Residents Only',
    notEUMessage: 'This portal is intended for EU/EEA residents. If you are not an EU/EEA resident, please use our regular contact form.',
    gdprOnlyNote: 'This form is for GDPR-related requests only. For other inquiries, please use our contact page.',
    yourDetails: 'Your Details',
    selectRequest: 'Select Your Request Type',
    requestType: 'Request Type',
    email: 'Email Address',
    confirmEmail: 'Confirm Email',
    message: 'Additional Details (Optional)',
    idNote: 'We may ask for ID verification to process your request.',
    responseTime: 'We will respond within',
    responseTimeDays: '30 days (extendable to 90 days for complex requests)',
    submit: 'Submit Request',
    submitting: 'Submitting...',
    successTitle: 'Request Submitted Successfully',
    successMessage: 'We have received your GDPR request. You will receive a confirmation email shortly. We will respond to your request within 30 days.',
    errorTitle: 'Submission Error',
    errorMessage: 'There was an error submitting your request. Please try again or contact us directly at',
    rights: 'Your GDPR Rights',
    article: 'Article',
    privacyPolicy: 'Privacy Policy'
  },
  de: {
    title: 'GDPR-Datenantrag-Portal',
    subtitle: 'Üben Sie Ihre Rechte gemäß der Datenschutz-Grundverordnung (DSGVO) aus',
    notEUTitle: 'DSGVO-Rechte nur für EU/EWR-Bürger',
    notEUMessage: 'Dieses Portal ist für EU/EWR-Bürger bestimmt. Wenn Sie kein EU/EWR-Bürger sind, verwenden Sie bitte unser reguläres Kontaktformular.',
    gdprOnlyNote: 'Dieses Formular ist nur für DSGVO-Anträge bestimmt. Für andere Anfragen nutzen Sie bitte unsere Kontaktseite.',
    yourDetails: 'Ihre Daten',
    selectRequest: 'Wählen Sie Ihren AntragsTyp',
    requestType: 'Antragsart',
    email: 'E-Mail-Adresse',
    confirmEmail: 'E-Mail bestätigen',
    message: 'Zusätzliche Angaben (Optional)',
    idNote: 'Wir können einen Identitätsnachweis verlangen, um Ihren Antrag zu bearbeiten.',
    responseTime: 'Wir antworten innerhalb',
    responseTimeDays: '30 Tage (verlängerbar auf 90 Tage bei komplexen Anträgen)',
    submit: 'Antrag einreichen',
    submitting: 'Wird gesendet...',
    successTitle: 'Antrag erfolgreich eingereicht',
    successMessage: 'Wir haben Ihren DSGVO-Antrag erhalten. Sie erhalten in Kürze eine Bestätigungs-E-Mail. Wir werden innerhalb von 30 Tagen auf Ihren Antrag antworten.',
    errorTitle: 'Übermittlungsfehler',
    errorMessage: 'Bei der Übermittlung Ihres Antrags ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt unter',
    rights: 'Ihre DSGVO-Rechte',
    article: 'Artikel',
    privacyPolicy: 'Datenschutzerklärung'
  },
  fr: {
    title: 'Portail de demandes des personnes concernées RGPD',
    subtitle: 'Exercez vos droits en vertu du Règlement général sur la protection des données (RGPD)',
    notEUTitle: 'Droits RGPD réservés aux résidents de l\'UE/EEE',
    notEUMessage: 'Ce portail est destiné aux résidents de l\'UE/EEE. Si vous n\'êtes pas résident de l\'UE/EEE, veuillez utiliser notre formulaire de contact régulier.',
    gdprOnlyNote: 'Ce formulaire est destiné uniquement aux demandes RGPD. Pour autres demandes, veuillez utiliser notre page de contact.',
    yourDetails: 'Vos coordonnées',
    selectRequest: 'Sélectionnez votre type de demande',
    requestType: 'Type de demande',
    email: 'Adresse e-mail',
    confirmEmail: 'Confirmer l\'e-mail',
    message: 'Détails supplémentaires (Facultatif)',
    idNote: 'Nous pouvons demander une vérification d\'identité pour traiter votre demande.',
    responseTime: 'Nous répondrons dans',
    responseTimeDays: '30 jours (extensible à 90 jours pour les demandes complexes)',
    submit: 'Soumettre la demande',
    submitting: 'Soumission en cours...',
    successTitle: 'Demande soumise avec succès',
    successMessage: 'Nous avons bien reçu votre demande RGPD. Vous recevrez un e-mail de confirmation sous peu. Nous répondrons à votre demande dans les 30 jours.',
    errorTitle: 'Erreur de soumission',
    errorMessage: 'Une erreur s\'est produite lors de la soumission de votre demande. Veuillez réessayer ou contactez-nous directement à',
    rights: 'Vos droits RGPD',
    article: 'Article',
    privacyPolicy: 'Politique de confidentialité'
  },
  es: {
    title: 'Portal de Solicitudes del Titular de Datos RGPD',
    subtitle: 'Ejerce tus derechos conforme al Reglamento General de Protección de Datos (RGPD)',
    notEUTitle: 'Derechos RGPD solo para residentes de la UE/EEE',
    notEUMessage: 'Este portal está destinado a residentes de la UE/EEE. Si no es residente de la UE/EEE, utilice nuestro formulario de contacto regular.',
    gdprOnlyNote: 'Este formulario es solo para solicitudes RGPD. Para otras consultas, utilice nuestra página de contacto.',
    yourDetails: 'Sus datos',
    selectRequest: 'Seleccione su tipo de solicitud',
    requestType: 'Tipo de solicitud',
    email: 'Correo electrónico',
    confirmEmail: 'Confirmar correo',
    message: 'Detalles adicionales (Opcional)',
    idNote: 'Podemos solicitar verificación de identidad para procesar su solicitud.',
    responseTime: 'Responderemos dentro de',
    responseTimeDays: '30 días (ampliable a 90 días para solicitudes complejas)',
    submit: 'Enviar solicitud',
    submitting: 'Enviando...',
    successTitle: 'Solicitud enviada con éxito',
    successMessage: 'Hemos recibido su solicitud RGPD. Recibirá un correo de confirmación en breve. Responderemos a su solicitud dentro de los 30 días.',
    errorTitle: 'Error de envío',
    errorMessage: 'Hubo un error al enviar su solicitud. Inténtelo de nuevo o contáctenos directamente en',
    rights: 'Sus derechos RGPD',
    article: 'Artículo',
    privacyPolicy: 'Política de privacidad'
  },
  it: {
    title: 'Portale delle Richieste degli Interessati GDPR',
    subtitle: 'Esercita i tuoi diritti conformemente al Regolare Generale sulla Protezione dei Dati (GDPR)',
    notEUTitle: 'Diritti GDPR solo per residenti UE/SEE',
    notEUMessage: 'Questo portale è destinato ai residenti UE/SEE. Se non sei residente UE/SEE, utilizza il nostro modulo di contatto regolare.',
    gdprOnlyNote: 'Questo modulo è solo per richieste GDPR. Per altre richieste, utilizza la nostra pagina di contatto.',
    yourDetails: 'I tuoi dati',
    selectRequest: 'Seleziona il tipo di richiesta',
    requestType: 'Tipo di richiesta',
    email: 'Indirizzo email',
    confirmEmail: 'Conferma email',
    message: 'Dettagli aggiuntivi (Facoltativo)',
    idNote: 'Potremmo richiedere la verifica dell\'identità per elaborare la tua richiesta.',
    responseTime: 'Risponderemo entro',
    responseTimeDays: '30 giorni (estendibile a 90 giorni per richieste complesse)',
    submit: 'Invia richiesta',
    submitting: 'Invio in corso...',
    successTitle: 'Richiesta inviata con successo',
    successMessage: 'Abbiamo ricevuto la tua richiesta GDPR. Riceverai un\'email di conferma a breve. Risponderemo alla tua richiesta entro 30 giorni.',
    errorTitle: 'Errore di invio',
    errorMessage: 'Si è verificato un errore nell\'invio della tua richiesta. Riprova o contattaci direttamente a',
    rights: 'I tuoi diritti GDPR',
    article: 'Articolo',
    privacyPolicy: 'Privacy Policy'
  },
  nl: {
    title: 'GDPR-portaal voor gegevensonderwerpen',
    subtitle: 'Oefen uw rechten uit onder de Algemene Verordening Gegevensbescherming (AVG)',
    notEUTitle: 'AVG-rechten alleen voor EU/EER-ingezetenen',
    notEUMessage: 'Dit portaal is bedoeld voor EU/EER-ingezetenen. Als u geen EU/EER-ingezetene bent, gebruikt u ons normale contactformulier.',
    gdprOnlyNote: 'Dit formulier is alleen voor AVG-verzoeken. Voor andere vragen gebruikt u onze contactpagina.',
    yourDetails: 'Uw gegevens',
    selectRequest: 'Selecteer uw verzoektype',
    requestType: 'Type verzoek',
    email: 'E-mailadres',
    confirmEmail: 'E-mail bevestigen',
    message: 'Aanvullende details (Optioneel)',
    idNote: 'We kunnen identiteitsverificatie vragen om uw verzoek te verwerken.',
    responseTime: 'We reageren binnen',
    responseTimeDays: '30 dagen (verlengbaar tot 90 dagen voor complexe verzoeken)',
    submit: 'Verzoek indienen',
    submitting: 'Indienen...',
    successTitle: 'Verzoek succesvol ingediend',
    successMessage: 'We hebben uw AVG-verzoek ontvangen. U ontvangt binnenkort een bevestigings-e-mail. We reageren op uw verzoek binnen 30 dagen.',
    errorTitle: 'Verzendfout',
    errorMessage: 'Er is een fout opgetreden bij het verzenden van uw verzoek. Probeer het opnieuw of neem rechtstreeks contact met ons op',
    rights: 'Uw AVG-rechten',
    article: 'Artikel',
    privacyPolicy: 'Privacybeleid'
  },
  pl: {
    title: 'Portal żądań podmiotu danych RODO',
    subtitle: 'Wykorzystaj swoje prawa zgodnie z Ogólnym Rozporządzeniem o Ochronie Danych (RODO)',
    notEUTitle: 'Prawa RODO tylko dla mieszkańców UE/EOG',
    notEUMessage: 'Ten portal jest przeznaczony dla mieszkańców UE/EOG. Jeśli nie jesteś mieszkańcem UE/EOG, użyj naszego zwykłego formularza kontaktowego.',
    gdprOnlyNote: 'Ten formularz jest tylko dla żądań RODO. W przypadku innych zapytań użyj naszej strony kontaktowej.',
    yourDetails: 'Twoje dane',
    selectRequest: 'Wybierz typ żądania',
    requestType: 'Typ żądania',
    email: 'Adres e-mail',
    confirmEmail: 'Potwierdź e-mail',
    message: 'Dodatkowe szczegóły (Opcjonalnie)',
    idNote: 'Możemy poprosić o weryfikację tożsamości w celu przetworzenia Twojego żądania.',
    responseTime: 'Odpowiemy w ciągu',
    responseTimeDays: '30 dni (przedłużalne do 90 dni dla złożonych żądań)',
    submit: 'Wyślij żądanie',
    submitting: 'Wysyłanie...',
    successTitle: 'Żądanie zostało pomyślnie wysłane',
    successMessage: 'Otrzymaliśmy Twoje żądanie RODO. Wkrótce otrzymasz e-mail z potwierdzeniem. Odpowiemy na Twoje żądanie w ciągu 30 dni.',
    errorTitle: 'Błąd przesyłania',
    errorMessage: 'Wystąpił błąd podczas przesyłania Twojego żądania. Spróbuj ponownie lub skontaktuj się z nami bezpośrednio pod',
    rights: 'Twoje prawa RODO',
    article: 'Artykuł',
    privacyPolicy: 'Polityka prywatności'
  }
};

const GdprRequestForm: React.FC<GdprRequestFormProps> = ({
  recipientEmail = 'info@shayish-yasif.co.il',
  privacyPolicyUrl = '/privacy-policy'
}) => {
  const [language, setLanguage] = useState<RequestLanguage>('en');
  const [isEU, setIsEU] = useState<boolean | null>(null);
  const [requestType, setRequestType] = useState<RequestType>('access');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  // Detect if user is in EU
  React.useEffect(() => {
    const gdpApplies = doesGDPRApply();
    setIsEU(gdpApplies);

    // Auto-detect language from browser for EU users
    if (gdpApplies) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('de')) setLanguage('de');
      else if (browserLang.startsWith('fr')) setLanguage('fr');
      else if (browserLang.startsWith('es')) setLanguage('es');
      else if (browserLang.startsWith('it')) setLanguage('it');
      else if (browserLang.startsWith('nl')) setLanguage('nl');
      else if (browserLang.startsWith('pl')) setLanguage('pl');
      else setLanguage('en');
    }
  }, []);

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    if (email !== confirmEmail) {
      setEmailError('Email addresses do not match');
      return;
    }
    setEmailError('');

    setIsSubmitting(true);

    try {
      // Create mailto link with request details
      const subject = encodeURIComponent(`GDPR ${REQUEST_TYPES[requestType].en} - ${email}`);
      const body = encodeURIComponent(
        `GDPR Data Subject Request\n\n` +
        `Request Type: ${REQUEST_TYPES[requestType].article} - ${REQUEST_TYPES[requestType].en}\n` +
        `Email: ${email}\n` +
        `Language: ${language.toUpperCase()}\n` +
        `Date: ${new Date().toISOString()}\n\n` +
        `Additional Details:\n${message || 'N/A'}\n\n` +
        `---\n` +
        `This request was submitted via the GDPR Data Subject Request Portal.\n` +
        `Response required within 30 days (GDPR Article 12(3)).`
      );

      // Open email client with pre-filled message
      window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

      setSubmitStatus('success');

      // Reset form
      setTimeout(() => {
        setEmail('');
        setConfirmEmail('');
        setMessage('');
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  // Show EU-only warning if not in EU
  if (isEU === false) {
    return (
      <div className="min-h-screen bg-primary text-light py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">{t.notEUTitle}</h1>
            <p className="text-muted mb-6">{t.notEUMessage}</p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-accent text-white font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors rounded-sm"
            >
              Go to Contact Form
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-light py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-accent mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-muted">{t.subtitle}</p>
        </div>

        {/* Language Switcher for EU Users */}
        {isEU === true && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {(['en', 'de', 'fr', 'es', 'it', 'nl', 'pl'] as RequestLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 text-sm font-bold uppercase rounded transition-colors ${
                  language === lang
                    ? 'bg-accent text-white'
                    : 'bg-neutral-800 text-muted hover:text-light'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* GDPR Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
          <p className="text-sm text-muted flex items-start gap-3">
            <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <span>{t.gdprOnlyNote}</span>
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-500 mb-2">{t.successTitle}</h3>
                <p className="text-sm text-muted">{t.successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-500 mb-2">{t.errorTitle}</h3>
                <p className="text-sm text-muted">
                  {t.errorMessage} <a href={`mailto:${recipientEmail}`} className="text-accent underline">{recipientEmail}</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Request Type Selection */}
          <div>
            <h2 className="text-xl font-bold text-light mb-4">{t.selectRequest}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(REQUEST_TYPES).map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setRequestType(type.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    requestType === type.id
                      ? 'border-accent bg-accent/10'
                      : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs text-accent font-mono mb-1">{type.article}</div>
                      <div className="text-sm font-semibold text-light">{type[language as keyof typeof type] || type.en}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Details */}
          <div className="bg-secondary/30 rounded-lg p-6 border border-neutral-800">
            <h3 className="text-lg font-bold text-accent mb-4">{t.yourDetails}</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-light mb-2">
                  {t.email} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-sm text-light focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="confirmEmail" className="block text-sm font-semibold text-light mb-2">
                  {t.confirmEmail} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="confirmEmail"
                  required
                  value={confirmEmail}
                  onChange={(e) => {
                    setConfirmEmail(e.target.value);
                    setEmailError('');
                  }}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-sm text-light focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com"
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-light mb-2">
                  {t.message}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-sm text-light focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Please provide any additional details about your request..."
                />
              </div>

              <p className="text-xs text-muted italic">{t.idNote}</p>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
            <p className="text-sm text-muted">
              <span className="font-semibold text-light">{t.responseTime}</span>{' '}
              <span className="text-accent">{t.responseTimeDays}</span>
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <a
              href={privacyPolicyUrl}
              className="text-sm text-muted hover:text-accent transition-colors underline underline-offset-2"
            >
              {t.privacyPolicy}
            </a>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-accent text-white font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors rounded-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {t.submitting}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t.submit}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-sm text-muted">
          <p className="mb-2">
            <strong className="text-light">{t.rights}:</strong>{' '}
            GDPR Articles 15, 16, 17, 18, 20, 21
          </p>
          <p className="text-xs">
            {getGDPRInfo(language).complaintAuthority}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GdprRequestForm;
