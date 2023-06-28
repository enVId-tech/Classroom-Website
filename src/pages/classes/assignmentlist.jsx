import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import ClassHelmet from "../../Assets/jsx/pagehead";

const AssignmentList = ({ Pages, PagesArrayNumber, path, ClassNum }) => {

    const ClassTitle = {
        page: "class",
        classType: Pages[0][ClassNum],
        classPage: "assignments"
    }

    return (
        <HelmetProvider>
            <ClassHelmet {...ClassTitle} />
            <div className="connections">
                <Sidebar />
                <section className="content">
                    <center>
                        <h1 id="NamePlate">{Pages[0][ClassNum]} | Assignments</h1>
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
                        <span className="AssignmentBar">
                            <div id="Assignments">
                                <div className="assignment">
                                    <h1 className="assignmentName">Assignment 1</h1>
                                </div>
                            </div>
                            <div id="AssignmentSummary">
                                <h1 id="Placeholder">Click on an assignment!</h1>
                            </div>
                        </span>
                    </center>
                </section>
            </div>
        </HelmetProvider>
    );
};

export default AssignmentList;