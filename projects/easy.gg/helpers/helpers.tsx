
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