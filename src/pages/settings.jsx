import React from "react";
import Sidebar from "../Assets/jsx/sidebar"
import SelectionBar from "../Assets/jsx/selectionbar"
import User from "../Assets/jsx/settings-profile";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";

const Settings = ({ Pages, PagesArrayNumber, path }) => {
    return (
        <HelmetProvider>
            <ClassHelmet page="settings" />
            <div className="settings">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">Settings</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                        <User type="settings" />
                    </section>
                </center>
            </div>
        </HelmetProvider>
    )
}

export default Settings;