import React, { useState } from "react";
import Sidebar from "../Assets/jsx/sidebar";
import SelectionBar from "../Assets/jsx/selectionbar";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";
import '../Assets/jsx/console.jsx'

// eslint-disable-next-line react/prop-types
const AdminPanel = ({ Pages, PagesArrayNumber, path }) => {
    const [output, setOutput] = useState([]);

    setOutput(["Welcome to the admin panel!"]);

    return (
        <HelmetProvider>
            <ClassHelmet page="adminpanel" />
            <div className="connections">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">Admin Panel</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} />
                    </section>
                    <div id="output">
                        {output}
                    </div>
                    <input type="text" id="input" />
                </center>
            </div>
        </HelmetProvider>
    );
}

export default AdminPanel;