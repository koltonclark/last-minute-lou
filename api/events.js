export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  const TM_KEY = 'McmmI1XAvDjXiBx0REoXS2ZqRg5oAh7U';
  const EB_KEY = '42YKTNSWNBQDOGO7V4';
  
  const today = new Date();
  const startDate = today.toISOString().split('.')[0] + 'Z';
  const endDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + 'Z';

  try {
    const [tmRes, ebRes] = await Promise.all([
      fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TM_KEY}&city=Louisville&stateCode=KY&countryCode=US&startDateTime=${startDate}&endDateTime=${endDate}&size=20&sort=date,asc`),
      fetch(`https://www.eventbriteapi.com/v3/events/search/?location.address=Louisville,KY&location.within=10mi&start_date.range_start=${startDate}&start_date.range_end=${endDate}&expand=venue,ticket_availability&token=${EB_KEY}`)
    ]);

    const tmData = await tmRes.json();
    const ebData = await ebRes.json();

    res.status(200).json({
      ticketmaster: tmData._embedded?.events || [],
      eventbrite: ebData.events || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
