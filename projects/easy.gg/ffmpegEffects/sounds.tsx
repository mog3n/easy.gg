import { SimpleSoundClip } from "../types/editor";
import { SoundEffect } from "./effects";

const hospitalFlickSound: SimpleSoundClip = {
    audioURL: '/soundclips/hospital.mp3',
    marker: 4.26,
    duration: 7.497143,
    creator: 'TikTok God: Robert Wan',
    name: 'Hospital Flick',

    default_video_effects: {
        flash: true,
        slow_mo: 4,
        shake: true,
        vignette: true,
        hue: "90",
    }
}

export const hospitalFlick = SoundEffect(hospitalFlickSound);