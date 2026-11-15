# Leggi la tonalità — 3.0 · Accademia musicale

App didattica **gratuita**, in italiano e fruibile da smartphone, pubblicabile con GitHub Pages.
Nessun account richiesto per i familiari. Nessuna libreria remota, tracking, pubblicità o caricamento di dati personali.

## Nuovo nella versione 3.0

**Percorso di sei livelli, sbloccati in ordine:**

1. **Lettura delle note:** esercizi con le nove chiavi e posizioni musicali.
2. **Armature e tonalità:** circolo delle quinte esplorabile, relative maggiori/minori, omonime.
3. **Costruzione delle scale:** esercizio pratico sui sette gradi e riconoscimento delle alterazioni nelle scale maggiori, minori naturali, armoniche e melodiche ascendenti.
4. **Intervalli:** riconoscimento visivo della qualità e del numero, ascolto melodico e armonico.
5. **Accordi e armonia:** triadi diatoniche, gradi della scala e cadenze.
6. **Analisi e trasposizione:** brevi frammenti originali, scelta della tonalità più probabile e trasposizione di motivi.

**Regola degli sblocchi:** sei domande per verifica, almeno cinque corrette per progredire. I livelli già superati rimangono aperti. Gli esercizi sbagliati sono registrati e proposti nel **Ripasso mirato**; dopo due ripassi corretti sono considerati consolidati.

Le modalità precedenti **Allenati** e **Impara** restano disponibili da subito. Il lettore delle scale conserva ascolto Web Audio, pausa, velocità regolabile, curatore sullo spartito e inquadratura stabile su gruppi di 3 o 5 note.

Il percorso comprende **351 tracce di esercizi** con variazioni dovute alla chiave selezionata. Il suono degli esempi è sintetizzato dal browser e non usa registrazioni di Wikipedia.

I progressi della v3 sono salvati automaticamente nel `localStorage` del singolo browser e non condivisi fra i componenti della famiglia. Le statistiche degli esercizi classici (v2.x) vengono conservate. Browser o dispositivo diversi avranno progressi distinti; la cancellazione dei dati del sito azzera il progresso. La modalità Studio generale è sempre accessibile.

## Pubblicazione: aggiornare il repository già esistente

Repository: https://github.com/tamaka-ict/leggi-la-tonalita
Sito pubblico: https://tamaka-ict.github.io/leggi-la-tonalita/

1. Apri il repository su GitHub e accedi all'account `tamaka-ict`.
2. **Consigliato:** crea un backup con `Code → Download ZIP`.
3. Estrai sul computer `leggi-la-tonalita-v3-github.zip`.
4. Sul ramo `main`, scegli `Add file → Upload files` e trascina **i 6 file estratti** nella cartella principale del repository (non la cartella e non lo ZIP).
5. Conferma con `Commit changes`, direttamente sul ramo `main`.
6. GitHub Pages userà automaticamente i file aggiornati: **non devi creare un nuovo repository né cambiare Settings → Pages**.
7. Apri https://tamaka-ict.github.io/leggi-la-tonalita/?v=30 e controlla la scritta **Versione 3.0**. Poi verifica il menu **Percorso**.

I vecchi file `app.js` e `scale.js` possono rimanere su GitHub: la v3 non li richiama. I sei file che carichi ora sono `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `README.md`, `ISTRUZIONI-GITHUB.txt`.

## Test dopo l'upload

- Apri **Percorso**: solo il primo livello deve essere disponibile.
- Completa sei domande nel primo livello (almeno 5 corrette): il secondo deve diventare selezionabile.
- Apri **Impara**, seleziona Do maggiore e premi **Ascolta la scala**: sul pentagramma si evidenziano le note. Verifica anche il controllo di velocità e la finestra da 5 note.
- Chiudi e riapri il sito: i livelli sbloccati devono rimanere memorizzati **sullo stesso dispositivo e browser**.

Se compare una versione precedente, usa il link con `?v=30`, ricarica la pagina e riapri l'app; non cancellare subito i dati del sito perché contengono i progressi.

## File e dipendenze

- `index.html`: contiene HTML, CSS e tutto il JavaScript di entrambe le modalità e del nuovo percorso.
- `sw.js`: cache offline, con aggiornamento prioritario dalla rete.
- `manifest.webmanifest` e `icon.svg`: icona e installazione sulla schermata Home.
- `README.md` e `ISTRUZIONI-GITHUB.txt`: documentazione.

### Limitazioni attuali

Gli esempi di analisi sono brevi **frammenti costruiti a scopo didattico**, non importazione/riconoscimento automatico di spartiti PDF o MusicXML. L'audio usa oscillatori sintetici; ascoltarlo per prima volta richiede il tocco di un pulsante nel browser. Il percorso non sincronizza i risultati fra telefoni e non richiede un account.
