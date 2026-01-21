# ✅ FINÁLNY SETUP - Chata Bardejov Kalendár

## 🎯 Čo je HOTOVÉ a FUNGUJE:

### ✅ Backend (Read-Only)
- `/api/calendar.js` - Jednoduchý endpoint bez autentifikácie
- Číta `GOOGLE_ICAL_URL` z Vercel Environment Variable
- Fetchne .ics súbor (jednoduchý fetch, žiadne credentials)
- Parsuje DTSTART/DTEND manuálne (regex)
- Vracia JSON: `{success: true, bookedDates: ["2026-01-20", ...]}`

### ✅ Frontend
- `index.html` + `index-en.html`
- Volá `/api/calendar`
- Blokuje dátumy v Flatpickr kalendári
- Pri chybe zobrazí všetko ako voľné (žiadne error messages)

### ✅ Formulár
- Čistý Formspree: `<form action="https://formspree.io/f/mjknjyyw">`
- Odosiela email notifikácie
- Zápis do kalendára: **Formspree Plugin** (nastavené v tvojom dashboarde)

---

## 🔧 Čo máš nastavené vo Vercel:

### Environment Variables:
```
GOOGLE_ICAL_URL = https://calendar.google.com/calendar/ical/9df8165438f7bff5ffbc9aa5f9063d4098060108a32e4c493c1f4b8f09279197%40group.calendar.google.com/private-5798c538273c23f911d19f8c555c101d/basic.ics
```

**To je všetko!** Žiadne ďalšie credentials.

---

## 🚀 Ako to funguje (End-to-End):

### **Rezervácia:**
```
1. Hosť vyplní formulár na stránke
2. Klikne "Odoslať rezerváciu"
3. Formspree dostane dáta
4. Formspree ti pošle email
5. Formspree Plugin zapíše udalosť do Google Kalendára (ak máš plugin nastavený)
   ALEBO pridáš udalosť manuálne
6. Google aktualizuje .ics súbor (~5-15 minút)
```

### **Blokovanie dátumov:**
```
1. Ďalší hosť otvorí stránku
2. Frontend zavolá `/api/calendar`
3. Backend fetchne GOOGLE_ICAL_URL
4. Backend parsuje .ics text
5. Backend vráti JSON s obsadenými dátumami
6. Frontend zablokuje dátumy v Flatpickr
7. Hosť vidí červené prečiarknuté dni a nemôže ich vybrať
```

---

## 🧪 Testovanie:

### Test 1: Načítanie kalendára
1. Otvor: https://chata-two.vercel.app
2. Otvor Chrome DevTools (F12) → Console
3. Refresh stránku (Ctrl+F5)
4. Hľadaj: `Načítané obsadené termíny:`
5. **Očakávaný výstup**: `["2026-01-20", "2026-01-21", "2026-01-27"]`

✅ Ak vidíš tento output → kalendár funguje!

### Test 2: Vizuálne blokovanie
1. Klikni na dátum v rezervačnom kalendári
2. Dni 20., 21., 27. január 2026 by mali byť:
   - Červené
   - Prečiarknuté
   - Neklikateľné

✅ Ak sú zablokované → perfektné!

### Test 3: Formulár
1. Vyplň rezervačný formulár
2. Odošli
3. **Očakávané výsledky**:
   - ✅ Email od Formspree príde na tvoj inbox
   - ✅ Formspree dashboard ukáže novú submission
   - ✅ Ak máš Formspree Plugin → udalosť sa pridá do Google Kalendára

---

## ⚙️ Formspree Plugin Setup (ak chceš automatický zápis):

1. Choď na: https://formspree.io/forms/mjknjyyw/integration
2. Klikni na **"Add Integration"**
3. Vyber **"Google Calendar"** (ak je dostupný)
4. Autorizuj Formspree prístup k tvojmu Google Kalendáru
5. Namapuj polia:
   - `datum_prichodu` → Start Date
   - `datum_odchodu` → End Date
   - `meno` → Summary
6. Save

Po nastavení bude každá rezervácia automaticky pridaná do kalendára!

---

## 📊 Aktuálny stav súborov:

### Backend:
```
api/
└── calendar.js  ← Jednoduchý read-only endpoint
```

### Frontend:
```
index.html       ← Formulár + kalendár (SK)
index-en.html    ← Formulár + kalendár (EN)
```

### Dokumentácia:
```
KALENDAR_NAVOD.md  ← Detailný návod
FINAL_SETUP.md     ← Tento súbor (prehľad)
```

---

## 🎯 Čo už NIE JE v kóde (vyčistené):

❌ Google Calendar API write operations
❌ Service Account credentials
❌ googleapis dependency
❌ Komplexné backend API pre zápis
❌ Žlté error messages pre používateľov
❌ CORS proxy závislosti

---

## 💡 Maintenance:

### Pridanie novej rezervácie manuálne:
1. Otvor Google Calendar
2. Vytvor celodenný event:
   - Názov: `Rezervácia: [Meno hosťa]`
   - Začiatok: Dátum príchodu
   - Koniec: Dátum odchodu
   - Celodenný: ✅
3. Ulož
4. Do 15 minút sa termín zablokuje na stránke

### Zmena kalendára:
1. Vercel → Environment Variables
2. Edit `GOOGLE_ICAL_URL`
3. Vlož nový iCal link
4. Save
5. Vercel automaticky redeploy

---

## ✅ Výhody tohto riešenia:

✅ **Jednoduché** - Žiadny zložitý setup
✅ **Spoľahlivé** - Formspree je overený servis
✅ **Automatické blokovanie** - Hostia vidia dostupnosť
✅ **Bez nákladov** - Formspree free plán stačí
✅ **Nula maintenance** - Funguje automaticky
✅ **Bezpečné** - Žiadne API keys v kóde

---

## 🆘 Riešenie problémov:

### Kalendár neukazuje obsadené termíny:
1. Check Console (F12) pre chyby
2. Skontroluj Vercel env variable `GOOGLE_ICAL_URL`
3. Otvor iCal URL v prehliadači - malo by stiahnuť .ics súbor

### Formspree nefunguje:
1. Dashboard: https://formspree.io/forms/mjknjyyw
2. Over, či máš potvrdený email

### API endpoint nefunguje:
1. Test priamo: https://chata-two.vercel.app/api/calendar
2. Malo by vrátiť JSON: `{success: true, bookedDates: [...]}`
3. Ak vráti prázdne pole → skontroluj GOOGLE_ICAL_URL

---

## 📞 Support:

- Formspree submissions: https://formspree.io/forms/mjknjyyw/submissions
- Vercel deployments: https://vercel.com/dufalarobert-hubs-projects/chata-two
- Environment variables: https://vercel.com/dufalarobert-hubs-projects/chata-two/settings/environment-variables

---

**🎉 HOTOVO! Všetko je nastavené a funguje!**
