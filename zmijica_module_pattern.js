var IgricaZmijica = (function () {
    var visinaTabele = 20,
        sirinaTabele = 20,
        pocetnaPozicija = [[1, 3], [1, 2], [1, 1]],
        zmija = pocetnaPozicija,
        trenutniSmer = 'desno',
        smer = trenutniSmer,
        pauzirano,
        tabela = nacrtajIgru(),
        food,
        poeni = 0,
        vreme = 0,
        zivoti = 3;

    var praznoPolje = 0,
        zmijica = 1,
        hrana = 2;

    document.body.addEventListener("keydown", promeniSmer);
    document.body.addEventListener("keydown", pauzirajIgru);

    pokreniIgru();

    function postaviZmijuNaTabelu() {
        for (var deoZmije = 0; deoZmije < zmija.length; deoZmije++) {
            tabela[zmija[deoZmije][0]][zmija[deoZmije][1]] = zmijica;
        }
        return tabela;
    }

    function daLiJeUdarilaZid() {
        var pozicijaGlaveVertikalno = zmija[0][0];
        var pozicijaGlaveHorizontalno = zmija[0][1];
        return  pozicijaGlaveHorizontalno < 0 || pozicijaGlaveHorizontalno > sirinaTabele-1 || pozicijaGlaveVertikalno < 0 || pozicijaGlaveVertikalno > visinaTabele-1;
    }

    function kretanje(trenutniSmer, zmija) {
        var vertikala = zmija[0][0],
            horizontala = zmija[0][1];

        if (pauzirano == true) {
            return zmija;
        } else {
            if (trenutniSmer == "levo") {
                zmija.unshift([vertikala, horizontala - 1]);
            }
            if (trenutniSmer == "desno") {
                zmija.unshift([vertikala, horizontala + 1]);
            }
            if (trenutniSmer == "gore") {
                zmija.unshift([vertikala - 1, horizontala]);
            }
            if (trenutniSmer == "dole") {
                zmija.unshift([vertikala + 1, horizontala]);
            }
            zmija.pop();
            return zmija;
        }
    }

    function daLiJePreslaPrekoSebe() {
        //bug - ne proverava poslednji element niza zato sto kada (daLiJePojela() == true) vraca true.
        for (var i = 3; i < zmija.length-1; i++) {
            if (zmija[0].toString() == zmija[i].toString()) {
                console.log("presla preko sebe");
                return true;
            }
        }
    }

    function pokreniIgru() {
        postaviHranu();
        var pokreniZmiju = setInterval(function () {
            tabela = nacrtajIgru();
            tabela[food[0]][food[1]] = hrana;
            trenutniSmer = smer;
            if (daLiJePreslaPrekoSebe() || daLiJeUdarilaZid()) {
                smanjiZivote(pokreniZmiju, pokreniVreme);
                zmija = [[1, 3], [1, 2], [1, 1]];
                trenutniSmer = "desno";
                smer = trenutniSmer;
            } else {
                zmija = kretanje(trenutniSmer, zmija);
            }
            postaviZmijuNaTabelu();
            ispisNaStranici(tabela, 20);
            daLiJePojela();
            azurirajStatuse();
        }, 500);
        var pokreniVreme = setInterval(function () {
            if (!pauzirano) vreme++;
        }, 1000);

    }

    function pauzirajIgru(event) {
        if (event.keyCode == 80) { // p
            if (!pauzirano) {
                pauzirano = true;
            } else if (pauzirano) {
                pauzirano = false;
            }
        }
    }

    function prekiniIgru(pokreniZmiju, pokreniVreme) {
        document.getElementById("poruka").innerHTML = "Kraj igre! Ukupan broj osvojenih poena je: <span>" + poeni + "</span>";
        clearInterval(pokreniZmiju);
        clearInterval(pokreniVreme);
    }

    function nacrtajIgru() {
        var platforma = [];
        for (var visina = 0; visina < visinaTabele; visina++) {
            platforma[visina] = [];
            for (var sirina = 0; sirina < sirinaTabele; sirina++) {
                platforma[visina][sirina] = praznoPolje;
            }
        }
        return platforma;
    }

    function ispisNaStranici(niz, velicinaPolja) {
        if (!daLiJeUdarilaZid()) {
            var tabela = document.createElement("table");
            tabela.style.border = "solid 3px gray";
            for (var red = 0; red < niz.length; red++) {
                var redUKoloni = document.createElement("tr");
                for (var kolona = 0; kolona < niz[red].length; kolona++) {
                    var polje = document.createElement("td");
                    if (niz[red][kolona] == 0) polje.style.backgroundColor = "white";
                    if (niz[red][kolona] == 1) polje.style.backgroundColor = "black";
                    if (niz[red][kolona] == 2) polje.style.background = "yellow";
                    polje.style.width = velicinaPolja + "px";
                    polje.style.height = velicinaPolja + "px";
                    polje.style.border = "dotted 1px silver";
                    redUKoloni.appendChild(polje);
                }
                tabela.appendChild(redUKoloni);
            }
            document.getElementById("ispis").innerHTML = tabela.outerHTML;
        }
    }

    function postaviHranu() {
        var hranaPozicijaLeft = Math.floor(Math.random() * tabela[0].length);
        var hranaPozicijaTop = Math.floor(Math.random() * tabela.length);
        for (var index in zmija) {
            while (zmija[index][0] == hranaPozicijaTop && zmija[index][1] == hranaPozicijaLeft) {
                postaviHranu();
            }
        }
        food = [hranaPozicijaTop, hranaPozicijaLeft];
    }

    function daLiJePojela() {
        if (zmija[0][0] == food[0] && zmija[0][1] == food[1]) {
            povecajZmijicu();
            postaviHranu();
            poeni++;
            pustiZvukJednom("collect.wav");
            console.log("pojela");
            return true;
        }
        return false;
    }

    function povecajZmijicu() {
        zmija.push(food);
    }

    function promeniSmer(event) {
        if (event.keyCode == 37) {
            if (trenutniSmer == 'desno') {
                smer = 'desno';
            } else {
                smer = 'levo';
            }
        } else if (event.keyCode == 39) {
            if (trenutniSmer == 'levo') {
                smer = "levo";
            } else {
                smer = 'desno';
            }
        } else if (event.keyCode == 38) {
            if (trenutniSmer == 'dole') {
                smer = 'dole'
            } else {
                smer = 'gore';
            }
        } else if (event.keyCode == 40) {
            if (trenutniSmer == 'gore') {
                smer = "gore";
            } else {
                smer = 'dole';
            }
        }
    }

    function smanjiZivote(int1, int2) {
        if (zivoti == 1){
            prekiniIgru(int1, int2);
        }else{
            zivoti--;
            azurirajStatuse();
        }
    }

    function azurirajStatuse() {
        var statusi = ">> Poeni: <span>" + poeni + "</span> << || >> Vreme: <span>" + vreme + "</span> sec << || >> Zivoti: <span>" + zivoti + "</span> <<";
        document.getElementById("status").innerHTML = statusi;
    }

    function pustiZvukJednom(parametar) {
        oneSound = new Audio(parametar);
        oneSound.play();
    }
})();


