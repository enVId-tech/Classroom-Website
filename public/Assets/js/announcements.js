window.addEventListener('DOMContentLoaded', (event) => {
    AnnouncementsGet();
});

function AnnouncementsGet() {
    let url = window.location.pathname;

    let fetchData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    }

    fetch('/announcements/get', fetchData)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            AnnouncementsAdd(data.announcements);
        }
    );
}

function AnnouncementsAdd(announcements) {
    for (let i = 0; i < announcements.length; i++) {
        let announcement = announcements[i];

        const announcementSelectionSidebar = document.getElementById('AnnouncementsSelect');

        let announcementSelection = document.createElement('div');
        announcementSelectionSidebar.appendChild(announcementSelection);

        let announcementSelectionTitle = document.createElement('h1');
        announcementSelectionTitle.innerHTML = announcement.title;
        announcementSelectionTitle.className = i + " AnnouncementsSelection";
        announcementSelectionTitle.onclick = function() {AnnouncementsHideShow(i)};
        announcementSelectionTitle.id = "AnnouncementNameSelect";
        announcementSelection.appendChild(announcementSelectionTitle);

        const announcementSelectionContentSidebar = document.getElementById('AnnouncementsContent');

        let announcementContentDiv = document.createElement('div');
        announcementContentDiv.id = i;
        announcementContentDiv.className = "AnnouncementsContent";
        announcementSelectionContentSidebar.appendChild(announcementContentDiv);
        
        let announcementSelectionContentTitle = document.createElement('h1');
        announcementSelectionContentTitle.innerHTML = announcement.title;
        announcementSelectionContentTitle.id = "AnnouncementTitle";
        announcementContentDiv.appendChild(announcementSelectionContentTitle);

        let announcementSelectionContent = document.createElement('h3');
        announcementSelectionContent.innerHTML = announcement.description;
        announcementSelectionContent.id = "AnnouncementContent";
        announcementContentDiv.appendChild(announcementSelectionContent);
    }
}

function AnnouncementsHideShow(id) {
    let announcementSelection = document.getElementById(id);

    if (document.getElementsByClassName("AnnouncementsContentShow")) {
        let announcementSelections = document.getElementsByClassName("AnnouncementsContentShow");
        for (let i = 0; i < announcementSelections.length; i++) {
            announcementSelections[i].className = "AnnouncementsContent";
        }
    }

    if (announcementSelection.className === "AnnouncementsContent") {
        announcementSelection.className = "AnnouncementsContentShow";
    } else {
        announcementSelection.className = "AnnouncementsContent";
    }
}