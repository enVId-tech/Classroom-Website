import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";
import User from "../Assets/jsx/settings-profile";

const Settings = ({Pages, PagesArrayNumber, path}) => {
    return (
        <div className="settings">
            <Sidebar />
            <center>
                <section className="content">
                    <h1 id="NamePlate">Settings</h1>
                    <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path}/>
                    <User Type="settings" />
                </section>
            </center>
        </div>
    )
}

export default Settings;