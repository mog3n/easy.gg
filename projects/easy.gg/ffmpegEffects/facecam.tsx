import { FFmpeg } from "@ffmpeg/ffmpeg";
import { CropPosition } from "../pages/facecam";

export const renderFacecam = (
    ffmpeg: FFmpeg,
    inputClip: File,
    faceCrop: CropPosition,
    gameCrop: CropPosition,
    startDuration: number,
    endDuration: number
): string => {
    // TODO: Robert
    
    const url = URL.createObjectURL(new Blob);
    return url;
}