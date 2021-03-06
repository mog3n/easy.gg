import { SimpleSoundClip } from "../types/editor";
import { SoundEffect } from "./soundTemplate";

export const hospitalFlickSound: SimpleSoundClip = {
    audioURL: '/soundclips/hospital.mp3',
    marker: 4.26,
    duration: 7.497143,
    creator: 'TikTok God: Robert Wan',
    name: 'Hospital Flick',
    previewMP4: '/audioPreviews/hospital.mp4',

    default_video_effects: {
        flash: true,
        slow_mo: 2,
        shake: true,
        vignette: true,
        hue: "90",
    }
}

export const masterAtWorkSound: SimpleSoundClip = { 
    audioURL: '/soundclips/masteratwork.mp3',
    marker: 7.24752,
    duration: 14.04,
    creator: 'TikTok God: Robert Wan',
    name: 'Master At Work',
    previewMP4: '/audioPreviews/previewMasterAtWork.mp4',

    default_video_effects: {
        flash: true,
        slow_mo: 1,
        shake: true,
        vignette: true,
        hue: "240",
    }
}

export const maskOffSound: SimpleSoundClip = {
    audioURL: '/soundclips/maskoff.mp3',
    marker: 4.22812,
    duration: 8.016,
    creator: 'TikTok God: Robert Wan',
    name: 'Mask Off',

    default_video_effects: {
        flash: true,
        slow_mo: 2,
        shake: true,
        vignette: true,
        hue: "180",
    }
}

export const availableSoundClips: SimpleSoundClip[] = [hospitalFlickSound, masterAtWorkSound, maskOffSound];


export const hospitalFlick = SoundEffect(hospitalFlickSound);
export const masterAtWork = SoundEffect(masterAtWorkSound);
export const maskOff = SoundEffect(maskOffSound);