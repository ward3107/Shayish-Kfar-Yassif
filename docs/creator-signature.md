# Creator signature

The creator's requested footer signature is **vasia dev.**, with the supplied
logo, the Hebrew line “בניית פתרונות דיגיטליים חזקים במפגש שבין עיצוב לבינה מלאכותית.”,
and personal contact/social links. Use this signature on future projects for this
creator when these project instructions are available.

`components/CreatorSignature.tsx` is the reusable component. Pass `logoUrl` for
the original logo asset and `links` for verified destinations (email, WhatsApp,
Facebook, Instagram, GitHub, LinkedIn). The original SVG logos and all six contact destinations were copied from the
public source of https://www.vasia.dev/ (ward3107/Waseem-Portfolio). The portfolio
may override some contacts through its admin settings; these values are from
its source constants. Absent destinations are hidden. Do not reuse the marble
business's contacts for the creator signature.

The shared marketing footer in `components/Layout.tsx` includes the signature.

## שימוש בפרויקט הבא

1. העתיקו את `CreatorSignature.tsx` ואת `CreatorSignature.css` לתיקיית הרכיבים.
2. בפרויקט React התקינו `lucide-react` אם אינו מותקן.
3. העתיקו את `public/creator` לפרויקט החדש — אלו הלוגואים המקוריים במצב בהיר וכהה.
4. הקישורים האישיים כבר מוגדרים ב־`creatorLinks`; עדכנו אותם אם השתנו. אימייל צריך
   להיות בצורת `mailto:...`; WhatsApp בצורת `https://wa.me/...` עם קידומת מדינה.
5. הוסיפו את הרכיב בסוף הפוטר המשותף:

```tsx
import CreatorSignature from './components/CreatorSignature';

<footer>
  {/* תוכן הפוטר של האתר */}
  <CreatorSignature />
</footer>
```

הרכיב משתמש במשתני הצבע של האתר (`--color-text-main`, `--color-text-muted`,
`--color-border`). בפרויקט אחר ניתן להגדיר אותם או להתאים את קובץ ה־CSS.
באתר שאינו React יש להתאים את הרכיב לטכנולוגיית האתר.

כדי להשתמש באותה חתימה בשיחה או במאגר חדש, צרפו את הקבצים הללו או הפנו
אליהם במפורש. ההנחיה במאגר הזה אינה מועברת אוטומטית לכל שיחה או פרויקט חדש.

מקור הלוגואים והקישורים: https://github.com/ward3107/Waseem-Portfolio — `public/brand` ו־`src/constants.ts`.
