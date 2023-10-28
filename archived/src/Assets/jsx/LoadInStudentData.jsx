import React, { useEffect, useState } from "react";
import { logOut, checkLoggedIn, refreshSessionCookie } from "./keeploggedout";

const LoadInStudentData = () => {
    const [userDisplayName, setUserDisplayName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [dataParsed, setDataParsed] = useState([]);
    const [sidebarParse, setSidebarParse] = useState([]);
    const [firstName, setFirstName] = useState("");

    async function setUserInfoValues(userInformation) {
        setUserDisplayName(userInformation[0].displayName);
        setProfilePicture(userInformation[0].profilePicture);
        setFirstName(userInformation[0].firstName);
    }

    async function getUserDataFromServer() {
        const response = await fetch("/student/data");

        //console.log(response);
        return await response.json();
    }

    useEffect(() => {
        (async () => {
            setInterval(async () => {
                await refreshSessionCookie();
            }, 5000);
            await refreshSessionCookie();
            const userInformation = await getUserDataFromServer();
            setUserInfoValues(userInformation);

            const response = await fetch('/student/sidebar/get');
            const data = await response.json();

            await checkLoggedIn();

            const dataParsed = JSON.parse(data.studentData);
            const sidebarParse = JSON.parse(data.sidebarJSON);


            // Check if the required data is present before updating the state
            if (dataParsed && sidebarParse) {
                setDataParsed(dataParsed);
                setSidebarParse(sidebarParse);
            } else {
                //console.log("Data not present");
            }
        })();
    }, []);

    const handleSidebarButtonClick = (link) => {
        window.location.replace(link);
    };

    const handleSidebarContentClick = (link) => {
        window.location.replace(link);
    };

    if (document.getElementById("NamePlate") && window.location.pathname === "/") {
        document.getElementById("NamePlate").innerHTML = "Welcome " + firstName + "!";
    }

    return (
        <>
            <div className="sidebar-item">
                <div className="img" id="LeftImg">
                    <img
                        id="ProfilePicture"
                        src={profilePicture}
                        className="image"
                        referrerPolicy="no-referrer"
                        alt="../Assets/Images/Placeholder.png"
                    />
                    <br />
                    <h4 id="Loggedinas">Logged in as<br />{userDisplayName}</h4>
                </div>
            </div>
            <div className="sidebar-item">
                <button className="sidebar-label" onClick={() => window.location.replace("/")}>
                    Home
                </button>
            </div>
            <div className="sidebar-item">
                <button className="sidebar-label" onClick={() => window.location.replace("/connections/home")}>
                    Connections
                </button>
                <div className="sidebar-dropdown">
                    <div className="sidebar-item extras">
                        <button className="sidebar-item extras" onClick={() => window.location.replace("/connections/appointmentView")}>
                            View Appointments
                        </button>
                    </div>
                    <div className="siderbar-item extras">
                        <button className="sidebar-item extras" onClick={() => window.location.replace("/connections/appointmentRequest")}>
                            Schedule an appointment
                        </button>
                    </div>
                </div>
            </div>
            {dataParsed.map((dataItem, i) => {
                if (dataItem.hasAccess) {
                    return (
                        <div key={i} className="sidebar-item">
                            <button
                                className="sidebar-label"
                                onClick={() => handleSidebarButtonClick(sidebarParse[i].link)}
                            >
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
};

export default LoadInStudentData;
