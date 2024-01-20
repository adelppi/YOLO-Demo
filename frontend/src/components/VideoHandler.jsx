import { useEffect } from "react";
import { Webcam } from "../utils/webcam";

const ButtonHandler = ({ cameraRef }) => {
    const webcam = new Webcam();

    useEffect(() => {
        webcam.open(cameraRef.current);
        cameraRef.current.style.display = "block";
        return () => {
            webcam.close(cameraRef.current);
        };
    }, []);

    return <></>;
};

export default ButtonHandler;
