const API_key = 'qP7h9NOAlOsQSGo4H9OyuZHnxMesBe'
const btnRicerca = document.getElementById('ricerca')
const tabella = document.getElementById("tabella")
const tabella1= document.createElement("tbody")
const error = document.getElementById('error')
let visualizzaData =""
const user = document.getElementById('username')
const btnLogout = document.getElementById('logout')
btnLogout.onclick = ()=>{
    sessionStorage.clear()
  }
// controllo autenticazione
if(sessionStorage.getItem("user")==null){
    window.location.replace("http://localhost:5500/public/login.html");
  }
  user.innerHTML = "User: "+ sessionStorage.getItem("user") 

const btnHome = document.getElementById('home')
btnHome.onclick = ()=>{
window.location.replace("http://localhost:5500/public/index.html");
}  

//inserimento dei dati estratti dal database nei campi di selezione
function search(result){
    const prodotti= document.getElementById("prodotti")
    let prodotti1= document.createElement("option")
  
    for(let i=0; i<result.length; i++){
        prodotti1.innerHTML =result[i].nomeProdotto
        prodotti.appendChild(prodotti1)
        prodotti1= document.createElement("option")
    }
  
  }
//inserisce i dati restituiti dal server in una tabella
function visualizza(results,quant,nome_prodotto){
    visualizzaData = ""
    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    if(results==null){
        visualizzaData =""
    }
    else{
        visualizzaData += "<tr style='background-color: green; color: white'> <td>" + results[0].nome + "</td> <td>" + results[0].prezzo  + 
        "€</td> <td>"+ results[0].prezzo_scontato +"€</td> <td>"+ results[0].spedizione + " days</td> <td> <a href='ordina.html?nome="+results[0].nome +"&prezzoFix="+results[0].prezzoFix+"&prezzo_scontato="+results[0].prezzo_scontato+"&quant="+quant+"&prodotto="+nome_prodotto+"' class='btn btn-primary'><i class='fas fa-check'></i></a> </td></tr>"      

        for(let i=1; i<results.length; i++){
            visualizzaData += "<tr> <td>" + results[i].nome + "</td> <td>" + results[i].prezzo  + 
            "€</td> <td>"+ results[i].prezzo_scontato +"€</td> <td>"+ results[i].spedizione + " days</td> <td> <a href='ordina.html?nome="+results[i].nome +"&prezzoFix="+results[i].prezzoFix+"&prezzo_scontato="+results[i].prezzo_scontato+"&quant="+quant+"&prodotto="+nome_prodotto+"' class='btn btn-primary'><i class='fas fa-check'></i></a> </td></tr>"      
        }        
    }

    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    visualizzaData = ""

}

btnRicerca.onclick = ()=>{
    const nome_prodotto = document.getElementById('input').value
    const quant = document.getElementById('quant').value
    const priority = document.getElementById('priority').value
    error.innerHTML = ""
    if(nome_prodotto!="" && quant!="" && quant>0 && priority!="select a priority"){
    //ricerca dei rivenditori per il restock del prodotto richiesto
    fetch('http://localhost:3000/restock/'+nome_prodotto+'/'+quant + '/'+priority+'/'+API_key)
        .then(response => {
            if(response.status==200)
            response.json()
            .then(result=>{
                visualizza(result,quant,nome_prodotto)
            })
            else{
                if(response.status==404){
                    response.json()
                    .then(err => {
                        console.error(err)
                        error.innerHTML = "nessun rivenditore trovato"
                        visualizza(null,quant,nome_prodotto)
                    })
                }
                else{
                    response.json()
                    .then(err => {
                        console.error(err) 
                    })
                }
            }
        })
    }
    else if(quant=="" || quant<=0){
        error.innerHTML = "inserisci una quantità valida"
        visualizza(null,quant,nome_prodotto)
    }
    else{
        error.innerHTML = "inserisci i dati per la ricerca"
        visualizza(null,quant,nome_prodotto)
    }
}
//richiesta al server dei nomi dei prodotti
fetch('http://localhost:3000/restock/nomi_prodotti/'+API_key)
.then(response => {
    if(response.status==200){
        response.json().then(result => {
            search(result)    
        })
    }
    else{
        response.json().then(error => {
              console.error(error)
        })   
    }   
})
