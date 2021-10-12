const assert = require('chai').assert
const expect = require('chai').expect
const app = require('../server/script')

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "restock"
});
con.connect(function (err) {
    if (err) throw err;
})
let QUERY = "SELECT prodotto.nome as nomeProdotto, rivende.prezzo, rivende.quantità, rivenditore.nome as nomeRivenditore, rivenditore.spedizione_min, " +
    "sconto.valore, sconto_extra.valore as valore_extra, sconto.importo_minimo, sconto.quantità_min, sconto_extra.data_inizio, sconto_extra.data_fine " +
    "FROM prodotto, rivende, rivenditore, sconto, sconto_extra " +
    "WHERE id_prodotto=prodotto.id " +
    "and id_rivenditore=rivenditore.id " +
    "and id_sconto = sconto.id " +
    "and id_sconto_extra = sconto_extra.id " +
    "and prodotto.nome='"

describe('test', function () {
    describe('result vuoto', function () {
        //? vuoto
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
    describe('sort array', function () {
        //? sort Multiplo
        it('sort should sort', function () {
            //input
            results = []
            exp = []
            exp.push({ nome: 'r3', prezzo: 100, sped: 4 }, { nome: 'r1', prezzo: 100, sped: 5 }, { nome: 'r2', prezzo: 150, sped: 7 })
            results.push({ nome: 'r1', prezzo: 100, sped: 5 }, { nome: 'r2', prezzo: 150, sped: 7 }, { nome: 'r3', prezzo: 100, sped: 4 })
            //console.log(results)
            assert.deepEqual(app.sortMultiplo(results), exp);
        })
    })
    describe('controlli sconti', function () {
        //? sconto
        it('sconto should return 1459.20', function () {
            //input
            let nome_prodotto = 'Philips monitor 17”'
            let quant = 12

            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                //supplier 2, sconto del 5%
                assert.equal(app.Sconto(result[0].prezzo * quant, result[0].valore), 1489.92);
            });
        })
        //? sconto extra
        it('sconto extra should return 1441.19', function () {
            //input
            let nome_prodotto = 'Philips monitor 17”'
            let quant = 12

            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                //supplier 3, sonto del 5% + sconto extra del 2%
                var prezzo_scontato = app.Sconto(app.Sconto(result[2].prezzo * quant, result[2].valore),result[2].valore_extra)
                assert.equal(Math.round((prezzo_scontato + Number.EPSILON) * 100) / 100, 1441.19)
            });
        })
       //? importo minimo
        it('importo_minimo should return valid', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12

            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                //supplier 3, importo minimo per sconto 1000€
                assert.equal(app.importo_minimo(result, quant), "valid");
            });
        })
       //? quant
        it('quant should return valid', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 6
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                //quant massima disponibile dal supplier 1 = 8
                assert.equal(app.quant(result, quant), "valid");
            });
        })
       //? data
        it('data should return valid', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 6
            let data = new Date('2021-09-23')
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                //periodo di validità sconto extra supplier 3, Settembre
                assert.equal(app.data(result, data), "valid");
            });
        })
    })
    describe('restock', function () {
        //? restock 1
        it('ultimateRestock1 should return il fornitore Supplier 3 è il più conveniente con un prezzo finale di: 1441.19€, spedizione minima: 4 giorni', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12
            let data = new Date('2021-09-24')
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il fornitore Supplier 3 è il più conveniente con un prezzo finale di: 1441.19€, spedizione minima: 4 giorni");
            });
        })
        //? restock 2
        it('ultimateRestock2 should return il fornitore Supplier 2 è il più conveniente con un prezzo finale di: 1459.2€, spedizione minima: 7 giorni', function () {
            //input
            let nome_prodotto = "Philips monitor 17”"
            let quant = 12
            let data = new Date('2021-10-20')
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il fornitore Supplier 2 è il più conveniente con un prezzo finale di: 1459.2€, spedizione minima: 7 giorni");
            });
        })
        //? restock 3
        it('ultimateRestock3 should return il fornitore Supplier 3 è il più veloce con una spedizione minima: 4 giorni, prezzo finale di: 576.24€', function () {
            //input
            let nome_prodotto = "sedia da ufficio"
            let quant = 5
            let data = new Date('2021-09-24')
            let priority = "Fast"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il fornitore Supplier 3 è il più veloce con una spedizione minima: 4 giorni, prezzo finale di: 576.24€");
            });
        })
        //? restock
        it('ultimateRestock4 should return il fornitore Supplier 2 è il più conveniente con un prezzo finale di: 485€, spedizione minima: 7 giorni', function () {
            //input
            let nome_prodotto = "sedia da ufficio"
            let quant = 5
            let data = new Date()
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il fornitore Supplier 2 è il più conveniente con un prezzo finale di: 485€, spedizione minima: 7 giorni");
            });
        })
        //? restock 5
        it('ultimateRestock5 should return il fornitore Supplier 3 è il più conveniente con un prezzo finale di: 400€, spedizione minima: 4 giorni', function () {
            //input
            let nome_prodotto = "tastiera meccanica"
            let quant = 8
            let data = new Date()
            let priority = "Economic"
            con.query(QUERY + nome_prodotto + "' and rivende.quantità>=" + quant, function (err, result, fields) {
                if (err) throw err;
                assert.equal(app.ultimateRestock(result, quant, data, priority), "il fornitore Supplier 3 è il più conveniente con un prezzo finale di: 400€, spedizione minima: 4 giorni");
                //chiudi la connessione al database dopo l'ultimo test
                con.end()
            });
        })
    })
})
