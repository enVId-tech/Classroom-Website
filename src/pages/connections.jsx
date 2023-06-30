import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";

// eslint-disable-next-line react/prop-types
const ActiveConnections = ({ Pages, PagesArrayNumber, path }) => {
    return (
        <HelmetProvider>
            <ClassHelmet page="connections" />
            <div className="connections">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">Connections</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                    </section>
                </center>
            </div>
        </HelmetProvider>
    )
}

export default ActiveConnections;