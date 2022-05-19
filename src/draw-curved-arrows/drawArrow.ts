export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x0: number, // 시작점 x
  y0: number, // 시작점 y
  x1: number, // 끝점 x
  y1: number, // 끝점 y
  aLength: number, // 화살 날개의 길이
  lineWidth: number, // 선의 전체 굵기
  firstStoreSize: number,
  secondStoreSize: number,
  secondary = false
) {
  const storeGap = secondStoreSize - firstStoreSize;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const angleX = dx === 0 ? (dy >= 0 ? storeGap : -storeGap) : dx;
  const angleY = dx === 0 ? dy : dx > 0 ? dy - storeGap : dy + storeGap;
  const angle = Math.atan2(angleY, angleX);
  const length = Math.sqrt(angleX * angleX + angleY * angleY);
  const arrowGap = firstStoreSize + lineWidth * 2.5;
  const borderArrowAddGap = 2;

  if (ctx) {
    // border arrow
    ctx.lineWidth = lineWidth + 4;

    ctx.translate(x0, y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";

    ctx.arc(
      length / 2 - lineWidth / 4,
      (length / 2) * Math.sqrt(3) - arrowGap,
      length,
      (Math.PI / 180) * (240 - 0.1),
      (Math.PI / 180) * (300 - 0.1),
      false
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(length, lineWidth / 2 - arrowGap + borderArrowAddGap);
    ctx.lineTo(
      length - aLength - borderArrowAddGap,
      lineWidth / 2 - arrowGap + borderArrowAddGap
    );
    ctx.lineTo(length, lineWidth / 2 - aLength - arrowGap - borderArrowAddGap);
    ctx.lineTo(length + borderArrowAddGap, lineWidth / 2 - arrowGap);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // color arrow
    ctx.lineWidth = lineWidth;
    ctx.translate(x0, y0);
    ctx.rotate(angle);

    // Line
    // ctx.clearRect(0, 0, 1300, 600);
    ctx.strokeStyle = secondary
      ? "rgba(255, 99, 132, 1)"
      : "rgba(54, 162, 235, 1)";
    ctx.fillStyle = secondary
      ? "rgba(255, 99, 132, 1)"
      : "rgba(54, 162, 235, 1)";

    const line = new Path2D();
    line.arc(
      length / 2 - lineWidth / 4,
      (length / 2) * Math.sqrt(3) - arrowGap,
      length,
      (Math.PI / 180) * 240,
      (Math.PI / 180) * 300,
      false
    );
    ctx.stroke(line);

    // Arrow Header
    ctx.beginPath();
    ctx.moveTo(length, lineWidth / 2 - arrowGap);
    ctx.lineTo(length - aLength, lineWidth / 2 - arrowGap);
    ctx.lineTo(length, lineWidth / 2 - aLength - arrowGap);
    ctx.lineTo(length, lineWidth / 2 - arrowGap);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    return { angle, translate: [x0, y0], lineWidth, path: line };
  }
}
