document.addEventListener("DOMContentLoaded", function () {
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
            console.log(data);
            createElements(data);
        });

    function createElements(data) {
        let sidebar = document.getElementById("sidebar");
        if (data.hasAccessTo.CSP == true) {
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

        if (data.hasAccessTo.CSA == true) {
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

                let CSAContent = document.createElement("p");
                CSAContent.innerHTML = "Content for Item 3";
                CSADropdown.appendChild(CSAContent);
            } else {
                console.error("Sidebar element not found");
            }
        }

        if (data.hasAccessTo.MobileWebDev == true) {
            if (sidebar) {
                let MobileWebDev = document.createElement("div");
                MobileWebDev.className = "sidebar-item";
                sidebar.appendChild(MobileWebDev);

                let MobileWebDevButton = document.createElement("button");
                MobileWebDevButton.className = "sidebar-label";
                MobileWebDevButton.onclick = function () { window.location.href = "/Classes/MobileWebDev" };
                MobileWebDevButton.innerHTML = "Mobile Web. Dev.";
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

        if (data.hasAccessTo.AdminPanel == true) {
            if (sidebar) {
                let AdminPanel = document.createElement("div");
                AdminPanel.className = "sidebar-item";
                sidebar.appendChild(AdminPanel);

                let AdminPanelButton = document.createElement("button");
                AdminPanelButton.className = "sidebar-label";
                AdminPanelButton.onclick = function () { window.location.href = "/AdminPanel" };
                AdminPanelButton.innerHTML = "Admin Panel";
                AdminPanel.appendChild(AdminPanelButton);

                let AdminPanelDropdown = document.createElement("div");
                AdminPanelDropdown.className = "sidebar-dropdown";
                AdminPanel.appendChild(AdminPanelDropdown);

                let AdminPanelContent = document.createElement("p");
                AdminPanelContent.innerHTML = "Content for Item 3";
                AdminPanelDropdown.appendChild(AdminPanelContent);
            } else {
                console.error("Sidebar element not found");
            }
        }
        sidebar.appendChild(document.createElement("br"));
        sidebar.appendChild(document.createElement("br"));
        sidebar.appendChild(document.createElement("br"));
        sidebar.appendChild(document.createElement("br"));

        let logout = document.createElement("div");
        logout.className = "sidebar-item";
        sidebar.appendChild(logout);

        let logoutButton = document.createElement("button");
        logoutButton.className = "item signout siderbar-label";
        logoutButton.onmousedown = function () {logOut()};
        logoutButton.id = "LogOut";
        logout.appendChild(logoutButton);

        let logoutContent = document.createElement("h3");
        logoutContent.innerHTML = "Log Out";
        logoutContent.className = "text signout";
        logoutButton.appendChild(logoutContent);
    }
});