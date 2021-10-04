# Restock

Software for managing a store's restock.

- [Problem analysis](/README.md#problem-analysis)

- [Functional analysis](/README.md#analisi-funzionalità)

- [Functions](/README.md#funzioni)

- [User guide](/README.md#guida-allutilizzo)


## Problem analysis

your shop sell products at a fix prices, but when you need to stock from supplier, you want to choose the cheapest one based on the selling prices and discounts they offer.
The discount they offer may be related to:
- the quantity of the product request
- the total amount of the order
- or may be limited to certain periods of the year

You can also choose supplier based on the minimun days to ship the order in case an urgent delivery is required.

## Analisi funzionalità
<b>AS</b> store owner

<b>I WANT</b> controllare i prezzi di un prodotto offerti da rivenditori diversi

<b>SO THAT</b> quando devo fare restock di un prodotto, posso scegliere se comprare dal rivenditore più conveniente, o dal più veloce a consegnare l'ordine

<i>(SCENARIO 1:)</i>

<b>GIVEN</b> Una richiesta di acquisto di 12X monitor fatta il 24 settembre, priority Economic

<b>WHEN</b> Supplier 1 has 8pcs in stock at 120€ each, and offers 5% discount for purchases of minimum 1000€. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 15pcs in stock at 128€ each, and offers a 3% discount if you order >5pcs and 5% discount if you order >10pcs. Min. days to ship order is 7
  
<b>AND</b> Supplier 3 has 23pcs in stock at 129€ each, and offers a discount of 5% for orders over 1000€. It also offers an additional discount of 2% for orders placed in september.. Min. days to ship order is 4

<b>THEN</b> 
- Supplier 1 is not prompted because it does not have enough stock quantity available.
- Supplier 2 can fulfill the request for 1459.20€.
- Supplier 3 can fulfill the request for 1441.19€; this is the cheapest one so it should be highlighted.


<i>(SCENARIO 2:)</i>

<b>GIVEN</b> Una richiesta di acquisto di 12X monitor fatta il 3 novembre, priority Economic

<b>WHEN</b> Supplier 1 has 8pcs in stock at 120€ each, and offers 5% discount for purchases of minimum 1000€. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 15pcs in stock at 128€ each, and offers a 3% discount if you order >5pcs and 5% discount if you order >10pcs. Min. days to ship order is 7
  
<b>AND</b> Supplier 3 has 23pcs in stock at 129€ each, and offers a discount of 5% for orders over 1000€. It also offers an additional discount of 2% for orders placed in september. Min. days to ship order is 4

<b>THEN</b> 
- Supplier 1 is not prompted because it does not have enough stock quantity available.
- Supplier 2 can fulfill the request for 1459.20€; this is the cheapest one so it should be highlighted.
- Supplier 3 can fulfill the request for 1470.60€.

<i>(SCENARIO 3:)</i>

<b>GIVEN</b> una richiesta di acquisto di 5X sedie da uffico fatta il 24 settembre, priority Fast

<b>WHEN</b> Supplier 1 has 10pcs in stock at 110€ each, and offers 5% discount for purchases of minimum 1000€. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 8pcs in stock at 100€ each, and offers a 3% discount if you order >5pcs and 5% discount if you order >10pcs. Min. days to ship order is 7

<b>AND</b> Supplier 3 has 15pcs in stock at 120€ each, and offers a discount of 5% for orders over 1000€ and 2% if you order >5pcs. It also offers an additional discount of 2% for orders placed in september. Min. days to ship order is 4

<b>THEN</b>
- Supplier 1 can fulfill the request shipping the order in 5 days for 550€
- Supplier 2 can fulfill the request shipping the order in 7 days for 485€.
- Supplier 3 can fulfill the request shipping the order in 4 days for 576€. this is the fastest one so it should be highlighted.

<i>(SCENARIO 4:)</i>

<b>GIVEN</b>  una richiesta di acquisto di 8X tastiere meccaniche fatta il 24 settembre, priority Economic

<b>WHEN</b> Supplier 1 has 20pcs in stock at 50€ each. Min. days to ship order is 5

<b>AND</b> Supplier 2 has 30pcs in stock at 55€ each. Min. days to ship order is 7

<b>AND</b> Supplier 3 has 25pcs in stock at 50€ each. Min. days to ship order is 4

<b>THEN</b>
- Supplier 1 can fulfill the request for 400€, Min. days to ship order is 5
- Supplier 2 can fulfill the request for 440€, Min. days to ship order is 7
- Supplier 3 can fulfill the request for 400€, Min. days to ship order is 4. This is the cheapest one and the fastest one so it should be highlighted.

### Funzioni

- <b>Login/logout:</b>

Per accedere alle funzionalità del sito, è necessario autenticarsi. Tramite una schermata di log-in è possibile far accedere al servizio solamente gli operatori a cui è stato assegnato un account valido. Senza eseguire l'accesso non è possibile accedere a nessuna delle funzionalità. Il nome utente e la password vengono salvati in un database; per evitare di esporre le password a chi utilizza il database, o a persone che provano ad attaccare il nostro sistema, è necessario codificare le password prima di salvare nel database. Tramite una funzione di hashing è possibile generare un hash per la password, a questo punto l'unico modo per verificare se la password inserita durante la fase di login è corretta, è quello di usare una funzione compare(), perché una volta codificata non è possibile risalire alla password in chiaro, ma solamente verificare se l'hash analizzata è stata generata da quella password.

Una volta effettuato il login, la sessione dell'utente verrà salvata permettendogli di accedere a tutte le funzioni del sito; se si vuole cambiare account, o semplicemente terminare la sessione corrente, è presente un tasto per il logout: l'utente verra reindirizzato alla pagina di login e dovrà inserire nuovamente i dati corretti per autenticarsi.

- <b>Ricerca rivenditori</b>

Inserendo i dati relativi al nome di un prodotto e la quantità desiderata, l'utente può visualizzare una lista di tutti i rivenditori che possono soddisfare la richiesta; l'ordine con cui vengono visualizzati è basato sulla priorità impostata dall'utente: Economica o Veloce. Per mostrare all'utente la lista dei rivenditori, il server deve ricevere una richiesta contenente tutti i dati necessari, quindi se l'utente non compila interamente il form, la richiesta non parte e viene visualizzato un messaggio di errore; allo stesso modo se non vengono trovati dei rivenditori che soddisfano la richiesta, verrà mostrato un messaggio di errore. 

Per velocizzare l'inserimento dei dati, e limitare gli errori dovuti ad una scrittura manuale, i nomi dei prodotti vengono inseriti nel form, e l'utente deve solo selezionare quello desiderato; per farlo è sufficente effettuare una richiesta al server quando viene caricata la pagina per la ricerca.

- <b>Ordina/guadagno</b>

L'utente può sempre scegliere il rivenditore che preferisce, anche se non è quello evidenziato dal sistema; per questo a fianco di ogni rivenditore è presente un tasto che permette di concludere l'ordine con quel rivenditore specifico. Una volta comfermato l'ordine viene mostrato il prezzo a cui verranno venduti gli oggetti, il prezzo d'acquisto, e il possibile guadagno vendendo l'intero ordine. A questo punto l'utente può tornare al form per inserire nuovi dati ed effettuare una nuova ricerca opppure effetuare il logout e tornare alla schermata di login.

## Guida all'utilizzo

Per accedere al servizio è necessario autenticarsi; gli account devono essere distribuiti agli operatori abilitati, che non possono scegliere di crearne di nuovi. Una volta autenticati, sarà possibile accedere a tutte le funzioni; per cambiare account o disconnettersi da quello attualmente in uso, è presente un tasto di logout, che elimina la sessione corrente e reindirizza alla pagina di login.

Quando si vuole effettuare un ordine di restock, è sufficente inserire il nome del prodotto e la quantità desiserata nel form, specificando la priorità per la ricerca: 
- economica, se si vuole individuare il rivenditore che offre il prezzo più basso
- veloce, se si vuole individuare il rivenditore che spedisce nel minor tempo

I nomi dei prodotti salvati nel database saranno inseriti automaticamente nel form, in questo modo l'utente deve solamente selezionare il nome desiderato, evitando possibili errori di scrittura manuale; lo stesso vale per le tipologie di priorità.

![Screenshot (14)](https://user-images.githubusercontent.com/90613113/135643907-77860b29-e286-4f7f-99cf-901cc9d19184.png)

Con i dati inseriti verrà effettuata una richiesta al server dove si trova il database che contiene tutti i dati relativi ai prodotti ordinabili e i rivenditori che li offrono.
Dopo aver applicato gli sconti disponibili, viene visualizzata una lista con tutti i rivenditori che sono in grado di soddisfare la richiesta di restock: se viene selezionata una quantità di prodotti superiore a quella disponibile per un rivenditore, questo non verrà mostrato.

In base alla priorità di ricerca selezionata verrà evidenziato il rivenditore più opportuno: 
- economica, viene evidenziato il rivenditore che offre il prezzo più basso, e in caso di più prezzi uguali, verrà scelto il più veloce a consegnare
- veloce, viene evidenziato il rivenditore che offre la spedizione più veloce, e in caso di tempistiche uguali, verrà scelto il più economico

![Screenshot (13)](https://user-images.githubusercontent.com/90613113/135273609-214f1b4b-55bc-4013-b4e9-3b8a73eefcfa.png)

L'utente può sempre scegliere il rivenditore che preferisce, anche se non è quello evidenziato dal sistema; per questo a fianco di ogni rivenditore è presente un tasto che permette di concludere l'ordine con quel rivenditore specifico. Una volta comfermato l'ordine viene mostrato il prezzo a cui verranno venduti gli oggetti, il prezzo d'acquisto, e il possibile guadagno vendendo l'intero ordine. A questo punto l'utente può tornare al form per inserire nuovi dati ed effettuare una nuova ricerca opppure effetuare il logout e tornare alla schermata di login.

![Screenshot (16)](https://user-images.githubusercontent.com/90613113/135643966-3d4d9243-6378-4a71-95eb-82047b98c33d.png)

