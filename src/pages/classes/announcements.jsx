import React from "react";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import "../../Assets/css/announcements.css";

const Announcements = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
    return (
        <div className="connections">
            <Sidebar />
            <section className="content">
                <center>
                    <h1 id="NamePlate">{Pages[0][ClassNum]} | Announcements</h1>
                    <ul className="nav nav-tabs" role="tablist">
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
                    </ul>
                    <span id="AnnouncementsHolder">
                        <div id="AnnouncementsSelect"></div>
                        <div id="AnnouncementsContent"></div>
                    </span>
                </center>
            </section>
        </div>
    );
}

export default Announcements;