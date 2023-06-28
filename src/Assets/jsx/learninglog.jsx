import React from 'react';

export async function SubmitData() {
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
            dataID: document.cookie.split("=")[1].split(";")[0],
            text: event.target.elements.textarea.value,
            period: event.target.elements.PeriodList.value,
            date: event.target.elements.DateList.value,
            Class: window.location.pathname.split("/")[2],
        };

        switch (true) {
            case data.text === "":
                return "Please enter text.";
            case data.period === "":
                return "Please select a period.";
            case data.date === "":
                return "Please select a date.";
            case data.dataID === "":
                return "Please log in.";
            default:
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
                    console.log(responseData);
                } catch (error) {
                    console.error(error);
                }
                break;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea id="textarea" />
            <select id="PeriodList">
                {periodOptions}
            </select>
            <input type="date" id="DateList">
                {dateOptions}
            </input>
            <button type="submit">Submit</button>
        </form>
    );
}
