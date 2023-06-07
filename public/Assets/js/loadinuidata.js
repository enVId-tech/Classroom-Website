document.addEventListener("DOMContentLoaded", async function () {
    await waitForUserData();
  
    const namePlate = document.getElementById("NamePlate");
    if (namePlate && namePlate.innerHTML.includes("!")) {
      namePlate.innerHTML = "Welcome " + userData.firstName + "!";
    }
    document.getElementById("Loggedinas").innerHTML = "Logged in as " + userData.displayName;
    document.getElementById("ProfilePicture").src = userData.profilePicture;
  
  });
  
  function waitForUserData() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (userData) {
          clearInterval(interval);
          resolve();
        }
      }, 1); // Check every millisecond to see if userData is defined
    });
  }
  