import React, { useEffect } from "react";

async function setUserInfoValues(userInformation) {
    const namePlate = document.getElementById("NamePlate");
    if (namePlate && namePlate.innerHTML.includes("!")) {
        namePlate.innerHTML = `Welcome ${userInformation[0].firstName}!`;
    }
    document.getElementById("Loggedinas").innerHTML = `Logged in as ${userInformation[0].displayName}`;
    document.getElementById("ProfilePicture").src = userInformation[0].profilePicture;
}

async function getDataIDFromServer() {
    const response = await fetch("/student/data/ID", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json().catch((err) => {
        window.location.replace("/User/Authentication/Log-In");
    });
    document.cookie = `dataID=${data.encryptedData}`;
    checkLoggedIn();
    return data.encryptedData;
}

async function getUserDataFromServer(dataID) {
    const response = await fetch("/student/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataID }),
    });
    return await response.json();
}

async function Elements() {
    const dataID = document.cookie.split("=")[1];

    const sidebarDataGet = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataID }),
    };

    const response = await fetch("/student/sidebar/get", sidebarDataGet);
    const data = await response.json();
    if (data.error) {
        checkLoggedIn();
        return;
    }
    const dataParsed = JSON.parse(data.studentData);
    const sidebarParse = JSON.parse(data.sidebarJSON);

    const handleSidebarButtonClick = (link) => {
        window.location.replace(link);
    };

    const handleSidebarContentClick = (link) => {
        window.location.replace(link);
    };

    return (
        <>
            {dataParsed.map((dataItem, i) => {
                if (dataItem.hasAccess) {
                    return (
                        <div key={i} className="sidebar-item">
                            <button className="sidebar-label" onClick={() => handleSidebarButtonClick(sidebarParse[i].link)}>
                                {sidebarParse[i].name}
                            </button>
                            <div className="sidebar-dropdown">
                                {sidebarParse[i].Pages.length > 0 ? (
                                    sidebarParse[i].Pages.map((page, j) => (
                                        <button
                                            key={j}
                                            className="sidebar-item extras"
                                            onClick={() => handleSidebarContentClick(page.link)}
                                        >
                                            {page.name}
                                        </button>
                                    ))
                                ) : (
                                    <span>No Pages</span>
                                )}
                            </div>
                        </div>
                    );
                } else {
                    return null;
                }
            })}
            <br />
            <br />
            <br />
            <br />
            <div className="sidebar-item">
                <button
                    className="sidebar-label"
                    onClick={() =>
                        window.location.replace(
                            window.location.pathname.includes("profile-settings") ? "/" : "/User/profile-settings/settings"
                        )
                    }
                >
                    {window.location.pathname.includes("profile-settings") ? "Back to Dashboard" : "Profile and Settings"}
                </button>
            </div>
            <div className="sidebar-item">
                <button className="item signout siderbar-label" id="LogOut" onClick={logOut}>
                    <h3 className="text signout">Log Out</h3>
                </button>
            </div>
        </>
    );
}

const LoadInStudentData = () => {
    useEffect(() => {
        (async () => {
            const dataID = await getDataIDFromServer();
            const userInformation = await getUserDataFromServer(dataID);
            setUserInfoValues(userInformation);
            Elements();
        })();
    }, []);

    return <div>{document.getElementsById("sidebardiv")}</div>;
};

export default LoadInStudentData;
