export const arrowSize = (size: number, maxSize: number) => {
  const MAX_ARROW_SIZE = 18;
  const MIN_ARROW_SIZE = 10;
  const MAX_LINEWIDTH = 10;
  const MIN_LINEWIDTH = 2;

  const aLength = Math.ceil(
    (MAX_ARROW_SIZE - MIN_ARROW_SIZE) * (size / maxSize) + MIN_ARROW_SIZE
  );
  const lineWidth = Math.ceil(
    (MAX_LINEWIDTH - MIN_LINEWIDTH) * (size / maxSize) + MIN_LINEWIDTH
  );

  return { aLength, lineWidth };
};

export const marketSize = (movement: number, maxMovement: number) => {
  const MAX_CIRCLE_SIZE = 180;
  const MIN_CIRCLE_SIZE = 90;

  const storeSize = Math.ceil(
    (MAX_CIRCLE_SIZE - MIN_CIRCLE_SIZE) * (movement / maxMovement) +
      MIN_CIRCLE_SIZE
  );
  const halfStoreSize = Math.ceil(
    ((MAX_CIRCLE_SIZE - MIN_CIRCLE_SIZE) * (movement / maxMovement) +
      MIN_CIRCLE_SIZE) /
      2
  );

  return { storeSize, halfStoreSize };
};
