const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app= express()
const script = require('../script')
const dotenv = require('dotenv');
dotenv.config();

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
app.get('/restock/nomi_prodotti/:API_key',(req,res)=>{
    const {API_key}= req.params
    if(API_key != process.env.API_key){
        res.status(401).send({
            "error": "API_key-0001",
            "message": "Incorrect API_key",
            "detail": "Ensure that the API_key included in the request is correct"
        })       
    }
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
            res.status(200).send(result)
        });
    }) 
})

//restock
app.get('/restock/:nome_prodotto/:quant/:priority/:API_key',(req,res)=>{
    const {API_key} = req.params
    if(API_key != process.env.API_key){
        res.status(401).send({
            "error": "API_key-0002",
            "message": "Incorrect API_key",
            "detail": "Ensure that the API_key included in the request is correct"
        })
    }
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
                res.status(404).send({
                    "error": "API_key-0001",
                    "message": "Incorrect API_key",
                    "detail": "Ensure that the API_key included in the request is correct"
                })
            else
                res.status(200).send(script.Restock(result,quant,data,priority))
        });
    })
})

// implementazione autenticazione
app.get("/users/:name/:password/:API_key",(req,res)=>{
    const {API_key} = req.params
    if(API_key != process.env.API_key){
        res.status(401).send({
            "error": "API_key-0003",
            "message": "Incorrect API_key",
            "detail": "Ensure that the API_key included in the request is correct"
        })   
    }
    else{
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
                        res.status(200).send(true)
                        else
                        res.status(400).send({
                            "error": "Password-0001",
                            "message": "incorrect password",
                            "detail": "Ensure that the password included in the request is correct"
                        })
                    });    
                }
                else
                res.status(404).send({
                    "error": "UserNotFound-0001",
                    "message": "incorrect username",
                    "detail": "Ensure that the username included in the request is correct"
                })
            })
        });
    }
})
    