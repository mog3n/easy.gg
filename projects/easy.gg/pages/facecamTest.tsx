import { NextPage } from "next";
import { useEffect } from "react";
import ffmpeg from "../components/ffmpeg";
import { renderFacecam } from "../ffmpegEffects/facecam";

const FacecamTest: NextPage = () => {
    useEffect(() => {
        ffmpeg.load();
    }, [])

    return <>
        <button onClick={async () => renderFacecam(
            ffmpeg,
            new File([(await (await fetch(new Request('/TEST.mp4'))).blob())], 'video.mp4'),
            { x: 0, y: 0, width: 0, height: 0},
            { x: 0, y: 0, width: 0, height: 0},
            0,
            10
        )}>call function</button>
    </>
}

export default FacecamTest