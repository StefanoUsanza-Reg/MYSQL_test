# Restock

Software per la gestione del restock di un negozio.

## Analisi problema

Il tuo negozio vende i prodotti a dei prezzi fissi, ma quando vuoi rifornirti dai rivenditori, vuoi scegliere quello più conveniente in base ai prezzi di vendita e gli sconti che offrono: 
- gli sconti possono essere correlati alla quantità di prodotti richiesti
- all'importo totale dell'ordine
- o potrebbero essere limitati ad alcuni periodi dell'anno
Inoltre puoi scegliere i rivenditori in base ai giorni di spedizione dell'ordine, in caso fosse necessario una consegna urgente

## guida all'utilizzo

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
