const API_key = 'qP7h9NOAlOsQSGo4H9OyuZHnxMesBe'
const btnLogin = document.getElementById("login")
const name = document.getElementById("name")
const password = document.getElementById("password")
const error = document.getElementById("error")

btnLogin.onclick = ()=>{
    if(name.value!="" && password.value!=""){
        //controllo della password
        fetch('http://localhost:3000/users/'+ name.value +'/'+ password.value+'/'+API_key)
        .then(response =>{
            if(response.status==200){
                response.json()
                .then(() =>{
                    sessionStorage.setItem("user", name.value)
                    window.location.replace("http://localhost:5500/public/index.html");
                })
            }
            else if(response.status==400 || response.status == 404){
                response.json()
                .then(err=>{
                    console.error(err)
                    error.innerHTML = "login errato"
                    password.value = ""
                })
            }
        })   
    }
    //nome utente o password non inseriti
    else{
        error.innerHTML = "login errato"
    }
    
}