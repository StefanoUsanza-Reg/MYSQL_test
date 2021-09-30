# Restock

Software per la gestione del restock di un negozio.

[Guida all'utilizzo](/StefanoUsanza-Reg/restock/blob/master/README.md#guida-allutilizzo)

## Analisi problema

Il tuo negozio vende i prodotti a dei prezzi fissi, ma quando vuoi rifornirti dai rivenditori, vuoi scegliere quello più conveniente in base ai prezzi di vendita e gli sconti che offrono: 
- gli sconti possono essere correlati alla quantità di prodotti richiesti
- all'importo totale dell'ordine
- o potrebbero essere limitati ad alcuni periodi dell'anno
Inoltre puoi scegliere i rivenditori in base ai giorni di spedizione dell'ordine, in caso fosse necessario una consegna urgente.

## Analisi funzionalità
<b>AS</b> store owner

<b>I WANT</b> controllare i prezzi di un prodotto offerti da rivenditori diversi

<b>SO THAT</b> quando devo fare restock di un prodotto, posso scegliere se comprare dal rivenditore più conveniente, o dal più veloce a consegnare l'ordine

(scenario 1:)

<b>GIVEN</b> Una richiesta di acquisto di 12X monitor fatta il 24 settembre

<b>WHEN</b> Supplier 1 has 8pcs in stock at 120€ each, and offers 5% discount for purchases of minimum 1000€. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 15pcs in stock at 128€ each, and offers a 3% discount if you order >5pcs and 5% discount if you order >10pcs. Min. days to ship order is 7
  
<b>AND</b> Supplier 3 has 23pcs in stock at 129€ each, and offers a discount of 5% for orders over 1000€. It also offers an additional discount of 2% for orders placed in september.. Min. days to ship order is 4

<b>THEN</b> 
- Supplier 1 is not prompted because it does not have enough stock quantity available.
- Supplier 2 can fulfill the request for 1’459.20€.
- Supplier 3 can fulfill the request for 1’441.19€; this is the cheapest one so it should be highlighted


(scenario 2:)

<b>GIVEN</b> 

<b>WHEN</b>

<b>THEN</b>

## Guida all'utilizzo

Per accedere al servizio è necessario effettuare un login; gli account devono essere distribuiti agli operatori abilitati, che non possono scegliere di crearne di nuovi. I dati relativi agli account sono salvati in un database, e per proteggere le password le criptiamo prima di salvarle, in questo modo non è possibile risalire alla password in chiaro anche se venissero rubate le informazioni dal database. Per cambiare account o disconnettersi da quello attualmente in uso, è presente un tasto di logout, che elimina la sessione corrente e reindirizza alla pagina di login.

Quando si vuole effettuare un ordine di restock, è sufficente inserire il nome del prodotto e la quantità desiserata nel form, specificando la priorità per la ricerca: 
- economica, se si vuole individuare il rivenditore che offre il prezzo più basso
- veloce, se si vuole individuare il rivenditore che spedisce nel minor tempo

![Screenshot (3)](https://user-images.githubusercontent.com/90613113/135053101-36ea0f99-0da9-4f37-8473-07d8f0b5ec0f.png)

Con i dati inseriti verrà effettuata una richiesta al server dove si trova il database che contiene tutti i dati relativi ai prodotti ordinabili e i rivenditori che li offrono.
Dopo aver applicato gli sconti disponibili, viene visualizzata una lista con tutti i rivenditori che sono in grado di soddisfare la richiesta di restock: se viene selezionata una quantità di prodotti superiore a quella disponibile per un rivenditore, questo non verrà mostrato.
In base alla priorità di ricerca selezionata verrà evidenziato il rivenditore più opportuno: 
- economica, viene evidenziato il rivenditore che offre il prezzo più basso, e in caso di più prezzi uguali, verrà scelto il più veloce a consegnare
- veloce, viene evidenziato il rivenditore che offre la spedizione più veloce, e in caso di tempistiche uguali, verrà scelto il più economico

![Screenshot (13)](https://user-images.githubusercontent.com/90613113/135273609-214f1b4b-55bc-4013-b4e9-3b8a73eefcfa.png)

L'utilizzatore del servizio può sempre scegliere il rivenditore che preferisce, anche se non è quello evidenziato dal sistema; per questo a fianco di ogni rivenditore è presente un tasto che permette di concludere l'ordine con quel rivenditore specifico.
Una volta comfermato l'ordine viene mostrato il prezzo a cui verranno venduti gli oggetti, il prezzo d'acquisto, e il possibile guadagno vendendo l'intero ordine.
