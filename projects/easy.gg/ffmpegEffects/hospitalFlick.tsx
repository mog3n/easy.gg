import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { Dispatch, SetStateAction } from "react";

interface SimpleSoundClip {
    audioURL: string,
    marker: number,
    duration: number,
}

const hospitalFlickSound: SimpleSoundClip = {
    audioURL: '/soundclips/hospital.mp3',
    marker: 4.26,
    duration: 7.497143,
}

export const HospitalFlick = () => {
    const getAudioFile = async () => {
        const sound = await fetch(new Request(hospitalFlickSound.audioURL));
        const soundBlob = await sound.blob();
        return (new File([soundBlob], 'hospitalFlick'));
    }
    const getVideoProgressLength = () => {
        return 5;
    }
    const getMinMarkerDuration = () => {
        return hospitalFlickSound.marker
    }
    const getSoundDuration = () => {
        return hospitalFlickSound.duration
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

        const videoCropLeft = userSelectedVideoDurationPoint - hospitalFlickSound.marker;
        const audioDuration = hospitalFlickSound.duration;
        // Before the inciting point
        setGeneratingVideoProgress(1);
        await ffmpeg.run(
            '-ss', videoCropLeft.toFixed(2),
            '-t', audioDuration.toString(),
            '-i', 'video',
            '-c:v', 'libx264',
            '-r', FRAMERATE.toString(),
            '-preset', 'ultrafast',
            'A.mp4'
        );

        const SLOWMOFACTOR = 2;

        const slowMoEnd = ((audioDuration - hospitalFlickSound.marker) / SLOWMOFACTOR).toFixed(2);

        setGeneratingVideoProgress(2);
        // trim slow mo part
        await ffmpeg.run(
            '-ss', hospitalFlickSound.marker.toFixed(2),
            '-t', slowMoEnd,
            '-i', 'video',
            '-c:v', 'libx264',
            '-r', FRAMERATE.toString(),
            '-preset', 'ultrafast',
            'B.mp4'
        )

        setGeneratingVideoProgress(3);
        // make clip B slo mo
        await ffmpeg.run(
            '-i', 'B.mp4',
            '-filter_complex',
            // `
            //   [0:v]setpts=${SLOWMOFACTOR}*PTS[slowchoppy],
            //   [slowchoppy]minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=30'[slow]
            // `,
            `
                              [0:v]minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=60'[slowInt],
                              [slowInt]setpts=${SLOWMOFACTOR}*PTS[slow]
                            `,
            // `
            //   [0:v]minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=60'[slow]
            // `,
            // `
            //   [0:v]setpts=${SLOWMOFACTOR}*PTS[slow]
            // `,
            '-map', '[slow]',
            '-c:v', 'libx264',
            '-r', FRAMERATE.toString(),
            '-preset', 'ultrafast',
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
        await ffmpeg.run(
            '-i', 'B-slowed.mp4',
            '-vf', `hue='h=90: b=max(0,5-5*t)', vignette`, // << test this
            '-preset', 'ultrafast',
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
                                [0:v][0:a][1:v]concat=n=2:v=1:a=1[vcomb][acomb],
                                [acomb][2:a]amerge=inputs=2[out]`,
            '-map', '[vcomb]',
            '-map', '[out]',
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-preset', 'ultrafast',
            'output.mp4'
        );

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer]));

        return url;
    }

    return { getAudioFile, generateVideo, getVideoProgressLength, getMinMarkerDuration, getSoundDuration }
}