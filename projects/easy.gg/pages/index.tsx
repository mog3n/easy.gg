import type { NextPage } from 'next'
import Head from 'next/head'
import { DetailedHTMLProps, LegacyRef, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState, VideoHTMLAttributes } from 'react'
import styles from '../styles/Home.module.css'
import { FileUploader } from 'baseui/file-uploader';
import { Button } from 'baseui/button';
import axios from 'axios';
import { Input } from 'baseui/input';

import ffmpeg from '../components/ffmpeg';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { convertSecondsToTimestamp } from '../helpers/helpers';


const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [videoMarkerDuration, setVideoMarkerDuration] = useState(22.405);
  const [audioMarkerDuration, setAudioMarkerDuration] = useState(4.26);

  const [isMovingTimeline, setIsMovingTimeline] = useState(false);
  const [videoTimelinePos, setVideoTimelinePos] = useState(0);
  const [timelineMouseOffset, setTimelineMouseOffset] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(900);

  const [videoFile, setVideoFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();

  const [result, setResult] = useState<string>('');

  const checkFfmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
  }

  useEffect(() => {
    checkFfmpeg();
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      if (videoRef.current.duration) {
        const width = videoRef.current.duration * 60;
        setTimelineWidth(width) // i.e. 60 pixels per second of footage
      }
    }
  }, [videoRef])

  const generateVideo = async () => {
    await checkFfmpeg();
    if (audioFile && videoFile && audioRef.current) {
      const aFile = await fetchFile(audioFile);
      const vFile = await fetchFile(videoFile);

      const FRAMERATE = 30;

      ffmpeg.FS('writeFile', 'audio', aFile);
      ffmpeg.FS('writeFile', 'video', vFile);

      const videoCropLeft = videoMarkerDuration - audioMarkerDuration;
      const tDuration = audioRef.current.duration;

      await ffmpeg.run(
        '-i', 'video',
        '-ss', videoCropLeft.toFixed(2),
        '-vf', 'scale=1280:720',
        '-c:v', 'libx264',
        '-t', tDuration.toString(),
        '-r', FRAMERATE.toString(), //framerate
        'tmp1.mp4'
      );

      await ffmpeg.run(
        '-i', 'tmp1.mp4',
        '-i', 'audio',
        '-filter_complex', '[0:a][1:a]amerge[out]',
        '-map', '0:v',
        '-map', '[out]',
        '-c:v', 'copy',
        '-c:a', 'aac',
        'output.mp4'
      );

      const data = ffmpeg.FS('readFile', 'output.mp4');
      const url = URL.createObjectURL(new Blob([data.buffer]));
      setResult(url);
    } else {
      alert("No video or audio file");
    }

  }


  const loadFile = async (file: File) => {
    await checkFfmpeg();

    if (file.name.includes('mp3')) {
      setAudioFile(file);
    } else {
      setVideoFile(file);
      setVideoTimelinePos(timelineWidth / 2);
    }
  }

  const memoizedVideoPlayer = useMemo(() => {
    if (videoFile) {
      return <div style={{
        height: 350,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <video ref={videoRef}
          controls={false} width={500} src={URL.createObjectURL(videoFile)}
          onClick={() => {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            } else {
              videoRef.current?.play();
            }
          }}
          onPlaying={(event) => {
            setIsVideoPlaying(true);
          }}
          onPause={(event) => {
            setIsVideoPlaying(false);
          }}
          onTimeUpdate={(event) => {
            const videoTrackCompletionPercentage = event.currentTarget.currentTime / event.currentTarget.duration;
            const durationInPixels = videoTrackCompletionPercentage * timelineWidth;
            const timelinePos = durationInPixels - (timelineWidth / 2) // center
            setVideoTimelinePos(-timelinePos);
          }}
        />
      </div>
    }
  }, [videoFile])

  const memoizedAudioPlayer = useMemo(() => {
    if (audioFile) {
      return <div style={{ display: 'flex', justifyContent: 'center' }}>
        <audio controls ref={audioRef} src={URL.createObjectURL(audioFile)}></audio>
      </div>
    }
  }, [audioFile])

  return (
    <div style={{
      background: '#121212',
      minHeight: '100vh',
    }}>
      <Head>
        <title>easy.gg Editor</title>
        <meta name="description" content="An editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!videoFile && !audioFile ? <>
        <div>
          <FileUploader
            onDrop={(acceptedFiles) => {
              for (const file of acceptedFiles) {
                loadFile(file);
              }
            }}
          />
        </div>
      </> : <></>
      }

      {memoizedVideoPlayer}

      {videoFile ? <>
        <div style={{ display: 'flex', justifyContent: 'center', }}>
          <Button onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime -= 0.1;
            }
          }}>{`<`}</Button>
          <Button onClick={() => {
            if (!isVideoPlaying) {
              videoRef.current?.play();
            } else {
              videoRef.current?.pause();
            }
          }}>{!isVideoPlaying ? "Play" : "Pause"}</Button>
          <Button onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime += 0.1;
            }
          }}>{`>`}</Button>

        </div>
        <div style={{
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 120,
        }}>
          <div style={{
            width: 3,
            cursor: 'pointer',
            backgroundColor: '#52FF00',
            height: 90,
            position: 'absolute',
            borderRadius: 5,
            zIndex: 999,
            transform: 'translateX(-1.5px)',
          }} />
          <div style={{
            width: timelineWidth || 0,
            height: 36,
            position: 'absolute',
            backgroundColor: '#282915',
            left: (window.innerWidth / 2) - (timelineWidth / 2),
            transform: `translateX(${videoTimelinePos}px)`,
            border: '2px solid #BECE07',
            borderRadius: 6,
            cursor: 'pointer',
          }}
            onMouseDown={(mouseEvt) => {
              setIsMovingTimeline(true);
              const offset = (mouseEvt.clientX - window.innerWidth / 2) - videoTimelinePos;
              setTimelineMouseOffset(offset);
            }}
            onMouseMove={(mouseEvent) => {
              if (isMovingTimeline) {
                const newRelativePosition = (mouseEvent.clientX - (window.innerWidth / 2)) - timelineMouseOffset;
                if (newRelativePosition <= timelineWidth / 2 && newRelativePosition >= -timelineWidth / 2) {
                  setVideoTimelinePos(newRelativePosition);
                }
                if (videoRef.current) {
                  const time = (timelineWidth / 2) - newRelativePosition;
                  const ratio = time / timelineWidth;
                  const timeToSet = videoRef.current.duration * ratio;
                  videoRef.current.currentTime = timeToSet || 0;
                }
              }
            }}
            onMouseUp={() => {
              setIsMovingTimeline(false);
            }}
          />
          <div style={{ width: timelineWidth, height: 90 }} />
        </div>


        <div style={{ display: 'flex', justifyContent: 'center', color: '#fff'}}>
          <Button onClick={() => {
            if (videoRef.current) {
              setVideoMarkerDuration(videoRef.current.currentTime);
            }
          }}>Mark Video</Button>
          { videoMarkerDuration ? videoMarkerDuration : '0' }
        </div>
      </> : <></>}

      {memoizedAudioPlayer}

      {audioFile ? <>
        <div style={{ display: 'flex', justifyContent: 'center', color: '#fff' }}>
          <Button onClick={() => {
            if (audioRef.current) {
              const mark = audioRef.current.currentTime
              setAudioMarkerDuration(mark);
            }
          }}>Mark Audio!</Button>
          { audioMarkerDuration ? audioMarkerDuration: '0' }
        </div>
      </> : <></>}


      {audioFile && videoFile ? <>
        <div>
          <Button onClick={generateVideo}>Generate Video</Button>
        </div>
      </> : <></>}

      {result ? <>
        <video style={{ width: 300 }} controls src={result} />
      </> : <></>}

    </div>
  )
}

export default Home