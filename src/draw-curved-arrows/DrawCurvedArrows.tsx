import { drawArrow } from "./drawArrow";
import { arrowSize, marketSize } from "./movementSize";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import styles from "./DrawCurvedArrow.module.scss";
import { Stores } from "./type";

const DrawCurvedArrows = ({
  stores,
  imgUrl,
}: {
  stores: Stores;
  imgUrl: string;
}) => {
  const maxTotalMovement = Math.max(
    ...stores.map((store) => store.total).flat()
  );
  const maxPersonalMovement = Math.max(
    ...stores.map((v) => Object.values(v.movement)).flat()
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedStores, setSelectedStores] = useState<typeof stores>([]);
  const [lines, setLines] = useState<
    {
      startStore: string;
      endStore: string;
      path: {
        angle: number;
        translate: number[];
        lineWidth: number;
        path: Path2D;
      };
      movement: number;
    }[]
  >([]);
  const [renderData, setRenderData] = useState({
    startStore: "",
    endStore: "",
    movement: 0,
    x: 0,
    y: 0,
  });
  const [displayMovement, setDisplayMovement] = useState(false);

  const setSelectedStoresHandler: MouseEventHandler<HTMLLIElement> = (e) => {
    const { id } = e.currentTarget;

    const matchStore = stores.find((store) => store.name === id);
    if (!(id && matchStore)) return;
    if (selectedStores.find((store) => store.name === matchStore.name)) {
      setSelectedStores(
        selectedStores.filter((store) => store.name !== matchStore.name)
      );
    } else {
      setSelectedStores((pre) =>
        pre.length < 2 ? [...pre, matchStore] : [matchStore]
      );
    }
  };

  const selectedStoresResetHandler: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setSelectedStores([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvasSize.width + 100, canvasSize.height + 200);
      const { width, height } = img;
      setCanvasSize({ width, height });
      ctx.drawImage(img, 30, 130);
      setLines([]);

      if (selectedStores.length === 1) {
        stores.forEach((store) => {
          if (store.name === selectedStores[0].name) return;
          const [selectedStore] = selectedStores;

          const leave =
            selectedStore.movement[
              store.name as keyof typeof selectedStore.movement
            ];
          const come =
            store.movement[selectedStore.name as keyof typeof store.movement];
          const { aLength: leaveALength, lineWidth: leaveLineWidth } =
            arrowSize(leave!, maxPersonalMovement);
          const { aLength: comeALength, lineWidth: comeLineWidth } = arrowSize(
            come!,
            maxPersonalMovement
          );
          const { halfStoreSize: firstHalfStoreSize } = marketSize(
            selectedStores[0].total,
            maxTotalMovement
          );
          const { halfStoreSize: secondHalfStoreSize } = marketSize(
            store.total,
            maxTotalMovement
          );

          const leavePath = drawArrow(
            ctx,
            selectedStores[0].coodinate[0],
            selectedStores[0].coodinate[1],
            store.coodinate[0],
            store.coodinate[1],
            leaveALength,
            leaveLineWidth,
            firstHalfStoreSize,
            secondHalfStoreSize
          );
          const comePath = drawArrow(
            ctx,
            store.coodinate[0],
            store.coodinate[1],
            selectedStores[0].coodinate[0],
            selectedStores[0].coodinate[1],
            comeALength,
            comeLineWidth,
            secondHalfStoreSize,
            firstHalfStoreSize,
            true
          );

          setLines((pre) => [
            ...pre,
            {
              startStore: selectedStore.name,
              endStore: store.name,
              movement: leave!,
              path: leavePath!,
            },
          ]);
          setLines((pre) => [
            ...pre,
            {
              startStore: store.name,
              endStore: selectedStore.name,
              movement: come!,
              path: comePath!,
            },
          ]);
        });
      } else {
        const renderStores = selectedStores.length
          ? selectedStores.reverse()
          : stores;
        renderStores.forEach((firstStore, i) => {
          renderStores.forEach((secondStore, j) => {
            if (i <= j) return;
            const leave =
              firstStore.movement[
                secondStore.name as keyof typeof firstStore.movement
              ];
            const come =
              secondStore.movement[
                firstStore.name as keyof typeof secondStore.movement
              ];
            const { aLength: leaveALength, lineWidth: leaveLineWidth } =
              arrowSize(leave!, maxPersonalMovement);
            const { aLength: comeALength, lineWidth: comeLineWidth } =
              arrowSize(come!, maxPersonalMovement);
            const { halfStoreSize: firstHalfStoreSize } = marketSize(
              firstStore.total,
              maxTotalMovement
            );
            const { halfStoreSize: secondHalfStoreSize } = marketSize(
              secondStore.total,
              maxTotalMovement
            );

            const leavePath = drawArrow(
              ctx,
              firstStore.coodinate[0],
              firstStore.coodinate[1],
              secondStore.coodinate[0],
              secondStore.coodinate[1],
              leaveALength,
              leaveLineWidth,
              firstHalfStoreSize,
              secondHalfStoreSize
            );
            const comePath = drawArrow(
              ctx,
              secondStore.coodinate[0],
              secondStore.coodinate[1],
              firstStore.coodinate[0],
              firstStore.coodinate[1],
              comeALength,
              comeLineWidth,
              secondHalfStoreSize,
              firstHalfStoreSize,
              true
            );

            setLines((pre) => [
              ...pre,
              {
                startStore: firstStore.name,
                endStore: secondStore.name,
                movement: leave!,
                path: leavePath!,
              },
            ]);
            setLines((pre) => [
              ...pre,
              {
                startStore: secondStore.name,
                endStore: firstStore.name,
                movement: come!,
                path: comePath!,
              },
            ]);
          });
        });
      }
    };
    console.log(12);
    img.src = imgUrl;
  }, [selectedStores, stores, canvasSize.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.onmousemove = ({ offsetX, offsetY }) => {
      for (let i = 0; i < lines.length; i++) {
        ctx.save();

        ctx.lineWidth = lines[i].path.lineWidth;
        ctx.translate(lines[i].path.translate[0], lines[i].path.translate[1]);
        ctx.rotate(lines[i].path.angle);

        if (ctx.isPointInStroke(lines[i].path.path, offsetX, offsetY)) {
          const { startStore, endStore, movement } = lines[i];
          setRenderData({
            startStore,
            endStore,
            movement,
            x: offsetX,
            y: offsetY,
          });
          setDisplayMovement(true);
          return ctx.restore();
        } else {
          setDisplayMovement(false);
        }

        ctx.restore();
      }
    };
  }, [lines]);

  return (
    <>
      <button onClick={selectedStoresResetHandler}>RESET</button>
      <div className={styles.canvasWrapper}>
        <canvas
          id="canvas"
          ref={canvasRef}
          width={canvasSize.width + 100} // 화살표가 밖으로 나가서 임시로 값 추가
          height={canvasSize.height + 200} // 화살표가 밖으로 나가서 임시로 값 추가
        ></canvas>
        <ul>
          {stores.map((store) => {
            const { storeSize, halfStoreSize } = marketSize(
              store.total,
              maxTotalMovement
            );

            return (
              <li
                id={store.name}
                className={
                  styles.storeList +
                  " " +
                  (selectedStores.find((v) => v.name === store.name)
                    ? styles.active
                    : "")
                }
                key={store.name}
                onClick={setSelectedStoresHandler}
                style={{
                  left: `${store.coodinate[0] - halfStoreSize}px`,
                  top: `${store.coodinate[1] - halfStoreSize}px`,
                  width: `${storeSize}px`,
                  height: `${storeSize}px`,
                }}
              >
                {store.name}
              </li>
            );
          })}
        </ul>
        <div
          style={{
            position: "absolute",
            top: renderData.y + 10 + "px",
            left: renderData.x + 10 + "px",
            backgroundColor: "black",
            color: "white",
            display: displayMovement ? "block" : "none",
          }}
        >
          {renderData.startStore +
            " -> " +
            renderData.endStore +
            "/" +
            renderData.movement}
        </div>
      </div>
    </>
  );
};

export default DrawCurvedArrows;
