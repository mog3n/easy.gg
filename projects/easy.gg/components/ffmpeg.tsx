import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg = createFFmpeg({
    corePath: '/ffmpeg/ffmpeg-core.js',
    log: true
});

export default ffmpeg;