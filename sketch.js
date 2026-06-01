let mic;
let fft;
let smoothVolume = 0;
let ghostState = 1;
let ghost1;
let ghost2;
let ghost3;
let bg1;
let bg1;
let bg3;
let bgX = 0;
let baseR = 250;
let baseG = 80;
let baseB = 60;

function preload() {
  ghost1 = loadImage("ghost1.png");
  ghost2 = loadImage("ghost2.png");
  ghost3 = loadImage("ghost3.png");
    bg1 = loadImage("bg1.png");
    bg2 = loadImage("bg2.png");
    bg3 = loadImage("bg3.png");
}

function setup() {
  let cnv = createCanvas(800, 400);
  cnv.parent('canvas-container');
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  imageMode(CENTER);
}

function draw() {
    bgX -= 1;
    if (bgX <= -width) {
        bgX = = 0;
    }
    image(bg1, width / 2 + bgX, height / 2, width, height);
    image(bg2, width / 2 + bgX, height / 2, width, height);
    image(bg3, width / 2 + bgX + width * 2, height / 2, width, height);
    image(bg, width / 2, height / 2, width, height);

  let micLevel = mic.getLevel();
    let smoothFactor = parseFloat(document.getElementById('smoothing').value);
    smoothVolume = lerp(smoothVolume, micLevel, smoothFactor);
    fft.analyze();


  let bass   = fft.getEnergy("bass");
  let mid    = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  // Debug anzeigen
  // --- Kreide-UI ---

let y = height - 25;

// Kreidefarbe (leicht transparent weiß)
stroke(255, 230);
strokeWeight(3);
noFill();

// kleine Unregelmäßigkeit für „handgemalt“
let jitter = () => random(-1.5, 1.5);

// Volumen Linie
let volWidth = map(smoothVolume, 0, 0.1, 0, width/3 - 20);
line(10 + jitter(), y + jitter(), 10 + volWidth + jitter(), y + jitter());

// Bass Linie
let bassWidth = map(bass, 0, 255, 0, width/3 - 20);
line(width/6 + jitter(), y + jitter(), width/6 + bassWidth + jitter(), y + jitter());
  
// Mid Linie
let midWidth = map(mid, 0, 255, 0, width/3 - 20);
line(width/3 + jitter(), y + jitter(), width/3 + midWidth + jitter(), y + jitter());

// Treble Linie
let trebleWidth = map(treble, 0, 255, 0, width/3 - 20);
line(width/2 + jitter(), y + jitter(), width/2 + trebleWidth + jitter(), y + jitter());


// Labels (auch Kreide)
noStroke();
fill(255, 230);
textSize(12);

text("Vol", 10, y - 9);
text("Bass", width/ 6,y - 9);
text("Mid", width/ 3,y - 9);
text("Treble", width/ 2,y-9);

  // Stabilität und Empfindlichkeit 

  
    if (smoothVolume > 0.002) {
        ghostState = 3;
    } else if (smoothVolume > 0.001) {
        ghostState = 2;
    } else {
        ghostState = 1;
    }
  
  let currentGhost;
  
  if (ghostState === 3) {
  currentGhost = ghost3;
} else if (ghostState === 2) {
  currentGhost = ghost2;
} else {
  currentGhost = ghost1;
}


// BASS → dunkler Faktor
let dark = map(bass, 0, 255, 0.4, 1.0);

// TREBLE → heller Faktor
let bright = map(treble, 0, 255, 1.0, 2.0);

// MID → Stabilisierung
let midFactor = map(mid, 0, 255, 0.9, 1.1);

// Gesamtfaktor
let factor =
  (dark * 0.4) +
  (bright * 0.4) +
  (midFactor * 0.2);

// Basisfarbe bleibt gleich
let r = baseR * factor;
let g = baseG * factor;
let b = baseB * factor;

// Begrenzen
r = constrain(r, 0, 255);
g = constrain(g, 0, 255);
b = constrain(b, 0, 255);
  
  tint(r, g, b);
image(currentGhost, width/2, height/2, 600, 800);
noTint();
}