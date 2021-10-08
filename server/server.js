const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app= express()
const script = require('../script')

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mysql = require('mysql');

let QUERY = ""

//server express in ascolto sulla porta 3000
app.listen(3000, ()=>{
    console.log("server listening on port 3000:")
})

//recupero nomi prodotti dal server
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

//restock
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
                res.send(script.Restock(result,quant,data,priority))
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

app.get("/order",(req,res)=>{
    res.send("hello")
})