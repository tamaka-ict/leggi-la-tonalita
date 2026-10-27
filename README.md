# Leggi la tonalità — versione 2.2

App per esercitarsi nel riconoscimento delle armature e ascoltare scale con note evidenziate sul pentagramma.

## Novità della versione 2.2

- **Visualizzazione per blocchi**: predefinita 5 note, alternativa 3 note. Durante la riproduzione il pentagramma resta fermo per tutto il blocco e si riposiziona soltanto al blocco successivo.
- Resta disponibile la modalità **Scorrimento a ogni nota (classico)**.
- Il cursore arancione si ferma sulla nota attiva per tutta la sua durata; la linea e la barra di avanzamento continuano a indicare l'avanzamento complessivo.
- Selezione della visualizzazione salvata sul dispositivo.
- Non cambia l'audio: scale maggiori, minori naturali, armoniche e melodiche, controllo tempo e timbro; 9 posizioni di chiave.
- Tutto il codice è contenuto in `index.html`, senza librerie esterne.

## Come aggiornare il tuo GitHub Pages

Repository: https://github.com/tamaka-ict/leggi-la-tonalita

1. Estrai lo ZIP, **non caricare lo ZIP direttamente**.
2. Nel repository, sul ramo `main`, scegli **Add file → Upload files**.
3. Carica i 6 file contenuti nell'archivio nella **cartella principale**: `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `README.md`, `ISTRUZIONI-GITHUB.txt`.
4. Conferma **Commit changes**. Attendi la pubblicazione nella scheda **Actions** o in **Settings → Pages**.
5. Visita https://tamaka-ict.github.io/leggi-la-tonalita/?v=22 e verifica la scritta **Versione 2.2**. Se vedi la vecchia versione, ricarica la pagina (Ctrl+Shift+R su PC), oppure chiudi e riapri la web app sul telefono.

La configurazione di GitHub Pages non cambia e il link condiviso ai familiari resta invariato. I vecchi `app.js` e `scale.js` non servono più; se presenti nel repository, si possono eliminare separatamente, ma non è obbligatorio. Le statistiche già salvate vengono conservate.

## Prova rapida

Apri **Impara**, seleziona una scala e imposta **Schermata fissa per 5 note**. Premi **Ascolta**: la vista deve cambiare solo alla 6ª e all'11ª nota. Con **3 note**, i passaggi avvengono alla 4ª, 7ª, 10ª e 13ª nota. L'indicatore numerico mostra il blocco corrente. Il tasto Stop riporta all'inizio.

Nota: su dispositivi molto stretti si può scorrere manualmente lo spartito. L'audio è sintetizzato attraverso la Web Audio API; parte da un'interazione dell'utente. Il sito funziona offline dopo il primo caricamento, nei browser compatibili.
