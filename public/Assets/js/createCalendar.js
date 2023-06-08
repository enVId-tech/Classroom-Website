document.addEventListener("DOMContentLoaded", function () {
  // Get the slider tabs and content
  var sliderTabs = document.querySelector('.slider-tabs');
  var sliderContent = document.querySelector('.slider-content');

  // Get the current date
  var currentDate = new Date();

  // Generate the calendar for the current month and the next two months
  for (var i = 0; i < 12; i++) {
    var date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    var monthName = date.toLocaleString('default', { month: 'long' });

    // Create the tab element
    var tabElement = document.createElement('div');
    tabElement.classList.add('tab');
    tabElement.textContent = monthName;
    sliderTabs.appendChild(tabElement);

    // Create the month element
    var monthElement = document.createElement('div');
    monthElement.classList.add('month');

    // Create the days container
    var daysContainer = document.createElement('div');
    daysContainer.classList.add('days');

    // Get the number of days in the month
    var daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Generate day elements
    for (var j = 1; j <= daysInMonth; j++) {
      var dayElement = document.createElement('div');
      dayElement.textContent = j;
      dayElement.classList.add('day');

      var theday = new Date(date.getFullYear(), date.getMonth(), j).toString().slice(0, 15);
      var today = new Date().toString().slice(0, 15);

      // Add the "current-day" class to the appropriate day element
      if (theday === today) {
        dayElement.classList.add('current-day');
      }

      // Check if the day is a weekend (Saturday or Sunday)
      var dayOfWeek = new Date(date.getFullYear(), date.getMonth(), j).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayElement.style.display = 'none'; // Hide weekends
      }

      // Create the weekday label
      var weekdayLabel = document.createElement('div');
      weekdayLabel.classList.add('weekday-label');
      weekdayLabel.textContent = getWeekdayLabel(dayOfWeek);

      dayElement.appendChild(weekdayLabel);

      // Check if user has necessary permissions to access the pencil icon
      var hasPermission = checkUserPermission(); // Implement the permission check on the server-side

      if (hasPermission) {
        // Add an editable pencil icon to the day element
        var pencilIcon = document.createElement('i');
        pencilIcon.classList.add('fas', 'fa-pencil-alt', 'edit-icon');
        dayElement.appendChild(pencilIcon);

        // Add click event listener to the pencil icon
        pencilIcon.addEventListener('click', function () {
          var detailsElement = this.nextElementSibling;
          var content = prompt('Enter your content:', detailsElement.textContent);
          if (content !== null) {
            detailsElement.textContent = content;
            // Send the updated content to the server for saving
            saveContentToServer(content);
          }
        });
      }

      // Create the day's details element
      var detailsElement = document.createElement('div');
      detailsElement.classList.add('details');
      detailsElement.textContent = 'Details for day ' + j;
      dayElement.appendChild(detailsElement);

      daysContainer.appendChild(dayElement);
    }

    monthElement.appendChild(daysContainer);
    sliderContent.appendChild(monthElement);
  }

  // Add click event listeners to tabs
  var tabs = document.querySelectorAll('.tab');
  var months = document.querySelectorAll('.month');

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      // Remove the 'active' class from all tabs and months
      tabs.forEach(function (tab) {
        tab.classList.remove('active');
      });
      months.forEach(function (month) {
        month.classList.remove('active');
      });

      // Add the 'active' class to the clicked tab and month
      tab.classList.add('active');
      months[index].classList.add('active');
    });
  });

  // Set the first tab and month as active
  tabs[0].classList.add('active');
  months[0].classList.add('active');

  // Function to save content to the server
  function saveContentToServer(content) {
    // Make an AJAX request or use fetch to see content to the server
    // Replace the URL below with your server int
    
    const dataID = document.cookie.split("=")[1];

    const windowURL = window.location.pathname;

    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID, content, windowURL })
    }

    fetch('/agenda/write', data)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      }
    );
  }

  // Function to get the weekday label based on the day of the week index
  function getWeekdayLabel(dayOfWeek) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  // Function to check user's permission (replace with server-side implementation)
  async function checkUserPermission() {
    // Implement the necessary permission check on the server-side and return the result

    const dataID = document.cookie.split("=")[1];

    const windowURL = window.location.pathname;
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID, windowURL })
    }

    fetch('/agenda/permission', data)
      .then(response => response.json())
      .then(data => {
        hasPermission = data.hasPermission;
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
    return hasPermission;
  }
});
