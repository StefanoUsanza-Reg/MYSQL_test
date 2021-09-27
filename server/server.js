const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app= express()

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const assert = require('chai').assert
const expect = require('chai').expect

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restock"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("connected to the database!")
})
let QUERY = "SELECT prodotto.nome as nomeProdotto, rivende.prezzo, rivende.quantità, rivenditore.nome as nomeRivenditore, rivenditore.spedizione_min, "+ 
"sconto.valore, sconto_extra.valore as valore_extra, sconto.importo_minimo, sconto.quantità_min, sconto_extra.data_inizio, sconto_extra.data_fine "+
"FROM prodotto, rivende, rivenditore, sconto, sconto_extra "+
"WHERE id_prodotto=prodotto.id "+
"and id_rivenditore=rivenditore.id "+
"and id_sconto = sconto.id "+
"and id_sconto_extra = sconto_extra.id "+
"and prodotto.nome='"

//server express in ascolto sulla porta 3000
app.listen(3000, ()=>{
    console.log("server listening on port 3000:")
})

app.get('/restock/:nome_prodotto/:quant',(req,res)=>{
    const {nome_prodotto} = req.params
    const {quant} = req.params

    con.query(QUERY+ nome_prodotto+"' and rivende.quantità>="+quant, function (err, result, fields) {
        if (err) throw err;
        //con.end()
        res.send(result)
    });

})