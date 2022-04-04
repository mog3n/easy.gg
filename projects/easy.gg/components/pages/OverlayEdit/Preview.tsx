import axios from "axios";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { OverlayEffect } from "../../../ffmpegEffects/overlayTemplate";
import { SoundEffect } from "../../../ffmpegEffects/soundTemplate";
import { SimpleOverlayClip, SimpleSoundClip } from "../../../types/editor"
import ffmpeg, { checkFfmpeg } from "../../ffmpeg";

interface PreviewProps {
    overlay: SimpleOverlayClip | undefined;
    videoMarker: number;
}

export const OverlayEditPreview = (props: PreviewProps) => {

    const router = useRouter();
    const [videoFile, setVideoFile] = useState<File>();
    const [isRendering, setIsRendering] = useState(false);
    const [ffmpegProgress, setFfmpegProgress] = useState<number>(0);

    const [previewBlobUrl, setPreviewBlobUrl] = useState('');

    useEffect(() => {
        checkFfmpeg();

        const asyncEffect = async () => {
            const overlayEffect = props.overlay ? OverlayEffect(props.overlay) : null;

            // check router for params
            if (router.query.clip) {
                const blobUrl = router.query.clip as string;
                const blob = await axios.get(blobUrl, { responseType: 'blob' })
                const vFile = new File([blob.data], 'videoFile');
                setVideoFile(vFile);
                if (overlayEffect && vFile) {
                    await checkFfmpeg();
                    setIsRendering(true);
                    setTimeout(async () => {
                        const preview = await overlayEffect.generateVideo(ffmpeg, vFile, props.videoMarker, setFfmpegProgress);
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

    }, [])


    return <>
        {isRendering ? <>Rendering Preview... {(ffmpegProgress * 100).toFixed(0)}%</> : <></>}
        {previewBlobUrl ? <video src={previewBlobUrl} autoPlay style={{ height: '100%' }} loop /> : <></>}
    </>
}