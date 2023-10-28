import React, { useState, useEffect } from 'react';

function AnnouncementsCreate() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const url = window.location.pathname;

      const response = await fetch('/class/announcements/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setAnnouncements(data.announcements);
    }

    fetchData();
  }, []);

  const AnnouncementsHideShow = (id) => {
    const announcementSelection = document.getElementById(id);
    const announcementSelections = document.getElementsByClassName('AnnouncementsContentShow');

    if (announcementSelection.className === 'AnnouncementsContentShow') {
      announcementSelection.className = 'AnnouncementsContent';
    } else {
      if (announcementSelections.length > 0) {
        for (let i = 0; i < announcementSelections.length; i++) {
          announcementSelections[i].className = 'AnnouncementsContent';
        }
      }
      announcementSelection.className = 'AnnouncementsContentShow';
    }
  };

  return (
    <div>
      <div id="AnnouncementsSelect">
        {
          announcements.map((announcement, i) => {
            return (
              <div key={i}>
                <h1 className={`${i} AnnouncementsSelection`} onClick={() => AnnouncementsHideShow(i)} id="AnnouncementNameSelect">
                  {announcement.title}
                </h1>
              </div>
            )
          })
        }
      </div>
      <div id="AnnouncementsContent">
        {
          announcements.map((announcement, i) => {
            return (
              <div id={i} className="AnnouncementsContent" key={i}>
                <h1 id="AnnouncementTitle">{announcement.title}</h1>
                <h3 id="AnnouncementContent">{announcement.description}</h3>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default AnnouncementsCreate;