const drinks = [
  { day: "MON", drink: "Coffee", detail: "16 oz", ounces: 16, caffeine: 190, color: "#8B5E3C", social: "alone" },
  { day: "TUE", drink: "Red Bull", detail: "8.4 oz", ounces: 8.4, caffeine: 80, color: "#D94343", social: "alone" },
  { day: "WED", drink: "Monster", detail: "16 oz", ounces: 16, caffeine: 150, color: "#FFFFFF", social: "friends" },
  { day: "THU", drink: "Storm", detail: "12 oz", ounces: 12, caffeine: 160, color: "#C66A9B", social: "alone" },
  { day: "FRI", drink: "NOS", detail: "16 oz", ounces: 16, caffeine: 160, color: "#E2A33A", social: "friends" },
  { day: "SAT", drink: "Green tea", detail: "8 oz", ounces: 8, caffeine: 30, color: "#65945D", social: "roommates" },
  { day: "SUN", drink: "Earl Grey", detail: "8 oz", ounces: 8, caffeine: 40, color: "#83A36D", social: "alone" }
];

const paper = "#F5EBD8";
const ink = "#493C32";
const totalCaffeine = drinks.reduce((sum, drink) => sum + drink.caffeine, 0);

function setup() {
  createCanvas(min(windowWidth, 1100), 820);
  pixelDensity(1);
  textFont("Helvetica");
  noLoop();
}

function draw() {
  background(paper);

  fill(ink);
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(width < 600 ? 25 : 35);
  text("A WEEK OF CAFFEINE", width / 2, 60);

  textStyle(NORMAL);
  textSize(width < 600 ? 10 : 13);
  text("ESTIMATED INTAKE · " + totalCaffeine + " MG FOR THE WEEK", width / 2, 91);

  const spacing = width / drinks.length;
  const centerY = 350;
  const minCaffeine = 30;
  const maxCaffeine = 190;
  const smallestBubble = spacing * 0.28;
  const largestBubble = min(128, spacing * 0.62);

  drinks.forEach((drink, index) => {
    const x = spacing * (index + 0.5);
    const diameter = map(drink.caffeine, minCaffeine, maxCaffeine, smallestBubble, largestBubble);
    const bubbleColor = color(drink.color);

    fill(ink);
    textFont("Marker Felt");
    textStyle(NORMAL);
    textSize(width < 600 ? 20 : 25);
    text(drink.day, x, 155);
    textFont("Helvetica");

    // Solid sketch rings encode serving size; dotted rings encode company.
    drawOzRings(x, centerY, diameter, drink.ounces, index * 13 + 3);
    drawSocialRings(x, centerY, diameter, drink.social !== "alone", drink.color);

    // Bubble size communicates caffeine; its fill color identifies the drink.
    drawHandDrawnBubble(x, centerY, diameter, bubbleColor, index * 19 + 7);

    fill(ink);
    textStyle(BOLD);
    textSize(width < 600 ? 10 : 16);
    text(drink.caffeine + " mg", x, centerY);

    textStyle(BOLD);
    textSize(width < 600 ? 9 : 13);
    text(drink.drink.toUpperCase(), x, 465);

    textStyle(NORMAL);
    textSize(width < 600 ? 7 : 10);
    text(drink.detail, x, 486);

    drawHandDrawnLine(x - spacing * 0.28, 520, x + spacing * 0.28, 520, index);

    noStroke();
    fill(bubbleColor);
    circle(x, 548, 9);
    fill(ink);
    textStyle(BOLD);
    textSize(14);
    text(index + 1, x + 14, 548);
  });

  drawLegend();
  drawGrain();
}

function drawHandDrawnBubble(x, y, diameter, bubbleColor, seed) {
  const radius = diameter / 2;
  const points = 48;

  // A second, lightly offset contour gives each bubble a sketched edge.
  for (let pass = 0; pass < 2; pass++) {
    push();
    translate(x + (pass ? 1.2 : 0), y + (pass ? -0.8 : 0));
    if (pass === 0) {
      fill(bubbleColor);
      stroke(ink);
      strokeWeight(1.2);
    } else {
      noFill();
      stroke(ink);
      strokeWeight(0.7);
    }

    beginShape();
    for (let i = 0; i <= points; i++) {
      const angle = TWO_PI * i / points;
      const wobble = sin(angle * 5 + seed) * 1.1 + sin(angle * 9 + seed * 0.7) * 0.65;
      const offset = pass ? sin(angle * 7 + seed) * 0.6 : 0;
      const r = radius + wobble + offset;
      vertex(cos(angle) * r, sin(angle) * r);
    }
    endShape(CLOSE);
    pop();
  }
}

function drawOzRings(x, y, diameter, ounces, seed) {
  const ringCount = ounces < 10 ? 1 : ounces < 16 ? 2 : 3;
  const points = 48;

  noFill();
  stroke("#887965");
  strokeWeight(0.9);
  for (let ring = 0; ring < ringCount; ring++) {
    const radius = diameter / 2 + 3 + ring * 4;
    beginShape();
    for (let i = 0; i <= points; i++) {
      const angle = TWO_PI * i / points;
      const wobble = sin(angle * 5 + seed + ring) * 0.7;
      vertex(x + cos(angle) * (radius + wobble), y + sin(angle) * (radius + wobble));
    }
    endShape(CLOSE);
  }
}

function drawHandDrawnLine(x1, y1, x2, y2, seed) {
  stroke("#BBAA90");
  strokeWeight(1);
  line(x1, y1, x2, y2);
  stroke(ink);
  strokeWeight(0.45);
  line(x1 + 1, y1 + sin(seed) * 1.2, x2 - 1, y2 + cos(seed) * 1.2);
}

function drawGrain() {
  randomSeed(24);
  noStroke();

  for (let i = 0; i < 6500; i++) {
    const alpha = random(5, 15);
    fill(random() > 0.5 ? color(73, 60, 50, alpha) : color(255, 250, 235, alpha));
    circle(random(width), random(height), random(0.4, 1.5));
  }
}

function drawSocialRings(x, y, diameter, shared, drinkColor) {
  const ringCount = shared ? 2 : 1;
  const dotSize = max(3, min(6, width / 180));

  for (let ring = 0; ring < ringCount; ring++) {
    const radius = diameter / 2 + 15 + ring * 7;
    const dotCount = 8;

    for (let i = 0; i < dotCount; i++) {
      const angle = TWO_PI * i / dotCount;
      const dotX = x + cos(angle) * radius;
      const dotY = y + sin(angle) * radius;
      fill(drinkColor);
      stroke(drinkColor === "#FFFFFF" ? ink : drinkColor);
      strokeWeight(0.8);
      circle(dotX, dotY, dotSize);
    }
  }
}

function drawLegend() {
  fill(ink);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text("HOW TO READ THE WEEK", width / 2, 625);

  fill(ink);
  textStyle(NORMAL);
  textSize(width < 600 ? 9 : 12);
  text("BUBBLE SIZE = CAFFEINE", width / 2 - width * 0.23, 657);
  text("BUBBLE COLOR = DRINK", width / 2 + width * 0.23, 657);

  const swatches = [
    { label: "Coffee", color: "#8B5E3C" },
    { label: "Red Bull", color: "#D94343" },
    { label: "Monster", color: "#FFFFFF" },
    { label: "Tea", color: "#65945D" }
  ];
  const swatchSpacing = min(150, width / swatches.length);
  swatches.forEach((swatch, index) => {
    const x = width / 2 + (index - (swatches.length - 1) / 2) * swatchSpacing;
    fill(swatch.color);
    stroke(swatch.color === "#FFFFFF" ? ink : swatch.color);
    strokeWeight(1);
    circle(x - 29, 687, 12);
    noStroke();
    fill(ink);
    textAlign(LEFT, CENTER);
    textSize(width < 600 ? 8 : 10);
    text(swatch.label, x - 19, 687);
  });

  fill(ink);
  textAlign(CENTER, CENTER);
  textSize(width < 600 ? 9 : 11);
  text("OZ RINGS: 1 = 8 oz · 2 = 12 oz · 3 = 16 oz", width / 2, 720);
  text("DOTTED RINGS: 1 = ALONE · 2 = SHARED", width / 2, 738);
  textSize(width < 600 ? 8 : 11);
  text("Caffeine amounts are estimates; actual values vary by brand and preparation.", width / 2, 755);
  text("MONDAY – SUNDAY", width / 2, 790);
}

function windowResized() {
  resizeCanvas(min(windowWidth, 1100), 820);
  redraw();
}
