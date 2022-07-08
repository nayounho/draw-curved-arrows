import DrawCurvedArrows from "./draw-curved-arrows/DrawCurvedArrows";
import { Stores } from "./draw-curved-arrows/type";
import { mockData } from "./mockData";
import imageUrl from "./assets/jdc-stores-sample.png";

const stores = mockData.store as unknown as Stores;

function App() {
  return <DrawCurvedArrows imgUrl={imageUrl} stores={stores} />;
}

export default App;
