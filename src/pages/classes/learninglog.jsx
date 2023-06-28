import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import SubmitData from "../../Assets/jsx/learninglog";
import ClassHelmet from "../../Assets/jsx/pagehead";

const LearningLog = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
    const periodOptions = [];
    const dateOptions = [];

    for (let i = 0; i < 8; i++) {
        periodOptions.push(<option value={i + 1}>{i + 1}</option>);
        dateOptions.push(<option value={i}>{i}</option>);
    }

    const ClassTitle = {
        page: "class",
        classType: Pages[0][ClassNum],
        classPage: "learninglog"
    }

    return (
        <HelmetProvider>
            <ClassHelmet {...ClassTitle} />
            <div className="learninglog">
                <Sidebar />
                <center>
                    <section className="content">
                        <h1 id="NamePlate">{Pages[0][ClassNum]} | Learning Log</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
                        <SubmitData />
                    </section>
                </center>
            </div>
        </HelmetProvider>
    )
}

export default LearningLog;