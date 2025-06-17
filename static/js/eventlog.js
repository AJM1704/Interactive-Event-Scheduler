document.addEventListener("DOMContentLoaded", function () {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    console.log("in storage", events);
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    events.forEach(event => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.eventName}</td>
            <td>${event.dayOfWeek}</td>
            <td>${event.startTime}</td>
            <td>${event.stopTime}</td>
            <td>${event.phone}</td>
            <td>${event.location}</td>
            <td><a href="${event.eventURL}">Link</a></td>
        `;
        tbody.appendChild(row);
    });
});
