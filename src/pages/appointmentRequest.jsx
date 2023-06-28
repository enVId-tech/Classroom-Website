import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";

const RequestConnections = ({ Pages, PagesArrayNumber, path }) => {
    return (
        <HelmetProvider>
            <ClassHelmet page="requestconnections" />
            <div className="connections">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">Request an appointments</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                    </section>
                </center>
            </div>
        </HelmetProvider>
    )
}

export default RequestConnections;