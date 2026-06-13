document
.getElementById("registerForm")
.addEventListener("submit", async(e)=>{

e.preventDefault();

const data = {

full_name:
document.getElementById("full_name").value,

email:
document.getElementById("email").value,

phone:
document.getElementById("phone").value,

student_class:
document.getElementById("student_class").value,

password:
document.getElementById("password").value

};

const response = await fetch(
"/api/students/register",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

const result = await response.json();

alert(result.message);

});