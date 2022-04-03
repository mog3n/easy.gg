import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { Dispatch, SetStateAction } from "react";
import { SimpleSoundClip } from "../types/editor";

export interface SoundEffectType {
    getAudioFile: () => Promise<File>;
    getVideoProgressLength: () => number;
    getMinMarkerDuration: () => number;
    getSoundDuration: () => number;
    generateVideo: (ffmpeg: FFmpeg, videoFile: File, videoMarker: number, generatingVideoProgress: Dispatch<SetStateAction<number>>) => Promise<string>;
    simpleSoundEffect: SimpleSoundClip
}

export const SoundEffect = (soundEffect: SimpleSoundClip): SoundEffectType => {
    const getSimpleSoundClip = () => {
        return soundEffect;
    }
    const getAudioFile = async () => {
        const sound = await fetch(new Request(soundEffect.audioURL));
        const soundBlob = await sound.blob();
        return (new File([soundBlob], 'soundEffect'));
    }
    const getVideoProgressLength = () => {
        return 5;
    }
    const getMinMarkerDuration = () => {
        return soundEffect.marker
    }
    const getSoundDuration = () => {
        return soundEffect.duration
    }
    const generateVideo = async (
        ffmpeg: FFmpeg,
        videoFile: File,
        userSelectedVideoDurationPoint: number,
        setGeneratingVideoProgress: Dispatch<SetStateAction<number>>,
    ): Promise<string> => {
        const aFile = await fetchFile(await getAudioFile());
        ffmpeg.FS('writeFile', 'audio', aFile);

        const vFile = await fetchFile(videoFile);
        ffmpeg.FS('writeFile', 'video', vFile);

        const FRAMERATE = 30;

        const videoCropLeft = userSelectedVideoDurationPoint - soundEffect.marker;
        // Before the inciting point
        setGeneratingVideoProgress(1);


        await ffmpeg.run(
            '-ss', videoCropLeft.toFixed(2),
            '-t', soundEffect.marker.toString(),
            '-i', 'video',
            '-c:v', 'libx264',
            '-r', FRAMERATE.toString(),
            '-preset', 'ultrafast',
            '-maxrate', '3M',
            '-bufsize', '3M',
            'A.mp4'
        );

        const SLOWMOFACTOR = soundEffect.default_video_effects?.slow_mo || 2;
        const slowMoStart = videoCropLeft + soundEffect.marker;
        const slowMoEnd = (soundEffect.duration - soundEffect.marker) / SLOWMOFACTOR;

        setGeneratingVideoProgress(2);
        // trim slow mo part
        await ffmpeg.run(
            '-ss', slowMoStart.toFixed(2),
            '-t', slowMoEnd.toFixed(2),
            '-i', 'video',
            '-c:v', 'libx264',
            '-r', FRAMERATE.toString(),
            '-preset', 'ultrafast',
            '-maxrate', '3M',
            '-bufsize', '3M',
            'B.mp4'
        )

        setGeneratingVideoProgress(3);
        // make clip B slo mo
        await ffmpeg.run(
            '-i', 'B.mp4',
            '-filter_complex',
            `
                              [0:v]minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=60'[slowInt],
                              [slowInt]setpts=${SLOWMOFACTOR.toFixed(0)}*PTS[slowI],
                              [0:a]asetpts=${SLOWMOFACTOR.toFixed(0)}*PTS[audioI],
                              [audioI]atempo=(1/${SLOWMOFACTOR.toFixed(0)})[aSlowI]
                            `,
            '-map', '[slowI]',
            '-map', '[aSlowI]',
            '-c:v', 'libx264',
            '-r', FRAMERATE.toString(),
            '-preset', 'ultrafast',
            '-maxrate', '3M',
            '-bufsize', '3M',
            'B-slowed.mp4',
        );

        // // animate the hue
        // await ffmpeg.run(
        //   '-i', 'B-slowed.mp4',
        //   '-vf', `hue='b=max(0,5-5*t)'`,
        //   // '-r', FRAMERATE.toString(),
        //   'B-slow-edited.mp4'
        // );

        // // animate the hue (RAINBOW EFFECT)
        // await ffmpeg.run(
        //   '-i', 'B-slowed.mp4',
        //   '-vf', 'hue=H=2*PI*t:s=cos(2*PI*t)+10',
        //   'B-slow-edited.mp4'
        // );

        // // animate the hue (CHANGE HUE EFFECT)
        // await ffmpeg.run(
        //   '-i', 'B-slowed.mp4',
        //   '-vf', 'hue=H=2*PI*t:s=cos(2*PI*t)+10',
        //   'B-slow-edited.mp4'
        // );

        setGeneratingVideoProgress(4);
        // animate the hue (CHANGE HUE + BRIGHTNESS EFFECT)

        // hue

        await ffmpeg.run(
            '-i', 'B-slowed.mp4',
            '-vf', `
                ${/* COMMENT: Change Hue & Brightness */""}
                hue='h=${soundEffect.default_video_effects?.hue || `0`}
                ${soundEffect.default_video_effects?.flash ? `: b=max(0,5-5*t)` : ``}',
                ${/* COMMENT: Apply Vignette */""}
                ${soundEffect.default_video_effects?.vignette ? "vignette" : ""}
                `, // << test this
            '-preset', 'ultrafast',
            '-maxrate', '3M',
            '-bufsize', '3M',
            'B-slow-edited.mp4'
        );

        // tone down vingette

        // // animate the hue (VIGNETTE EFFECT)
        // await ffmpeg.run(
        //   '-i', 'B-slowed.mp4',
        //   '-vf', `vignette`,
        //   'B-slow-edited.mp4'
        // );

        setGeneratingVideoProgress(5);
        await ffmpeg.run(
            '-i', 'A.mp4',
            '-i', 'B-slow-edited.mp4',
            '-i', 'audio',

            '-filter_complex', `
                                [0:v][0:a][1:v]${soundEffect.default_video_effects?.slow_mo === 1 ? `[1:a]` : ``}concat=n=2:v=1:a=1[vcomb][acomb],
                                [acomb][2:a]amerge=inputs=2[out]`,
            '-map', '[vcomb]',
            '-map', '[out]',
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-preset', 'ultrafast',
            '-maxrate', '3M',
            '-bufsize', '3M',
            'output.mp4'
        );

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer]));

        return url;
    }
    return { getAudioFile, generateVideo, getVideoProgressLength, getMinMarkerDuration, getSoundDuration, simpleSoundEffect: soundEffect }
}