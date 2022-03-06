import { NextPage } from "next";
import { useEffect } from "react";
import ffmpeg from "../components/ffmpeg";
import { renderFacecam } from "../ffmpegEffects/facecam";

const FacamTest: NextPage = () => {
    useEffect(() => {
        ffmpeg.load();
    }, [])

    return <>
        <button onClick={() => renderFacecam(
            ffmpeg
        )}>call function</button>
    </>
}