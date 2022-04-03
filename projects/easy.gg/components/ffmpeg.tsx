import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg = createFFmpeg({
    corePath: '/ffmpeg/ffmpeg-core.js',
    log: true
});

 // Function to check ffmpeg is lodaded
export const checkFfmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
}

export const exitFfmpeg = () => {
    if (ffmpeg.isLoaded()) {
        ffmpeg.exit();
        console.log(ffmpeg.isLoaded());
    }
}

export default ffmpeg;