import React from "react";
import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import { SubmitData } from '../../Assets/js/learninglog.js'

const LearningLog = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
    const periodOptions = [];
    for (let i = 0; i < 8; i++) {
        periodOptions.push(<option key={`period-${i}`}>Period {i + 1}</option>);
    }

    const dateOptions = [];
    for (let i = 0; i < 8; i++) {
        dateOptions.push(<option key={`date-${i}`}>Date {i}</option>);
    }

    return (
        <div className="learninglog">
            <Sidebar />
            <center>
                <section className="content">
                    <h1 id="NamePlate">{Pages[0][ClassNum]} | Learning Log</h1>
                    <ul className="nav nav-tabs" role="tablist">
                        <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
                    </ul>
                    <br />
                    <div className="PeriodSelection">
                        <select className="PeriodDropdown" id="PeriodList" defaultValue={"disabled"}>
                            <option disabled value="disabled"> -- Select a Period -- </option>
                            {periodOptions}
                        </select>
                    </div>
                    <div className="DateSelection">
                        <select className="DateDropdown" id="DateList" defaultValue={"disabled"}>
                            <option disabled value="disabled"> -- Select a Date -- </option>
                            {dateOptions}
                        </select>
                    </div>

                    <hr></hr>

                    <h1 id="Instructions">
                        Instructions: State any new Essential Questions (EQs), Learning Objectives, and/or new vocabulary.
                        Additionally, summarize what you did or learned today ~and~ connect it to other ideas we have learned
                        whenever applicable. This is also a good place to make comments, ask questions, or tell Mr. Wai you need
                        extra help. (At the end of the semester, you will be graded on your learning logs, so place make sure to
                        complete a log entry after *every* class, even on days you are absent.)

                        <br /><br />

                        APCSP Example: Today, I learned how to create a device for sending a single bit of information over a
                        distance. I also analyzed the limitations of sending binary messages.

                        <br /><br />

                        You are still required to do a log entry on days you are absent! If you are absent, you can write in
                        your log entry: Today, I was absent. From looking at the day's agenda, I see the class learned about
                        coding loops. I will make up the work during tutorial this week. You have only 1 week to back-date any
                        missed entries, including for days that you are absent. So please make sure to keep up with learning log
                        entries every day!

                        <br /><br />

                        NOTE: Each tardy and unexecused absense is a half point deduction from the Participation / Learning Log
                        category.

                        <br /><br />

                        If you did not learn anything new, please state what you worked on in class, and/or the concepts that
                        you reviewed. Write something like: Today, I reviewed worksheets about computer vocabulary. I learned
                        most of this yesterday, but I continued working on the worksheet I did not finish.
                    </h1>

                    <textarea id="textarea"></textarea>

                    <button id="Submit" type="submit" onClick={() => SubmitData}>
                            Submit
                    </button>
                </section>
            </center>
        </div>
    )
}

export default LearningLog;