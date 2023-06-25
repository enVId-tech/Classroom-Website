import React, { useEffect, useState } from 'react';

function createCalendar() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    fetchUserPermission();

    return () => {
      // Cleanup if needed
    };
  });

  /*
  async function fetchUserPermission() {
    const dataID = document.cookie.split('=')[1];
    const windowURL = window.location.pathname;
    
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID, windowURL })
    }

    const response = await fetch('/student/data/permission', data);
    const res = await response.json();

    if (res.error) {
      console.error(res.error);
    }
    if (res.success) {
      setHasPermission(true);
    }
  }*/

  function getWeekdayLabel(dayOfWeek) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  return (
    <div>
      <div className="slider-tabs">
        {months.map((month, index) => (
          <div className={`tab ${index === 0 ? 'active' : ''}`} key={index}>
            {month.name}
          </div>
        ))}
      </div>
      <div className="slider-content">
        {months.map((month, index) => (
          <div className={`month ${index === 0 ? 'active' : ''}`} key={index}>
            <div className="days">
              {month.days.map((day, dayIndex) => (
                <div
                  className={`day ${day.isWeekend ? 'weekend' : ''} ${
                    day.isCurrentDay ? 'current-day' : ''
                  }`}
                  key={dayIndex}
                >
                  <div className="weekday-label">{getWeekdayLabel(day.weekday)}</div>
                  <div className="details">{day.details}</div>
                  {hasPermission && (
                    <i className="fas fa-pencil-alt edit-icon" onClick={() => handleEdit(day)}>
                      Edit
                    </i>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default createCalendar;
