
document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    if(!email || !password){

        alert("Please Enter Email And Password");

        return;

    }

    try{

        const response = await fetch(
            "/login",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    email,
                    password
                })
            }
        );

        const result =
        await response.json();

        if(result.success){

            alert(
                "Login Successful"
            );

            window.location.href =
            "/dashboard";

        }else{

            alert(
                result.message ||
                "Invalid Email Or Password"
            );

        }

    }catch(error){

        console.log(error);

        alert(
            "Server Error"
        );

    }

});