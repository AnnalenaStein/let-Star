let myStars = [];
let numOfStars;
let StarsData;
let filterCriterion = null;

let minDistance = Infinity; // Startwert für Minimum der Distanz
let maxDistance = -Infinity; // Startwert für Maximum der Distanz
let minRadius = Infinity; // Startwert für Minimum des Radius
let maxRadius = -Infinity; // Startwert für Maximum des Radius


function preload() {
    StarsData = loadJSON("data/StarData.json");
    console.log("StarsData", StarsData);
}

function setup() {
    createCanvas(1440, 820, WEBGL); //WEBGL wegen 3D
    colorMode(HSB, 360, 100, 100);
    let easycam = new Dw.EasyCam(this._renderer, { distance: 700 }); //Distanz die die Kamera im Raum ist
    
    numOfStars = StarsData.Stars.length;
    console.log("numOfStars", numOfStars);

       // Berechne die minimalen und maximalen Entfernungen und Radien
       for (var i = 0; i < numOfStars; i++) {
        let distance = StarsData.Stars[i].Distance;
        let radius = StarsData.Stars[i].Radius;

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
    }

    console.log(`Minimale Entfernung: ${minDistance}, Maximale Entfernung: ${maxDistance}`);
    console.log(`Minimaler Radius: ${minRadius}, Maximaler Radius: ${maxRadius}`);

    for (var i = 0; i < numOfStars; i++) {
        let currentStar = new Stars();
        noStroke();

        currentStar.myName = StarsData.Stars[i].Name;
        currentStar.myTemperature = StarsData.Stars[i].Temperature;
        currentStar.myDistance = map(StarsData.Stars[i].Distance, 0, 962, 1000, 8000); //Min und Max angepasst
        currentStar.myRadius = map(StarsData.Stars[i].Radius, 0, 895, 10, 400); //Min und Max angepasst
        currentStar.myLuminosity = map(StarsData.Stars[i].Mv, 0, 888, 100, 225);

        // Farbe basierend auf der Spektralklasse
        let spectralClass = StarsData.Stars[i]["Spectral Class"].charAt(0);
        switch (spectralClass) {
            case 'O':
            case 'B':
                currentStar.myColor = color(200, 20, currentStar.myLuminosity); // Blau für O und B
                break;
            case 'A':
            case 'F':
                currentStar.myColor = color(60, 5, currentStar.myLuminosity); // Weiß-Gelb für A und F
                break;
            case 'G':
                currentStar.myColor = color(60, 30, 150, currentStar.myLuminosity); // Gelblich für G
                break;
            case 'K':
                currentStar.myColor = color(30, 30, 100, currentStar.myLuminosity); // Orange für K
                break;
            case 'M':
                currentStar.myColor = color(5, 15, 100, currentStar.myLuminosity); // Rot für M
                break;
            default:
                currentStar.myColor = color(225, 1, 225, currentStar.myLuminosity); // Neutral (Weiß) falls unbekannte Spektralklasse
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
                    return star.myRadius > 12;
                case 'medium':
                    return star.myRadius > 10 && star.myRadius <= 12;
                case 'small':
                    return star.myRadius <= 10;
                case 'cold':
                    return star.myTemperature <= 4000;
                case 'warm':
                    return star.myTemperature > 4000 && star.myTemperature <= 7000;
                case 'hot':
                    return star.myTemperature > 7000;
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