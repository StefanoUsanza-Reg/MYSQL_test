const multisort = require("multisort")

module.exports = {
    //funzione sconto definitiva
    Sconto: function(numero,percentuale){
        return numero - (numero * percentuale)/100
    },
    importo_minimo: function (result, quant) {
        if (result[2].importo_minimo <= (result[2].prezzo * quant))
            return "valid"
        else
            return "invalid"
    },
    quant: function (result, quant) {
        if (quant >= result[1].quantità_min)
            return "valid"
        else
            return "invalid"
    },
    data: function (result, data) {
        if (data >= result[3].data_inizio && data <= result[3].data_fine)
            return "valid"
        else
            return "invalid"
    },
    restock: function (result, quant, data) {

        function sconto(numero, percentuale) {
            return numero - (numero * percentuale) / 100
        }
        //controllo validità sconti
        for (let i = 0; i < result.length; i++) {
            if (result[i].quantità_min > quant || result[i].importo_minimo > (result[i].prezzo * quant))
                result[i].valore = 0
        }
        //applicazione sconti
        var prezzo_scontato = sconto(sconto(result[0].prezzo * quant, result[0].valore), result[0].valore_extra)
        var rivenditore = result[0].nomeRivenditore
        var spedizione = result[0].spedizione_min
        //console.log("il rivenditore "+ rivenditore +" può accettare la richiesta con un prezzo finale di: "+ prezzo_scontato+"€ , spedizione minima: " + spedizione + " giorni")
        var tempScontato
        var tempSpedizione
        for (let i = 1; i < result.length; i++) {
            //sconto extra valido
            // console.log(data)
            if (result[i].data_inizio <= data && result[i].data_fine >= data) {
                tempScontato = sconto(sconto(result[i].prezzo * quant, result[i].valore), result[i].valore_extra)
                tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
                tempSpedizione = result[i].spedizione_min
                //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
                if (tempScontato < prezzo_scontato) {
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione
                }
            }
            //sconto extra non valido
            else {
                tempScontato = sconto(result[i].prezzo * quant, result[i].valore)
                tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
                tempSpedizione = result[i].spedizione_min
                //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
                if (tempScontato < prezzo_scontato) {
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione
                }
            }
        }
        //evidenzia il rivenditore più conveniente
        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        var migliore = "il rivenditore " + rivenditore + " è il più conveniente con un prezzo finale di: " + prezzo_scontato + "€, spedizione minima: " + spedizione + " giorni"
        //console.log(migliore)
        return migliore
    },
    fastRestock: function (result, quant, data) {

        function sconto(numero, percentuale) {
            return numero - (numero * percentuale) / 100
        }
        //controllo validità sconti
        for (let i = 0; i < result.length; i++) {
            if (result[i].quantità_min > quant || result[i].importo_minimo > (result[i].prezzo * quant))
                result[i].valore = 0
        }
        //applicazione sconti
        var prezzo_scontato = sconto(sconto(result[0].prezzo * quant, result[0].valore), result[0].valore_extra)
        var rivenditore = result[0].nomeRivenditore
        var spedizione = result[0].spedizione_min
        //console.log("il rivenditore "+ rivenditore +" può accettare la richiesta con un prezzo finale di: "+ prezzo_scontato+"€ , spedizione minima: " + spedizione + " giorni")
        var tempScontato
        var tempSpedizione
        for (let i = 1; i < result.length; i++) {
            //sconto extra valido
            if (result[i].data_inizio <= data && result[i].data_fine >= data) {
                tempScontato = sconto(sconto(result[i].prezzo * quant, result[i].valore), result[i].valore_extra)
                tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
                tempSpedizione = result[i].spedizione_min
                //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
                if (tempSpedizione < spedizione) {
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione
                }
                else if (tempSpedizione == spedizione) {
                    if (tempScontato < prezzo_scontato) {
                        prezzo_scontato = tempScontato
                        rivenditore = result[i].nomeRivenditore
                    }
                }
            }
            //sconto extra non valido
            else {
                tempScontato = sconto(result[i].prezzo * quant, result[i].valore)
                tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
                tempSpedizione = result[i].spedizione_min
                //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
                if (tempSpedizione < spedizione) {
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione
                }
                else if (tempSpedizione == spedizione) {
                    if (tempScontato < prezzo_scontato) {
                        prezzo_scontato = tempScontato
                        rivenditore = result[i].nomeRivenditore
                    }
                }
            }
        }
        //evidenzia il rivenditore più conveniente
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        var migliore = "il rivenditore " + rivenditore + " è il più veloce consegnando in: " + spedizione + " giorni, con un prezzo finale di: " + prezzo_scontato + "€"
        //console.log(migliore)
        return migliore
    },
    finalRestock: function (result, quant, data) {

        function sconto(numero, percentuale) {
            return numero - (numero * percentuale) / 100
        }
        //controllo validità sconti
        for (let i = 0; i < result.length; i++) {
            if (result[i].quantità_min > quant || result[i].importo_minimo > (result[i].prezzo * quant))
                result[i].valore = 0
        }
        //applicazione sconti
        var prezzo_scontato = sconto(sconto(result[0].prezzo * quant, result[0].valore), result[0].valore_extra)
        var rivenditore = result[0].nomeRivenditore
        var spedizione = result[0].spedizione_min
        //console.log("il rivenditore "+ rivenditore +" può accettare la richiesta con un prezzo finale di: "+ prezzo_scontato+"€ , spedizione minima: " + spedizione + " giorni")
        var tempScontato
        var tempSpedizione
        for (let i = 1; i < result.length; i++) {
            //sconto extra valido
            if (result[i].data_inizio <= data && result[i].data_fine >= data) {
                tempScontato = sconto(sconto(result[i].prezzo * quant, result[i].valore), result[i].valore_extra)
                tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
                tempSpedizione = result[i].spedizione_min
                //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
                if (tempScontato < prezzo_scontato) {
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione
                }
                else if (tempScontato == prezzo_scontato) {
                    if (tempSpedizione < spedizione) {
                        rivenditore = result[i].nomeRivenditore
                        spedizione = tempSpedizione
                    }
                }
            }
            //sconto extra non valido
            else {
                tempScontato = sconto(result[i].prezzo * quant, result[i].valore)
                tempScontato = Math.round((tempScontato + Number.EPSILON) * 100) / 100;
                tempSpedizione = result[i].spedizione_min
                //console.log("il rivenditore " + result[i].nomeRivenditore + " può accettare la richiesta con un prezzo finale di: "+ tempScontato + "€, spedizione minima: " + tempSpedizione + " giorni")
                if (tempScontato < prezzo_scontato) {
                    prezzo_scontato = tempScontato
                    rivenditore = result[i].nomeRivenditore
                    spedizione = tempSpedizione
                }
                else if (tempScontato == prezzo_scontato) {
                    if (tempSpedizione < spedizione) {
                        rivenditore = result[i].nomeRivenditore
                        spedizione = tempSpedizione
                    }
                }
            }
        }
        //evidenzia il rivenditore più conveniente
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        var migliore = "il rivenditore " + rivenditore + " è il più conveniente con un prezzo finale di: " + prezzo_scontato + "€, spedizione minima: " + spedizione + " giorni"
        //console.log(migliore)
        return migliore
    },
    vuoto: function (result) {
        if (result[0] == null)
            return "vuoto"
    },
    visualizza: function () {
        const result = 250
        const nome = "r2"
        var trovato = false
        var a = []
        a[0] = ["r1", 100]
        a.push(["r2", 200], ["r3", 160])
        //console.log(a)
        //ricerca nell'array bidimensionale
        for (let i = 0; i < a.length; i++) {
            //corrispondenza trovata
            if (a[i][0] == nome) {
                trovato = true
                //controllo prezzo minore
                if (result < a[i][1]) {
                    //console.log("old: "+a[i][1])
                    a[i][1] = result
                    //console.log("new: "+a[i][1]) 
                }
            }
        }
        if (trovato == false)
            a.push([nome, result])
        //console.log(a)
        if (a[1][1] == 200)
            return true
        else
            return false
    },
    sortMultiplo: function (results) {
        var criteria = [
            'prezzo',
            'sped'
        ];
        multisort(results, criteria)
        //console.log(results)
        return results
    },
    ultimateRestock: function (result, quant, data, priority) {
        function sconto(numero, percentuale) {
            return numero - (numero * percentuale) / 100
        }

        let results = []
        //controllo validità sconti
        for (let i = 0; i < result.length; i++) {
            if (result[i].quantità_min > quant || result[i].importo_minimo > (result[i].prezzo * quant))
                result[i].valore = 0
        }

        //applicazione sconti
        var nome
        var prezzo
        var prezzo_scontato
        var spedizione

        for (let i = 0; i < result.length; i++) {
            //sconto extra valido
            if (result[i].data_inizio <= data && result[i].data_fine >= data) {
                nome = result[i].nomeRivenditore
                prezzo = result[i].prezzo
                prezzo_scontato = sconto(sconto(result[i].prezzo * quant, result[i].valore), result[i].valore_extra)
                prezzo_scontato = Math.round((prezzo_scontato + Number.EPSILON) * 100) / 100;
                spedizione = result[i].spedizione_min
            }
            //sconto extra non valido
            else {
                nome = result[i].nomeRivenditore
                prezzo = result[i].prezzo
                prezzo_scontato = sconto(result[i].prezzo * quant, result[i].valore)
                prezzo_scontato = Math.round((prezzo_scontato + Number.EPSILON) * 100) / 100;
                spedizione = result[i].spedizione_min
            }
            var trovato = false
            //ricerca nomi rivenditori già usati
            for (let j = 0; j < results.length; j++) {
                //rivenditore già presente
                if (results[j].nome == nome) {
                    trovato = true
                    if (results[j].prezzo_scontato > prezzo_scontato) {
                        results[j].prezzo_scontato = prezzo_scontato
                    }
                }
            }
            //nuovo rivenditore
            if (trovato == false) {
                results.push({ nome: nome, prezzo: prezzo, prezzo_scontato: prezzo_scontato, spedizione: spedizione })
            }

        }
        //sort & return
        if (priority == "Economic") {
            var criteria = [
                'prezzo_scontato',
                'spedizione'
            ];
        }
        else if (priority == "Fast") {
            var criteria = [
                'spedizione',
                'prezzo_scontato'
            ];
        }

        multisort(results, criteria)
        if (priority == "Economic")
            var migliore = "il rivenditore " + results[0].nome + " è il più conveniente con un prezzo finale di: " + results[0].prezzo_scontato + "€, spedizione minima: " + results[0].spedizione + " giorni"
        else if (priority == "Fast")
            var migliore = "il rivenditore " + results[0].nome + " è il più veloce con una spedizione minima: " + results[0].spedizione + " giorni, prezzo finale di: " + results[0].prezzo_scontato + "€"
        return migliore
    },
    //funzione restock definitiva
    Restock: function(result, quant, data, priority){
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
        var prezzoFix = result[0].prezzoFix
    
        for (let i=0; i<result.length; i++){
            //sconto extra valido
            if(result[i].data_inizio<=data && result[i].data_fine>=data){
                nome = result[i].nomeRivenditore
                prezzo = result[i].prezzo
                prezzo_scontato = this.Sconto(this.Sconto(result[i].prezzo*quant,result[i].valore),result[i].valore_extra)
                prezzo_scontato = Math.round((prezzo_scontato + Number.EPSILON) * 100) / 100;
                spedizione = result[i].spedizione_min
            }
            //sconto extra non valido
            else{
                nome = result[i].nomeRivenditore
                prezzo = result[i].prezzo
                prezzo_scontato = this.Sconto(result[i].prezzo*quant,result[i].valore)
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
                results.push({nome: nome,prezzo: prezzo,prezzo_scontato: prezzo_scontato,spedizione: spedizione,prezzoFix: prezzoFix})
            }
            
        }
        //sort & return
        if(priority=="Economic"){
            var criteria = [
            'prezzo_scontato',
            'spedizione'
          ];    
        }
        else if(priority=="Fast"){
            var criteria = [
                'spedizione',
                'prezzo_scontato'
              ];    
        }
    
          multisort(results,criteria)
          return results

    }
}