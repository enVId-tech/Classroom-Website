import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";

// eslint-disable-next-line react/prop-types
const StudentData = ({ Pages, PagesArrayNumber, path }) => {
    return (
        <HelmetProvider>
            <ClassHelmet page="settings" />
            <div className="settings">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">Student Data</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                    </section>
                </center>
            </div>
        </HelmetProvider>
    )
}

export default StudentData;