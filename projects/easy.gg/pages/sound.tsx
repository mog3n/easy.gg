import { FileUploader } from "baseui/file-uploader";
import { NextPage } from "next";
import { useRef, useState } from "react";

const Sound: NextPage = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [audioFile, setAudioFile] = useState("")
    const [currentTime, setCurrentTime] = useState(0);

    const [videoFile, setVideoFile] = useState("");
    const [videoTime, setVideoTime] = useState(0);

    return <>
        <FileUploader
            onDrop={(files) => {
                const file = files[0];
                if (file.name.includes(".mp3")) {
                    setAudioFile(URL.createObjectURL(file));
                } else {
                    setVideoFile(URL.createObjectURL(file));
                }
            }}
        />
        <audio controls ref={audioRef} src={audioFile} onTimeUpdate={(evt) => {
            setCurrentTime(evt.currentTarget.currentTime);
        }}/>
        {audioRef.current ? <>
            <div>{audioRef.current.duration}</div>
            <div>
                {audioRef.current.currentTime}
            </div>
        </> : <></>}

        <video controls ref={videoRef} src={videoFile} onTimeUpdate={(evt) => {
            setVideoTime(evt.currentTarget.currentTime);
        }} />
        {videoRef.current ? <>
            <div>{videoRef.current.duration}</div>
            <div>{videoRef.current.currentTime}</div>
        </> : <></>}
    </>
}

export default Sound;