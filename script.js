module.exports = {
    sconto: function(result,quant){
        function Sconto(numero,percentuale){
            console.log("prezzo di: "+ numero)
            console.log("sconto di: "+ (numero * percentuale)/100)
             return numero - (numero * percentuale)/100
        }
        return Sconto(result[0].prezzo*quant,result[0].valore)
    },
    sconto_extra: function(result,quant){
        function Sconto(numero,percentuale){
            console.log("prezzo di: "+ numero)
            console.log("sconto di: "+ (numero * percentuale)/100)
             return numero - (numero * percentuale)/100
        }
        function scontoExtra(numero,percentuale){
            console.log("sconto extra di: "+ (numero * percentuale)/100)
            return numero - (numero * percentuale)/100
        }
        var numb= scontoExtra(Sconto(result[2].prezzo*quant,result[2].valore),result[2].valore_extra)
        var rounded = Math.round((numb + Number.EPSILON) * 100) / 100;
        console.log("prezzo finale: "+ rounded)
        return rounded
    },
    migliore: function(result,quant){
        function Sconto(numero,percentuale){
            //console.log("prezzo di: "+ numero)
            //console.log("sconto di: "+ (numero * percentuale)/100)
             return numero - (numero * percentuale)/100
        }
        temp = Sconto(result[0].prezzo*quant,result[0].valore)
        //console.log(Sconto(result[0].prezzo*quant,result[0].valore))
        for(let i=1; i<result.length; i++){
            //console.log(Sconto(result[i].prezzo*quant,result[i].valore))
            if(Sconto(result[i].prezzo*quant,result[i].valore)<temp){
                temp = Sconto(result[i].prezzo*quant,result[i].valore)
            }
        }
        return temp 
    },
    importo_minimo: function(result,quant){
        console.log("importo minimo: "+result[2].importo_minimo)
        console.log("importo: "+result[2].prezzo*quant)
        if(result[2].importo_minimo<=(result[2].prezzo*quant))
            return "valido"
        else
            return "non valido"
    },
    quant: function(result, quant){
        console.log("quant min: "+ result[1].quantità_min)
        console.log("quant richiesta: "+ quant)
        if(quant>=result[1].quantità_min)
            return "valido"
        else
            return "non valido"
    },
    data: function(result,data){
        console.log("data ordinazine: "+ data)
        console.log("data inizio sconto: "+ result[3].data_inizio)
        console.log("data fine sconto: "+ result[3].data_fine)
        if(data>=result[3].data_inizio && data<=result[3].data_fine)
            return "valido"
        else
            return "non  valido"
    },
    restock: function(result,quant,data){

        function sconto(numero,percentuale){
            return numero - (numero * percentuale)/100
        }
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
            }           
        }
        //evidenzia il rivenditore più conveniente
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        var migliore = "il rivenditore " + rivenditore + " è il più conveniente con un prezzo finale di: "+ prezzo_scontato + "€, spedizione minima: " + spedizione + " giorni"
        console.log(migliore)
        return migliore
    },
    fastRestock: function(result,quant,data){

        function sconto(numero,percentuale){
            return numero - (numero * percentuale)/100
        }
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
        console.log(migliore)
        return migliore
    }
}