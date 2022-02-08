import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg = createFFmpeg({
    corePath: '/ffmpeg/ffmpeg-core.js',
    log: false
});

export default ffmpeg;