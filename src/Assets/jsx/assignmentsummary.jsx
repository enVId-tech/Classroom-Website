import React, { useEffect } from 'react';

function Assignments() {
  useEffect(() => {
    AssignmentsGet();
  }, []);

  const AssignmentsGet = async () => {
    const url = window.location.pathname;

    const response = await fetch('/student/assignments/summary/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, dataID }),
    });

    const data = await response.json();
    console.log(data);
    CreateAssignmentList(data);
  };

  const CreateAssignmentList = (data) => {
    console.log(data);
    const AssignmentList = document.getElementById('Assignment');
    const AssignmentSummary = document.getElementById('AssignmentSummary');

    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);

      if (data[i] === 'LearningLog') {
        for (let j = 0; j < data[i].length; j++) {
          const Assignmentbar = (
            <div className="assignment" id={i}>
              <h1 id="AssignmentTitle">{data.title}</h1>
              <h3 id="AssignmentDueDate">{data.date}</h3>
            </div>
          );
          AssignmentList.appendChild(Assignmentbar);
        }
        break;
      }

      const Assignmentbar = (
        <div className="assignment" id={i}>
          <h1 id="AssignmentTitle">{data.title}</h1>
          <h3 id="AssignmentDueDate">{data.date}</h3>
        </div>
      );
      AssignmentList.appendChild(Assignmentbar);
    }
  };

  return (
    <div>
      <div id="Assignment"></div>
      <div id="AssignmentSummary"></div>
    </div>
  );
}

export default Assignments;
