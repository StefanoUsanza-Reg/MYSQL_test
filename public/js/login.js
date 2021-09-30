const btnLogin = document.getElementById("login")
const name = document.getElementById("name")
const password = document.getElementById("password")
const error = document.getElementById("error")

btnLogin.onclick = ()=>{
    if(name.value!="" && password.value!=""){
        //controllo della password
        fetch('http://localhost:3000/users/'+ name.value +'/'+ password.value)
        .then(response => response.json())
        .then(data => {
            //password corretta
            if(data){
                sessionStorage.setItem("user", name.value)
                window.location.replace("http://localhost:5500/public/index.html");
            }
            //password errata    
            else{
                error.innerHTML = "login errato"
                name.value = ""
                password.value = ""
            }
        })    
    }
    //nome utente o password non inseriti
    else{
        error.innerHTML = "login errato"
        name.value = ""
        password.value = ""
    }
    
}