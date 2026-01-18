const ical = require('node-ical');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const calendarUrl = process.env.GOOGLE_ICAL_URL;

  if (!calendarUrl) {
    console.error('GOOGLE_ICAL_URL environment variable is not set');
    return res.status(200).json({
      success: false,
      error: 'Calendar not configured',
      bookedDates: []
    });
  }

  try {
    const events = await ical.async.fromURL(calendarUrl);
    const bookedDates = new Set();

    for (const key in events) {
      const event = events[key];
      if (event.type !== 'VEVENT') continue;

      const start = new Date(event.start);
      const end = new Date(event.end);

      // Add all dates from start to end (exclusive of end date for overnight stays)
      const current = new Date(start);
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0]; // YYYY-MM-DD
        bookedDates.add(dateStr);
        current.setDate(current.getDate() + 1);
      }
    }

    const sortedDates = Array.from(bookedDates).sort();

    res.status(200).json({
      success: true,
      bookedDates: sortedDates
    });
  } catch (error) {
    console.error('Calendar fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calendar data',
      bookedDates: []
    });
  }
};
