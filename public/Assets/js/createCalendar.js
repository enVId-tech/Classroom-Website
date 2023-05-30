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
  
        let theday = new Date(date.getFullYear(), date.getMonth(), j).toString().slice(0, 15);
        let today = new Date().toString().slice(0, 15);

        // Add the "current-day" class to the appropriate day element
        if (theday === today) {
            
          dayElement.classList.add('current-day');
        }
  
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
  });
  