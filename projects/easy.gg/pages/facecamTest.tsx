import { NextPage } from "next";
import { useEffect, useState } from "react";
import ffmpeg from "../components/ffmpeg";
import { renderFacecam } from "../ffmpegEffects/facecam";

const FacecamTest: NextPage = () => {
    const [resp, setRes] = useState<string[]>();
    useEffect(() => {
        ffmpeg.load();
    }, [])

    return <>
        <button onClick={async () => {
            const response = await renderFacecam(
                ffmpeg,
                new File([(await (await fetch(new Request('/TEST.mp4'))).blob())], 'video.mp4'),
                { x: 0, y: 520, width: 300, height: 200 }, //facecam
                { x: 540, y: 0, width: 300, height: 600 }, //gamecam
                0,
                10
            )
            setRes(response)
        }}>call function</button>

        {resp ? <>
            {resp.map(str => {
                return <><video src={str} controls></video></>
            })}
        </> : <></>}
    </>
}

export default FacecamTest