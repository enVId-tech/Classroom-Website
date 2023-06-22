import React, { useEffect, useState } from 'react';
import Sidebar from '../../Assets/jsx/sidebar';
import SelectionBar from '../../Assets/jsx/selectionbar';

function Calendar({ Pages, PagesArrayNumber, path, ClassNum }) {
  const [currentDate] = useState(new Date());
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Fetch user permission from the server
    checkUserPermission().then(result => setHasPermission(result));
  }, []);

  const generateCalendar = () => {
    const calendar = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthName = date.toLocaleString('default', { month: 'long' });

      const tabElement = <div className="tab">{monthName}</div>;

      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      const dayElements = [];
      for (let j = 1; j <= daysInMonth; j++) {
        const day = new Date(date.getFullYear(), date.getMonth(), j).toString().slice(0, 15);
        const today = new Date().toString().slice(0, 15);
        const dayOfWeek = new Date(date.getFullYear(), date.getMonth(), j).getDay();

        const weekdayLabel = <div className="weekday-label">{getWeekdayLabel(dayOfWeek)}</div>;

        const detailsElement = (
          <div className="details">Details for day {j}</div>
        );

        const dayElement = (
          <div className={`day ${day === today ? 'current-day' : ''}`} key={j}>
            {weekdayLabel}
            {hasPermission && (
              <>
                <i
                  className="fas fa-pencil-alt edit-icon"
                  onClick={() => handleEditClick(detailsElement)}
                ></i>
                {detailsElement}
              </>
            )}
          </div>
        );

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          dayElement.props.style = { display: 'none' };
        }

        dayElements.push(dayElement);
      }

      const daysContainer = <div className="days">{dayElements}</div>;

      const monthElement = (
        <div className="month" key={i}>
          {daysContainer}
        </div>
      );

      calendar.push(tabElement, monthElement);
    }

    return calendar;
  };

  const handleEditClick = (detailsElement) => {
    const content = prompt('Enter your content:', detailsElement.textContent);
    if (content !== null) {
      detailsElement.textContent = content;
      // Send the updated content to the server for saving
      saveContentToServer(content);
    }
  };

  const saveContentToServer = (content) => {
    const dataID = document.cookie.split('=')[1];
    const windowURL = window.location.pathname;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID, content, windowURL })
    };

    fetch('/class/agenda/write', data)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const checkUserPermission = async () => {
    const dataID = document.cookie.split('=')[1];
    const windowURL = window.location.pathname;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID, windowURL })
    };

    try {
      const response = await fetch('/class/agenda/permission', data);
      const result = await response.json();
      return result.hasPermission;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const getWeekdayLabel = (dayOfWeek) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="connections">
      <Sidebar />
      <section className="content">
        <h1 id="NamePlate">{path} | Agenda</h1>
        <ul className="nav nav-tabs" role="tablist">
          <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} windowpath={path} />
        </ul>
        <br />
        <div className="slider">
          <div className="slider-tabs">{generateCalendar().filter((_, index) => index % 2 === 0)}</div>
          <div className="slider-content">{generateCalendar().filter((_, index) => index % 2 !== 0)}</div>
        </div>
      </section>
    </div>
  );
}

export default Calendar;
