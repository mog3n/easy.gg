import type { NextPage } from 'next'
import Head from 'next/head'
import { DetailedHTMLProps, LegacyRef, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState, VideoHTMLAttributes } from 'react'
import styles from '../styles/Home.module.css'
import { FileUploader } from 'baseui/file-uploader';
import { Button } from 'baseui/button';
import axios from 'axios';
import { Input } from 'baseui/input';
import { FaPlay, FaPause } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import ffmpeg from '../components/ffmpeg';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { convertSecondsToTimestamp } from '../helpers/helpers';
import { ProgressBar } from 'baseui/progress-bar';

interface SimpleSoundClip {
  audioURL: string,
  marker: number,
}

const hospitalFlick: SimpleSoundClip = {
  audioURL: '/soundclips/hospital.mp3',
  marker: 4.26,
}


const Edit: NextPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [videoMarkerDuration, setVideoMarkerDuration] = useState(24.340597);
  const [audioMarkerDuration, setAudioMarkerDuration] = useState(4.26);

  const [isMovingTimeline, setIsMovingTimeline] = useState(false);
  const [videoTimelinePos, setVideoTimelinePos] = useState(-450);
  const [timelineMouseOffset, setTimelineMouseOffset] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(900);

  const [videoFile, setVideoFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();

  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [ffmpegProgress, setFfmpegProgress] = useState<number>(0);

  const [results, setResults] = useState<string[]>([]);

  const checkFfmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
  }

  useEffect(() => {
    checkFfmpeg();

    const asyncEffect = async () => {
      // pre-fetch the hospital flick sound
      const sound = await fetch(new Request(hospitalFlick.audioURL));
      const soundBlob = await sound.blob();
      setAudioFile(new File([soundBlob], "soundfile"));
    }
    asyncEffect();

    ffmpeg.setProgress((progress) => {
      console.log(progress);
      setFfmpegProgress(progress.ratio);
    })

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
    if (videoFile && audioFile && audioRef.current) {

      setIsGeneratingVideo(true);

      try {
        const aFile = await fetchFile(audioFile);
        ffmpeg.FS('writeFile', 'audio', aFile);

        const vFile = await fetchFile(videoFile);
        ffmpeg.FS('writeFile', 'video', vFile);

        const FRAMERATE = 30;

        const videoCropLeft = videoMarkerDuration - audioMarkerDuration;
        const audioDuration = audioRef.current.duration;
        // Before the inciting point
        await ffmpeg.run(
          '-ss', videoCropLeft.toFixed(2),
          '-t', audioMarkerDuration.toString(),

          '-i', 'video',
          '-c:v', 'libx264',
          '-r', FRAMERATE.toString(),
          'A.mp4'
        );

        const SLOWMOFACTOR = 2;

        const slowMoEnd = ((audioDuration - audioMarkerDuration) / SLOWMOFACTOR).toFixed(2);


        // trim slow mo part
        await ffmpeg.run(
          '-ss', videoMarkerDuration.toFixed(2),
          '-t', slowMoEnd,
          '-i', 'video',
          '-c:v', 'libx264',
          '-r', FRAMERATE.toString(),
          'B.mp4'
        )

        // make clip B slo mo
        await ffmpeg.run(
          '-i', 'B.mp4',
          '-filter_complex', `
                              [0:v]setpts=${SLOWMOFACTOR}*PTS[slowchoppy],
                              [slowchoppy]minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=30'[slow]
                            `,
          '-map', '[slow]',
          '-c:v', 'libx264',
          'B-slowed.mp4',
        );

        // animate the hue
        await ffmpeg.run(
          '-i', 'B-slowed.mp4',
          '-vf', `hue='b=max(0,5-5*t)'`,
          // '-vf', 'colorize=hue=1:lightness=max(1,4-2t)',
          // '-vf', 'hue=H=2*PI*t:s=cos(2*PI*t)+10',
          'B-slow-edited.mp4'
        );

        // // animate the hue (RAINBOW EFFECT)
        // await ffmpeg.run(
        //   '-i', 'B-slowed.mp4',
        //   '-vf', 'hue=H=2*PI*t:s=cos(2*PI*t)+10',
        //   'B-slow-edited.mp4'
        // );

        // // animate the hue (CHANGE HUE EFFECT)
        // await ffmpeg.run(
        //   '-i', 'B-slowed.mp4',
        //   '-vf', 'hue=H=2*PI*t:s=cos(2*PI*t)+10',
        //   'B-slow-edited.mp4'
        // );

        // // animate the hue (CHANGE HUE + BRIGHTNESS EFFECT)
        // await ffmpeg.run(
        //   '-i', 'B-slowed.mp4',
        //   '-vf', `hue=H=2:'b=max(0,5-5*t)'`, // << test this
        //   'B-slow-edited.mp4'
        // );

        await ffmpeg.run(
          '-i', 'A.mp4',
          '-i', 'B-slow-edited.mp4',
          '-i', 'audio',

          '-filter_complex', `
                                [0:v][0:a][1:v]concat=n=2:v=1:a=1[vcomb][acomb],
                                [acomb][2:a]amerge=inputs=2[out]`,
          '-map', '[vcomb]',
          '-map', '[out]',
          '-c:v', 'libx264',
          '-c:a', 'aac',
          'output.mp4'
        );

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer]));

        setResults([...results, url]);
        setIsGeneratingVideo(false);
      } catch (e) {
        console.error(e);
        setIsGeneratingVideo(false);
      }

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#000',
      }}>
        <video ref={videoRef}
          style={{ borderRadius: 5, cursor: 'pointer' }}
          controls={false} height={window.innerHeight * 0.6} src={URL.createObjectURL(videoFile)}
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
        <audio ref={audioRef} src={URL.createObjectURL(audioFile)}></audio>
      </div>
    }
  }, [audioFile])

  return (
    <div style={{
      background: '#1f1f1f',
      minHeight: '100vh',
    }}>
      <Head>
        <title>easy.gg Editor</title>
        <meta name="description" content="An editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!videoFile || !audioFile ? <>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#000', marginTop: -30 }}>
          <Button onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime -= 0.1;
            }
          }}><FiChevronLeft /></Button>
          <Button onClick={() => {
            if (!isVideoPlaying) {
              videoRef.current?.play();
            } else {
              videoRef.current?.pause();
            }
          }}>{!isVideoPlaying ? <FaPlay /> : <FaPause />}</Button>
          <Button onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime += 0.1;
            }
          }}><FiChevronRight /></Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', color: '#52FF00', fontSize: 11, marginTop: 20, letterSpacing: '0.1em' }}>
          {convertSecondsToTimestamp(videoRef.current?.currentTime || 0, 30)}
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
            pointerEvents: 'none',
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
            onMouseLeave={() => {
              setIsMovingTimeline(false);
            }}
          />
          <div style={{ width: timelineWidth, height: 90 }} />
        </div>


        {isGeneratingVideo ? <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
              <ProgressBar showLabel getProgressLabel={(value) => {
                return `${Math.round(value)}% Rendered (of a few files)`
              }} value={Math.min(Math.max(ffmpegProgress*100, 0), 100)}/>
              <div style={{color: '#c7c7c7', marginTop: 10}}>Grab a G-FUEL while your clip is being rendered!</div>
            </div>
        </> : <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
            {/* { videoMarkerDuration ? convertSecondsToTimestamp(videoMarkerDuration, 30) : '0' } */}
            <Button onClick={async () => {
              if (videoRef.current) {
                setVideoMarkerDuration(videoRef.current.currentTime);
                generateVideo();
              }
            }}>Mark</Button>
          </div>
        </>}

        
      </> : <></>}

      {memoizedAudioPlayer}

      {/* {audioFile ? <>
        <div style={{ display: 'flex', justifyContent: 'center', color: '#fff' }}>
          <Button onClick={() => {
            if (audioRef.current) {
              const mark = audioRef.current.currentTime
              setAudioMarkerDuration(mark);
            }
          }}>Mark Audio!</Button>
          {audioMarkerDuration ? audioMarkerDuration : '0'}
        </div>
      </> : <></>}


      {videoFile && audioFile ? <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={generateVideo}>Generate Video</Button>
        </div>
      </> : <></>} */}

      {results ? <>

        <div style={{ display: 'flex', }}>

          {results.map(result => (<>
            <video style={{ width: 300 }} controls src={result} />
          </>))}

        </div>

      </> : <></>}

    </div>
  )
}

export default Edit