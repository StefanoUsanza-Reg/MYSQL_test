const btnRicerca = document.getElementById('ricerca')
const tabella = document.getElementById("tabella")
const tabella1= document.createElement("tbody")
const nomeProdotto = document.getElementById('nome_prodotto')
let prodotto = document.createElement('option')
let visualizzaData =""

//inserimento dei dati estratti dal database nei campi di selezione
function inserisciNomi(){
fetch('http://localhost:3000/restock/nomi_prodotti')
.then(response => response.json())
.then(result => {
      for (let i=0; i<result.length; i++){
        prodotto.innerHTML= result[i].nomeProdotto
        nomeProdotto.appendChild(prodotto)
        prodotto = document.createElement('option')
    }
})    
}
//calcola lo sconto di un numero in base ad una percentuale
function sconto(numero,percentuale){
    return numero - (numero * percentuale)/100
}
//individua il riveditore più economico
function restock(result,quant,data){
    temp = []
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
    temp[0]= prezzo_scontato
    //visualizza(result,prezzo_scontato,0)
    //console.log("il rivenditore "+ rivenditore +" può accettare la richiesta con un prezzo finale di: "+ prezzo_scontato+"€ , spedizione minima: " + spedizione + " giorni")
    var tempScontato
    var tempSpedizione
    for(let i=1; i<result.length;i++){
        //sconto extra valido
        if(result[i].data_inizio<=data && result[i].data_fine>=data){
            tempScontato = sconto(sconto(result[i].prezzo*quant,result[i].valore),result[i].valore_extra)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            temp[i]=tempScontato
            //visualizza(result,tempScontato,i)
            //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempScontato<prezzo_scontato){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
                prezzo = result[i].prezzo
            }
            else if(tempScontato==prezzo_scontato){
                if(tempSpedizione<spedizione){
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione
                    prezzo = result[i].prezzo 
                }
            }                     
        }           
        //sconto extra non valido
        else{
            tempScontato = sconto(result[i].prezzo*quant,result[i].valore)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            temp[i]=tempScontato
            //visualizza(result,tempScontato,i)
            //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempScontato<prezzo_scontato){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
                prezzo = result[i].prezzo
            }
            else if(tempScontato==prezzo_scontato){
                if(tempSpedizione<spedizione){
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione 
                    prezzo = result[i].prezzo
                }
            }                    
        }           
    }
    //evidenzia il rivenditore più conveniente
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //var migliore = "il rivenditore " + rivenditore + " è il più conveniente con un prezzo finale di: "+ prezzo_scontato + "€, spedizione minima: " + spedizione + " giorni"
    visualizza(result,temp,rivenditore,prezzo_scontato,spedizione,prezzo)
}
//individua il rivenditore più veloce
function fastRestock(result,quant,data){
    temp = []
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
            }
            else if(tempSpedizione==spedizione){
                if(tempScontato<prezzo_scontato){
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    prezzo = result[i].prezzo
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
            }
            else if(tempSpedizione==spedizione){
                if(tempScontato<prezzo_scontato){
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    prezzo = result[i].prezzo
                }
            }                    
        }           
    }
    //evidenzia il rivenditore più conveniente
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //var migliore = "il rivenditore " + rivenditore + " è il più veloce consegnando in: "+ spedizione+" giorni, con un prezzo finale di: "+ prezzo_scontato + "€"
    visualizza(result,temp,rivenditore,prezzo_scontato,spedizione,prezzo)
    //return migliore
}
//inserisce i dati in una tabella
function visualizza(result,temp,rivenditore,prezzo_scontato,spedizione,prezzo){
    visualizzaData = ""
    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    visualizzaData +=  "<tr style='background-color: green'> <td>" + rivenditore + "</td> <td>" + prezzo + 
    "€</td> <td>"+ prezzo_scontato +"€</td> <td>"+ spedizione + " giorni</td></tr>"

    for(let i=0; i<result.length; i++){
        visualizzaData += "<tr> <td>" + result[i].nomeRivenditore + "</td> <td>" + result[i].prezzo  + 
        "€</td> <td>"+ temp[i] +"€</td> <td>"+ result[i].spedizione_min + " giorni</td></tr>"    
    }


    tabella1.innerHTML = visualizzaData
    tabella.appendChild(tabella1)
    visualizzaData = ""

}


btnRicerca.onclick = ()=>{
    const nome_prodotto = document.getElementById('nome_prodotto').value
    const quant = document.getElementById('quant').value
    const priority = document.getElementById('priority').value
    const data = new Date(Date.now())

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
inserisciNomi()