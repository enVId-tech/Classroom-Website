async function Elements() {
    let dataID = document.cookie.split("=")[1];
    let getData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dataID })
    }
    fetch('/getstudentaccess', getData)
        .then(response => response.json())
        .then(data => {
            createElements(data);
        });
}
function createElements(data) {
    let sidebar = document.getElementById("sidebardiv");
    if (data.hasAccessTo.CSD.hasAccess == true) {
        if (sidebar) {
            let CSD = document.createElement("div");
            CSD.className = "sidebar-item";
            sidebar.appendChild(CSD);

            let CSDButton = document.createElement("button");
            CSDButton.className = "sidebar-label";
            CSDButton.onclick = function () { window.location.href = "/Classes/CSD" };
            CSDButton.innerHTML = "CSD";
            CSD.appendChild(CSDButton);

            let CSDDropdown = document.createElement("div");
            CSDDropdown.className = "sidebar-dropdown";
            CSD.appendChild(CSDDropdown);

            let CSDContent = document.createElement("p");
            CSDContent.innerHTML = "Content for Item 3";
            CSDDropdown.appendChild(CSDContent);
        }
    }
    if (data.hasAccessTo.CSP.hasAccess == true) {
        if (sidebar) {
            let CSP = document.createElement("div");
            CSP.className = "sidebar-item";
            sidebar.appendChild(CSP);

            let CSPButton = document.createElement("button");
            CSPButton.className = "sidebar-label";
            CSPButton.onclick = function () { window.location.href = "/Classes/CSP" };
            CSPButton.innerHTML = "AP CSP";
            CSP.appendChild(CSPButton);

            let CSPDropdown = document.createElement("div");
            CSPDropdown.className = "sidebar-dropdown";
            CSP.appendChild(CSPDropdown);

            let CSPContent = document.createElement("p");
            CSPContent.innerHTML = "Content for Item 3";
            CSPDropdown.appendChild(CSPContent);
        } else {
            console.error("Sidebar element not found");
        }
    }

    if (data.hasAccessTo.CSA.hasAccess == true) {
        if (sidebar) {
            let CSA = document.createElement("div");
            CSA.className = "sidebar-item";
            sidebar.appendChild(CSA);

            let CSAButton = document.createElement("button");
            CSAButton.className = "sidebar-label";
            CSAButton.onclick = function () { window.location.href = "/Classes/CSA" };
            CSAButton.innerHTML = "AP CSA";
            CSA.appendChild(CSAButton);

            let CSADropdown = document.createElement("div");
            CSADropdown.className = "sidebar-dropdown";
            CSA.appendChild(CSADropdown);

            let CSADiv = document.createElement("div");
            CSADiv.className = "sidebar-item extras";
            CSADropdown.appendChild(CSADiv);

            let CSAContent = document.createElement("button");
            CSAContent.className = "sidebar-item extras";
            CSAContent.onclick = function () { window.location.href = "/Classes/CSA/Announcements" };
            CSAContent.innerHTML = "Announcements";
            CSADiv.appendChild(CSAContent);

            let CSAContent3 = document.createElement("button");
            CSAContent3.className = "sidebar-item extras";
            CSAContent3.onclick = function () { window.location.href = "/Classes/CSA/Agenda" };
            CSAContent3.innerHTML = "Agenda";
            CSADiv.appendChild(CSAContent3);


            let CSAContent2 = document.createElement("button");
            CSAContent2.className = "sidebar-item extras";
            CSAContent2.onclick = function () { window.location.href = "/Classes/CSA/AssignmentList" };
            CSAContent2.innerHTML = "Assignment List";
            CSADiv.appendChild(CSAContent2);

            let CSAContent4 = document.createElement("button");
            CSAContent4.className = "sidebar-item extras";
            CSAContent4.onclick = function () { window.location.href = "/Classes/CSA/LearningLog" };
            CSAContent4.innerHTML = "Learning Log";
            CSADiv.appendChild(CSAContent4);
        } else {
            console.error("Sidebar element not found");
        }
    }

    if (data.hasAccessTo.MobileWebDev.hasAccess == true) {
        if (sidebar) {
            let MobileWebDev = document.createElement("div");
            MobileWebDev.className = "sidebar-item";
            sidebar.appendChild(MobileWebDev);

            let MobileWebDevButton = document.createElement("button");
            MobileWebDevButton.className = "sidebar-label";
            MobileWebDevButton.onclick = function () { window.location.href = "/Classes/MAD" };
            MobileWebDevButton.innerHTML = "Mobile App. Dev.";
            MobileWebDev.appendChild(MobileWebDevButton);

            let MobileWebDevDropdown = document.createElement("div");
            MobileWebDevDropdown.className = "sidebar-dropdown";
            MobileWebDev.appendChild(MobileWebDevDropdown);

            let MobileWebDevContent = document.createElement("p");
            MobileWebDevContent.innerHTML = "Content for Item 3";
            MobileWebDevDropdown.appendChild(MobileWebDevContent);
        } else {
            console.error("Sidebar element not found");
        }
    }

    if (data.hasAccessTo.AdminPanel.hasAccess == true) {
        if (sidebar) {
            let AdminPanel = document.createElement("div");
            AdminPanel.className = "sidebar-item";
            sidebar.appendChild(AdminPanel);

            let AdminPanelButton = document.createElement("button");
            AdminPanelButton.className = "sidebar-label";
            AdminPanelButton.onclick = function () { window.location.href = "/adminPanel" };
            AdminPanelButton.innerHTML = "Admin Panel";
            AdminPanel.appendChild(AdminPanelButton);

            let AdminPanelDropdown = document.createElement("div");
            AdminPanelDropdown.className = "sidebar-dropdown";
            AdminPanel.appendChild(AdminPanelDropdown);

            let AdminPanelDiv = document.createElement("div");
            AdminPanelDiv.className = "sidebar-item extras";
            AdminPanelDropdown.appendChild(AdminPanelDiv);

            let AdminButton = document.createElement("button");
            AdminButton.className = "sidebar-item extras";
            AdminButton.onclick = function () { window.location.href = "/adminPanel/StudentList" };
            AdminButton.innerHTML = "Student List";
            AdminPanelDropdown.appendChild(AdminButton);
        } else {
            console.error("Sidebar element not found");
        }
    }
    sidebar.appendChild(document.createElement("br"));
    sidebar.appendChild(document.createElement("br"));
    sidebar.appendChild(document.createElement("br"));
    sidebar.appendChild(document.createElement("br"));

    if (!window.location.pathname.includes("profile-settings")) {
        let profile = document.createElement("div");
        profile.className = "sidebar-item";
        sidebar.appendChild(profile);

        let profileButton = document.createElement("button");
        profileButton.className = "sidebar-label";
        profileButton.onclick = function () { window.location.href = "/User/profile-settings/settings" };
        profileButton.innerHTML = "Profile and Settings";
        profile.appendChild(profileButton);
    } else {
        let profile = document.createElement("div");
        profile.className = "sidebar-item";
        sidebar.appendChild(profile);

        let profileButton = document.createElement("button");
        profileButton.className = "sidebar-label";
        profileButton.onclick = function () { window.location.href = "/" };
        profileButton.innerHTML = "Back to Dashboard";
        profile.appendChild(profileButton);
    }

    let logout = document.createElement("div");
    logout.className = "sidebar-item";
    sidebar.appendChild(logout);

    let logoutButton = document.createElement("button");
    logoutButton.className = "item signout siderbar-label";
    logoutButton.id = "LogOut";
    logoutButton.onclick = logOut;
    logout.appendChild(logoutButton);

    let logoutContent = document.createElement("h3");
    logoutContent.innerHTML = "Log Out";
    logoutContent.className = "text signout";
    logoutButton.appendChild(logoutContent);


}