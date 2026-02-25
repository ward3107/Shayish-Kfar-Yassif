import React, { useState } from 'react';
import Button from './Button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    type: 'New Apartment',
    style: 'Modern',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = t('contact.name') + ' is required';
    }
    if (!formData.phone.trim()) {
      errors.phone = t('contact.phone') + ' is required';
    }
    if (!formData.city.trim()) {
      errors.city = t('contact.city') + ' is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(formErrors)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLInputElement;
      if (firstErrorElement) {
        firstErrorElement.focus();
      }
      return;
    }

    console.log("Form Submitted", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-secondary p-10 border border-neutral-800 text-center transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-accent w-16 h-16" />
        </div>
        <h3 className="text-2xl font-serif text-light mb-4">{t('contact.request_received')}</h3>
        <p className="text-muted mb-8">{t('contact.will_contact')}</p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">{t('contact.back')}</Button>
      </div>
    );
  }

  return (
    <div className="bg-secondary p-8 md:p-12 border border-neutral-800 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Line */}
      <div className="absolute top-0 left-12 rtl:right-12 rtl:left-auto w-[1px] h-20 bg-accent"></div>

      <h3 className="text-3xl font-serif text-light mb-2">{t('contact.form_title')}</h3>
      <p className="text-muted mb-10 text-sm tracking-wide">{t('contact.form_desc')}</p>
      
      <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-describedby={formErrors && Object.keys(formErrors).length > 0 ? 'form-errors' : undefined}>
        {Object.keys(formErrors).length > 0 && (
          <div id="form-errors" className="bg-red-900/20 border border-red-700 text-red-200 p-4 rounded-sm" role="alert">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} aria-hidden="true" />
              <span className="font-bold">Please correct the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm">
              {Object.entries(formErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">
              {t('contact.name')} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              aria-required="true"
              aria-invalid={!!formErrors.name}
              aria-describedby={formErrors.name ? 'name-error' : undefined}
              className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none placeholder-gray-500"
              onChange={handleChange}
            />
            {formErrors.name && (
              <span id="name-error" className="text-red-400 text-xs" role="alert">
                {formErrors.name}
              </span>
            )}
          </div>
          <div className="space-y-2 group">
            <label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">
              {t('contact.phone')} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              aria-required="true"
              aria-invalid={!!formErrors.phone}
              aria-describedby={formErrors.phone ? 'phone-error' : undefined}
              className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none placeholder-gray-500"
              onChange={handleChange}
            />
            {formErrors.phone && (
              <span id="phone-error" className="text-red-400 text-xs" role="alert">
                {formErrors.phone}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <label htmlFor="city" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">
              {t('contact.city')} <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              aria-required="true"
              aria-invalid={!!formErrors.city}
              aria-describedby={formErrors.city ? 'city-error' : undefined}
              className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none placeholder-gray-500"
              onChange={handleChange}
            />
            {formErrors.city && (
              <span id="city-error" className="text-red-400 text-xs" role="alert">
                {formErrors.city}
              </span>
            )}
          </div>
          <div className="space-y-2 group">
            <label htmlFor="type" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">{t('contact.project_type')}</label>
            <select
              id="type"
              name="type"
              className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none"
              onChange={handleChange}
            >
              <option className="bg-primary text-light" value="New Apartment">{t('contact.types.new')}</option>
              <option className="bg-primary text-light" value="Renovation">{t('contact.types.reno')}</option>
              <option className="bg-primary text-light" value="Private Villa">{t('contact.types.villa')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 group">
          <label htmlFor="notes" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">{t('contact.notes')}</label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none resize-none"
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="pt-4">
            <Button type="submit" fullWidth size="lg" variant="gold">{t('contact.submit')}</Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;