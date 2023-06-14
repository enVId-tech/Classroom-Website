window.addEventListener('DOMContentLoaded', async function () {
    AssignmentsGet();
});

async function AssignmentsGet() {
    const url = window.location.pathname;
    const dataID = document.cookie.split("=")[1].split(";")[0];

    const fetchData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, dataID: dataID }),
    }

    await fetch('/student/assignments/summary/get', fetchData)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            CreateAssignmentList(data);
        }
    );
};

function CreateAssignmentList(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        console.log(data[i])
        const AssignmentList = document.getElementById("Assignment");
        const AssignmentSummary = document.getElementById("AssignmentSummary")

        if (data[i] == "LearningLog") {
            for (j = 0; j < data[i].length; j++) {
                const Assignmentbar = document.createElement("div");
                Assignmentbar.className = "assignment";
                Assignmentbar.id = i;
                AssignmentList.appendChild(Assignmentbar);
            
                const AssignmentTitle = document.createElement("h1");
                AssignmentTitle.id = "AssignmentTitle";
                AssignmentTitle.textContent = data.title;
                Assignmentbar.appendChild(AssignmentTitle);
        
                const AssignmentDueDate = document.createElement("h3");
                AssignmentDueDate.id = "AssignmentDueDate";
                AssignmentDueDate.textContent = data.date;
                Assignmentbar.appendChild(AssignmentDueDate);
            }
            break;
        }
        console.log(i);
        const Assignmentbar = document.createElement("div");
        Assignmentbar.className = "assignment";
        Assignmentbar.id = i;
        AssignmentList.appendChild(Assignmentbar);
    
        const AssignmentTitle = document.createElement("h1");
        AssignmentTitle.id = "AssignmentTitle";
        AssignmentTitle.textContent = data.title;
        Assignmentbar.appendChild(AssignmentTitle);

        const AssignmentDueDate = document.createElement("h3");
        AssignmentDueDate.id = "AssignmentDueDate";
        AssignmentDueDate.textContent = data.date;
        Assignmentbar.appendChild(AssignmentDueDate);
    }
}