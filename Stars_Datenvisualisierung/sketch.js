let myStars = [];
let numOfStars;
let StarsData;
let filterCriterion = null;

let minDistance = Infinity; // Startwert für Minimum der Distanz
let maxDistance = -Infinity; // Startwert für Maximum der Distanz
let minRadius = Infinity; // Startwert für Minimum des Radius
let maxRadius = -Infinity; // Startwert für Maximum des Radius
let minMv = Infinity; // Startwert für Minimum der MV
let maxMv = -Infinity;
let minTemperature = Infinity; // Startwert für Minimum der MV
let maxTemperature = -Infinity;


function preload() {
    StarsData = loadJSON("data/StarData.json");
    console.log("StarsData", StarsData);
}

function setup() {
    createCanvas(1440, 820, WEBGL); //WEBGL wegen 3D
    colorMode(HSB, 360, 100, 100);
    let easycam = new Dw.EasyCam(this._renderer, { distance: 3000 }); //Distanz die die Kamera im Raum ist

    numOfStars = StarsData.Stars.length;
    console.log("numOfStars", numOfStars);

    // Berechne die minimalen und maximalen Entfernungen und Radien
    for (var i = 0; i < numOfStars; i++) {
        let distance = StarsData.Stars[i].Distance;
        let radius = StarsData.Stars[i].Radius;
        let mv = StarsData.Stars[i].Mv;
        let temperature = StarsData.Stars[i].Temperature;

        if (distance < minDistance) {
            minDistance = distance;
        }
        if (distance > maxDistance) {
            maxDistance = distance;
        }

        if (radius < minRadius) {
            minRadius = radius;
        }
        if (radius > maxRadius) {
            maxRadius = radius;
        }
        if (mv < minMv) {
            minMv = mv;
        }
        if (mv > maxMv) {
            maxMv = mv;
        }
        if (temperature < minTemperature) {
            minTemperature = temperature;
        }
        if (temperature > maxTemperature) {
            maxTemperature = temperature;
        }
    }

    console.log(`Minimale Entfernung: ${minDistance}, Maximale Entfernung: ${maxDistance}`);
    console.log(`Minimaler Radius: ${minRadius}, Maximaler Radius: ${maxRadius}`);
    console.log(`Minimaler Mv: ${minMv}, Maximaler Mv: ${maxMv}`);
    console.log(`Minimale Temperatur: ${minTemperature}, Maximale Temperatur: ${maxTemperature}`);

    for (var i = 0; i < numOfStars; i++) {
        let currentStar = new Stars();
        noStroke();

        currentStar.myName = StarsData.Stars[i].Name;
        currentStar.myEinheitRadius = StarsData.Stars[i].EinheitRadius;
        currentStar.myTemperature = StarsData.Stars[i].Temperature;
        currentStar.myDistance = map(StarsData.Stars[i].Distance, 0, 25.999, 0, 3000); //Min und Max angepasst
        currentStar.myRadius = map(StarsData.Stars[i].Radius, 0, 9.14, 10, 200); //Min und Max angepasst
        currentStar.myLuminosity = map(StarsData.Stars[i].Mv, 0, 27.57, 100, 225);

        // Umrechnungsfaktoren
        const radiusEarth = 1; // 1 Re
        const radiusSun = 0.004; // 1 Rs in Re
        const radiusJupiter = 0.11; // 1 Rj in Re

        // Berechnung des Radius in Erdradien
        if (StarsData.Stars[i].EinheitRadius === "Re") {
            currentStar.mySize = StarsData.Stars[i].Radius; // Bereits in Re
        } else if (StarsData.Stars[i].EinheitRadius === "Rs") {
            currentStar.mySize = StarsData.Stars[i].Radius * (1 / radiusSun); // Umrechnung in Re
        } else if (StarsData.Stars[i].EinheitRadius === "Rj") {
            currentStar.mySize = StarsData.Stars[i].Radius * (radiusJupiter / radiusEarth); // Umrechnung in Re
        } else {
            currentStar.mySize = 1; // Standardgröße, wenn keine Einheit angegeben ist
        }

        // console.log(`Original Radius (Einheit: ${StarsData.Stars[i].EinheitRadius}): ${StarsData.Stars[i].Radius}`);
        // console.log(`Umgerechneter Radius in Erdradien: ${currentStar.mySize}`);

        // Farbe basierend auf der Spektralklasse
        let spectralClass = StarsData.Stars[i]["Spectral Class"].charAt(0);
        switch (spectralClass) {
            case 'O':
            case 'B':
                currentStar.myColor = color(230, 80, 100); // Blau für O und B
                break;
            case 'A':
            case 'F':
                currentStar.myColor = color(60, 30, 100); // Weiß-Gelb für A und F
                break;
            case 'G':
                currentStar.myColor = color(45, 70, 100); // Helles Gelb für G
                break;
            case 'K':
                currentStar.myColor = color(30, 60, 100); // Helles Orange für K
                break;
            case 'M':
                currentStar.myColor = color(0, 50, 100); // Helles Rot für M
                break;
            case 'T':
                currentStar.myColor = color(270, 40, 100); // Helles Violett für T
                break;
            case 'Y':
            case 'L':
                currentStar.myColor = color(20, 80, 50); // Dunkelrot-braun für Y und L 
                break;
            case 'D':
                currentStar.myColor = color(200, 40, 100); // Helles Weiß für Weißzwerge
                break;
            default:
                currentStar.myColor = color(40, 4, 100); // Helles Neutral (Weiß) 
        }

        let k = random(2 * PI);
        let j = random(2 * PI);

        // Verwendung der Distanz für die Position
        currentStar.myX = currentStar.myDistance * (sin(j)) * (cos(k));
        currentStar.myY = currentStar.myDistance * (sin(j)) * (sin(k));
        currentStar.myZ = currentStar.myDistance * (cos(j));

        currentStar.mySize = currentStar.myRadius; // Ensure mySize is set

        myStars[i] = currentStar;
    }

    // Add event listeners for buttons
    document.getElementById('ButtonAll').addEventListener('click', () => { filterCriterion = 'all'; updateSelectedButton('ButtonAll'); });

    // Size
    document.getElementById('sizeButtonBig').addEventListener('click', () => { filterCriterion = 'big'; updateSelectedButton('sizeButtonBig'); });
    document.getElementById('sizeButtonMedium').addEventListener('click', () => { filterCriterion = 'medium'; updateSelectedButton('sizeButtonMedium'); });
    document.getElementById('sizeButtonSmall').addEventListener('click', () => { filterCriterion = 'small'; updateSelectedButton('sizeButtonSmall'); });

    // Temperatur
    document.getElementById('coldButton').addEventListener('click', () => { filterCriterion = 'cold'; updateSelectedButton('coldButton'); });
    document.getElementById('warmButton').addEventListener('click', () => { filterCriterion = 'warm'; updateSelectedButton('warmButton'); });
    document.getElementById('hotButton').addEventListener('click', () => { filterCriterion = 'hot'; updateSelectedButton('hotButton'); });

    // Funktion zum Aktualisieren des ausgewählten Buttons
    function updateSelectedButton(selectedId) {
        const buttons = document.querySelectorAll('.filterButton');
        buttons.forEach(button => {
            button.classList.remove('selected'); // Entferne die 'selected'-Klasse von allen Buttons
        });
        document.getElementById(selectedId).classList.add('selected'); // Füge die 'selected'-Klasse zum ausgewählten Button hinzu
    }
}

function draw() {
    background(180, 0, 0);

    let filteredStars = myStars;

    // Prüfen, ob ein Filter aktiv ist; falls nicht, werden alle Sterne angezeigt
    if (filterCriterion && filterCriterion !== 'all') {
        filteredStars = myStars.filter(star => {
            switch (filterCriterion) {
                case 'big':
                    return star.myRadius > 50;
                case 'medium':
                    return star.myRadius > 25 && star.myRadius <= 50;
                case 'small':
                    return star.myRadius <= 25;
                case 'cold':
                    return star.myTemperature <= 1110;
                case 'warm':
                    return star.myTemperature > 1110 && star.myTemperature <= 5100;
                case 'hot':
                    return star.myTemperature > 5100;
                default:
                    return true;
            }
        });
    }

    console.log(`Filter: ${filterCriterion}, Anzahl gefilterter Sterne: ${filteredStars.length}`);

    // Zeichne die kleine Kugel in der Mitte
    push();
    fill(215, 89, 64); // Gelbe Farbe
    translate(0, 0, 0);
    sphere(5); // Radius der Kugel
    pop();

    for (let i = 0; i < filteredStars.length; i++) {
        filteredStars[i].display();
    }
}