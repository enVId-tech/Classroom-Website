import React, { useEffect, useState } from "react";

const CreateCalendar = () => {
  const [months, setMonths] = useState([]);
  const [activeNum, setActiveNum] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [hasPermission, setHasPermission] = useState(false);

  const date = new Date();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();


  useEffect(() => {
    checkUserPermission();
    const monthsArray = pushMonths();
    setMonths(monthsArray);
    setActiveNum([
      currentDay,
      currentMonth + 1,
      currentYear,
    ])
  }, []);

  const numberOfMonths = 11;


  const pushMonths = () => {
    let monthsArray = [];

    for (let i = 0; i < numberOfMonths; i++) {
      if (currentMonth + i > 12) {
        monthsArray.push(currentMonth + i - 12 + " " + (currentYear + 1).toString());
      } else {
        monthsArray.push(currentMonth + i + " " + currentYear);
      }
    }

    return monthsArray;
  };

  const getDaysInMonth = (month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }


  const getDayLabel = (day) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (day > 6) {
      while (day > 6) {
        day -= 7;
      }
    }
    return days[day];
  }

  const getMonthLabel = (month) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
    if (month - 1 > 11) {
      while (month - 1 > 11) {
        month -= 12;
      }
    }
    return monthNames[month - 1];
  }

  async function checkUserPermission() {
    const windowURL = window.location.pathname;

    const data = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ windowURL }),
    };

    const response = await fetch("/class/agenda/permission", data);
    const dataResponse = await response.json();
    if (dataResponse.error) {
      console.log(dataResponse.error);
    }

    setHasPermission(dataResponse.hasPermission);

  }

  const setActive = (index) => {
    const tabElements = document.getElementsByClassName("tab");
    
    for (let i = 0; i < tabElements.length; i++) {
      tabElements[i].classList.remove("active");
    }
    tabElements[index].classList.add("active");
  }
  return (
    <>
      <div className="slider-tabs">
        {
          months.map((month, index) => {
            const monthLabel = getMonthLabel(parseInt(month.split(" ")[0]));
            return (
              <div className={`tab ${index === 0 ? 'active' : ''}`} key={index} onClick={() => setActive(index)}>
                {monthLabel}
              </div>
            );
          })
        }
      </div>
      <div className="slider-content">
        {
          months.map((month) => {
            let days = getDaysInMonth(month.split(" ")[0], month.split(" ")[1]);
            return days.map((day, index) => (
              <div className={`day ${day === activeNum[0] ? 'active' : ''}`} key={index}>
                <div className="day-number">
                  {day}
                </div>
                <div className="weekday-label">
                  {getDayLabel(index)}
                </div>
              </div>
            ));
          })
        }
      </div>
    </>
  )
}
export default CreateCalendar;
