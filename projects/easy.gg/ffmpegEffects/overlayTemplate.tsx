import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { Dispatch, SetStateAction } from "react";
import ffmpeg from "../components/ffmpeg";
import { SimpleOverlayClip } from "../types/editor";

export interface OverlayEffectType {
    getOverlayFile: () => Promise<File>;
    getVideoProgressLength: () => number;
    getMinMarkerDuration: () => number;
    getSoundDuration: () => number;
    generateVideo: (
        ffmpeg: FFmpeg,
        videoFile: File,
        videoMarker: number,
        generatingVideoProgress: Dispatch<SetStateAction<number>>,
    ) => Promise<string>;
    generatePreview: (
        ffmpeg: FFmpeg,
        videoFile: File,
        videoMarker: number,
        generatingVideoProgress: Dispatch<SetStateAction<number>>,
    ) => Promise<string>;
    simpleSoundEffect: SimpleOverlayClip
}

export const OverlayEffect = (overlayEffect: SimpleOverlayClip): OverlayEffectType => {
    const getOverlayFile = async () => {
        const sound = await fetch(new Request(overlayEffect.overlayURL));
        const soundBlob = await sound.blob();
        return (new File([soundBlob], 'overlayEffect'));
    }
    const getVideoProgressLength = () => {
        return 5;
    }
    const getMinMarkerDuration = () => {
        return overlayEffect.marker
    }
    const getSoundDuration = () => {
        return overlayEffect.duration
    }
    const generateVideo = async (
        _: FFmpeg,
        videoFile: File,
        userSelectedVideoDurationPoint: number,
        setGeneratingVideoProgress: Dispatch<SetStateAction<number>>,
    ): Promise<string> => {
        const aFile = await fetchFile(await getOverlayFile());
        ffmpeg.FS('writeFile', 'overlay', aFile);

        const vFile = await fetchFile(videoFile);
        ffmpeg.FS('writeFile', 'video', vFile);

        const FRAMERATE = 30;

        const videoCropLeft = userSelectedVideoDurationPoint - overlayEffect.marker;

        await ffmpeg.run(
            '-ss', videoCropLeft.toFixed(2),
            '-t', overlayEffect.duration.toFixed(2),
            '-i', 'video',
            '-i', 'overlay',
            '-c:v', 'libx264',
            '-r', FRAMERATE.toString(),
            '-preset', 'ultrafast',
            '-maxrate', '3M',
            '-bufsize', '3M',
            '-filter_complex', `[1:v]chromakey=color=0x000000:similarity=0.2:blend=0[overlaytransparent],
                                [overlaytransparent]scale=w=360:h=-2[overlayscaled],
                                [0:v]crop=w=in_h*9/16[croppedvid],
                                [croppedvid]scale=w=360:h=-2[videoscaled],
                                [videoscaled][overlayscaled]overlay[overlayed]`,
            '-map', '[overlayed]',
            '-map', '1:a',
            'output.mp4'
        );

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer]));

        return url;
    }
    const generatePreview = async (
        _: FFmpeg,
        videoFile: File,
        userSelectedVideoDurationPoint: number,
        setGeneratingVideoProgress: Dispatch<SetStateAction<number>>,
    ): Promise<string> => {
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer]));

        return url;
    }
    return { getOverlayFile, generateVideo, getVideoProgressLength, getMinMarkerDuration, getSoundDuration, simpleSoundEffect: overlayEffect, generatePreview }
}