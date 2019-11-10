const http = require('http');
const url = require('url');
const fs = require('fs');
const dt = require('./idmodule');
const TimeAndDate = require('./datemodule');

const hostname = 'localhost';
const port = 8080;
const starturl = 'http://' + hostname + ':' + port;

/* Diese Funktion...
   - erzeugt eine Liste aus den gespeicherten Dateien, die die eingetragenen Bugs enthalten. Anzeige vom Inhalt unter "Einträge in der Datenbank".
   - erzeugt eine Liste mit Knöpfen über die die Bug-Einträge geschlossen werden können.
   - erzeugt eine Liste mit Knöpfen über die die Bug-Einträge wieder gelöscht werden können.
   - erzeugt eine Liste mit Knöpfen und inputfeldern über die die Bug-Einträge aktualisiert werden können */
let showList = function buildList() {
    let list = '<ul>';
    for (file of fs.readdirSync('files')) {
        list += '<li>';
        list += fs.readFileSync('./files/' + file);
        list += '<form action="./" method="get" class="btn-ctrl-area"><input type="text" name="addtext" placeholder="Notizen/Kommentare/Zwischenstatus usw. zu Einträgen hinzufügen ..." required><input type="hidden" name="add" value="' + file + '"><button class="btn" type="submit" value="Ergänzen">Text ergänzen <i class="fas fa-comment-dots"></i></button></form>';
        list += '<form action="./" method="get" class="btn-ctrl-area"><input type="text" name="addurl" placeholder="URL hinzufügen ..." required><input type="hidden" name="addnameurl" value="' + file + '"><button class="btn" type="submit" value="URL Ergänzen">URL ergänzen <i class="fas fa-link"></i></button></form>';
        list += '<form action="./" method="get" class="btn-ctrl-area"><input type="text" name="addimg" placeholder="Bild-URL hinzufügen ..." required><input type="hidden" name="addimgurl" value="' + file + '"><button class="btn" type="submit" value="Bild-URL Ergänzen">Bild-URL ergänzen <i class="fas fa-image"></i></button></form>';
        list += '<div class="btn-ctrl-area"><form action="./" method="get" ><input type="hidden" name="close" value="' + file + '"><button class="btn" type="submit" value="Schließen">Schließen <i class="fas fa-archive"></i></button></form>';
        list += '<form action="./" method="get"><input type="hidden" name="del" value="' + file + '"><button class="btn" type="submit" value="Löschen">Löschen <i class="fas fa-trash"></i></button></form></div>';
        list += '</li>';
    }
    list += '</ul>';
    return list;
}

const server = http.createServer((req, res) => {

    res.writeHead(200, {'Content-Type': 'text/html'});

    let q = url.parse(req.url, true).query;

// Löschen von von Datenbank-Elementen/Dateien
// Hinzufügen von einem 'Task geschlossen' Eintrag in den einzelnen Datenbank-Elementen
// Hinzufügen von beliebigem Text in den einzelnen Datenbank-Elementen/Dateien
// Hinzufügen von beliebigen URLs in den einzelnen Datenbank-Elementen/Dateien. Die URLs sind anklickbar.
// Hinzufügen von beliebigen Bild-URLs in den einzelnen Datenbank-Elementen/Dateien. Die Bilder-URLs werden als IMG-Elemente eingebunden und sind anklickbar.
let modifyEntry = function editFile() {
if (q.del) {
    fs.unlinkSync('./files/' + q.del);
} else if (q.close) {
    fs.appendFileSync('./files/' + q.close, `<script>
    function closeTask() {
        document.getElementById('a` + q.close.substring(0, q.close.length - 5) + `').innerHTML = '<span class="orange"><i class="fas fa-archive symbol"></i> Task geschlossen</span>';
      }
      closeTask();
      </script>`);
} else if (q.add) {
    fs.appendFileSync('./files/' + q.add, '<div class="data-textupdate"><i class="fas fa-comment-dots symbol"></i> ' + q.addtext + '</div>');
} else if (q.addurl) {
    fs.appendFileSync('./files/' + q.addnameurl, '<div class="data-urlupdate"><i class="fas fa-link symbol"></i> <a href="' + q.addurl + '" target="_blank">' + q.addurl + '</a></div>');
} else if (q.addimg) {
    fs.appendFileSync('./files/' + q.addimgurl, '<div class="data-imgurlupdate"><i class="fas fa-image symbol"></i> <a href="' + q.addimg + '" target="_blank"><img src="' + q.addimg + '" alt="' + q.addimg + '" class="data-img"></a></div>');
}
}
modifyEntry();

// Diese Funktion dient dazu, dass bei der Auswahl der Priorität eine indivduelle Klasse gespeichert wird, die für eine individuelle Text-Einfärbung sorgt
function sendText(id,num) {
return '<div class="data-closed" id="a' + id + '"><i class="fas fa-archive symbol"></i> Task offen</div>' +
'<div class="data-project"><i class="fas fa-project-diagram symbol"></i> ' +
q.project +
'<div class="data-descr"><i class="fas fa-bug symbol"></i> ' +
q.description +
'</div><div class="data-prio-' + num + '"><i class="fas fa-fire symbol"></i> ' +
q.prio +
'</div><div class="data-person"><i class="fas fa-user symbol"></i> ' +
q.person +
'</div><div class="data-id"><i class="fas fa-key symbol"></i> ' +
q.postid +
'</div><div class="data-date"><i class="fas fa-clock symbol"></i> ' +
TimeAndDate.generateDate() + '</div>';
}

// Je nach Priorität-Auswahl wird die Funktion 'sendText' mit einem individuellen Wert aufgerufen, wo der Wert in den HTML-Tag geschrieben wird. 
let createEntry = function writeFile() {
if (q.prio === 'niedrig') {
    fs.writeFile('./files/' + q.postid + '.html', sendText(q.postid,1), (err) => {
        if (err) throw err;
      });
} else if (q.prio === 'mittel') {
    fs.writeFile('./files/' + q.postid + '.html', sendText(q.postid,2), (err) => {
        if (err) throw err;
      });
} else if (q.prio === 'groß') {
    fs.writeFile('./files/' + q.postid + '.html', sendText(q.postid,3), (err) => {
        if (err) throw err;
      });
}
}
createEntry();

const style = fs.readFileSync('./style/style.css');
const script = fs.readFileSync('./script/script.js');

// Es folgen der gesamte HTML-Text, das CSS-Styling und JavaScript der Anzeige beim localhost-Aufruf
res.write(`
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Bug Tracker von Markus Schmieder</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">


<style>
` + style + `
</style>

</head>

<body>

<div id="all">
<button class="btns-scroll" id="btn-up"><i class="fas fa-chevron-up"></i></button>
<button class="btns-scroll" id="btn-down"><i class="fas fa-chevron-down"></i></button>

    <header>
        <h1>Bug Tracker <i class="fas fa-bug"></i></h1>
        <h2>von Markus Schmieder</h2>
    </header>

    <main>
    <section id="main-input-area">
    
        <div class="btn-ctrl-area">
            <div id="newentryheader">Neuen Eintrag anlegen: </div>
            <input class="btn" type="button" value="Anzeigen" id="btn-InputShowHide">
        </div>
        
        <div id="area-input-show-hide">

            <form action="" method="get" id="form">
                <h4>Projekt <i class="fas fa-project-diagram"></i></h4>
                <input type="text" name="project" placeholder="Um welches Projekt handelt es sich?" required>
                
                <h4>Beschreibung <i class="fas fa-bug"></i></h4>
                <input type="text" name="description" placeholder="Beschreibe das Thema ..." required>

                <h4>Priorität <i class="fas fa-fire"></i></h4>
                <select name="prio">
                <option value="niedrig">niedrig</option>
                <option value="mittel">mittel</option>
                <option value="groß">groß</option>
                </select>

                <h4>Zugeordnete Person <i class="fas fa-user"></i></h4>
                <input type="text" name="person" placeholder="Verantwortliche Person eintragen ..." required><br>

                <input type="hidden" name="postid" value="` + dt.generatePostId() + `" readonly>

                <button class="btn" type="submit" id="btn-main-send" value="Hinzufügen">Hinzufügen <i class="fas fa-plus"></i></button>
            </form>

        </div>

    </section>

    <section class="btn-ctrl-area">
    <div id="dbheader">
        Einträge in der Datenbank <i class="fas fa-database"></i> (` + fs.readdirSync('files').length + `)
    </div>
    
    <form action="" method="get" id="form-refresh">
    <button class="btn" id="btn-refresh" type="button" value="Ansicht aktualisieren">Ansicht aktualisieren <i class="fas fa-sync"></i></button>
    </form>

    <input class="btn" type="button" value="Anzeigen" id="btn-DbShowHide">
    
    </section>
    
    <div id="area-db">
    ` + showList() + `
    </div>
    </main>

</div>

<script>
` + script + `
</script>

</body>
</html>
`);
res.end();
});

// console.log('http://localhost:8080');
server.listen(port, hostname, () => {
    console.log(starturl);
});