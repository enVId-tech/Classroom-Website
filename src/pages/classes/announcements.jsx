import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import ClassHelmet from "../../Assets/jsx/pagehead";
import "../../Assets/css/announcements.css";


const Announcements = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
    const ClassTitle = {
        page: "class",
        classType: Pages[0][ClassNum],
        classPage: "announcements"
    }

    return (
        <HelmetProvider>
            <ClassHelmet {...ClassTitle} />
            <div className="connections">
                <Sidebar />
                <section className="content">
                    <center>
                        <h1 id="NamePlate">{Pages[0][ClassNum]} | Announcements</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
                        <span id="AnnouncementsHolder">
                            <div id="AnnouncementsSelect"></div>
                            <div id="AnnouncementsContent"></div>
                        </span>
                    </center>
                </section>
            </div>
        </HelmetProvider>
    );
}

export default Announcements;