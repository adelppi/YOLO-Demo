import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import VideoHandler from "./components/VideoHandler";
import { detect, detectVideo } from "./utils/detect";
import "./style/App.css";

const App = () => {
    const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
    const [model, setModel] = useState({
        net: null,
        inputShape: [1, 0, 0, 3],
    }); // init model & input shape

    // references
    const cameraRef = useRef(null);
    const canvasRef = useRef(null);

    // model configs
    const modelName = "best";

    useEffect(() => {
        const initialize = async () => {
            await tf.ready();

            const yolov8 = await tf.loadGraphModel(
                `${window.location.href}/${modelName}_web_model/model.json`,
                {
                    onProgress: (fractions) => {
                        setLoading({ loading: true, progress: fractions });
                    },
                }
            );

            const dummyInput = tf.ones(yolov8.inputs[0].shape);
            const warmupResults = yolov8.execute(dummyInput);

            setLoading({ loading: false, progress: 1 });
            setModel({
                net: yolov8,
                inputShape: yolov8.inputs[0].shape,
            });

            tf.dispose([warmupResults, dummyInput]);

            webcam.open(cameraRef.current);
            cameraRef.current.style.display = "block";
        };

        initialize();
    }, []);

    return (
        <div className="App">
            <div className="header">
                <h1>YOLOを体験してみよう!</h1>
            </div>
            {loading.loading ? (
                <h3>読み込み中... {(loading.progress * 100).toFixed(2)}%</h3>
            ) : (
                <h3>カメラを人にかざすと認識するよ</h3>
            )}

            <div className="content">
                <video
                    autoPlay
                    muted
                    ref={cameraRef}
                    onPlay={() =>
                        detectVideo(cameraRef.current, model, canvasRef.current)
                    }
                />
                <canvas
                    width={model.inputShape[1]}
                    height={model.inputShape[2]}
                    ref={canvasRef}
                />
            </div>

            <VideoHandler cameraRef={cameraRef} />
        </div>
    );
};

export default App;
