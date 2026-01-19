import React, { useState } from 'react';
import Button from './Button';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">{t('contact.name')}</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none placeholder-gray-500"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2 group">
            <label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">{t('contact.phone')}</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              required
              className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none placeholder-gray-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <label htmlFor="city" className="text-xs uppercase tracking-widest text-muted group-focus-within:text-accent transition-colors">{t('contact.city')}</label>
            <input 
              type="text" 
              id="city" 
              name="city" 
              required
              className="w-full bg-transparent border-b border-gray-700 focus:border-accent text-light py-2 outline-none transition-colors rounded-none placeholder-gray-500"
              onChange={handleChange}
            />
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