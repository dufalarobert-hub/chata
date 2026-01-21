// Simple iCal fetcher - no authentication needed
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
      bookedDates: []
    });
  }

  try {
    // Simple fetch - no authentication
    const response = await fetch(calendarUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const icsContent = await response.text();

    // Parse iCal manually - extract DTSTART and DTEND from VEVENT blocks
    const bookedDates = new Set();
    const eventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
    const events = [...icsContent.matchAll(eventRegex)];

    events.forEach(eventMatch => {
      const eventContent = eventMatch[1];

      // Extract DTSTART and DTEND
      const dtstartMatch = eventContent.match(/DTSTART[;:]([^\r\n]+)/);
      const dtendMatch = eventContent.match(/DTEND[;:]([^\r\n]+)/);

      if (dtstartMatch && dtendMatch) {
        let startStr = dtstartMatch[1].split(':').pop();
        let endStr = dtendMatch[1].split(':').pop();

        // Parse date (format: YYYYMMDD or YYYYMMDDTHHMMSS)
        const parseICSDate = (str) => {
          const year = str.substring(0, 4);
          const month = str.substring(4, 6);
          const day = str.substring(6, 8);
          return new Date(`${year}-${month}-${day}T00:00:00`);
        };

        const startDate = parseICSDate(startStr);
        const endDate = parseICSDate(endStr);

        // Add all dates between start and end (exclusive of end date)
        const current = new Date(startDate);
        while (current < endDate) {
          bookedDates.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
      }
    });

    const sortedDates = Array.from(bookedDates).sort();

    res.status(200).json({
      success: true,
      bookedDates: sortedDates
    });
  } catch (error) {
    console.error('Calendar fetch error:', error);
    // Return empty array on error - don't block the user
    res.status(200).json({
      success: false,
      bookedDates: []
    });
  }
};
