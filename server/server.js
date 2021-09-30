const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app= express()

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const multisort = require("multisort")
var mysql = require('mysql');

let QUERY = ""

//server express in ascolto sulla porta 3000
app.listen(3000, ()=>{
    console.log("server listening on port 3000:")
})

app.get('/restock/nomi_prodotti',(req,res)=>{
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "restock"
      });
    con.connect(function(err) {
        if (err) throw err;
        QUERY= "SELECT prodotto.nome as nomeProdotto FROM prodotto"
        con.query(QUERY, function (err, result, fields) {
            if (err) throw err;
            con.end()
            res.send(result)
        });
    })
})

app.get('/restock/:nome_prodotto/:quant/:priority',(req,res)=>{
    const {nome_prodotto} = req.params
    const {quant} = req.params
    const {priority} = req.params
    let data = new Date()
    QUERY = "SELECT prodotto.nome as nomeProdotto,prodotto.prezzo as prezzoFix, rivende.prezzo, rivende.quantità, rivenditore.nome as nomeRivenditore, rivenditore.spedizione_min, "+ 
    "sconto.valore, sconto_extra.valore as valore_extra, sconto.importo_minimo, sconto.quantità_min, sconto_extra.data_inizio, sconto_extra.data_fine "+
    "FROM prodotto, rivende, rivenditore, sconto, sconto_extra "+
    "WHERE id_prodotto=prodotto.id "+
    "and id_rivenditore=rivenditore.id "+
    "and id_sconto = sconto.id "+
    "and id_sconto_extra = sconto_extra.id "+
    "and prodotto.nome='"
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "restock"
        });
    con.connect(function(err) {
        if (err) throw err;
        con.query(QUERY+ nome_prodotto+"' and rivende.quantità>="+quant, function (err, result, fields) {
            if (err) throw err;
            con.end()
            if(result[0]==null)
                res.send(result)
            else
                res.send(restock(result,quant,data,priority))
        });
    })
})

// implementazione autenticazione
app.get("/users/:name/:password",(req,res)=>{
    const {name}= req.params
    const {password}= req.params
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "users"
      });
    con.connect(function(err) {
        if (err) throw err;
        QUERY= "SELECT user.username, user.password FROM user WHERE user.username = '"+ name+"'"
        con.query(QUERY, function (err, result, fields) {
            if (err) throw err;
            con.end()
            //res.send(result)
            const user = result
            if(user!=""){
                bcrypt.compare(password, user[0].password).then(function(result) {
                    if(result)
                        res.send(true)
                    else
                        res.send(false)
                });    
            }
            else
                res.send(false)
        })
    });
})

function sconto(numero,percentuale){
    return numero - (numero * percentuale)/100
}

function restock(result,quant,data,priority){
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