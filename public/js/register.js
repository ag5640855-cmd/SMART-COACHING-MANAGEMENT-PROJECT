document
.getElementById("registerForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const full_name = document.getElementById("full_name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const student_class = document.getElementById("student_class").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    if (
        !full_name ||
        !email ||
        !phone ||
        !student_class ||
        !password ||
        !confirm_password
    ) {
        alert("Please fill all fields.");
        return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    if (password !== confirm_password) {
        alert("Passwords do not match.");
        return;
    }

    const registerBtn = document.getElementById("registerBtn");
    registerBtn.disabled = true;
    registerBtn.innerText = "Registering...";

    try {

        const response = await fetch("/api/student-auth/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                full_name,
                email,
                phone,
                student_class,
                password
            })

        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {

            document.getElementById("registerForm").reset();

            setTimeout(() => {
                window.location.href = "/student-login";
            }, 1000);

        }

    } catch (error) {

        console.error(error);

        alert("Server Error. Please try again.");

    } finally {

        registerBtn.disabled = false;
        registerBtn.innerText = "Register";

    }

});