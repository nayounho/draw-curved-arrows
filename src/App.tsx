import DrawCurvedArrows from "./draw-curved-arrows/DrawCurvedArrows";
import { Stores } from "./draw-curved-arrows/type";
import { mockData } from "./mockData";

const imgUrl = "http://3.36.33.116/assets/jdc-stores-sample.png";
const stores = mockData.store as unknown as Stores;

function App() {
  return <DrawCurvedArrows imgUrl={imgUrl} stores={stores} />;
}

export default App;
