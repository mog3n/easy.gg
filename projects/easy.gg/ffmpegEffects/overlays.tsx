import { SimpleOverlayClip } from "../types/editor";

export const testOverlay: SimpleOverlayClip = {
    overlayURL: '/overlays/a.mp4',
    marker: 3.093316,
    duration: 11.534,
    creator: 'Aaron Kwok @kwoknation / Olivia Rodrigo',
    name: 'Deja Vu',
    previewMP4: '/audioPreviews/hospital.mp4',

    default_video_effects: {
        flash: true,
        slow_mo: 2,
        shake: true,
        vignette: true,
        hue: "90",
    }
}

export const stayWithMe: SimpleOverlayClip = {
    overlayURL: '/overlays/staywithmeoverlay2.mp4',
    marker: 6.08831,
    duration: 16.556,
    creator: 'Aaron Kwok @kwoknation / Olivia Rodrigo',
    name: 'Stay With Me',
    previewMP4: '/audioPreviews/hospital.mp4',

    default_video_effects: {
        flash: true,
        slow_mo: 2,
        shake: true,
        vignette: true,
        hue: "90",
    }
}


export const availableOverlays: SimpleOverlayClip[] = [testOverlay, stayWithMe];