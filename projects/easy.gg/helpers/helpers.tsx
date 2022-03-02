
// i.e. if FPS=30 then 63.2 -> 01:03:06
export const convertSecondsToTimestamp = (timeInSec: number, framerate: number) => {

    let minutes = 0;
    if (timeInSec > 60) {
        minutes = Math.floor(timeInSec/60);
        timeInSec = timeInSec%60;
    }
    let seconds = Math.floor(timeInSec);
    let frames = Math.round(Math.round((timeInSec-seconds) * 1000) / (1000/framerate));

    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const framesStr = frames < 10 ? `0${frames}` : `${frames}`;

    return `${minutesStr}:${secondsStr}:${framesStr}`;
}
export const isClient = () => typeof window !== 'undefined';

export const clipThumbnailUrlProxy = (url: string) => {
    return `/proxy/clipThumbnail/${url.replace('https://clips-media-assets2.twitch.tv/', '')}`;
}

export const userProfilePictureThumbnailProxy = (url: string) => {
    return `/proxy/userProfilePic/${url.replace('https://static-cdn.jtvnw.net/', '')}`;
}

export const twitchClipProxy = (url: string) => {
    const urlLink = new URL(`${window.location.protocol}//${window.location.host}/api/twitch/videoProxy`);
    urlLink.searchParams.append('url', url);
    return urlLink.href;
    // return `/proxy/twitchClip/${url.replace('https://production.assets.clips.twitchcdn.net/', '')}`;
}