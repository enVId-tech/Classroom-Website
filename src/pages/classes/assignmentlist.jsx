import React from "react";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";

const AssignmentList = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
    return (
        <div className="connections">
            <Sidebar />
            <section className="content">
                <h1 id="NamePlate">{path} | Assignments</h1>
                <ul className="nav nav-tabs" role="tablist">
                    <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} windowpath={path} />
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
            </section>
        </div>
    );
};

export default AssignmentList;