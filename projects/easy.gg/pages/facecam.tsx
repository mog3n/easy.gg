import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ffmpeg from "../components/ffmpeg";
import { Header } from "../components/ui/Header";
import { renderFacecam } from "../ffmpegEffects/facecam";
import { twitchClipProxy } from "../helpers/helpers";

export interface CropPosition {
    x: number
    y: number
    width: number
    height: number
}

interface MousePos {
    x: number
    y: number
}

const Facecam: NextPage = () => {
    const router = useRouter();
    const [clipUrl, setClipUrl] = useState('');
    const [clipProxyUrl, setClipProxyUrl] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const [mouseStartPos, setMouseStartPos] = useState<MousePos>({ x: 0, y: 0 })

    const [showFaceCrop, setShowFaceCrop] = useState(true);
    const [isMovingFaceCrop, setIsMovingFaceCrop] = useState(false);
    const [isResizingFaceCrop, setIsResizingFaceCrop] = useState(false);
    const [faceCrop, setFaceCrop] = useState<CropPosition>({
        x: 0, y: 0, width: 100, height: 100
    })

    const [showVideoCrop, setShowVideoCrop] = useState(false);
    const [isMovingVideoCrop, setIsMovingVideoCrop] = useState(false);
    const [isResizingVideoCrop, setIsResizingVideoCrop] = useState(false);
    const [videoCrop, setVideoCrop] = useState<CropPosition>({
        x: 0, y: 0, width: 100, height: 200
    })
    const [heightRatio, setHeightRatio] = useState(0);

    const [results, setResults] = useState<string[]>();

    const [resp, setRes] = useState<string[]>();
    useEffect(() => {
        if (!ffmpeg.isLoaded()) {
            ffmpeg.load();
        }
    }, [])


    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
        setClipProxyUrl(blobUrl);
    }, [router]);

    const renderVideoCropTool = () => {
        return <>
            <div
                style={{
                    top: 0,
                    left: 0,
                    position: 'absolute',
                    width: videoCrop.width,
                    height: videoCrop.height,
                    border: '3px solid #fff',
                    transform: `translateX(${videoCrop.x}px) translateY(${videoCrop.y}px)`,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    zIndex: 1
                }}
            />
            <div
                style={{
                    top: 0,
                    left: 0,
                    position: "absolute",
                    width: 15,
                    height: 15,
                    backgroundColor: '#fff',
                    transform: `translateX(${videoCrop.x + videoCrop.width - 15}px) translateY(${videoCrop.y + videoCrop.height - 15}px)`,
                    zIndex: 2,
                }}
            />
        </>
    }

    const renderFaceCamCropTool = () => {
        return <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: faceCrop.width,
                    height: faceCrop.height,
                    border: '3px solid #fff',
                    transform: `translateX(${faceCrop.x}px) translateY(${faceCrop.y}px)`,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    zIndex: 1
                }}
            />
            <div
                style={{
                    top: 0,
                    left: 0,
                    position: "absolute",
                    width: 15,
                    height: 15,
                    backgroundColor: '#fff',
                    transform: `translateX(${faceCrop.x + faceCrop.width - 15}px) translateY(${faceCrop.y + faceCrop.height - 15}px)`,
                    zIndex: 2,
                }}
            />
        </>
    }

    const renderToolOverlay = () => {
        return <div style={{
            position: 'absolute',
            width: videoRef.current?.clientWidth,
            height: videoRef.current?.clientHeight,
            zIndex: 9,
        }}
            onMouseDown={(mouseEvt) => {
                const { clientX, clientY } = mouseEvt;
                if (showFaceCrop) {
                    // check if mouse is over top the face overlay
                    const isInsideBoxX = clientX > faceCrop.x && clientX < faceCrop.x + faceCrop.width
                    const isInsideBoxY = clientY > faceCrop.y && clientY < faceCrop.y + faceCrop.height

                    // Check if mouse is over top resize corner
                    const isInsideResizeCornerX = clientX > faceCrop.x + faceCrop.width - 20 && clientX < faceCrop.x + faceCrop.width;
                    const isInsideResizeCornerY = clientY > faceCrop.y + faceCrop.height - 20 && clientX < faceCrop.y + faceCrop.height;

                    if (isInsideResizeCornerX && isInsideResizeCornerY) {
                        setIsResizingFaceCrop(true);
                    } else if (isInsideBoxX && isInsideBoxY) {
                        // Mouse is overtop the overlay
                        setIsMovingFaceCrop(true);
                        setMouseStartPos({ x: mouseEvt.clientX - faceCrop.x, y: mouseEvt.clientY - faceCrop.y });
                    }
                }
                if (showVideoCrop) {
                    // check if mouse is over top the video overlay
                    const insideBoxWidth = clientX > videoCrop.x && clientX < videoCrop.x + videoCrop.width
                    const insideBoxHeight = clientY > videoCrop.y && clientY < videoCrop.y + videoCrop.height

                    // Check if mouse is over top resize corner
                    const isInsideResizeCornerX = clientX > videoCrop.x + videoCrop.width - 20 && clientX < videoCrop.x + videoCrop.width;
                    const isInsideResizeCornerY = clientY > videoCrop.y + videoCrop.height - 20 && clientY < videoCrop.y + videoCrop.height;
                    if (isInsideResizeCornerX && isInsideResizeCornerY) {
                        setIsResizingVideoCrop(true);
                    } else if (insideBoxWidth && insideBoxHeight) {
                        setIsMovingVideoCrop(true);
                        setMouseStartPos({ x: mouseEvt.clientX - videoCrop.x, y: mouseEvt.clientY - videoCrop.y });
                    }
                }
            }}
            onMouseMove={(mouseEvt) => {
                // Handle resizing of face
                if (isResizingFaceCrop) {
                    const { clientX, clientY } = mouseEvt;
                    const faceCropWidth = clientX - faceCrop.x + 7.5;
                    const faceCropHeight = clientY - faceCrop.y + 7.5
                    setFaceCrop({
                        x: Math.round(faceCrop.x),
                        y: Math.round(faceCrop.y),
                        width: Math.round(faceCropWidth),
                        height: Math.round(faceCropHeight)
                    })
                }
                // Handle resizing of video
                if (isResizingVideoCrop) {
                    const { clientX, clientY } = mouseEvt;
                    const width = clientX - videoCrop.x + 7.5;
                    setVideoCrop({
                        x: Math.round(videoCrop.x),
                        y: Math.round(videoCrop.y),
                        width: Math.round(width),
                        height: Math.round(width * heightRatio)
                    })
                }
                //  Handle X Y movement of facecrop
                if (isMovingFaceCrop) {
                    const { clientX, clientY } = mouseEvt;
                    const x = Math.min(Math.max(clientX - mouseStartPos.x, 0), clientX + faceCrop.width);
                    const y = Math.min(Math.max(clientY - mouseStartPos.y, 0), clientY + faceCrop.height);
                    setFaceCrop({
                        x, y,
                        width: faceCrop.width,
                        height: faceCrop.height,
                    })
                }
                // Handle X Y movement of video crop
                if (isMovingVideoCrop) {
                    const { clientX, clientY } = mouseEvt;
                    setVideoCrop({
                        x: Math.round(clientX - mouseStartPos.x),
                        y: Math.round(clientY - mouseStartPos.y),
                        width: Math.round(videoCrop.width),
                        height: Math.round(videoCrop.height),
                    })
                }
            }}
            onMouseUp={(mouseEvt) => {
                mouseEvt.preventDefault();
                setIsMovingFaceCrop(false);
                setIsMovingVideoCrop(false);
                setIsResizingVideoCrop(false);
                setIsResizingFaceCrop(false);
            }}
        >
        </div>
    }

    return <>
        <div>
            <Header pageActive="Editor" />

            <div>
                {renderToolOverlay()}
                <video src={clipProxyUrl} style={{ width: 600 }} ref={videoRef}></video>
                {showVideoCrop ? renderVideoCropTool() : <></>}
                {showFaceCrop ? renderFaceCamCropTool() : <></>}
            </div>


            <div>
                {showVideoCrop ? <>Video Crop</> : <></>}
                {showFaceCrop ? <>Face Crop</> : <></>}

                <button
                    onClick={() => {
                        const ratio = (16 - ((9 * faceCrop.height) / faceCrop.width)) / 9;
                        if (ratio !== heightRatio) {
                            setHeightRatio(ratio);
                            setVideoCrop({
                                x: Math.round(videoCrop.x),
                                y: Math.round(videoCrop.y),
                                width: Math.round(faceCrop.width),
                                height: Math.round(faceCrop.width * ratio)
                            })
                        }
                        setShowVideoCrop(true);
                        setShowFaceCrop(false);
                    }}
                >
                    Edit Video Crop
                </button>

                <button
                    onClick={() => {
                        setShowVideoCrop(false);
                        setShowFaceCrop(true);
                    }}
                >
                    Edit Face Crop
                </button>

                <button onClick={async () => {

                    if (videoRef.current) {
                        const { videoWidth, videoHeight, offsetLeft, offsetTop } = videoRef.current;
                        const videoPlayerWidth = videoRef.current.clientWidth;
                        const videoPlayerHeight = videoRef.current.clientHeight;

                        console.log(videoWidth, videoHeight, videoPlayerWidth, videoPlayerHeight, offsetLeft, offsetTop);

                        // Account for video scaling (i.e. the video preview in the browser is the same size as the actual video)
                        const widthScaleFactor = videoWidth / videoPlayerWidth;
                        const heightScaleFactor = videoHeight / videoPlayerHeight;

                        // Account for the position of the video player
                        const faceCropX = faceCrop.x - offsetLeft;
                        const faceCropY = faceCrop.y - offsetTop;
                        const videoCropX = videoCrop.x - offsetLeft;
                        const videoCropY = videoCrop.y - offsetTop;

                        let faceCropAbsolute: CropPosition = {
                            x: faceCropX * widthScaleFactor,
                            y: faceCropY * heightScaleFactor,
                            width: faceCrop.width * widthScaleFactor,
                            height: faceCrop.height * heightScaleFactor,
                        };

                        let gameCropAbsolute: CropPosition = {
                            x: videoCropX * widthScaleFactor,
                            y: videoCropY * heightScaleFactor,
                            width: videoCrop.width * widthScaleFactor,
                            height: videoCrop.height * heightScaleFactor,
                        };
                        console.log(faceCropAbsolute, gameCropAbsolute);
                        const file = new File([(await (await fetch(new Request(clipProxyUrl))).blob())], 'video.mp4');
                        const render = await renderFacecam(ffmpeg, file, faceCropAbsolute, gameCropAbsolute, 0, 0);
                        router.push({
                            pathname: '/export',
                            query: {
                                clip: render[0]
                            }
                        })
                    }

                }}>Render</button>

                {results ? results.map(result => {
                    return <video src={result} key={result} />
                }) : <></>}

            </div>

        </div>
    </>
}

export default Facecam;