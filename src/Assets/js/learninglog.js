export async function SubmitData() {
    let data = {
        dataID: document.cookie.split("=")[1].split(";")[0],
        text: document.getElementById("textarea").value,
        period: document.getElementById("PeriodList").value,
        date: document.getElementById("DateList").value,
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
            let sendData = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };

            fetch("/student/learninglog/submit", sendData)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                });
            break;
    }
}
