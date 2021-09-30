const assert = require('chai').assert
const expect = require('chai').expect
const app = require('../script')

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "restock"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("connected to the database!")
})
let QUERY = "SELECT prodotto.nome as nomeProdotto, rivende.prezzo, rivende.quantità, rivenditore.nome as nomeRivenditore, rivenditore.spedizione_min, " +
    "sconto.valore, sconto_extra.valore as valore_extra, sconto.importo_minimo, sconto.quantità_min, sconto_extra.data_inizio, sconto_extra.data_fine " +
    "FROM prodotto, rivende, rivenditore, sconto, sconto_extra " +
    "WHERE id_prodotto=prodotto.id " +
    "and id_rivenditore=rivenditore.id " +
    "and id_sconto = sconto.id " +
    "and id_sconto_extra = sconto_extra.id " +
    "and prodotto.nome='"

/*
    As a store owner
    I want controllare la validità degli sconti offerti dai rivenditori
    so that posso scegliere il rivenditore più conveniente

    given una richiesta di acquisto di 12X monitor
    when r1 ha 8pcs a 120$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, spedizione min 5 giorni
    and r2 ha 15pcs a 128$, e offre uno sconto del 3% con ordini con >5pcs, o del 5% con >10pcs, spedizione min 7 giorni
    and r3 ha 23pcs a 129$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, sconto extra del 2% se ordinato a settembre, spedizione min 4 giorni
    than r3 ha accesso allo sconto del 5%
*/

describe('test', function () {
    it('sconto should return 1459.20', function () {
        //input
        let nome_prodotto = 'Philips monitor 17”'
        let quant = 12

        con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
            if (err) throw err;
            assert.equal(app.sconto(result, quant), 1489.92);
        });
    })
    it('sconto extra should return 1441.19', function () {
        //input
        let nome_prodotto = 'Philips monitor 17”'
        let quant = 12

        con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
            if (err) throw err;
            assert.equal(app.sconto_extra(result, quant), 1441.19);
        });
    })
    it('migliore should return 1459.20', function () {
        //input
        let nome_prodotto = "Philips monitor 17”"
        let quant = 12

        con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
            if (err) throw err;
            assert.equal(app.migliore(result, quant), 1459.20);
        });

    })
    describe('controlli sconti', function () {
        /*
            As a store owner
            I want controllare la validità degli sconti offerti dai rivenditori
            so that posso scegliere il rivenditore più conveniente

            given una richiesta di acquisto di 12X monitor
            when r3 ha 23pcs a 129$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, sconto extra del 2% se ordinato a settembre, spedizione min 4 giorni
            than lo sconto del 5% con importo_min>=1000$ offerto da r3 è valido per questa richiesta d'acquisto
        */
        it('importo_minimo should return valido', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12

            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.importo_minimo(result, quant), "valido");
            });
        })
        /*
            As a store owner
            I want controllare la validità degli sconti offerti dai rivenditori
            so that posso scegliere il rivenditore più conveniente

            given una richiesta di acquisto di 6X monitor
            when r2 ha 15pcs a 128$, e offre uno sconto del 3% con ordini con >5pcs, o del 5% con >10pcs, spedizione min 7 giorni
            than lo sconto del 3% con >5pcs offerto da r2 è valido per questa richiesta d'acquisto
        */
        it('quant should return valido', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 6
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.quant(result, quant), "valido");
            });
        })

        /*
            As a store owner
            I want controllare la validità degli sconti offerti dai rivenditori
            so that posso scegliere il rivenditore più conveniente

            given una richiesta di acquisto di 6X monitor fatta il 23 settembre
            when r3 ha 23pcs a 129$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, sconto extra del 2% se ordinato a settembre, spedizione min 4 giorni
            than lo sconto extra del 2% ordinato a settembre offerto da r3 è valido per questa richiesta d'acquisto
        */
        it('data should return true', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 6
            let data = new Date('2021-09-23')
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.data(result, data), "valido");
            });
        })

    })
    describe('restock', function () {
        /*
            As a store owner
            I want controllare i prezzi proposti dai rivenditori scontati
            so that posso scegliere quello più conveniente

            given una richiesta di acquisto di 12X monitor fatta il 24 settembre
            when r1 ha 8pcs a 120$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, spedizione min 5 giorni
            and r2 ha 15pcs a 128$, e offre uno sconto del 3% con ordini con >5pcs, o del 5% con >10pcs, spedizione min 7 giorni
            and r3 ha 23pcs a 129$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, sconto extra del 2% se ordinato a settembre, spedizione min 4 giorni
            than il rivenditore più conveniente dovrebbe essere r3 con un prezzo finale di: 1441.19€
        */
        it('restock should return il rivenditore r3 è il più conveniente con un prezzo finale di: 1441.19€', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12
            let data = new Date("2021-09-24")
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.restock(result, quant, data), "il rivenditore rivenditore3 è il più conveniente con un prezzo finale di: 1441.19€, spedizione minima: 4 giorni");
            });
        })

        /*
            As a store owner
            I want controllare i prezzi proposti dai rivenditori scontati
            so that posso scegliere quello più conveniente

            given una richiesta di acquisto di 12X monitor fatta il 3 novembre
            when r1 ha 8pcs a 120$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, spedizione min 5 giorni
            and r2 ha 15pcs a 128$, e offre uno sconto del 3% con ordini con >5pcs, o del 5% con >10pcs, spedizione min 7 giorni
            and r3 ha 23pcs a 129$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, sconto extra del 2% se ordinato a settembre, spedizione min 4 giorni
            than il rivenditore più conveniente dovrebbe essere r2 con un prezzo finale di: 1459.20€
        */
        it('restock2 should return il rivenditore r2 è il più conveniente con un prezzo finale di: 1459.2€', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12
            let data = new Date("2021-11-3")
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.restock(result, quant, data), "il rivenditore rivenditore2 è il più conveniente con un prezzo finale di: 1459.2€, spedizione minima: 7 giorni");
            });
        })
        /*
            As a store owner
            I want controllare i tempi di consegna offerti dai rivenditori
            so that posso scegliere quello più veloce

            given una richiesta di acquisto di 5X sedie fatta il 24 settembre
            when r1 ha 10pcs a 110$, e offre uno sconto del 5% con ordini con importo_min>= 1000$, spedizione min 5 giorni
            and r2 ha 8pcs a 100$, e offre uno sconto del 3% con ordini con >5pcs, o del 5% con >10pcs, spedizione min 7 giorni
            and r3 ha 15pcs a 120$, e offre uno sconto del 5% con ordini con importo_min>= 1000$,2% con >5pcs sconto extra del 2% se ordinato a settembre, spedizione min 4 giorni
            than il rivenditore più veloce dovrebbe essere r3 con 4 giorni e con un prezzo finale di: 576.24€
        */
        it('fastRestock should return il rivenditore r3 è il più veloce consegnando in: 4 giorni, con un prezzo finale di: 576.24€', function () {
            //input
            let nome_prodotto = "sedia da ufficio"
            let quant = 5
            let data = new Date("2021-09-24")
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.fastRestock(result, quant, data), "il rivenditore rivenditore3 è il più veloce consegnando in: 4 giorni, con un prezzo finale di: 576.24€");
            });
        })
        /*
            As a store owner
            I want controllare i prezzi proposti dai rivenditori e i tempi di spedizione
            so that posso scegliere quello più conveniente e in caso di parità quello più veloce

            given una richiesta di acquisto di 5X tastiere
            when r1 ha 20pcs a 50$, spedizione min 5 giorni
            and r2 ha 30pcs a 55$, spedizione min 7 giorni
            and r3 ha 25pcs a 50$, spedizione min 4 giorni
            than il rivenditore più conveniente dovrebbe essere r3 con un prezzo finale di: 50€, spedizione minima: 4 giorni
        */
        it('finalRestock should return il rivenditore r3 è il più conveniente con un prezzo finale di: 50€, spedizione minima: 4 giorni', function () {
            //input
            let nome_prodotto = "tastiera meccanica"
            let quant = 5
            let data = new Date("2021-09-24")
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.finalRestock(result, quant, data), "il rivenditore rivenditore3 è il più conveniente con un prezzo finale di: 250€, spedizione minima: 4 giorni");
            });
        })
        it('ultimateRestock should return il rivenditore rivenditore3 è il più conveniente con un prezzo finale di: 1441.19€, spedizione minima: 4 giorni', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12
            let data = new Date()
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il rivenditore rivenditore3 è il più conveniente con un prezzo finale di: 1441.19€, spedizione minima: 4 giorni");
            });
        })
        it('ultimateRestock2 should return il rivenditore rivenditore2 è il più conveniente con un prezzo finale di: 1459.2€, spedizione minima: 7 giorni', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12
            let data = new Date('2021-10-20')
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il rivenditore rivenditore2 è il più conveniente con un prezzo finale di: 1459.2€, spedizione minima: 7 giorni");
            });
        })
        it('ultimateRestock3 should return il rivenditore rivenditore3 è il più veloce con una spedizione minima: 4 giorni, prezzo finale di: 576.24€', function () {
            //input
            let nome_prodotto = "sedia da ufficio"
            let quant = 5
            let data = new Date()
            let priority = "Fast"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il rivenditore rivenditore3 è il più veloce con una spedizione minima: 4 giorni, prezzo finale di: 576.24€");
            });
        })
        it('ultimateRestock4 should return il rivenditore rivenditore2 è il più conveniente con un prezzo finale di: 485€, spedizione minima: 7 giorni', function () {
            //input
            let nome_prodotto = "sedia da ufficio"
            let quant = 5
            let data = new Date()
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il rivenditore rivenditore2 è il più conveniente con un prezzo finale di: 485€, spedizione minima: 7 giorni");
            });
        })
        it('ultimateRestock5 should return il rivenditore rivenditore3 è il più conveniente con un prezzo finale di: 400€, spedizione minima: 4 giorni', function () {
            //input
            let nome_prodotto = "tastiera meccanica"
            let quant = 8
            let data = new Date()
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il rivenditore rivenditore3 è il più conveniente con un prezzo finale di: 400€, spedizione minima: 4 giorni");
            });
        })
    })
    describe('result vuoto', function () {
        it('vuoto should return vuoto', function () {
            //input
            let nome_prodotto = "tastiera meccanica"
            let quant = 50
            let data = new Date("2021-09-24")
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.vuoto(result), "vuoto");
            });
        })
    })
    describe('save data', function () {
        it('visualizza should return', function () {
            assert.equal(app.visualizza(), true);

        })
        it('sort', function () {
            //input
            results = []
            exp = []
            exp.push({ nome: 'r3', prezzo: 100, sped: 4 }, { nome: 'r1', prezzo: 100, sped: 5 }, { nome: 'r2', prezzo: 150, sped: 7 })
            results.push({ nome: 'r1', prezzo: 100, sped: 5 }, { nome: 'r2', prezzo: 150, sped: 7 }, { nome: 'r3', prezzo: 100, sped: 4 })
            console.log(results)
            assert.deepEqual(app.sortMultiplo(results), exp);
            //chiudi la connessione al database dopo l'ultimo test
            con.end()
        })
    })
})
