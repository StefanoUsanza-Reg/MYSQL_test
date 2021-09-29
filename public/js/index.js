const btnRicerca = document.getElementById('ricerca')
const tabella = document.getElementById("tabella")
const tabella1= document.createElement("tbody")
let visualizzaData =""

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
function visualizza(results){
    visualizzaData = ""
    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)

    visualizzaData += "<tr style='background-color: green; color: white'> <td>" + results[0].nome + "</td> <td>" + results[0].prezzo  + 
    "€</td> <td>"+ results[0].prezzo_scontato +"€</td> <td>"+ results[0].spedizione + " giorni</td> <td> <a href='#' class='btn btn-primary'><i class='fas fa-check'></i></a> </td></tr>"      

    for(let i=1; i<results.length; i++){
        visualizzaData += "<tr> <td>" + results[i].nome + "</td> <td>" + results[i].prezzo  + 
        "€</td> <td>"+ results[i].prezzo_scontato +"€</td> <td>"+ results[i].spedizione + " giorni</td> <td> <a href='#' class='btn btn-primary'><i class='fas fa-check'></i></a> </td></tr>"      
    }

    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    visualizzaData = ""

}

btnRicerca.onclick = ()=>{
    const nome_prodotto = document.getElementById('input').value
    const quant = document.getElementById('quant').value
    const priority = document.getElementById('priority').value
    const data = new Date().toJSON().slice(0, 10)
    if(nome_prodotto!="" && quant!="" && priority!=""){
    //ricerca dei rivenditori per il restock del prodotto richiesto
    fetch('http://localhost:3000/restock/'+nome_prodotto+'/'+quant + '/'+data + '/'+priority)
    .then(response => response.json())
    .then(result => {
        //trovati dei rivenditori che possono soddisfare la richiesta
        if(result[0]!=null){
            visualizza(result)
        }
        //nessun rivenditore può soddisfare la richiesta
        else
            console.log("nessun rivenditore trovato")   
        });
    }
}
//richiesta al server dei nomi dei prodotti
fetch('http://localhost:3000/restock/nomi_prodotti')
.then(response => response.json())
.then(result => {
    search(result)
})