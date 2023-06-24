import React from "react";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";

const AssignmentList = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
    return (
        <div className="connections">
            <Sidebar />
            <section className="content">
                <center>
                    <h1 id="NamePlate">{Pages[0][ClassNum]} | Assignments</h1>
                    <ul className="nav nav-tabs" role="tablist">
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
                    </ul>
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
    );
};

export default AssignmentList;