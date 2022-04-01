export interface VideoEffects {
    hue?: string;
    slow_mo?: number;

    vignette?: boolean,

    flash?: boolean;
    flash_duration?: number;
    shake?: boolean;
    shake_duration?: number;
    shake_intensity?: number;
}

export interface SimpleSoundClip {
    audioURL: string,
    marker: number,
    duration: number,
    name: string,
    creator: string,
    num_users?: number,
    previewMP4?: string;

    default_video_effects?: VideoEffects
}