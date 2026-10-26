# Leggi la tonalità – versione 2.0

Applicazione web per imparare e allenarsi a riconoscere armature di chiave e **ascoltare le scale seguendo le note sul pentagramma**. Progettata per GitHub Pages, senza build, senza dipendenze e senza account per chi la usa.

## Novità della v2

- Nella sezione **Impara**: selezione indipendente di tutte le **15 armature di chiave**, scala maggiore e scala minore **naturale, armonica o melodica**.
- Audio riprodotto tramite **Web Audio API** del browser: non sono necessari download, registrazioni da Wikipedia o connessioni a servizi di terze parti.
- Spartito con note di **andata e ritorno**, cursore verticale arancione, barra orizzontale d'avanzamento e scorrimento automatico sul cellulare.
- Tocca una singola nota per ascoltarla isolatamente, oppure usa **Ascolta / Pausa-Riprendi / Stop**.
- Tempo regolabile **50–170 BPM**; due timbri sintetici. Il volume è gestito dal dispositivo.
- I 9 tipi/posizioni di chiave sono ancora disponibili e modificano anche la posizione delle note nello spartito.
- Restano la modalità **Allenati**, i tre livelli di difficoltà, gli esercizi casuali e le statistiche salvate sul dispositivo.

**Nota musicale**: l'armatura identifica una tonalità maggiore e una relativa minore. La minore melodica è rappresentata nell'uso classico: sesto e settimo grado innalzati in salita, forma naturale in discesa. Sono supportate grafie come Mi♯, Si♯ e, nei casi teorici, il doppio diesis. Il suono è sintetizzato con oscillatori, **non una registrazione di un pianoforte**.

## Come pubblicarla per la prima volta

1. Crea un account gratuito su https://github.com/signup.
2. Crea un repository pubblico chiamato `leggi-la-tonalita`.
3. Dal computer, apri lo ZIP e **estrailo**.
4. Nel repository vai su **Add file → Upload files** e carica **tutti i file all'interno della cartella**, non il file ZIP né la cartella stessa. In particolare, `index.html` deve trovarsi nella root del repository.
5. Scrivi un messaggio di commit (ad esempio `Prima pubblicazione versione 2`) e conferma il commit sul ramo `main`.
6. Vai su **Settings → Pages → Build and deployment → Deploy from a branch**; scegli `main` e `/(root)`, poi **Save**.
7. Il link è `https://NOMEUTENTE.github.io/leggi-la-tonalita/`. Lo trovi anche in **Settings → Pages → Visit site**.

## Come aggiornare una precedente versione già online

**Non creare un secondo repository**: conserva il tuo repository esistente e quindi anche lo stesso indirizzo condiviso ai familiari.

1. Se desideri una copia di sicurezza, usa **Code → Download ZIP** dal repository prima dell'aggiornamento.
2. Estrai il nuovo pacchetto `leggi-la-tonalita-v2-github.zip` in locale.
3. Apri il **repository già esistente** su GitHub, in `main`.
4. Fai **Add file → Upload files**, seleziona e carica tutti i file che trovi *dentro* la cartella estratta. I file con gli stessi nomi sostituiranno i corrispondenti precedenti; `scale.js` è il nuovo file da aggiungere.
5. Scrivi `Aggiorna app alla versione 2: scale audio e cursore` e completa il commit su `main`.
6. Non serve modificare **Settings → Pages**, se era già configurato per `main` e `/(root)`. Controlla **Actions** o **Settings → Pages** se la pubblicazione tarda.
7. Riapri il link già noto e ricarica la pagina. In caso di vecchia versione in cache, chiudi e riapri la scheda oppure ricarica ignorando la cache (su PC `Ctrl+Shift+R` o `Cmd+Shift+R`). Le installazioni sulla home del telefono possono richiedere di chiudere e riaprire l'app.

### Quali file caricare

- `index.html` – interfaccia e struttura dell'app (**sostituisci**)
- `app.js` – logica del quiz e selezione armature (**sostituisci**)
- `scale.js` – audio musicale e animazioni (**nuovo**)
- `sw.js` – cache offline aggiornata (**sostituisci**)
- `manifest.webmanifest` – metadati per installazione
- `icon.svg` – icona
- `README.md` e `ISTRUZIONI-GITHUB.txt` – guide (non influiscono sul funzionamento)

## Funzionamento offline e conservazione dei dati

L'audio viene generato in locale e non richiede file esterni. Dopo almeno un caricamento online da GitHub Pages, l'app può funzionare offline nei browser compatibili. Il browser potrebbe tuttavia dover scaricare la v2 prima di renderla disponibile senza rete.

Le statistiche della v1 sono salvate localmente con la stessa chiave `tonality-progress-v1`; la v2 le mantiene. **Non cancellare dati e cache del sito** se vuoi preservare i progressi. Il punteggio di un familiare non è condiviso con gli altri.

## Verifiche rapide

- Apri **Impara → Ascolta e segui la scala** e seleziona Do maggiore: devono comparire Do–Re–Mi–Fa–Sol–La–Si–Do e poi la discesa.
- Premi **Ascolta**, alza il volume del telefono se necessario: la linea arancione deve avanzare di una nota alla volta e il pentagramma scorrere.
- Seleziona una chiave diversa (es. Fa basso): gli stessi suoni devono apparire in posizioni differenti sul pentagramma.
- Per La minore melodica verifica Fa♯ e Sol♯ in salita e Fa, Sol naturali in discesa.
- Controlla che **Allenati** e le statistiche continuino a funzionare.

### Risoluzione problemi

- **Non si sente niente**: alza il volume multimedia; premi direttamente **Ascolta** (l'audio automatico senza gesto dell'utente viene bloccato dai browser); verifica che il browser supporti la Web Audio API.
- **Si vede la versione vecchia**: attendi la pubblicazione GitHub Pages, ricarica forzatamente e verifica che `scale.js` sia nella root del repository, oltre a `sw.js` aggiornato.
- **404**: controlla che il nome del repository sia corretto, che `index.html` sia nella root e che Pages sia configurato su `main` e `/(root)`.
- **Non scorrono le note sullo smartphone**: aggiorna il browser e assicurati di aver caricato `scale.js` e `index.html` entrambi in versione 2.

Riferimenti: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site e https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository.
