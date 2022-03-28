import { FileUploader } from "baseui/file-uploader";
import { NextPage } from "next";
import { useRef, useState } from "react";

const Sound: NextPage = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioFile, setAudioFile] = useState("")
    const [currentTime, setCurrentTime] = useState(0);

    return <>
        <FileUploader
            onDrop={(files) => {
                const file = files[0];
                setAudioFile(URL.createObjectURL(file));
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
    </>
}

export default Sound;