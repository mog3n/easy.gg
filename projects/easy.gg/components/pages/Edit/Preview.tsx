import axios from "axios";
import { SIZE, Spinner } from "baseui/spinner";
import { Router, useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SoundEffect } from "../../../ffmpegEffects/soundTemplate";
import { SimpleSoundClip } from "../../../types/editor"
import ffmpeg, { checkFfmpeg } from "../../ffmpeg";

interface PreviewProps {
    audio: SimpleSoundClip | undefined;
    videoMarker: number;
    setDisableStepChange: Dispatch<SetStateAction<boolean>>;
}

export const EditPreview = (props: PreviewProps) => {
    const audioEffect = props.audio ? SoundEffect(props.audio) : null;

    const router = useRouter();
    const [videoFile, setVideoFile] = useState<File>();
    const [isRendering, setIsRendering] = useState(false);
    const [ffmpegProgress, setFfmpegProgress] = useState<number>(0);

    const [previewBlobUrl, setPreviewBlobUrl] = useState('');

    useEffect(() => {
        checkFfmpeg();

        const asyncEffect = async () => {
            // check router for params
            if (router.query.clip) {
                const blobUrl = router.query.clip as string;
                const blob = await axios.get(blobUrl, { responseType: 'blob' })
                const vFile = new File([blob.data], 'videoFile');
                setVideoFile(vFile);
                if (audioEffect && vFile) {
                    await checkFfmpeg();
                    setIsRendering(true);
                    setTimeout(async () => {
                        try {
                            props.setDisableStepChange(true);
                            const preview = await audioEffect.generatePreview(ffmpeg, vFile, props.videoMarker, setFfmpegProgress);
                            setPreviewBlobUrl(preview);
                            setIsRendering(false);
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


    return <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {isRendering ? <>
            <div><Spinner /></div>
            {sanitizedProgress}%
            <div style={{margin: 20}}>
                A preview is being rendered...
            </div>
        </> : <></>}
        {!isRendering && previewBlobUrl ? <video controls src={previewBlobUrl} autoPlay style={{ width: '50%' }} loop /> : <></>}
        <div style={{height: 10}}></div>
        {!isRendering && previewBlobUrl ? <>A lower quality preview render was created. To generate an HD clip, tap the Export button below.</> : <></>}
    </div>
}