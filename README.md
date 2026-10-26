# Leggi la tonalità — versione 2.1

Web app gratuita per esercitarsi a leggere le armature di chiave e imparare le scale musicali con ascolto e cursore sincronizzato.

## Correzione dei problemi della v2.0

La versione 2.1 non ha più bisogno dei vecchi `app.js` e `scale.js`: entrambi sono integrati nel file `index.html`. Questo evita che un caricamento incompleto o una differenza tra versioni dei due script lasci vuoto il pentagramma e inattivi i comandi audio.

**Attenzione:** non è possibile attribuire con certezza il problema della v2.0 a un file mancante: nel repository GitHub pubblico i file apparivano presenti. La revisione elimina questo punto di fragilità e aggiorna la cache del service worker. Inoltre, cambiare i BPM mentre si ascolta la scala riavvia la nota corrente alla nuova velocità.

## Funzionalità

- Modalità Allenati: armatura casuale, quattro risposte, punteggi, serie, tre difficoltà.
- Modalità Impara: 15 armature e 9 configurazioni della chiave di Sol, Fa e Do.
- Scale maggiori e relative minori naturali, armoniche o melodiche.
- Audio Web Audio generato dal browser, senza file audio esterni.
- Spartito con note ascendenti e discendenti, cursore arancione e avanzamento blu, scorrimento orizzontale automatico.
- Velocità regolabile da 50 a 170 BPM, anche mentre la scala suona.
- Ascolto di una singola nota toccando lo spartito o con **Prova il suono di una nota**.
- Possibilità di utilizzare il sito offline dopo averlo caricato almeno una volta (nei browser compatibili).

## Installare su GitHub Pages

Repository di esempio: <https://github.com/tamaka-ict/leggi-la-tonalita>

Indirizzo del sito: <https://tamaka-ict.github.io/leggi-la-tonalita/>

1. Apri il repository e assicurati di essere sul ramo `main`.
2. Se desideri un backup, premi **Code → Download ZIP**.
3. Estrai lo ZIP della v2.1 sul computer: **non** caricare lo ZIP direttamente nel repository.
4. Da **Add file → Upload files**, carica i file della cartella estratta nella radice del repository (soprattutto `index.html` e `sw.js`).
5. Conferma con **Commit changes**; se viene proposta l'opzione, scegli `Commit directly to the main branch`.
6. Non modificare la sezione `Settings → Pages`: il sito già esistente continuerà allo stesso indirizzo.
7. Attendi la pubblicazione (vedi **Actions** o **Settings → Pages**), poi apri l'indirizzo e verifica in alto **Versione 2.1**.

### File inclusi

| File | Ruolo |
|---|---|
| `index.html` | Interfaccia, logica degli esercizi, note, audio e animazione: tutto in uno |
| `sw.js` | Cache offline v2.1 e cancellazione delle vecchie versioni |
| `manifest.webmanifest` | Installazione sulla schermata Home |
| `icon.svg` | Icona |
| `README.md` | Questa guida |
| `ISTRUZIONI-GITHUB.txt` | Istruzioni brevi per la sostituzione dei file |

**`app.js` e `scale.js` della v2.0 sono diventati superflui.** Puoi lasciarli nel repository: `index.html` non li carica più. Se vuoi fare pulizia, puoi eliminarli successivamente da GitHub con l'azione `Delete file` e confermare il commit. Non serve eliminarli per far funzionare la v2.1.

## Controllo rapido dopo la pubblicazione

1. Apri il sito e controlla che in alto compaia **Versione 2.1**.
2. Seleziona **Impara**. Dovresti vedere subito le 15 note di Do maggiore sul pentagramma (parte scorrevole in orizzontale).
3. Premi **Prova il suono di una nota** e controlla il volume multimediale del telefono.
4. Premi **Ascolta la scala**. La linea arancione deve spostarsi, la barra blu avanzare e la nota corrente aggiornarsi.
5. Sposta i BPM durante l'ascolto: la riproduzione deve cambiare velocità dalla nota corrente.
6. Cambia tipo di scala, tonalità e chiave musicale.

Se vedi ancora la versione precedente, apri la pagina con un parametro di aggiornamento, per esempio <https://tamaka-ict.github.io/leggi-la-tonalita/?v=21>, mentre sei collegato a Internet. Sul telefono chiudi e riapri eventualmente la scheda o l'app salvata sulla schermata iniziale. Non eliminare i dati del sito, a meno che sia necessario: potresti perdere i punteggi salvati.

Se la barra e le note avanzano ma **non** senti audio, il codice musicale sta funzionando: controlla il volume multimediale, le impostazioni silenzioso/audio del dispositivo e prova Chrome o Safari aggiornati. Se l'audio non è autorizzato, viene mostrato un messaggio nel lettore.

I progressi sono conservati sul singolo dispositivo e non condivisi. L'app non richiede un account per i familiari.
