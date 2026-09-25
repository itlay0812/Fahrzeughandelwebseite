/* Das Bildmaterial der Schwarzwaldstraße – reine Pfade, keine Dateien: Das
   Spiel soll kein einziges Kilobyte nachladen. Alle Farben kommen aus der
   Palette der Seite, damit das Minispiel zur Marke gehört und nicht zu
   einem fremden Spielautomaten. */

export const FARBE = {
  umland: "#e7dcc7", // crema-scura
  strasse: "#2a231d", // nero-morbido
  linie: "#f2eada", // crema
  rosso: "#c8102e",
  rossoScuro: "#8a0a20",
  creme: "#fbf7f0", // crema-chiara
  asfalto: "#4f483f",
  alluminio: "#6b6356",
  nero: "#1a1512",
};

type Ctx = CanvasRenderingContext2D;

function kasten(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Ein Wagen von oben. `entgegen` dreht ihn – Gegenverkehr zeigt nach unten. */
export function autoZeichnen(
  ctx: Ctx,
  x: number,
  y: number,
  lack: string,
  entgegen = false,
) {
  const w = 30;
  const h = 54;
  const links = x - w / 2;
  const oben = y - h / 2;

  ctx.save();
  if (entgegen) {
    ctx.translate(x, y);
    ctx.rotate(Math.PI);
    ctx.translate(-x, -y);
  }

  // Schatten auf dem Asphalt
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  kasten(ctx, links + 2, oben + 4, w, h, 8);
  ctx.fill();

  // Räder
  ctx.fillStyle = "#17120f";
  kasten(ctx, links - 3, oben + 8, 5, 13, 2);
  ctx.fill();
  kasten(ctx, links + w - 2, oben + 8, 5, 13, 2);
  ctx.fill();
  kasten(ctx, links - 3, oben + h - 21, 5, 13, 2);
  ctx.fill();
  kasten(ctx, links + w - 2, oben + h - 21, 5, 13, 2);
  ctx.fill();

  // Karosserie
  ctx.fillStyle = lack;
  kasten(ctx, links, oben, w, h, 8);
  ctx.fill();

  // Scheiben – die vordere liegt schmaler, das gibt dem Dach Richtung.
  ctx.fillStyle = "rgba(20,16,13,0.55)";
  kasten(ctx, links + 5, oben + 7, w - 10, 11, 3);
  ctx.fill();
  kasten(ctx, links + 4, oben + h - 20, w - 8, 12, 3);
  ctx.fill();

  // Dachfläche als Glanzkante
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  kasten(ctx, links + 5, oben + 20, w - 10, h - 42, 3);
  ctx.fill();

  // Scheinwerfer
  ctx.fillStyle = "rgba(251,247,240,0.9)";
  kasten(ctx, links + 4, oben + 1, 6, 3, 1.5);
  ctx.fill();
  kasten(ctx, links + w - 10, oben + 1, 6, 3, 1.5);
  ctx.fill();

  ctx.restore();
}

/** Ein Reh, quer auf der Fahrbahn – das klassische Schwarzwald-Schreckmoment. */
export function rehZeichnen(ctx: Ctx, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(x + 2, y + 5, 15, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5c5348";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  // Beine
  for (const bx of [-9, -4, 5, 10]) {
    ctx.beginPath();
    ctx.moveTo(x + bx, y + 1);
    ctx.lineTo(x + bx, y + 9);
    ctx.stroke();
  }

  // Rumpf
  ctx.fillStyle = "#8a7c65";
  ctx.beginPath();
  ctx.ellipse(x, y - 2, 14, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hals und Kopf
  ctx.strokeStyle = "#8a7c65";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x + 10, y - 3);
  ctx.lineTo(x + 17, y - 9);
  ctx.stroke();
  ctx.fillStyle = "#8a7c65";
  ctx.beginPath();
  ctx.ellipse(x + 18, y - 10, 5, 4, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Ohren
  ctx.strokeStyle = "#6b6356";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 16, y - 13);
  ctx.lineTo(x + 14, y - 17);
  ctx.moveTo(x + 19, y - 13);
  ctx.lineTo(x + 20, y - 17);
  ctx.stroke();

  // Zwei Lichtpunkte: Augen im Scheinwerfer
  ctx.fillStyle = "#fbf7f0";
  ctx.beginPath();
  ctx.arc(x + 20, y - 11, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Schlagloch – nach dem Winter gehört es zur Landstraße dazu. */
export function lochZeichnen(ctx: Ctx, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = "#4a4138";
  ctx.beginPath();
  ctx.ellipse(x, y, 19, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#120e0b";
  ctx.beginPath();
  ctx.ellipse(x, y + 1, 15, 7.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Tannen am Straßenrand – sie geben der Fahrt ihr Tempo. */
export function tanneZeichnen(ctx: Ctx, x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  ctx.fillStyle = "rgba(26,21,18,0.16)";
  ctx.beginPath();
  ctx.ellipse(3, 14, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3f3a30";
  ctx.fillRect(-2, 4, 4, 11);
  ctx.fillStyle = "#4f483f";
  for (const [oben, breite] of [
    [-24, 10],
    [-14, 13],
    [-4, 16],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(0, oben);
    ctx.lineTo(breite, oben + 13);
    ctx.lineTo(-breite, oben + 13);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
