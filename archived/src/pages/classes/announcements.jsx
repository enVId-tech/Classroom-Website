import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import ClassHelmet from "../../Assets/jsx/pagehead";
import AnnouncementsCreate from "../../Assets/jsx/announcements";
import "../../Assets/css/announcements.css";

// eslint-disable-next-line react/prop-types
const Announcements = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
    const ClassTitle = {
        page: "class",
        classType: Pages[0][ClassNum],
        classPage: "announcements"
    }

    return (
        <HelmetProvider>
            <ClassHelmet {...ClassTitle} />
            <div className="announcements">
                <Sidebar />
                <section className="content">
                    <center>
                        <h1 id="NamePlate">{Pages[0][ClassNum]} | Announcements</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
                        <br/>
                        <AnnouncementsCreate />
                    </center>
                </section>
            </div>
        </HelmetProvider>
    );
}

export default Announcements;