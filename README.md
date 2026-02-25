# שיש כפר יאסיף | Shayish Kfar Yassif

<div align="center">

![Shayish Kfar Yassif](https://img.shields.io/badge/שיש-כפר-יאסיף-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646FFA?style=for-the-badge&logo=vite)

**Premium Marble & Ceramic Surfaces | משטחי שיש וקרמיקה בהתאמה אישית**

[Features](#features) • [Technologies](#technologies) • [Installation](#installation) • [Live Demo](#live-demo) • [Project Structure](#project-structure)

</div>

---

## 🏛️ About | אודות

**Shayish Kfar Yassif** (שיש כפר יאסיף) is a premium marble and ceramic surfaces business based in Kfar Yassif, Israel. Since 2008, we've been crafting custom stone solutions for kitchens, bathrooms, and commercial spaces.

Our expertise includes:
- Custom marble countertops
- Ceramic tile installations
- Natural stone flooring
- Commercial and residential projects

---

## ✨ Features | תכונות

### 🌍 Multi-Language Support
- 🇮🇱 Hebrew (עברית)
- 🇸🇦 Arabic (العربية)
- 🇬🇧 English
- 🇷🇺 Russian (Русский)

### 🎨 Design & UX
- **Responsive Design** - Mobile, tablet, desktop
- **RTL/LTR Support** - Automatic layout switching
- **GSAP Animations** - Smooth scroll-based animations
- **Hero Video** - Immersive video background
- **Parallax Effects** - Engaging scroll interactions
- **Custom Cursor** - Unique cursor interactions

### ♿ Accessibility (WCAG 2.0 AA / IS 5568)
Built-in accessibility widget with 10 features:
1. Text size control (50%-200%)
2. High contrast mode
3. Grayscale mode
4. Link underlining
5. Readable font
6. Letter spacing
7. Line height adjustment
8. Pause animations
9. Highlight on hover/focus
10. Reset all settings

### 🔒 Legal Compliance
- **Cookie Consent** - Amendment 13 compliant
- **GDPR Ready** - EU/EEA data protection
- **Privacy Policy** - Full privacy documentation
- **Terms of Use** - Legal terms
- **Accessibility Statement** - WCAG compliance details
- **GDPR Request Form** - Data subject rights portal

### 🎵 Background Music
- 3 ambient tracks with shuffle
- Collapsible music player
- Full playback controls
- Volume management

### 📄 Pages
- **Home** - Hero with video, featured projects
- **Gallery** - Project portfolio
- **Process** - Our craftsmanship process
- **Materials** - Materials catalog
- **About** - Company information
- **Contact** - Contact form

---

## 🛠️ Technologies | טכנולוגיות

| Category | Technology |
|----------|------------|
| **Framework** | React 18.x |
| **Language** | TypeScript 5.x |
| **Build Tool** | Vite 6.x |
| **Routing** | React Router (HashRouter) |
| **Styling** | Tailwind CSS |
| **Animations** | GSAP + ScrollTrigger |
| **Icons** | Lucide React |
| **State** | React Context |

---

## 📦 Installation | התקנה

```bash
# Clone the repository
git clone https://github.com/yourusername/shayish-kfar-yassif.git
cd shayish-kfar-yassif

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Prerequisites | דרישות מוקדמות
- Node.js 18+
- npm or yarn package manager

---

## 🚀 Usage | שימוש

### Development
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Output in `dist/` directory

---

## 🌐 Live Demo | הדגמה חיה

Visit our website: [shayish-yasif.co.il](https://shayish-yasif.co.il)

---

## 📁 Project Structure | מבנה הפרויקט

```
shayish-kfar-yassif/
├── public/                         # Static assets
│   ├── accessibility-widget.css    # Accessibility widget
│   ├── accessibility-widget.js     # Accessibility widget script
│   └── ...
├── src/
│   ├── components/                  # React components
│   │   ├── AccessibilityWidget.tsx
│   │   ├── Button.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CookieBanner.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── Layout.tsx
│   │   ├── MusicPlayer.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/                    # React Context API
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                       # Custom React hooks
│   │   └── useScrollAnimation.ts
│   ├── pages/                       # Page components
│   │   ├── Home.tsx
│   │   ├── Gallery.tsx
│   │   ├── Process.tsx
│   │   ├── Materials.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TermsOfUse.tsx
│   │   ├── AccessibilityStatement.tsx
│   │   └── GdprRequestForm.tsx
│   ├── utils/                       # Utility functions
│   │   └── gdprDetection.ts         # GDPR EU detection
│   ├── constants.ts                 # Project data
│   ├── translations.ts              # i18n translations
│   ├── types.ts                     # TypeScript types
│   ├── App.tsx                      # Root component
│   ├── index.css                    # Global styles
│   ├── main.tsx                     # Entry point
│   └── vite-env.d.ts               # Vite types
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── tailwind.config.js              # Tailwind config
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── README.md                       # This file
```

---

## ⚖️ Compliance | תאימות

### Accessibility | נגישות
- **WCAG 2.0 AA** compliant
- **IS 5568** (Israeli Standard) compliant
- Semantic HTML5 markup
- Full keyboard navigation
- Screen reader compatible

### Privacy | פרטיות
- **Amendment 13** - Israeli Privacy Protection Law
- **GDPR** - EU General Data Protection Regulation
- Cookie consent management
- Data subject request handling

---

## 📞 Contact | צור קשר

- **Website:** [shayish-yasif.co.il](https://shayish-yasif.co.il)
- **Email:** info@shayish-yasif.co.il
- **Location:** Kfar Yassif, Israel | כפר יאסיף, ישראל

---

## 📜 License | רישיון

© 2024 Shayish Kfar Yassif. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or modification is strictly prohibited.

---

<div align="center">
  <sub>Built with ❤️ for natural stone excellence</sub>
</div>
