import axios from "axios";
import { ProgressBar } from "baseui/progress-bar";
import { Spinner } from "baseui/spinner";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SoundEffect } from "../../../ffmpegEffects/soundTemplate";
import { SimpleSoundClip } from "../../../types/editor";
import ffmpeg, { checkFfmpeg } from "../../ffmpeg";

interface RenderProps {
    audio: SimpleSoundClip | undefined;
    videoMarker: number;
    setDisableStepChange: Dispatch<SetStateAction<boolean>>;
}

export const Render = (props: RenderProps) => {
    const audioEffect = props.audio ? SoundEffect(props.audio) : null;

    const router = useRouter();
    const [isRendering, setIsRendering] = useState(false);
    const [ffmpegProgress, setFfmpegProgress] = useState<number>(0);

    useEffect(() => {
        checkFfmpeg();

        const asyncEffect = async () => {
            // check router for params
            if (router.query.clip) {
                const blobUrl = router.query.clip as string;
                const blob = await axios.get(blobUrl, { responseType: 'blob' })
                const vFile = new File([blob.data], 'videoFile');
                if (audioEffect && vFile) {
                    await checkFfmpeg();
                    setIsRendering(true);
                    setTimeout(async () => {
                        try {
                            props.setDisableStepChange(true);
                            const render = await audioEffect.generateVideo(ffmpeg, vFile, props.videoMarker, setFfmpegProgress);
                            setIsRendering(false);
                            router.push({
                                pathname: '/export',
                                query: {
                                  clip: render
                                }
                              })
                        } catch (e) {
                            console.error(e);
                        }
                        props.setDisableStepChange(false);
                    })
                }
            }
        }
        asyncEffect();

        ffmpeg.setProgress((progress) => {
            console.log(progress);
            setFfmpegProgress(progress.ratio);
        })

    }, [])

    const sanitizedProgress = Math.min(Math.max((ffmpegProgress * 100), 0), 100).toFixed(0);

    return <>
        <div style={{flex: 1, height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <ProgressBar value={ffmpegProgress*100}/>
                Exporting your video... {sanitizedProgress}%
            </div>
        </div>
    </>
}