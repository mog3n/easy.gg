import type { NextPage } from 'next'
import Head from 'next/head'
import { DetailedHTMLProps, LegacyRef, MutableRefObject, useEffect, useRef, useState, VideoHTMLAttributes } from 'react'
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

  const [videoFile, setVideoFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();

  const [interestingAudioPoint, setInterestingAudioPoint] = useState<string>('');

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

  const displayVideo = () => {
    if (videoFile) {
      return <div style={{height: 300}}>
        <video ref={videoRef} controls width={500} src={URL.createObjectURL(videoFile)} />
      </div>
    }
  }

  const loadFile = async (file: File) => {
    await checkFfmpeg();

    if (file.name.includes('mp3')) {
      setAudioFile(file);
      ffmpeg.FS('writeFile', 'audio', await fetchFile(file));
    } else {
      setVideoFile(file);
      ffmpeg.FS('writeFile', 'video', await fetchFile(file));
    }
  }

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

      {displayVideo()}

      {videoFile ? <>
        <div style={{
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}>
          <div style={{
            width: 3,
            backgroundColor: '#52FF00',
            height: 90,
            position: 'absolute',
            borderRadius: 5,
            zIndex: 999,
          }} />
          <div style={{
            width: 600,
            height: 50,
            position: 'absolute',
            backgroundColor: '#282915',
            left: (window.innerWidth / 2) - 300,
            transform: `translateX(${videoTimelinePos}px)`,
            border: '2px solid #BECE07',
            borderRadius: 6,
            cursor: 'pointer',
          }}
            onMouseDown={() => {
              setIsMovingTimeline(true);
            }}
            onMouseMove={(mouseEvent) => {
              if (isMovingTimeline) {
                setVideoTimelinePos(mouseEvent.clientX - 300);
              }
            }}
            onMouseLeave={() => {
              setIsMovingTimeline(false);
            }}
            onMouseUp={() => {
              setIsMovingTimeline(false);
            }}
          />
          <div style={{ width: 600, height: 90 }} />
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