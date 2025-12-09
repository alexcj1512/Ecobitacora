export const exportToICS = (title: string, description: string, date: Date) => {
  const formatDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const endDate = new Date(date.getTime() + 60 * 60 * 1000); // +1 hour

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ecobitacora//ES
BEGIN:VEVENT
UID:${Date.now()}@ecobitacora.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(date)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ecobitacora-${title.toLowerCase().replace(/\s/g, '-')}.ics`;
  link.click();
};

export const addToGoogleCalendar = (title: string, description: string, date: Date) => {
  const formatDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const endDate = new Date(date.getTime() + 60 * 60 * 1000);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}&dates=${formatDate(date)}/${formatDate(endDate)}`;
  
  window.open(url, '_blank');
};
