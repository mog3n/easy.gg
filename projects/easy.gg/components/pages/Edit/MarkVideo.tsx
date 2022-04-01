
import React from 'react';
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SoundEffect, SoundEffectType } from "../../../ffmpegEffects/effects";
import { hospitalFlick } from "../../../ffmpegEffects/sounds";
import ffmpeg from "../../ffmpeg";
import { Button } from 'baseui/button';
import { convertSecondsToTimestamp } from '../../../helpers/helpers';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaPause, FaPlay } from 'react-icons/fa';
import { SimpleSoundClip } from '../../../types/editor';

interface MarkVideoProps {
    selectedSoundClip?: SimpleSoundClip

    videoMarker?: number;
    timelinePos?: number;

    onSetVideoMarker: (timestamp: number, videoTimelinePos: number) => void;
}

export const MarkVideo = (props: MarkVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const propsSoundEffect = props.selectedSoundClip ? SoundEffect(props.selectedSoundClip) : null;
    const [soundEffect, setSoundEffect] = useState<SoundEffectType>(propsSoundEffect || hospitalFlick);

    const [videoMarkerDuration, setVideoMarkerDuration] = useState(props.videoMarker || 0);

    const [isMovingTimeline, setIsMovingTimeline] = useState(false);
    const [videoTimelinePos, setVideoTimelinePos] = useState(props.timelinePos || 0);
    const [timelineMouseOffset, setTimelineMouseOffset] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [timelineWidth, setTimelineWidth] = useState(900);

    const [renderTimelineWidth, setRenderTimelineWidth] = useState(0);

    const [videoFile, setVideoFile] = useState<File>();

    const [ffmpegProgress, setFfmpegProgress] = useState<number>(0);

    const router = useRouter();

    // Function to check ffmpeg is lodaded
    const checkFfmpeg = async () => {
        if (!ffmpeg.isLoaded()) {
            ffmpeg.load();
        }
    }

    // Load video blob into state
    useEffect(() => {
        checkFfmpeg();

        const asyncEffect = async () => {
            // check router for params
            if (router.query.clip) {
                const blobUrl = router.query.clip as string;
                const blob = await axios.get(blobUrl, { responseType: 'blob' })
                setVideoFile(new File([blob.data], 'videoFile'));
            }
        }
        asyncEffect();

        ffmpeg.setProgress((progress) => {
            console.log(progress);
            setFfmpegProgress(progress.ratio);
        })
    }, [])

    useEffect(() => {
        if (videoRef.current && props.videoMarker) {
            videoRef.current.currentTime = props.videoMarker;
        }
    }, [videoRef])

    // Update the size of the timeline
    useEffect(() => {
        if (containerRef.current) {
            setRenderTimelineWidth(containerRef.current.clientWidth);
        }
    }, [containerRef])

    const memoizedVideoPlayer = useMemo(() => {
        if (videoFile) {
            return <div style={
                {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    padding: 30,
                    backgroundColor: '#000',
                }
            }>
                <video ref={videoRef}
                    style={{ borderRadius: 5, cursor: 'pointer' }}
                    controls={false} width={window.innerWidth * 0.5}
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
                        const calculatedTimelineWidth = 350 / soundEffect.getSoundDuration() * duration;
                        setTimelineWidth(calculatedTimelineWidth);

                        if (props.timelinePos === 0 || !props.timelinePos) {
                            setVideoTimelinePos(calculatedTimelineWidth / 2);
                        }
                    }}
                    onPlaying={(event) => {
                        setIsVideoPlaying(true);
                    }}
                    onPause={(event) => {
                        setIsVideoPlaying(false);
                        if (videoRef.current) {
                            // calculate timeline offset value
                            const videoTrackCompletionPercentage = event.currentTarget.currentTime / event.currentTarget.duration;
                            const durationInPixels = videoTrackCompletionPercentage * timelineWidth;
                            const timelinePos = durationInPixels - (timelineWidth / 2) // center

                            // call update function
                            props.onSetVideoMarker(videoRef.current.currentTime, -timelinePos);
                        }
                    }}
                    onTimeUpdate={(event) => {
                        if (videoRef.current) {
                            const videoTrackCompletionPercentage = event.currentTarget.currentTime / event.currentTarget.duration;
                            const durationInPixels = videoTrackCompletionPercentage * timelineWidth;
                            const timelinePos = durationInPixels - (timelineWidth / 2) // center
                            setVideoTimelinePos(-timelinePos);
                        }
                    }}
                />
            </div>
        }
    }, [videoFile, timelineWidth, soundEffect])

    return (
        <div style={{ width: '100%' }} ref={containerRef}>

            {memoizedVideoPlayer}

            {
                videoFile ? <>
                    <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#000', marginTop: -30 }}>
                        <Button kind="minimal" onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.currentTime -= 0.1;
                            }
                        }
                        }> <FiChevronLeft /></Button >
                        <Button kind="minimal" onClick={() => {
                            if (!isVideoPlaying) {
                                videoRef.current?.play();
                            } else {
                                videoRef.current?.pause();
                            }
                        }}> {!isVideoPlaying ? <FaPlay /> : <FaPause />}</Button>
                        < Button kind="minimal" onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.currentTime += 0.1;
                            }
                        }}> <FiChevronRight /></Button >
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', color: '#52FF00', fontSize: 11, marginTop: 20, letterSpacing: '0.1em' }}>
                        {convertSecondsToTimestamp(videoRef.current?.currentTime || 0, 30)}
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 120,
                        position: 'absolute',
                        width: renderTimelineWidth,
                        overflow: 'hidden',
                    }}>
                        <div style={
                            {
                                width: 3,
                                cursor: 'pointer',
                                backgroundColor: '#52FF00',
                                height: 90,
                                position: 'absolute',
                                pointerEvents: 'none',
                                borderRadius: 5,
                                zIndex: 999,
                                transform: 'translateX(-1.5px) translateY(20px)',
                            }
                        } />

                        <div style={{
                            position: 'absolute',
                            pointerEvents: 'none',
                            zIndex: 998,
                        }}>
                            <img src="/audio.svg" style={{
                                transform: `translateY(40px) translateX(${-((soundEffect.getMinMarkerDuration() / soundEffect.getSoundDuration() * 350) - (350 / 2))}px)`,
                                pointerEvents: 'none',
                                userSelect: 'none',
                                MozUserSelect: 'none',
                                WebkitUserSelect: 'none',
                                width: 350,
                            }} />
                        </div>

                        <div style={{
                            width: timelineWidth || 0,
                            height: 90,
                            position: 'absolute',

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
                                if (videoRef.current && isMovingTimeline) {
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
                                    props.onSetVideoMarker(videoRef.current.currentTime, videoTimelinePos);
                                }
                            }}
                            onMouseLeave={() => {
                                setIsMovingTimeline(false);
                            }}
                        >
                            <div style={
                                {
                                    flex: 1,
                                    backgroundColor: '#282915',
                                    border: '2px solid #BECE07',
                                    boxSizing: 'border-box',
                                    borderRadius: 6,
                                    marginTop: 30,
                                    marginBottom: 30,
                                }
                            }> </div>
                        </div>

                    </div>

                    <div style={{ height: 20 }} />

                </> : <></>}

        </div>
    )
}

// {
//     isGeneratingVideo && renderStartTime ? <>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
//             <ProgressBar showLabel getProgressLabel={(value) => {
//                 return `${Math.round(value)}% Rendered (of a few files)`
//             }
//             } value={renderProgress} />
//             <div style={{ color: "#c7c7c7", margin: 10 }}>
//                 {((new Date().getTime() - renderStartTime.getTime()) / 1000).toFixed(0)}s elapsed / eta {((((new Date().getTime() - renderStartTime.getTime()) / 1000) / renderProgress) * 100).toFixed(0)} s
//             </div>
//             < div style={{ color: '#c7c7c7', margin: 20, marginTop: 0 }}> Please wait while we export your video.Taking too long ? Consider subscribing to use cloud rendering! </div>
//         </div>
//     </> : <>
//         < div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
//             {/* { videoMarkerDuration ? convertSecondsToTimestamp(videoMarkerDuration, 30) : '0' } */}
//             <Button onClick={async () => {
//                 if (videoRef.current) {
//                     setVideoMarkerDuration(videoRef.current.currentTime);
//                     generateVideo();
//                 }
//             }}> Export</Button>
//         </div>
//     </>}