import Webcam from "./features/webcam/Webcam";

function App() {
    return (
        <div className="App d-flex flex-column align-items-center p-3">
            <h1>Face Detection App</h1>
            <Webcam />
        </div>
    );
}

export default App;
