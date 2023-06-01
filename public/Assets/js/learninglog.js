async function SubmitData() {
    let data = {
        "dataID": document.cookie.split("=")[1].split(";")[0],
        "text": document.getElementById("textarea").value,
        "period": document.getElementById("PeriodList"),
        "date": document.getElementById("DateList"),
        "Class": window.location.pathname.split("/")[2]
    }

    switch (data) {
        case data.text == "": return "Please enter text."; break;
        case data.period == "": return "Please select a period."; break;
        case data.date == "": return "Please select a date."; break;
        case data.dataID == "": return "Please log in."; break;
        default:
            let sendData = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            fetch('/submitdata', sendData)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                }
            );
        break;
    }
}