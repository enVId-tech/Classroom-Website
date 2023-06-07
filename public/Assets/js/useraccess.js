async function Elements() {
    const dataID = document.cookie.split("=")[1];

    const sidebarDataGet = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dataID })
    };

    const response = await fetch('/sidebarget', sidebarDataGet);
    const data = await response.json();
    if (data.error) {
        checkLoggedIn();
        return;
    }
    const dataParsed = JSON.parse(data.studentData);
    const sidebarParse = JSON.parse(data.sidebarJSON);

    const sidebar = document.getElementById("sidebardiv");
    if (!sidebar) {
        console.log("No Sidebar");
        return;
    }

    for (let i = 0; i < dataParsed.length; i++) {
        if (dataParsed[i].hasAccess === true) {
            const sidebarItem = document.createElement("div");
            sidebarItem.className = "sidebar-item";
            sidebar.appendChild(sidebarItem);

            const sidebarButton = document.createElement("button");
            sidebarButton.className = "sidebar-label";
            sidebarButton.onclick = function () {
                window.location.replace(sidebarParse[i].link);
            };
            sidebarButton.innerHTML = sidebarParse[i].name;
            sidebarItem.appendChild(sidebarButton);

            const sidebarDropdown = document.createElement("div");
            sidebarDropdown.className = "sidebar-dropdown";
            sidebarItem.appendChild(sidebarDropdown);

            if (sidebarParse[i].Pages.length > 0) {
                for (let j = 0; j < sidebarParse[i].Pages.length; j++) {
                    const sidebarContent = document.createElement("button");
                    sidebarContent.className = "sidebar-item extras";
                    sidebarContent.onclick = function () {
                        window.location.replace(sidebarParse[i].Pages[j].link);
                    };
                    sidebarContent.innerHTML = sidebarParse[i].Pages[j].name;
                    sidebarDropdown.appendChild(sidebarContent);
                }
            } else {
                console.log("No Pages");
                sidebarItem.removeChild(sidebarDropdown);
            }
        } else {
            console.log("No Access");
        }
    }

    sidebar.appendChild(document.createElement("br"));
    sidebar.appendChild(document.createElement("br"));
    sidebar.appendChild(document.createElement("br"));
    sidebar.appendChild(document.createElement("br"));

    const profile = document.createElement("div");
    profile.className = "sidebar-item";
    sidebar.appendChild(profile);

    const profileButton = document.createElement("button");
    profileButton.className = "sidebar-label";
    profileButton.onclick = function () {
        if (window.location.pathname.includes("profile-settings")) {
            window.location.replace("/");
        } else {
            window.location.replace("/User/profile-settings/settings");
        }
    };
    profileButton.innerHTML = window.location.pathname.includes("profile-settings") ? "Back to Dashboard" : "Profile and Settings";
    profile.appendChild(profileButton);

    const logout = document.createElement("div");
    logout.className = "sidebar-item";
    sidebar.appendChild(logout);

    const logoutButton = document.createElement("button");
    logoutButton.className = "item signout siderbar-label";
    logoutButton.id = "LogOut";
    logoutButton.onclick = logOut;
    logout.appendChild(logoutButton);

    const logoutContent = document.createElement("h3");
    logoutContent.innerHTML = "Log Out";
    logoutContent.className = "text signout";
    logoutButton.appendChild(logoutContent);
}
