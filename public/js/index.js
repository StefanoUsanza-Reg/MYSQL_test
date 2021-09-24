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
