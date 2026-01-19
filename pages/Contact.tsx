import React from 'react';
import ContactForm from '../components/ContactForm';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen text-light transition-colors duration-300">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Contact Info */}
                <div className="space-y-16">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-serif text-light mb-8">{t('contact.title')}</h1>
                        <p className="text-muted font-light max-w-md text-lg">
                            {t('contact.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-12">
                        <div className="group">
                            <div className="flex items-center gap-4 mb-2">
                                <Phone className="text-accent" size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted">{t('contact.phone')}</span>
                            </div>
                            <a href="tel:+972500000000" className="text-3xl font-serif text-light hover:text-accent transition-colors" dir="ltr">050-000-0000</a>
                        </div>

                        <div className="group">
                            <div className="flex items-center gap-4 mb-2">
                                <Mail className="text-accent" size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted">{t('contact.email')}</span>
                            </div>
                            <a href="mailto:info@shayish-yasif.co.il" className="text-2xl font-serif text-light hover:text-accent transition-colors">info@shayish-yasif.co.il</a>
                        </div>

                        <div className="group">
                            <div className="flex items-center gap-4 mb-2">
                                <MapPin className="text-accent" size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted">{t('contact.address_title')}</span>
                            </div>
                            <p className="text-xl font-light text-light leading-relaxed">
                                {t('contact.address_lines.0')}<br/>
                                {t('contact.address_lines.1')}
                            </p>
                            <a href="#" className="inline-block mt-4 text-accent text-sm underline underline-offset-4 hover:text-light transition-colors">{t('contact.waze')}</a>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:mt-12">
                    <ContactForm />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Contact;