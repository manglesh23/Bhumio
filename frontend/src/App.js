import logo from "./logo.svg";
import "./App.css";
import PdfEditor from "./component/PDFeditor";

function App() {
  return (
    <div className="App">
      <PdfEditor filename="example.pdf" />
    </div>
  );
}

export default App;
