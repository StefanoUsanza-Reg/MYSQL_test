const btnRicerca = document.getElementById('ricerca')

    function sconto(numero,percentuale){
        return numero - (numero * percentuale)/100
    }

function restock(result,quant,data){

    //controllo validità sconti
    for(let i=0; i<result.length; i++){
        if(result[i].quantità_min>quant || result[i].importo_minimo>(result[i].prezzo*quant))
            result[i].valore = 0
    }
    //applicazione sconti
    var prezzo_scontato = sconto(sconto(result[0].prezzo*quant,result[0].valore),result[0].valore_extra)
    var rivenditore = result[0].nomeRivenditore
    var spedizione = result[0].spedizione_min
    console.log("il rivenditore "+ rivenditore +" può accettare la richiesta con un prezzo finale di: "+ prezzo_scontato+"€ , spedizione minima: " + spedizione + " giorni")
    var tempScontato
    var tempSpedizione
    for(let i=1; i<result.length;i++){
        //sconto extra valido
        if(result[i].data_inizio<=data && result[i].data_fine>=data){
            tempScontato = sconto(sconto(result[i].prezzo*quant,result[i].valore),result[i].valore_extra)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempScontato<prezzo_scontato){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
            }
            else if(tempScontato==prezzo_scontato){
                if(tempSpedizione<spedizione){
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione 
                }
            }                     
        }           
        //sconto extra non valido
        else{
            tempScontato = sconto(result[i].prezzo*quant,result[i].valore)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempScontato<prezzo_scontato){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
            }
            else if(tempScontato==prezzo_scontato){
                if(tempSpedizione<spedizione){
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione 
                }
            }                    
        }           
    }
    //evidenzia il rivenditore più conveniente
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    var migliore = "il rivenditore " + rivenditore + " è il più conveniente con un prezzo finale di: "+ prezzo_scontato + "€, spedizione minima: " + spedizione + " giorni"
    return migliore
}

function fastRestock(result,quant,data){
    //controllo validità sconti
    for(let i=0; i<result.length; i++){
        if(result[i].quantità_min>quant || result[i].importo_minimo>(result[i].prezzo*quant))
            result[i].valore = 0
    }
    //applicazione sconti
    var prezzo_scontato = sconto(sconto(result[0].prezzo*quant,result[0].valore),result[0].valore_extra)
    var rivenditore = result[0].nomeRivenditore
    var spedizione = result[0].spedizione_min
    console.log("il rivenditore "+ rivenditore +" può accettare la richiesta con un prezzo finale di: "+ prezzo_scontato+"€ , spedizione minima: " + spedizione + " giorni")
    var tempScontato
    var tempSpedizione
    for(let i=1; i<result.length;i++){
        //sconto extra valido
        if(result[i].data_inizio<=data && result[i].data_fine>=data){
            tempScontato = sconto(sconto(result[i].prezzo*quant,result[i].valore),result[i].valore_extra)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempSpedizione<spedizione){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
            }
            else if(tempSpedizione==spedizione){
                if(tempScontato<prezzo_scontato){
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                }
            }                     
        }           
        //sconto extra non valido
        else{
            tempScontato = sconto(result[i].prezzo*quant,result[i].valore)
            tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
            tempSpedizione = result[i].spedizione_min
            console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
            if(tempSpedizione<spedizione){
                prezzo_scontato = tempScontato
                rivenditore = result[i].nomeRivenditore
                spedizione = tempSpedizione
            }
            else if(tempSpedizione==spedizione){
                if(tempScontato<prezzo_scontato){
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                }
            }                    
        }           
    }
    //evidenzia il rivenditore più conveniente
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    var migliore = "il rivenditore " + rivenditore + " è il più veloce consegnando in: "+ spedizione+" giorni, con un prezzo finale di: "+ prezzo_scontato + "€"
    return migliore
}

btnRicerca.onclick = ()=>{
    const nome_prodotto = document.getElementById('nome_prodotto').value
    const quant = document.getElementById('quant').value
    const priority = document.getElementById('priority').value
    const data = new Date(Date.now())

    //fetch("http://localhost:3000/restock/economic/"+nome_prodotto+"/"+quant).then(() => console.log("test"));

    //ricerca di tutti i clienti nel database
fetch('http://localhost:3000/restock/'+nome_prodotto+'/'+quant)
.then(response => response.json())
  .then(result => {
      if(result[0]!=null){
        if(priority=="Economic")
        console.log(restock(result,quant,data))
        else if(priority=='Fast')
        console.log(fastRestock(result,quant,data))    
      }
      else
        console.log("nessun rivenditore trovato")
      
    });



}
