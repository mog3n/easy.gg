import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { CropPosition } from "../pages/facecam";

// export interface CropPosition {
//     x: number
//     y: number
//     width: number
//     height: number
// }

export const renderFacecam = async (
    ffmpeg: FFmpeg,
    inputClip: File,
    faceCrop: CropPosition,
    gameCrop: CropPosition,
    startDuration: number,
    endDuration: number
): Promise<string[]> => {
    // TODO: Robert
    const vFile = await fetchFile(inputClip);
    ffmpeg.FS('writeFile', 'video', vFile);

    const FRAMERATE = 30;
    
    const fx = faceCrop.x
    const fy = faceCrop.y
    const fh = faceCrop.height
    const fw = faceCrop.width
    const scaledfw = 1080
    const scaledfh = 1080*(fh/fw) // fh/fw is the ratio
    await ffmpeg.run(
        '-i', 'video',
        // '-filter:v', `crop=${fw}:${fh}:${fx}:${fy}`,
        '-filter_complex', `[0:v]crop=${fw}:${fh}:${fx}:${fy}[cropped];
                            [cropped]scale=${scaledfw}:${scaledfh}[out]`,   
        '-map', '[out]',
        '-map', '0:a',
        '-preset', 'ultrafast',
        '-c:v', 'libx264',
        '-r', FRAMERATE.toString(),                 
        'facecam.mp4'
    );

    const gx = gameCrop.x
    const gy = gameCrop.y
    const gh = gameCrop.height
    const gw = gameCrop.width
    const scaledgw = 1080
    const scaledgh = 1080*(gh/gw) // gh/gw is the ratio

    await ffmpeg.run(
        '-i', 'video',
        // '-filter:v', `crop=${gw}:${gh}:${gx}:${gy}`,
        '-filter_complex', `[0:v]crop=${fw}:${fh}:${fx}:${fy}[cropped];
                            [cropped]scale=${scaledgw}:${scaledgh}[out]`,
        '-map', '[out]',
        '-map', '0:a',
        '-preset', 'ultrafast',
        '-c:v', 'libx264',
        '-r', FRAMERATE.toString(),                 
        'gamecam.mp4'
    );

    //1080x1920
    // ffmpeg -i orig.mp4 -vf scale=1080:1080 -crf 20 -preset slow smaller.mp4  

    await ffmpeg.run(
        '-i', 'facecam.mp4',
        '-i', 'gamecam.mp4',
        '-filter_complex', `[0:v][1:v]vstack=inputs=2[out]`,
        '-map', '[out]',
        '-c:v', 'libx264',
        '-r', FRAMERATE.toString(),                 
        'stitched.mp4'
    );

    ///return below ,,
    
    const urls : string[] = []
    let data = ffmpeg.FS('readFile', 'facecam.mp4');
    let url = URL.createObjectURL(new Blob([data.buffer]));
    urls.push(url)
    data = ffmpeg.FS('readFile', 'gamecam.mp4');
    url = URL.createObjectURL(new Blob([data.buffer]));
    urls.push(url)
    data = ffmpeg.FS('readFile', 'stitched.mp4');
    url = URL.createObjectURL(new Blob([data.buffer]));
    urls.push(url)
    data = ffmpeg.FS('readFile', 'video');
    url = URL.createObjectURL(new Blob([data.buffer]));
    urls.push(url)
    

    return urls; // this is an array

    // const url = URL.createObjectURL(new Blob);
    // return url;
}