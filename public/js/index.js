const btnRicerca = document.getElementById('ricerca')

btnRicerca.onclick = ()=>{
    const nome_prodotto = document.getElementById('nome_prodotto').value
    const quant = document.getElementById('quant').value
    const priority = document.getElementById('priority').value
    const data = new Date(Date.now())

    console.log(nome_prodotto)
    console.log(quant)
    console.log(priority)
    console.log(data)

}

//ricerca nel database i dati da inserire nel campo nome_utente
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restock"
});

let QUERY = "SELECT prodotto.nome as nomeProdotto, rivende.prezzo, rivende.quantità, rivenditore.nome as nomeRivenditore, rivenditore.spedizione_min, "+ 
"sconto.valore, sconto_extra.valore as valore_extra, sconto.importo_minimo, sconto.quantità_min, sconto_extra.data_inizio, sconto_extra.data_fine "+
"FROM prodotto, rivende, rivenditore, sconto, sconto_extra "+
"WHERE id_prodotto=prodotto.id "+
"and id_rivenditore=rivenditore.id "+
"and id_sconto = sconto.id "+
"and id_sconto_extra = sconto_extra.id "+
"and prodotto.nome='"

con.connect(function(err) {
    if (err) throw err;
    console.log("connected to the database!")
con.query(QUERY+ nome_prodotto+"' and rivende.quantità>="+quant, function (err, result, fields) {
    if (err) throw err;
    console.log(result)
});
con.end()
})
