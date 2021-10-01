const user = document.getElementById('username')
const btnLogout = document.getElementById('logout')
btnLogout.onclick = ()=>{
    sessionStorage.clear()
  }
// controllo autenticazione
if(sessionStorage.getItem("user")==null){
    window.location.replace("http://localhost:5500/public/login.html");
  }
  user.innerHTML = "user: "+ sessionStorage.getItem("user")

const btnNavHome = document.getElementById('navHome')
btnNavHome.onclick = ()=>{
  window.location.replace("http://localhost:5500/public/index.html");
}
const btnHome = document.getElementById('home')
btnHome.onclick = ()=>{
  window.location.replace("http://localhost:5500/public/index.html");
}

//recupero stringa di valori
var queryString = window.location.search;
//ricerchiamo i parametri nella stringa
var urlParams = new URLSearchParams(queryString);
var nome = urlParams.get('nome')
var fix = urlParams.get('prezzoFix')
var scontato = urlParams.get('prezzo_scontato')
var quant = urlParams.get('quant')
var guad = (fix*quant)-scontato 

const titolo= document.getElementById('titolo')
const prezzoFix = document.getElementById('prezzoFix')
const prezzo_scontato = document.getElementById('prezzo_scontato')
const guadagno = document.getElementById('guadagno')

titolo.innerHTML = nome
prezzoFix.innerHTML = fix + "€"
prezzo_scontato.innerHTML = scontato + "€"
guadagno.innerHTML = (Math.round((guad + Number.EPSILON) * 100) / 100) + "€"