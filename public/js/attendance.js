document
.getElementById("attendanceForm")
.addEventListener("submit", async (e) => {

e.preventDefault();

const data = {
    student_id:
    document.getElementById("student_id").value,

    attendance_date:
    document.getElementById("attendance_date").value,

    status:
    document.getElementById("status").value
};

const response = await fetch(
    "/api/students/attendance",
    {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify(data)
    }
);

const result =
await response.json();

alert(result.message);

document
.getElementById("attendanceForm")
.reset();

});