const multisort = require("multisort")

module.exports = {
    //funzione sconto definitiva
    Sconto: function(numero,percentuale){
        return numero - (numero * percentuale)/100
    },
    //for Testing
    importo_minimo: function (result, quant) {
        if (result[2].importo_minimo <= (result[2].prezzo * quant))
            return "valid"
        else
            return "invalid"
    },
    //for Testing
    quant: function (result, quant) {
        if (quant >= result[1].quantità_min)
            return "valid"
        else
            return "invalid"
    },
    //for Testing
    data: function (result, data) {
        if (data >= result[3].data_inizio && data <= result[3].data_fine)
            return "valid"
        else
            return "invalid"
    },
    //for Testing
    vuoto: function (result) {
        if (result[0] == null)
            return "vuoto"
    },
    //funzione sortMultiplo definitiva
    sortMultiplo: function (results) {
        var criteria = [
            'prezzo',
            'sped'
        ];
        multisort(results, criteria)
        return results
    },
    //for Testing
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
            var migliore = "il fornitore " + results[0].nome + " è il più conveniente con un prezzo finale di: " + results[0].prezzo_scontato + "€, spedizione minima: " + results[0].spedizione + " giorni"
        else if (priority == "Fast")
            var migliore = "il fornitore " + results[0].nome + " è il più veloce con una spedizione minima: " + results[0].spedizione + " giorni, prezzo finale di: " + results[0].prezzo_scontato + "€"
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