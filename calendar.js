// src/Calendar.js
import React from 'react';

function Calendar({ currentDate, events, changeMonth, openModal }) {
  
  // --- Calendar Date Calculation Logic ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0];
  
  // Helper to get events for a specific date
  // (Using your previous, more robust filter for multi-day events)
  const getEventsForDate = (dateStr) => {
    return events.filter(event => 
      event.date === dateStr || 
      (event.start_date <= dateStr && event.end_date >= dateStr)
    );
  };

  // --- Generate Calendar Grid ---
  let calendarDays = [];

  // 1. Previous Month's trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    calendarDays.push({ 
        date, 
        isCurrentMonth: false, 
        fullDateStr: new Date(year, month - 1, date).toISOString().split('T')[0] 
    });
  }

  // 2. Current Month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const fullDate = new Date(year, month, i);
    const fullDateStr = fullDate.toISOString().split('T')[0];
    
    calendarDays.push({
      date: i,
      isCurrentMonth: true,
      fullDateStr,
      isToday: fullDateStr === todayDateStr,
      events: getEventsForDate(fullDateStr)
    });
  }

  // 3. Next Month's leading days
  let nextDayCount = 1;
  while (calendarDays.length < 42) {
    calendarDays.push({ 
        date: nextDayCount, 
        isCurrentMonth: false, 
        fullDateStr: new Date(year, month + 1, nextDayCount).toISOString('T')[0]
    });
    nextDayCount++;
  }

  
  return (
    
    <div className="calendar">
      <div className="nav-btn-container">
        <button onClick={() => changeMonth(-1)} className="nav-btn">←</button>
        <h2 id="monthYear" style={{ margin: 0 }}>{monthName} {year}</h2>
        <button onClick={() => changeMonth(1)} className="nav-btn">→</button>
      </div>
      
      <div className="day-headers">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
      </div>
      
      {/* ==================================================================== */}
      {/* START: UPDATED CALENDAR GRID */}
      {/* ==================================================================== */}
      
      <div className="calendar-grid" id="calendar">
        {calendarDays.map((dayInfo, index) => (
          <div 
            key={index}
            className={`calendar-day ${dayInfo.isCurrentMonth ? 'current-month' : 'other-month'} ${dayInfo.isToday ? 'today' : ''}`}
            // We keep the main click for 'add' as a fallback, 
            // but the button is more explicit.
            onClick={() => openModal('add', { date: dayInfo.fullDateStr })} 
          >
            <div className="date-number">{dayInfo.date}</div>

            {/* --- This is the new "eventBox" --- */}
            <div className="events">
              {dayInfo.events && dayInfo.events.map(event => (
                // This is the new "ev" div
                <div 
                  key={event.id}
                  className="event"
                  // This click is for editing a SINGLE event
                  onClick={(e) => { e.stopPropagation(); openModal('edit-event', event); }} 
                >
                  {/* expenseName */}
                  <div className="expense_Name"><b>
                    {event.title ? event.title.split(" - ")[0] : event.name}</b>
                  </div>
                  
                  {/* priceName */}
                  <div className="price_Name">
                    {event.title ? event.title.split(" - ")[1] : '$' + event.cost}
                  </div>
                  
                  {/* timeEl */}
                  <div className="time">
                    {event.time}
                  </div>
                </div>
              ))}
            </div>

            {/* --- This is the new "overlay" --- */}
            <div className="day-overlay">
              <button 
                className="overlay-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('add', { date: dayInfo.fullDateStr });
                }}
              >
                + Add
              </button>

              {/* Show Edit button ONLY if events exist */}
              {dayInfo.events && dayInfo.events.length > 0 && (
                <button 
                  className="overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // This modal call passes ALL events for the day
                    openModal('edit-day', dayInfo.events);
                  }}
                >
                  ✏️ Edit
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
      {/* ==================================================================== */}
      {/* END: UPDATED CALENDAR GRID */}
      {/* ==================================================================== */}
    </div>
  );
}

export default Calendar;
