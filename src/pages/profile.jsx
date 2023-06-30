import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";
import User from "../Assets/jsx/settings-profile";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";

// eslint-disable-next-line react/prop-types
const Profile = ({ Pages, PagesArrayNumber, path }) => {
    return (
        <HelmetProvider>
            <ClassHelmet page="profile" />
            <div className="profile">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">Profile</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                        <User type="profile" />
                    </section>
                </center>
            </div>
        </HelmetProvider>
    )
}

export default Profile;