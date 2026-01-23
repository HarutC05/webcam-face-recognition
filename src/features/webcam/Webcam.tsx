import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { webcamOn, webcamOff } from "./webcamSlice";
import type { RootState } from "../../app/store";
import { detectFaces, loadModels } from "../face/faceService";

function Webcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const dispatch = useDispatch();
    const isWebcamOn = useSelector((state: RootState) => state.webcam.isOn);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            videoRef.current!.srcObject = stream;

            // ----> TEST CODE GOES HERE <----
            await loadModels();
            const faces = await detectFaces(videoRef.current!);
            console.log(faces);
            // ----> END TEST <----

            dispatch(webcamOn());
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            dispatch(webcamOff());
        }
    };

    return (
        <div className="text-center mt-3">
            <video ref={videoRef} autoPlay width={400} className="border" />
            <div className="mt-2">
                <button
                    className="btn btn-success me-2"
                    onClick={startWebcam}
                    disabled={isWebcamOn}
                >
                    Start Webcam
                </button>
                <button
                    className="btn btn-danger"
                    onClick={stopWebcam}
                    disabled={!isWebcamOn}
                >
                    Stop Webcam
                </button>
            </div>
        </div>
    );
}

export default Webcam;
