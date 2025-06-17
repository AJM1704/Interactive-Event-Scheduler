document.getElementById("eventForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let isValid = true;
    let eventName = document.getElementById("eventName").value;
    let eventPattern = /^[A-Za-z0-9 ]+$/;
    if (!eventPattern.test(eventName)) {
        document.getElementById("eventError").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("eventError").style.display = "none";
    }
    let dayOfWeek = document.getElementById("dayOfWeek").value;
    if (dayOfWeek === "") {
        document.getElementById("dayError").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("dayError").style.display = "none";
    }
    let phone = document.getElementById("phone").value;
    let phonePattern = /^[1-9][0-9]{2}-[0-9]{3}-[0-9]{4}$/;
    if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("phoneError").style.display = "none";
    }
    let url = document.getElementById("eventURL").value;
    let urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
    if (!urlPattern.test(url)) {
        document.getElementById("urlError").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("urlError").style.display = "none";
    }
    if (!isValid) {
        return;
    }
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push({
        eventName,
        dayOfWeek,
        startTime: document.getElementById("startTime").value,
        stopTime: document.getElementById("stopTime").value,
        phone,
        location: document.getElementById("location").value,
        eventURL: url
    });
    localStorage.setItem("events", JSON.stringify(events));
    alert("Added event");
    window.location.href = "/eventlog.html";
});
