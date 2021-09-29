//recupero stringa di valori
var queryString = window.location.search;
//ricerchiamo i parametri nella stringa
var urlParams = new URLSearchParams(queryString);
var nome = urlParams.get('nome')
var fix = urlParams.get('prezzoFix')
var scontato = urlParams.get('prezzo_scontato')
var quant = urlParams.get('quant')

const titolo= document.getElementById('titolo')
const prezzoFix = document.getElementById('prezzoFix')
const prezzo_scontato = document.getElementById('prezzo_scontato')
const guadagno = document.getElementById('guadagno')

titolo.innerHTML = nome
prezzoFix.innerHTML = fix + "€"
prezzo_scontato.innerHTML = scontato + "€"
guadagno.innerHTML = (fix*quant)-scontato + "€"