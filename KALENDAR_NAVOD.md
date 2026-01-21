# 📅 Kalendár - Návod na použitie

## ✅ Čo funguje AUTOMATICKY:

1. **Email notifikácie** - Formspree odosiela emaily pri každej rezervácii
2. **Blokovanie dátumov** - Kalendár na stránke automaticky blokuje obsadené termíny z tvojho Google Kalendára
3. **Žiadny setup** - Všetko je už nastavené a funguje okamžite

---

## 🔧 Ako to funguje:

### 1. Rezervácia (odoslanie formulára):
```
Používateľ vyplní formulár
    ↓
Odošle cez Formspree
    ↓
Dostaneš email s rezerváciou
    ↓
Formspree Plugin automaticky zapíše do Google Kalendára
    (alebo pridáš manuálne, ak plugin nie je nastavený)
```

### 2. Blokovanie obsadených dátumov:
```
Používateľ otvorí stránku
    ↓
Frontend zavolá /api/calendar
    ↓
Backend načíta GOOGLE_ICAL_URL z environment variable
    ↓
Backend stiahne .ics súbor (jednoduchý fetch, bez autentifikácie)
    ↓
Backend parsuje DTSTART/DTEND z VEVENT blokov
    ↓
Backend vráti JSON: {success: true, bookedDates: ["2026-01-20", ...]}
    ↓
Frontend zablokuje dátumy v Flatpickr kalendári
    ↓
Používateľ vidí červené prečiarknuté dni
```

---

## 📝 Manuálny zápis do kalendára (po každej rezervácii):

Po tom, čo dostaneš email od Formspree s rezerváciou:

1. Otvor **Google Calendar**: https://calendar.google.com
2. Klikni na dátum príchodu
3. Vytvor **celodenný event**:
   - **Názov**: `Rezervácia: [Meno hosťa]`
   - **Dátum začiatku**: Dátum príchodu
   - **Dátum konca**: Dátum odchodu
   - **Celodenný**: ✅ Áno
4. Ulož event

Po uložení sa tento termín **automaticky zablokuje** na stránke pri ďalšom načítaní.

---

## 🔄 Ako rýchlo sa aktualizujú obsadené dátumy?

- **Google Calendar** → **aktualizácia .ics súboru**: ~5-15 minút
- **Stránka načíta nové dátumy**: Pri každom refresh stránky
- **Celkovo**: Nové rezervácie sa prejavia na stránke do **15 minút**

---

## 🌐 Kde je iCal URL nastavená?

V **Vercel Environment Variables**:
- Premenná: `GOOGLE_ICAL_URL`
- Hodnota: Tvoj iCal link z Google Calendar

Stránka volá `/api/calendar` endpoint, ktorý číta túto premennú a vracia obsadené dátumy.

---

## 🔧 Ako zmeniť kalendár (ak potrebuješ):

1. Choď na Vercel: https://vercel.com/dufalarobert-hubs-projects/chata-two/settings/environment-variables
2. Nájdi premennú `GOOGLE_ICAL_URL`
3. Klikni **Edit**
4. Nahraď URL za nový iCal link z Google Kalendára
5. Klikni **Save**
6. Vercel automaticky redeploy (môže trvať 1-2 min)

---

## ⚠️ Riešenie problémov:

### Kalendár neukazuje obsadené dátumy:
1. Skontroluj, či sú udalosti v Google Kalendári **celodenné**
2. Obnov stránku (Ctrl+F5 / Cmd+Shift+R)
3. Otvor Chrome DevTools (F12) → Console → hľadaj chyby

### Formspree nefunguje:
1. Skontroluj Formspree dashboard: https://formspree.io/forms/mjknjyyw
2. Over, či máš potvrdený email v Formspree

### CORS proxy nefunguje:
- Ak `corsproxy.io` nefunguje, zmeň v kóde na iný proxy:
  - `https://api.allorigins.win/raw?url=`
  - `https://cors-anywhere.herokuapp.com/`

---

## 📊 Štatistiky Formspree:

Pozri všetky odoslané rezervácie:
👉 https://formspree.io/forms/mjknjyyw/submissions

---

## 💡 Odporúčania:

1. **Skontroluj email denne** - Formspree posiela rezervácie
2. **Pridávaj udalosti promptne** - Aby sa termíny rýchlo zablokovali
3. **Používaj Google Calendar notifikácie** - Pripomenutie check-in/check-out
4. **Vytvor šablónu rezervácie** - Rýchlejšie pridávanie udalostí

---

## 🎯 Celkový workflow (zo začiatku do konca):

```
1. Hosť vyplní formulár na stránke
2. Formspree ti pošle email
3. Prejdeš do Google Kalendára
4. Pridáš udalosť (celodenný event)
5. Do 15 minút sa termín zablokuje na stránke
6. Ďalší hostia vidia obsadený termín
```

**✅ Jednoduché, spoľahlivé, bez komplikovaného setupu!**
