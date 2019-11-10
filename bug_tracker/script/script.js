    /* Nachfolgend sind alle EventListener. */
    window.addEventListener('scroll', () => {showHideUpBtn();showHideDownBtn()});
    document.getElementById("btn-up").addEventListener("click",() => {scrollWin(0, -1200)});
    document.getElementById("btn-down").addEventListener("click",() => {scrollWin(0, 1200)});
    document.getElementById("btn-InputShowHide").addEventListener("click",() => {showHideInput();showHideDownBtn()});
    document.getElementById("btn-DbShowHide").addEventListener("click",() => {showHideDb();showHideDownBtn()});
    document.getElementById("btn-refresh").addEventListener("click",() => {document.getElementById("form-refresh").submit()});

    /* Funktion, die die Scrolldistanz für die Scrollknöpfe bestimmt. */
    function scrollWin(x, y) {
    window.scrollBy(x, y);
    }

    /* Funktion, die die Bedingungen für die Anzeige vom Hochscroll-Knopf regelt. */
    function showHideUpBtn() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("btn-up").style.display = "block";
    } else {
        document.getElementById("btn-up").style.display = "none";
    }
    }

    /* Funktion, die die Bedingungen für die Anzeige vom Runterscroll-Knopf regelt. */
    function showHideDownBtn() {
        let distanceFromBottom = document.body.scrollHeight - window.innerHeight - window.scrollY;

        if (distanceFromBottom < 50 || document.body.scrollHeight === window.innerHeight) {
        document.getElementById("btn-down").style.display = "none";
      } else {
        document.getElementById("btn-down").style.display = "block";
      }
    }

    /* Funktion, die den Anzeigen-/Verstecken-Knopf für die Datenbankanzeige definiert. */
    function showHideDb() {
        if (document.getElementById("area-db").style.display === "block") {
        document.getElementById("area-db").style.display = "none";
        document.getElementById("btn-DbShowHide").value = "Anzeigen";
    } else {
        document.getElementById("area-db").style.display = "block";
        document.getElementById("btn-DbShowHide").value = "Verstecken";
    }
    }

    /* Funktion, die den Anzeigen-/Verstecken-Knopf für die Eingabe definiert. */
    function showHideInput() {
        if (document.getElementById("area-input-show-hide").style.display === "block") {
        document.getElementById("area-input-show-hide").style.display = "none";
        document.getElementById("btn-InputShowHide").value = "Anzeigen";
    } else {
        document.getElementById("area-input-show-hide").style.display = "block";
        document.getElementById("btn-InputShowHide").value = "Verstecken";
    }
    }