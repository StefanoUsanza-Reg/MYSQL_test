API_key = 'qP7h9NOAlOsQSGo4H9OyuZHnxMesBe'
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
var prodotto = urlParams.get('prodotto')

const titolo= document.getElementById('titolo')
const prezzoFix = document.getElementById('prezzoFix')
const prezzo_scontato = document.getElementById('prezzo_scontato')
const guadagno = document.getElementById('guadagno')
const id = document.getElementById('id')

var order =[]
order.push({supplier: nome,prodotto: prodotto,quant: quant,prezzoFix: fix + "€",prezzoFinal: scontato + "€",profit: (Math.round((guad + Number.EPSILON) * 100) / 100) + "€"})
fetch('https://server-express.glitch.me/genera/'+API_key
,{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(order[0])
})
.then(r=>r.json())
.then(d=>{
titolo.innerHTML = nome
prezzoFix.innerHTML = fix + "€"
prezzo_scontato.innerHTML = scontato + "€"
guadagno.innerHTML = (Math.round((guad + Number.EPSILON) * 100) / 100) + "€"
id.innerHTML = d  
})  

