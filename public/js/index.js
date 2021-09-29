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
//calcola lo sconto di un numero in base ad una percentuale
function sconto(numero,percentuale){
    return numero - (numero * percentuale)/100
}

//individua il riveditore più economico
function restock(result,quant,data){
    let results = []
    //controllo validità sconti
    for(let i=0; i<result.length; i++){
        if(result[i].quantità_min>quant || result[i].importo_minimo>(result[i].prezzo*quant))
            result[i].valore = 0
    }
    
    //applicazione sconti
    var nome
    var prezzo
    var prezzo_scontato
    var spedizione

    for (let i=0; i<result.length; i++){
        //sconto extra valido
        if(result[i].data_inizio<=data && result[i].data_fine>=data){
            nome = result[i].nomeRivenditore
            prezzo = result[i].prezzo
            prezzo_scontato = sconto(sconto(result[i].prezzo*quant,result[i].valore),result[i].valore_extra)
            prezzo_scontato = Math.round((prezzo_scontato + Number.EPSILON) * 100) / 100;
            spedizione = result[i].spedizione_min
        }
        //sconto extra non valido
        else{
            nome = result[i].nomeRivenditore
            prezzo = result[i].prezzo
            prezzo_scontato = sconto(result[i].prezzo*quant,result[i].valore)
            prezzo_scontato = Math.round((prezzo_scontato + Number.EPSILON) * 100) / 100;
            spedizione = result[i].spedizione_min
        }
        var trovato = false
        //ricerca nomi rivenditori già usati
        for(let j=0; j<results.length; j++){
            //rivenditore già presente
            if(results[j].nome==nome){
                trovato = true
                if(results[j].prezzo_scontato>prezzo_scontato){
                    results[j].prezzo_scontato=prezzo_scontato
                }
            }
        }
        //nuovo rivenditore
        if(trovato == false){
            results.push({nome: nome,prezzo: prezzo,prezzo_scontato: prezzo_scontato,spedizione: spedizione})
        }
        
    }
      fetch('http://localhost:3000/restockSort', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(results) 
    })
    .then(response => response.json())
    .then(results => {
        visualizza(results)
    })

}
//individua il rivenditore più veloce
function fastRestock(result,quant,data){
    let temp = []
    let index = 0
    //controllo validità sconti
    for(let i=0; i<result.length; i++){
        if(result[i].quantità_min>quant || result[i].importo_minimo>(result[i].prezzo*quant))
            result[i].valore = 0
    }
    //applicazione sconti
    var prezzo_scontato = sconto(sconto(result[0].prezzo*quant,result[0].valore),result[0].valore_extra)
    var rivenditore = result[0].nomeRivenditore
    var spedizione = result[0].spedizione_min
    var prezzo = result[0].prezzo
    temp[0] = prezzo_scontato
    //console.log("il rivenditore "+ rivenditore +" può accettare la richiesta con un prezzo finale di: "+ prezzo_scontato+"€ , spedizione minima: " + spedizione + " giorni")
    var tempScontato
    var tempSpedizione
    for(let i=1; i<result.length;i++){
        //sconto extra valido
        if(result[i].data_inizio<=data && result[i].data_fine>=data){
            tempScontato = sconto(sconto(result[i].prezzo*quant,result[i].valore),result[i].valore_extra)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            temp[i] = tempScontato
            //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempSpedizione<spedizione){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
                prezzo = result[i].prezzo
                index = i
            }
            else if(tempSpedizione==spedizione){
                if(tempScontato<prezzo_scontato){
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    prezzo = result[i].prezzo
                    index = i
                }
            }                     
        }           
        //sconto extra non valido
        else{
            tempScontato = sconto(result[i].prezzo*quant,result[i].valore)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            temp[i] = tempScontato
            //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempSpedizione<spedizione){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
                prezzo = result[i].prezzo
                index = i
            }
            else if(tempSpedizione==spedizione){
                if(tempScontato<prezzo_scontato){
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    prezzo = result[i].prezzo
                    index = i
                }
            }                    
        }           
    }
    //evidenzia il rivenditore più conveniente
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //var migliore = "il rivenditore " + rivenditore + " è il più veloce consegnando in: "+ spedizione+" giorni, con un prezzo finale di: "+ prezzo_scontato + "€"
    visualizza(result,temp,rivenditore,prezzo_scontato,spedizione,prezzo,index)
    //return migliore
}
//inserisce i dati in una tabella
function visualizza(results){
    visualizzaData = ""
    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    /* visualizzaData +=  "<tr style='background-color: green; color: white'> <td>" + rivenditore + "</td> <td>" + prezzo + 
    "€</td> <td>"+ prezzo_scontato +"€</td> <td>"+ spedizione + " giorni</td> <td> <a href='#' class='btn btn-primary'><i class='fas fa-check'></i></a> </td></tr>"
 */

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

    //ricerca dei rivenditori per il restock del prodotto richiesto
    fetch('http://localhost:3000/restock/'+nome_prodotto+'/'+quant)
    .then(response => response.json())
    .then(result => {
        //trovati dei rivenditori che possono soddisfare la richiesta
        if(result[0]!=null){
            //evidenzia il rivenditore più economico
            if(priority=="Economic"){
                restock(result,quant,data)
            }
            //evidenzia il rivenditore più veloce
            else if(priority=='Fast')
                fastRestock(result,quant,data)
        }
        //nessun rivenditore può soddisfare la richiesta
        else
            console.log("nessun rivenditore trovato")   
        });
}

fetch('http://localhost:3000/restock/nomi_prodotti')
.then(response => response.json())
.then(result => {
    search(result)
})