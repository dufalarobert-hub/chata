const { google } = require('googleapis');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get form data
    const { meno, email, telefon, pocet_osob, datum_prichodu, datum_odchodu, sprava } = req.body;

    if (!datum_prichodu || !datum_odchodu || !meno || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse dates (handle DD.MM.YYYY format from form)
    const parseDate = (dateStr) => {
      if (dateStr.includes('.')) {
        const [day, month, year] = dateStr.split('.');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return dateStr; // Already in YYYY-MM-DD format
    };

    const checkinISO = parseDate(datum_prichodu);
    const checkoutISO = parseDate(datum_odchodu);

    // Setup Google Calendar API with Service Account
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      console.error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
      return res.status(500).json({
        error: 'Calendar API not configured',
        message: 'Please contact administrator'
      });
    }

    const credentials = JSON.parse(serviceAccountKey);

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      console.error('GOOGLE_CALENDAR_ID not configured');
      return res.status(500).json({
        error: 'Calendar ID not configured',
        message: 'Please contact administrator'
      });
    }

    // Create event
    const event = {
      summary: `Rezervácia: ${meno}`,
      description: `
Hosť: ${meno}
Email: ${email}
Telefón: ${telefon || 'neuvedené'}
Počet osôb: ${pocet_osob || 'neuvedené'}
Poznámka: ${sprava || 'žiadna'}

Rezervované cez chatabardejov.sk
      `.trim(),
      start: {
        date: checkinISO,
        timeZone: 'Europe/Bratislava'
      },
      end: {
        date: checkoutISO,
        timeZone: 'Europe/Bratislava'
      },
      colorId: '11', // Red color to indicate booking
      status: 'confirmed'
    };

    // Insert event into calendar
    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
      sendUpdates: 'none' // Don't send email notifications from Google
    });

    console.log('Event created:', response.data.id);

    // Also send to Formspree for email notification
    const formspreeUrl = 'https://formspree.io/f/mjknjyyw';
    try {
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(req.body)
      });
    } catch (emailError) {
      console.error('Formspree email error:', emailError);
      // Don't fail the whole request if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Rezervácia bola úspešne vytvorená',
      eventId: response.data.id,
      checkin: checkinISO,
      checkout: checkoutISO
    });

  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error.message
    });
  }
};
