import axios from "axios";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SoundEffect } from "../../../ffmpegEffects/effects";
import { SimpleSoundClip } from "../../../types/editor"
import ffmpeg, { checkFfmpeg, exitFfmpeg } from "../../ffmpeg";

interface PreviewProps {
    audio: SimpleSoundClip | undefined;
    videoMarker: number;
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
                        const preview = await audioEffect.generateVideo(ffmpeg, vFile, props.videoMarker, setFfmpegProgress);
                        setPreviewBlobUrl(preview);
                        setIsRendering(false);
                    })
                }
            }
        }
        asyncEffect();

        ffmpeg.setProgress((progress) => {
            console.log(progress);
            setFfmpegProgress(progress.ratio);
        })

        return () => {
            exitFfmpeg();
        }

    }, [])


    return <>
        {isRendering ? <>Rendering Preview... {(ffmpegProgress * 100).toFixed(0)}%</> : <></>}
        {previewBlobUrl ? <video src={previewBlobUrl} autoPlay style={{ width: '100%' }} loop /> : <></>}
    </>
}