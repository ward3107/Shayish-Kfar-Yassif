import React from 'react';
import { Facebook, Github, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react';
import './CreatorSignature.css';

export interface CreatorLinks {
  email?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
}

// Add only the creator's confirmed destinations; these are separate from the business contacts.
export const creatorLinks: CreatorLinks = {
  email: 'mailto:wasya92@gmail.com',
  whatsapp: 'https://wa.me/972534260632',
  facebook: 'https://www.facebook.com/profile.php?id=61594997720112',
  instagram: 'https://www.instagram.com/vasia.dev/',
  github: 'https://github.com/ward3107',
  linkedin: 'https://www.linkedin.com/in/waseem-abu-akel-334486374/',
};

export default function CreatorSignature({ links = creatorLinks, logoUrl }: {
  links?: CreatorLinks;
  logoUrl?: string;
}) {
  const socials = [
    { label: 'Email', href: links.email, Icon: Mail },
    { label: 'WhatsApp', href: links.whatsapp, Icon: MessageCircle },
    { label: 'Facebook', href: links.facebook, Icon: Facebook },
    { label: 'Instagram', href: links.instagram, Icon: Instagram },
    { label: 'GitHub', href: links.github, Icon: Github },
    { label: 'LinkedIn', href: links.linkedin, Icon: Linkedin },
  ];

  return <section className="creator-signature" aria-label="Website created by vasia dev">
    <a className="creator-signature-home" href="https://www.vasia.dev/"
      target="_blank" rel="noopener noreferrer" aria-label="vasia.dev — יוצר האתר">
      {logoUrl ? <img className="creator-signature-logo" src={logoUrl} alt="vasia.dev" /> : <>
        <img className="creator-signature-logo creator-signature-logo-dark" src="/creator/vasia-logo-dark.svg" alt="vasia.dev" />
        <img className="creator-signature-logo creator-signature-logo-light" src="/creator/vasia-logo-light.svg" alt="vasia.dev" />
      </>}
    </a>
    <p dir="rtl">בניית פתרונות דיגיטליים חזקים במפגש שבין עיצוב לבינה מלאכותית.</p>
    <div className="creator-signature-socials" dir="ltr">
      {socials.filter(({ href }) => Boolean(href)).map(({ label, href, Icon }) =>
        <a key={label} href={href} aria-label={`vasia dev — ${label}`}
          target="_blank" rel="noopener noreferrer"><Icon size={20} strokeWidth={1.7} /></a>)}
    </div>
  </section>;
}
