import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import "./FaceOverlay.css";

function FaceOverlay() {
    const faces = useSelector((state: RootState) => state.face.faces);
    const videoOrCanvas = document.querySelector("video, canvas");

    const scaleX = videoOrCanvas
        ? (videoOrCanvas as HTMLVideoElement | HTMLCanvasElement).clientWidth /
          ((videoOrCanvas as HTMLVideoElement).videoWidth ||
              (videoOrCanvas as HTMLCanvasElement).width)
        : 1;
    const scaleY = videoOrCanvas
        ? (videoOrCanvas as HTMLVideoElement | HTMLCanvasElement).clientHeight /
          ((videoOrCanvas as HTMLVideoElement).videoHeight ||
              (videoOrCanvas as HTMLCanvasElement).height)
        : 1;

    return (
        <div className="overlay-container">
            {faces.map((face, i) => (
                <div
                    key={i}
                    className="face-box"
                    style={{
                        left: `${face.x * scaleX}px`,
                        top: `${face.y * scaleY}px`,
                        width: `${face.width * scaleX}px`,
                        height: `${face.height * scaleY}px`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 12,
                            background: "rgba(0,0,0,0.5)",
                            padding: "2px 4px",
                        }}
                    >
                        {face.age ? face.age.toFixed(0) : "?"} |{" "}
                        {face.gender || "?"}
                    </div>
                    <div style={{ fontSize: 10 }}>
                        {face.expressions &&
                            Object.entries(face.expressions).map(
                                ([exp, prob]) => (
                                    <div key={exp}>
                                        {exp}: {Math.round(prob * 100)}%
                                    </div>
                                ),
                            )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FaceOverlay;
