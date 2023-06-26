import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";

const RequestConnections = ({ Pages, PagesArrayNumber, path }) => {
    return (
        <div className="connections">
            <Sidebar />
            <center>
                <section className="content">
                    <h1 id="NamePlate">Request Appointments</h1>
                    <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                </section>
            </center>
        </div>
    )
}

export default RequestConnections;