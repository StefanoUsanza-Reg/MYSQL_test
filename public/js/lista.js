const API_key = 'qP7h9NOAlOsQSGo4H9OyuZHnxMesBe'
const tabella = document.getElementById("tabella")
const tabella1 = document.createElement("tbody")
const user = document.getElementById('username')
const btnLogout = document.getElementById('logout')
const btnPrevious = document.getElementById('previous')
const btnNext = document.getElementById('next')
const label = document.getElementById('label')
var index = 1

btnLogout.onclick = () => {
    sessionStorage.clear()
}
// controllo autenticazione
if (sessionStorage.getItem("user") == null) {
    window.location.replace("http://localhost:5500/public/login.html");
}
user.innerHTML = "User: " + sessionStorage.getItem("user")

function visualizza(results) {
    visualizzaData = ""
    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    if (results == null) {
        visualizzaData = ""
    }
    else {
        for (let i = (10*index)-10; i < 10*index; i++) {
            if(i<results.length){
                visualizzaData += "<tr> <td>" + results[i].prodotto + "</td> <td>" + results[i].quant +
                "</td> <td>" + results[i].supplier + "</td> <td>" + results[i].prezzoFix + "</td> <td>" + results[i].prezzoFinal + 
                "</td> <td>" + results[i].profit + "</td> <td>" + results[i]._id + "</td></tr>"   
            }
            else
            i = 10*index
        }
    }

    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    visualizzaData = ""

}



//richiedi lista di tutti gli ordini
fetch('https://server-express.glitch.me/order/'+API_key)
.then(response =>{
    if (response.status == 200) {
        response.json().then(result => {
            btnPrevious.onclick = ()=>{
                if(index>1)
                    index--
                    visualizza(result)
                label.innerHTML = index
            }
            
            btnNext.onclick = ()=>{
                if(((index+1)*10)-result.length<10)
                    index++
                visualizza(result)
                label.innerHTML = index
            }
            visualizza(result)
        })
    }
    else {
        response.json().then(error => {
            console.error(error)
        })
    }
})