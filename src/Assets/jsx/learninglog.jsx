import React from 'react';
import '../css/learninglog.css'

/* eslint-disable */
const SubmitData = () => {
    const periodOptions = [];
    for (let i = 0; i < 8; i++) {
        periodOptions.push(<option key={`period-${i}`}>Period {i + 1}</option>);
    }

    const dateOptions = [];
    for (let i = 0; i < 8; i++) {
        dateOptions.push(<option key={`date-${i}`}>Date {i}</option>);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            text: document.getElementById("textarea").value,
            period: document.getElementById("PeriodList").value,
            date: document.getElementById("DateList").value,
            Class: window.location.pathname.split("/")[2],
        };

        const sendData = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch("/student/learninglog/submit", sendData);
            const responseData = await response.json();
            if (responseData.error) {
                document.getElementById("Result").innerHTML = responseData.error;
                setTimeout(() => {
                    document.getElementById("Result").innerHTML = "";
                }, 3000);
            } else {
                document.getElementById("Result").innerHTML = "Submitted!";
                setTimeout(() => {
                    document.getElementById("Result").innerHTML = "";
                }, 3000);
            }
        } catch (error) {
            document.getElementById("Result").innerHTML = "An error occurred while submitting your learning log entry: " + error;
            setTimeout(() => {
                document.getElementById("Result").innerHTML = "";
            }, 3000);
        }
    };

    return (
        <>
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

            <textarea id="textarea" key={"text"} />

            <br />
            <h1 id="Result"></h1>
            <button type="submit" key="submit" id="Submit" onClick={handleSubmit}>Submit</button>
        </>
    );
}

export default SubmitData;