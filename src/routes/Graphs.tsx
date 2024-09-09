import("bootstrap");
import GraphsMainContent from "../components/Graphs Page Components/GraphsMainContent";
import MainMenuBar from "../components/Common Components/MainMenuBar";

function Graphs() {
  return (
    <div>
      <MainMenuBar isHomePageActive={false} />

      <GraphsMainContent />
    </div>
  );
}

export default Graphs;
