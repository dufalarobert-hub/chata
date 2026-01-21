# 🔧 Nastavenie Google Calendar API pre zápis rezervácií

## 📋 Krok 1: Vytvor Google Cloud Projekt

1. Choď na: **https://console.cloud.google.com**
2. Klikni na dropdown vľavo hore (vedľa "Google Cloud")
3. Klikni **"NEW PROJECT"**
4. Pomenuj projekt: `Chata Bardejov Calendar`
5. Klikni **"CREATE"**

---

## 🔑 Krok 2: Aktivuj Google Calendar API

1. V menu vľavo klikni na **"APIs & Services" → "Library"**
2. Vyhľadaj: **"Google Calendar API"**
3. Klikni na "Google Calendar API"
4. Klikni **"ENABLE"**

---

## 🤖 Krok 3: Vytvor Service Account

1. V menu vľavo: **"APIs & Services" → "Credentials"**
2. Klikni na **"CREATE CREDENTIALS"**
3. Vyber **"Service Account"**
4. Vyplň:
   - **Service account name**: `chata-calendar-writer`
   - **Service account ID**: (automaticky sa vygeneruje)
   - **Description**: `Service account for writing bookings to calendar`
5. Klikni **"CREATE AND CONTINUE"**
6. V **"Grant this service account access to project"**:
   - Vyber role: **"Editor"** (alebo môžeš dať len Calendar-specific role)
7. Klikni **"CONTINUE"**
8. Klikni **"DONE"**

---

## 📥 Krok 4: Stiahni Service Account Key (JSON)

1. V zozname "Service Accounts" nájdi `chata-calendar-writer`
2. Klikni na email service accountu (niečo ako `chata-calendar-writer@...iam.gserviceaccount.com`)
3. Prejdi na tab **"KEYS"**
4. Klikni **"ADD KEY" → "Create new key"**
5. Vyber **JSON**
6. Klikni **"CREATE"**
7. **Automaticky sa stiahne JSON súbor** - ulož ho niekde bezpečne!

---

## 📧 Krok 5: Zdieľaj Google Kalendár so Service Accountom

1. Otvor **Google Calendar**: https://calendar.google.com
2. Nájdi svoj kalendár (vľavo v "My calendars")
3. Klikni na **3 bodky** vedľa názvu kalendára → **"Settings and sharing"**
4. Scroll dole na sekciu **"Share with specific people or groups"**
5. Klikni **"Add people and groups"**
6. **Skopíruj email zo Service Account JSON súboru** (pole `client_email`):
   - Vyzerá ako: `chata-calendar-writer@chata-bardejov-calendar.iam.gserviceaccount.com`
7. Vlož tento email
8. Vyber permission: **"Make changes to events"**
9. Klikni **"Send"**

---

## 🔐 Krok 6: Nastav Environment Variables vo Vercel

1. Choď na: **https://vercel.com/dufalarobert-hubs-projects/chata-two/settings/environment-variables**

2. Pridaj **3 nové premenné**:

### A) `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Value**: Skopíruj **celý obsah** JSON súboru, ktorý si stiahol v Kroku 4
- Formát (celý JSON na jeden riadok):
```json
{"type":"service_account","project_id":"chata-bardejov-calendar","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"chata-calendar-writer@...iam.gserviceaccount.com",...}
```

### B) `GOOGLE_CALENDAR_ID`
- **Value**: ID tvojho kalendára
- Kde ho nájdeš:
  1. Google Calendar → Settings → vyber svoj kalendár
  2. Scroll dole na "Integrate calendar"
  3. Skopíruj **"Calendar ID"** (vyzerá ako: `abc123@group.calendar.google.com` alebo tvoj email)

### C) `GOOGLE_ICAL_URL` (už máš nastavenú)
- Nechaj tak, ako je

3. Pre každú premennú vyber **"All Environments"** (Production, Preview, Development)
4. Klikni **"Save"**

---

## ♻️ Krok 7: Redeploy Vercel

1. Choď na: **https://vercel.com/dufalarobert-hubs-projects/chata-two**
2. Klikni na **"Deployments"** (v top menu)
3. Klikni na najnovší deployment (top of list)
4. Klikni na **3 bodky** → **"Redeploy"**
5. Potvrď **"Redeploy"**

---

## ✅ Hotovo!

Po redeploy by malo všetko fungovať:
- ✅ Formulár odošle rezerváciu
- ✅ Zapíše sa do Google Kalendára
- ✅ Dátum sa zablokuje pre ostatných
- ✅ Dostaneš email cez Formspree

---

## 🧪 Testovanie

1. Otvor: https://chata-two.vercel.app
2. Vyplň rezervačný formulár
3. Skontroluj:
   - Email od Formspree prišiel?
   - Udalosť sa objavila v Google Kalendári?
   - Pri refresh stránky sú dátumy zablokované?

---

## ⚠️ Bezpečnosť

- **NIKDY** nezdieľaj Service Account JSON súbor verejne
- **NIKDY** ho necommituj do gitu
- **Len** vo Vercel Environment Variables (tie sú bezpečné)
