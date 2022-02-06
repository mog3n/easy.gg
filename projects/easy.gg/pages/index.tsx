import type { NextPage } from 'next'
import Head from 'next/head'
import { DetailedHTMLProps, LegacyRef, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState, VideoHTMLAttributes } from 'react'
import styles from '../styles/Home.module.css'
import { FileUploader } from 'baseui/file-uploader';
import { Button } from 'baseui/button';
import { Input } from 'baseui/input';

import ffmpeg from '../components/ffmpeg';
import { fetchFile } from '@ffmpeg/ffmpeg';


const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

    await ffmpeg.run(
      '-i', 'video',
      '-ss', '00:00:00',
      '-t', '7',
      '-r', '5',
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
  }


  const loadFile = async (file: File) => {
    await checkFfmpeg();

    if (file.name.includes('mp3')) {
      setAudioFile(file);
      ffmpeg.FS('writeFile', 'audio', await fetchFile(file));
    } else {
      setVideoFile(file);
      ffmpeg.FS('writeFile', 'video', await fetchFile(file));
      setVideoTimelinePos(timelineWidth/2);
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
          onPlaying={(event) => {
            setIsVideoPlaying(true);
          }}
          onPause={(event) => {
            setIsVideoPlaying(false);
          }}
          onTimeUpdate={(event) => {
            const videoTrackCompletionPercentage = event.currentTarget.currentTime / event.currentTarget.duration;
            const durationInPixels = videoTrackCompletionPercentage * timelineWidth;
            const timelinePos = durationInPixels - (timelineWidth/2) // center
            setVideoTimelinePos(-timelinePos);
          }}
        />
      </div>
    }
  }, [videoFile])

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

      <div>
        <FileUploader
          onDrop={(acceptedFiles) => {
            for (const file of acceptedFiles) {
              loadFile(file);
            }
          }}
        />
      </div>

      {memoizedVideoPlayer}

      {videoFile ? <>
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
            left: (window.innerWidth / 2) - (timelineWidth/2),
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
                const newRelativePosition =  (mouseEvent.clientX - (window.innerWidth / 2)) - timelineMouseOffset;
                if (newRelativePosition <= timelineWidth/2 && newRelativePosition >= -timelineWidth/2) {
                  setVideoTimelinePos(newRelativePosition);
                }
                if (videoRef.current) {
                  const time = (timelineWidth/2) - newRelativePosition;
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
        <div style={{display: 'flex', justifyContent: 'center',}}>
          <Button onClick={() => {
            if (!isVideoPlaying) {
              videoRef.current?.play();
            } else {
              videoRef.current?.pause();
            }
          }}>{ !isVideoPlaying ?  "Play" : "Pause" }</Button>
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