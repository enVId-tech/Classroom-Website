import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";

const ActiveConnections = (Pages, PagesArrayNumber, path) => {
    return (
        <div className="connections">
            <Sidebar />
            <center>
                <section className="content">
                    <h1 id="NamePlate">Active Connections</h1>
                    <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} windowpath={path}/>
                </section>
            </center>
        </div>
    )
}

export default ActiveConnections;