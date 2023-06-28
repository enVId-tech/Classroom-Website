import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";

const ActiveConnections = ({ Pages, PagesArrayNumber, path }) => {
    return (
        <HelmetProvider>
            <ClassHelmet page="viewconnections" />
            <div className="connections">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">View active appointments</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                    </section>
                </center>
            </div>

        </HelmetProvider>
    )
}

export default ActiveConnections;