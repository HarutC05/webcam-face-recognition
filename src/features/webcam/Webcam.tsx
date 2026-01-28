import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { webcamOn, webcamOff } from "./webcamSlice";
import type { RootState } from "../../app/store";
import { detectFaces, loadModels } from "../face/faceService";
import {
    setFaces,
    clearFaces,
    Face,
    FaceExpressions,
    Gender,
} from "../face/faceSlice";
import FaceOverlay from "../../components/FaceOverlay";

type Detection = {
    detection: { box: { x: number; y: number; width: number; height: number } };
    age: number;
    gender: Gender;
    expressions: {
        asSortedArray: () => { expression: string; probability: number }[];
    };
};

function Webcam() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dispatch = useDispatch();
    const isWebcamOn = useSelector((state: RootState) => state.webcam.isOn);
    const animationRef = useRef<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Start webcam
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) videoRef.current.srcObject = stream;
            dispatch(webcamOn());

            await loadModels();

            const detectLoop = async () => {
                if (!videoRef.current) return;

                const detections = (await detectFaces(
                    videoRef.current,
                )) as Detection[];
                const faceData = detections.map((d) => mapDetectionToFace(d));
                dispatch(setFaces(faceData));

                animationRef.current = requestAnimationFrame(detectLoop);
            };

            detectLoop();
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    };

    // Stop webcam
    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        if (animationRef.current) cancelAnimationFrame(animationRef.current);

        dispatch(webcamOff());
        dispatch(clearFaces());
    };

    // Handle image upload
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setImageFile(e.target.files[0]);
        dispatch(clearFaces());
        await loadModels();

        const img = new Image();
        img.src = URL.createObjectURL(e.target.files[0]);
        img.onload = async () => {
            if (!canvasRef.current) return;
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(img, 0, 0, img.width, img.height);

            const detections = (await detectFaces(img)) as Detection[];
            const faceData = detections.map((d) => mapDetectionToFace(d));
            dispatch(setFaces(faceData));
        };
    };

    const mapDetectionToFace = (d: Detection): Face => {
        const expressions: FaceExpressions = {
            neutral: 0,
            happy: 0,
            sad: 0,
            angry: 0,
            fearful: 0,
            disgusted: 0,
            surprised: 0,
        };

        d.expressions.asSortedArray().forEach((e) => {
            if (expressions.hasOwnProperty(e.expression)) {
                expressions[e.expression as keyof FaceExpressions] =
                    e.probability;
            }
        });

        return {
            x: d.detection.box.x,
            y: d.detection.box.y,
            width: d.detection.box.width,
            height: d.detection.box.height,
            age: d.age,
            gender: d.gender,
            expressions,
        };
    };

    // Cleanup
    useEffect(() => {
        return () => stopWebcam();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center mt-3">
            <div
                className="video-container position-relative"
                style={{ width: "100%", maxWidth: 480, aspectRatio: "4/3" }}
            >
                {!imageFile && (
                    <video
                        ref={videoRef}
                        autoPlay
                        width="100%"
                        height="100%"
                        className="border"
                    />
                )}
                {imageFile && (
                    <canvas
                        ref={canvasRef}
                        className="border"
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
                <FaceOverlay />
            </div>

            <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                <button
                    className="btn btn-success"
                    onClick={startWebcam}
                    disabled={isWebcamOn || !!imageFile}
                >
                    Start Webcam
                </button>
                <button
                    className="btn btn-danger"
                    onClick={stopWebcam}
                    disabled={!isWebcamOn && !imageFile}
                >
                    Stop Webcam
                </button>
                <label className="btn btn-primary mb-0">
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                    />
                </label>
                {imageFile && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setImageFile(null);
                            dispatch(clearFaces());
                        }}
                    >
                        Clear Image
                    </button>
                )}
            </div>
        </div>
    );
}

export default Webcam;
