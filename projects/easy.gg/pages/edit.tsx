import axios from 'axios';
import { Button } from 'baseui/button';
import { FileUploader } from 'baseui/file-uploader';
import { ProgressBar } from 'baseui/progress-bar';
import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ffmpeg from '../components/ffmpeg';
import { Header } from '../components/ui/Header';
import { SoundEffectType } from '../ffmpegEffects/effects';
import { hospitalFlick, masterAtWork, maskOff } from '../ffmpegEffects/sounds';
import { convertSecondsToTimestamp } from '../helpers/helpers';

export const PROCESSING_VIDEO_STEP = 0;

const Edit: NextPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundEffect, setSoundEffect] = useState<SoundEffectType>(hospitalFlick);

  const [videoMarkerDuration, setVideoMarkerDuration] = useState(0);

  const [isMovingTimeline, setIsMovingTimeline] = useState(false);
  const [videoTimelinePos, setVideoTimelinePos] = useState(450);
  const [timelineMouseOffset, setTimelineMouseOffset] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [timelineWidth, setTimelineWidth] = useState(900);

  const [videoFile, setVideoFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();

  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatingVideoProgress, setGeneratingVideoProgress] = useState(0);
  const [ffmpegProgress, setFfmpegProgress] = useState<number>(0);

  const [renderStartTime, setRenderStartTime] = useState<Date>();

  const router = useRouter();

  const checkFfmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
  }

  useEffect(() => {
    const asyncEffect = async () => {
      const sound = await soundEffect.getAudioFile();
      setAudioFile(sound);
    }
    asyncEffect();
  }, [soundEffect])

  useEffect(() => {
    checkFfmpeg();

    const asyncEffect = async () => {
      // check router for params
      if (router.query.clip) {
        const blobUrl = router.query.clip as string;
        console.log(blobUrl);
        const blob = await axios.get(blobUrl, { responseType: 'blob' })
        setVideoFile(new File([blob.data], 'videoFile'));
      }
      if (router.query.effect) {
        const effectString = router.query.effect as string;
        console.log(effectString)
        const presets: {[name: string]: SoundEffectType} = {
          "hospitalFlick": hospitalFlick,
          "maskOff" : maskOff,
          "masterAtWork" : masterAtWork,
        }
        if ((effectString in presets)){
          const effectToPassIn = presets[effectString];
          setSoundEffect(effectToPassIn)
        }
      }
    }
    asyncEffect();

    ffmpeg.setProgress((progress) => {
      console.log(progress);
      setFfmpegProgress(progress.ratio);
    })

  }, [])

  const generateVideo = async () => {
    if (soundEffect.getMinMarkerDuration() > videoMarkerDuration) {
      alert("Clip is too short!");
      return;
    }
    await checkFfmpeg();
    if (videoFile && audioFile && audioRef.current) {
      setIsGeneratingVideo(true);
      try {
        setIsGeneratingVideo(true);
        setRenderStartTime(new Date());
        const urlResult = await soundEffect.generateVideo(ffmpeg, videoFile, videoMarkerDuration, setGeneratingVideoProgress);
        router.push({
          pathname: '/export',
          query: {
            clip: urlResult
          }
        })
        setIsGeneratingVideo(false);
      } catch (e) {
        alert(e);
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
          controls={false} height={window.innerHeight * 0.6}
          src={URL.createObjectURL(videoFile)}
          onClick={() => {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
            } else {
              videoRef.current?.play();
            }
          }}
          onLoadedData={(evt) => {
            const duration = evt.currentTarget.duration;
            const calculatedTimelineWidth = 350/soundEffect.getSoundDuration() * duration;
            setTimelineWidth(calculatedTimelineWidth);
            setVideoTimelinePos(calculatedTimelineWidth/2);
          }}
          onPlaying={(event) => {
            setIsVideoPlaying(true);
          }}
          onPause={(event) => {
            setIsVideoPlaying(false);
          }}
          onTimeUpdate={(event) => {
            console.log(timelineWidth);
            const videoTrackCompletionPercentage = event.currentTarget.currentTime / event.currentTarget.duration;
            const durationInPixels = videoTrackCompletionPercentage * timelineWidth;
            const timelinePos = durationInPixels - (timelineWidth / 2) // center
            setVideoTimelinePos(-timelinePos);
          }}
        />
      </div>
    }
  }, [videoFile, timelineWidth])

  const memoizedAudioPlayer = useMemo(() => {
    if (audioFile) {
      return <div style={{ display: 'flex', justifyContent: 'center' }}>
        <audio ref={audioRef} src={URL.createObjectURL(audioFile)}></audio>
      </div>
    }
  }, [audioFile])

  const maxProgressSteps = soundEffect.getVideoProgressLength();
  const normalizeFfmpegProgress = Math.min(Math.max(ffmpegProgress, 0), 100);
  const renderProgress = ((normalizeFfmpegProgress*100)*(1/maxProgressSteps)) + (((generatingVideoProgress-1)/maxProgressSteps)*100);

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
      <Header pageActive="Editor" />

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
          <Button kind="minimal" onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime -= 0.1;
            }
          }}><FiChevronLeft /></Button>
          <Button kind="minimal" onClick={() => {
            if (!isVideoPlaying) {
              videoRef.current?.play();
            } else {
              videoRef.current?.pause();
            }
          }}>{!isVideoPlaying ? <FaPlay /> : <FaPause />}</Button>
          <Button kind="minimal" onClick={() => {
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
            transform: 'translateX(-1.5px) translateY(20px)',
          }} />
          <div style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 998,
          }}>
            <img src="/audio.svg" style={{
              transform: `translateY(40px) translateX(${-((soundEffect.getMinMarkerDuration()/soundEffect.getSoundDuration()*350) - (350/2))}px)`,
              pointerEvents: 'none',
              userSelect: 'none',
              MozUserSelect: 'none',
              WebkitUserSelect: 'none',
              width: 350,
            }}/>
          </div>
          <div style={{
            width: timelineWidth || 0,
            height: 90,
            position: 'absolute',

            left: (window.innerWidth / 2) - (timelineWidth / 2),
            transform: `translateX(${videoTimelinePos}px)`,

            cursor: 'pointer',
            display: 'flex',
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
              if (videoRef.current) {
                setVideoMarkerDuration(videoRef.current.currentTime);
              }
            }}
            onMouseLeave={() => {
              setIsMovingTimeline(false);
            }}
          >
            <div style={{
              flex: 1,
              backgroundColor: '#282915',
              border: '2px solid #BECE07',
              boxSizing: 'border-box',
              borderRadius: 6,
              marginTop: 30,
              marginBottom: 30,
            }}></div>
          </div>
        </div>

        <div style={{ width: timelineWidth, height: 20 }} />

        {isGeneratingVideo && renderStartTime ? <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
            <ProgressBar showLabel getProgressLabel={(value) => {
              return `${Math.round(value)}% Rendered (of a few files)`
            }} value={renderProgress} />
            <div style={{color: "#c7c7c7", margin: 10}}>
              {((new Date().getTime() - renderStartTime.getTime())/1000).toFixed(0)}s elapsed / eta {((((new Date().getTime() - renderStartTime.getTime())/1000)/renderProgress)*100).toFixed(0)}s
            </div>
            <div style={{ color: '#c7c7c7', margin: 20, marginTop: 0 }}>Please wait while we export your video. Taking too long? Consider subscribing to use cloud rendering!</div>
          </div>
        </> : <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
            {/* { videoMarkerDuration ? convertSecondsToTimestamp(videoMarkerDuration, 30) : '0' } */}
            <Button onClick={async () => {
              if (videoRef.current) {
                setVideoMarkerDuration(videoRef.current.currentTime);
                generateVideo();
              }
            }}>Export</Button>
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

    </div>
  )
}

export default Edit;