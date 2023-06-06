async function Elements() {
    let dataID = document.cookie.split("=")[1];

    let sidebarDataGet = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dataID })
    }

    fetch('/sidebarget', sidebarDataGet)
        .then(response => response.json())
        .then(data => {
            const dataParsed = JSON.parse(data.data);
            const sidebarParse = JSON.parse(data.sidebarJSON);
            sidebarElements(dataParsed, sidebarParse);
        }
        );
}

function sidebarElements(data, sidebarData) {
    let sidebar = document.getElementById("sidebardiv");

    for (let i = 0; i < data.length; i++) {
        if (data[i].hasAccess === true) {
            if (sidebar) {
                let sidebarItem = document.createElement("div");
                sidebarItem.className = "sidebar-item";
                sidebar.appendChild(sidebarItem);

                let sidebarButton = document.createElement("button");
                sidebarButton.className = "sidebar-label";
                sidebarButton.onclick = function () {
                    window.location.replace(sidebarData[i].link);
                };

                sidebarButton.innerHTML = sidebarData[i].name;
                sidebarItem.appendChild(sidebarButton);

                let sidebarDropdown = document.createElement("div");
                sidebarDropdown.className = "sidebar-dropdown";
                sidebarItem.appendChild(sidebarDropdown);

                if (sidebarData[i].Pages.length > 0) {
                    for (let j = 0; j < sidebarData[i].Pages.length; j++) {

                        let sidebarContent = document.createElement("button");
                        sidebarContent.className = "sidebar-item extras";
                        sidebarContent.onclick = function () {
                            window.location.replace(sidebarData[i].Pages[j].link);
                        };
                        sidebarContent.innerHTML = sidebarData[i].Pages[j].name;
                        sidebarDropdown.appendChild(sidebarContent);
                    }
                } else {
                    console.log("No Pages");
                    sidebarDropdown.removeChild(sidebarDropdown);
                }
            } else {
                console.log("No Sidebar");
            }
        } else {
            console.log("No Access");
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
        profileButton.onclick = function () { window.location.replace("/User/profile-settings/settings") };
        profileButton.innerHTML = "Profile and Settings";
        profile.appendChild(profileButton);
    } else {
        let profile = document.createElement("div");
        profile.className = "sidebar-item";
        sidebar.appendChild(profile);

        let profileButton = document.createElement("button");
        profileButton.className = "sidebar-label";
        profileButton.onclick = function () { window.location.replace("/") };
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