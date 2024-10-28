
import './App.css';
import FileUpload from "./components/FileUpload/FileUpload";
import {Toaster} from "react-hot-toast";
import FileItems from "./components/FileItems/FileItems";

function App() {
  return (
    <>
        <Toaster position="top-center"/>
      <FileUpload/>
        <FileItems/>
    </>
  );
}

export default App;
