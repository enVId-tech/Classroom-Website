import React, { useEffect } from 'react';

function Announcements() {
  useEffect(() => {
    const fetchData = async () => {
      const url = window.location.pathname;

      const response = await fetch('/class/announcements/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      AnnouncementsAdd(data.announcements);
    };

    fetchData();
  }, []);

  const AnnouncementsAdd = (announcements) => {
    const announcementSelectionSidebar = document.getElementById('AnnouncementsSelect');
    const announcementSelectionContentSidebar = document.getElementById('AnnouncementsContent');

    announcements.forEach((announcement, i) => {
      const announcementSelection = (
        <div key={i}>
          <h1 className={`${i} AnnouncementsSelection`} onClick={() => AnnouncementsHideShow(i)} id="AnnouncementNameSelect">
            {announcement.title}
          </h1>
        </div>
      );
      announcementSelectionSidebar.appendChild(announcementSelection);

      const announcementContentDiv = (
        <div id={i} className="AnnouncementsContent">
          <h1 id="AnnouncementTitle">{announcement.title}</h1>
          <h3 id="AnnouncementContent">{announcement.description}</h3>
        </div>
      );
      announcementSelectionContentSidebar.appendChild(announcementContentDiv);
    });
  };

  const AnnouncementsHideShow = (id) => {
    const announcementSelection = document.getElementById(id);

    const announcementSelections = document.getElementsByClassName('AnnouncementsContentShow');
    Array.from(announcementSelections).forEach((selection) => {
      selection.className = 'AnnouncementsContent';
    });

    if (announcementSelection.className === 'AnnouncementsContent') {
      announcementSelection.className = 'AnnouncementsContentShow';
    } else {
      announcementSelection.className = 'AnnouncementsContent';
    }
  };

  return (
    <div>
      <div id="AnnouncementsSelect"></div>
      <div id="AnnouncementsContent"></div>
    </div>
  );
}

export default Announcements;
