import { Button } from "baseui/button";
import { ProgressBar } from "baseui/progress-bar";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import styled from "styled-components";
import ffmpeg from "../components/ffmpeg";
import { CenteredHorizontally } from "../components/ui/Body";
import { Header } from "../components/ui/Header";
import { EditorStep } from "../components/ui/StepsUI";
import { renderFacecam } from "../ffmpegEffects/facecam";
import { twitchClipProxy } from "../helpers/helpers";
import { H1 } from "./export";

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

    const [selectedEditorStep, setSelectedEditorStep] = useState<EditorStep>({ label: '', key: 'start' });

    const [showFaceCrop, setShowFaceCrop] = useState(false);
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

    const [isRendering, setIsRendering] = useState(false);
    const [ffmpegProgress, setFfmpegProgress] = useState<number>(0);

    useEffect(() => {
        if (!ffmpeg.isLoaded()) {
            ffmpeg.load();
        }
        ffmpeg.setProgress((progress) => {
            setFfmpegProgress(progress.ratio);
        })
    }, [])

    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
        setClipProxyUrl(blobUrl);
    }, [router]);

    const editorSteps: { [key: string]: EditorStep } = {
        "start": { label: "Start", key: 'start' },
        "face": { label: "Face Crop", key: 'face' },
        "gameplay": { label: "Video Crop", key: 'gameplay' },
        "render": { label: "Render", key: 'render' }
    }

    const renderVideoCropTool = () => {
        return <>
            <CropRectangleUI
                style={{
                    width: videoCrop.width,
                    height: videoCrop.height,
                    transform: `translateX(${videoCrop.x}px) translateY(${videoCrop.y}px)`,
                    cursor: 'move',
                }}
            />
            <CropCornerUI
                onMouseDown={(mouseEvt) => mouseEvt.preventDefault()}
                style={{
                    transform: `translateX(${videoCrop.x + videoCrop.width - 10}px) translateY(${videoCrop.y + videoCrop.height - 10}px)`,
                    cursor: 'nwse-resize',
                }}
            />
        </>
    }

    const renderFaceCamCropTool = () => {
        return <>
            <CropRectangleUI
                // onMouseDown={(mouseEvt) => mouseEvt.preventDefault()}
                style={{
                    width: faceCrop.width,
                    height: faceCrop.height,
                    transform: `translateX(${faceCrop.x}px) translateY(${faceCrop.y}px)`,
                    cursor: 'move',
                }}
            />
            <CropCornerUI
                onMouseDown={(mouseEvt) => mouseEvt.preventDefault()}
                style={{
                    transform: `translateX(${faceCrop.x + faceCrop.width - 10}px) translateY(${faceCrop.y + faceCrop.height - 10}px)`,
                    cursor: 'nwse-resize'
                }}
            />
        </>
    }

    const renderToolOverlay = () => {
        return <div style={{
            position: 'absolute',
            width: videoRef.current?.clientWidth || 0,
            height: videoRef.current?.clientHeight || 0,
            zIndex: 9,
            overflow: 'hidden',
        }}
            onMouseDown={(mouseEvt) => {
                // Convert absolute values (window clientX, window clientY) to local values (top left = 0)
                if (videoRef.current) {
                    const { clientX: cx, clientY: cy } = mouseEvt;
                    const { offsetTop, offsetLeft } = videoRef.current;
                    const clientX = cx - offsetLeft;
                    const clientY = cy - offsetTop;

                    if (showFaceCrop) {
                        // check if mouse is over top the face overlay
                        const isInsideBoxX = clientX > faceCrop.x && clientX < faceCrop.x + faceCrop.width
                        const isInsideBoxY = clientY > faceCrop.y && clientY < faceCrop.y + faceCrop.height

                        // Check if mouse is over top resize corner
                        const isInsideResizeCornerX = clientX > faceCrop.x + faceCrop.width - 20 && clientX < faceCrop.x + faceCrop.width;
                        const isInsideResizeCornerY = clientY > faceCrop.y + faceCrop.height - 20 && clientY < faceCrop.y + faceCrop.height;
                        if (isInsideResizeCornerX && isInsideResizeCornerY) {
                            setIsResizingFaceCrop(true);
                        } else if (isInsideBoxX && isInsideBoxY) {
                            // Mouse is overtop the overlay
                            setIsMovingFaceCrop(true);
                            setMouseStartPos({ x: cx - faceCrop.x, y: cy - faceCrop.y });
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
                }

            }}
            onMouseMove={(mouseEvt) => {
                if (videoRef.current) {
                    // Handle resizing of face
                    if (isResizingFaceCrop) {
                        const { clientX: cx, clientY: cy } = mouseEvt;
                        const { offsetTop, offsetLeft, clientWidth, clientHeight } = videoRef.current;
                        const clientX = cx - offsetLeft;
                        const clientY = cy - offsetTop;
                        const faceCropWidth = clientX - faceCrop.x + 7.5;
                        const faceCropHeight = clientY - faceCrop.y + 7.5

                        const absoluteWidth = faceCrop.x + faceCropWidth + offsetLeft;
                        const absoluteHeight = faceCrop.y + faceCropHeight + offsetTop;

                        const maxAllowedWidth = offsetLeft + clientWidth;
                        const maxAllowedHeight = offsetTop + clientHeight;

                        const normalizedWidth = absoluteWidth < maxAllowedWidth ? faceCropWidth : faceCrop.width;
                        const normalizedHeight = absoluteHeight < maxAllowedHeight ? faceCropHeight : faceCrop.height;

                        setFaceCrop({
                            x: Math.round(faceCrop.x),
                            y: Math.round(faceCrop.y),
                            width: Math.round(normalizedWidth),
                            height: Math.round(normalizedHeight)
                        })
                        return;
                    }
                    // Handle resizing of video
                    if (isResizingVideoCrop) {
                        const { clientX: cx, clientY: cy } = mouseEvt;
                        const { offsetTop, offsetLeft, clientWidth, clientHeight } = videoRef.current;
                        const clientX = cx - offsetLeft;
                        const clientY = cy - offsetTop;

                        const width = clientX - videoCrop.x + 7.5;
                        const height = width * heightRatio;

                        const absoluteWidth = videoCrop.x + width + offsetLeft;
                        const absoluteHeight = videoCrop.y + height + offsetTop;
                        const maxAllowedWidth = offsetLeft + clientWidth;
                        const maxAllowedHeight = offsetTop + clientHeight;

                        if (absoluteWidth < maxAllowedWidth && absoluteHeight < maxAllowedHeight) {
                            setVideoCrop({
                                x: Math.round(videoCrop.x),
                                y: Math.round(videoCrop.y),
                                width: Math.round(width),
                                height: Math.round(height)
                            })
                        }
                        return;
                    }
                    //  Handle X Y movement of facecrop
                    if (isMovingFaceCrop) {
                        const { clientX, clientY } = mouseEvt;
                        const { clientLeft, clientTop, clientWidth, clientHeight } = videoRef.current;
                        const x = Math.min(Math.max(clientX - mouseStartPos.x, 0), clientX + faceCrop.width);
                        const y = Math.min(Math.max(clientY - mouseStartPos.y, 0), clientY + faceCrop.height);

                        const windowMaxX = Math.max(x + faceCrop.width, 0);
                        const windowMaxY = Math.max(y + faceCrop.height, 0);

                        const maxAllowedX = clientLeft + clientWidth;
                        const maxAllowedY = clientLeft + clientHeight;

                        console.log(windowMaxX, windowMaxY, maxAllowedX, maxAllowedY);

                        const normalizedX = (windowMaxX < maxAllowedX) ? x : faceCrop.x;
                        const normalizedY = (windowMaxY < maxAllowedY) ? y : faceCrop.y;

                        setFaceCrop({
                            x: normalizedX, y: normalizedY,
                            width: faceCrop.width,
                            height: faceCrop.height,
                        })


                    }
                    // Handle X Y movement of video crop
                    if (isMovingVideoCrop) {
                        const { clientX, clientY } = mouseEvt;
                        const { clientWidth, clientHeight, clientLeft: vx, clientTop: vy } = videoRef.current;
                        const x = Math.max(Math.round(clientX - mouseStartPos.x), 0)
                        const y = Math.max(Math.round(clientY - mouseStartPos.y), 0);
                        
                        const windowMaxX = vx + x + videoCrop.width;
                        const windowMaxY = vy + y + videoCrop.height;

                        const maxAllowedX = vx + clientWidth;
                        const maxAllowedY = vy + clientHeight;

                        console.log(windowMaxX, windowMaxY, maxAllowedX, maxAllowedY);

                        const normalizedX = (windowMaxX < maxAllowedX) ? x : videoCrop.x;
                        const normalizedY = (windowMaxY < maxAllowedY) ? y : videoCrop.y;

                        setVideoCrop({
                            x: normalizedX,
                            y: normalizedY,
                            width: Math.round(videoCrop.width),
                            height: Math.round(videoCrop.height),
                        })
                    }
                }

            }}
            onMouseUp={(mouseEvt) => {
                if (videoRef.current) {
                    const { clientHeight, clientWidth } = videoRef.current;
                    setIsMovingFaceCrop(false);
                    setIsMovingVideoCrop(false);
                    setIsResizingVideoCrop(false);
                    setIsResizingFaceCrop(false);
    
                    // Update the aspect ratio of the video stream portion
                    if (isResizingFaceCrop) {
    
                        const ratio = (16 - ((9 * faceCrop.height) / faceCrop.width)) / 9;
                        setHeightRatio(ratio);

                        // center the video crop automatically
                        const height = clientHeight;
                        const width = clientHeight * 1/ratio;
                        const xPos = (clientWidth / 2) - (width/2);
                        const yPos = 0;
                       
                        if (ratio !== heightRatio) {
                            setVideoCrop({
                                x: Math.round(xPos),
                                y: Math.round(yPos),
                                width: Math.round(width),
                                height: Math.round(height)
                            })
                        }
    
                        
                    }
                }
                
            }}
        >
            {showVideoCrop ? renderVideoCropTool() : null}
            {showFaceCrop ? renderFaceCamCropTool() : null}
        </div>
    }

    const renderFacecrop = async () => {
        setIsRendering(true);
        if (videoRef.current) {
            const { videoWidth, videoHeight, offsetLeft, offsetTop } = videoRef.current;
            const videoPlayerWidth = videoRef.current.clientWidth;
            const videoPlayerHeight = videoRef.current.clientHeight;

            // console.log(videoWidth, videoHeight, videoPlayerWidth, videoPlayerHeight, offsetLeft, offsetTop);

            // Account for video scaling (i.e. the video preview in the browser is the same size as the actual video)
            const widthScaleFactor = videoWidth / videoPlayerWidth;
            const heightScaleFactor = videoHeight / videoPlayerHeight;

            // Account for the position of the video player
            const faceCropX = faceCrop.x;
            const faceCropY = faceCrop.y;
            const videoCropX = videoCrop.x;
            const videoCropY = videoCrop.y;

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

            const file = new File([(await (await fetch(new Request(clipProxyUrl))).blob())], 'video.mp4');
            const render = await renderFacecam(ffmpeg, file, faceCropAbsolute, gameCropAbsolute, 0, 0);
            router.push({
                pathname: '/export',
                query: {
                    clip: render[0]
                }
            })
        }
        setIsRendering(false);
    }

    const renderEditorSteps = () => {

        const onStepSelected = (step: EditorStep) => {
            // Disable changing steps while rendering
            if (!isRendering) {
                setSelectedEditorStep(step);

                setShowFaceCrop(false);
                setShowVideoCrop(false);

                switch (step.key) {
                    case "face":
                        setShowFaceCrop(true);
                        break;
                    case "gameplay":
                        setShowVideoCrop(true);
                        break;
                    case "render":
                        break;
                    default:
                        break;
                }
            }
        }

        return <>
            <StepsContainer>
                {Object.keys(editorSteps).map((editorStepKey: string, index: number) => {
                    const step = editorSteps[editorStepKey];

                    const isPreviousStep = Object.keys(editorSteps).findIndex(searchStep => searchStep === selectedEditorStep.key) > index;

                    if (selectedEditorStep.key === step.key) {
                        return <>
                            <SingleStepContainer style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StepActiveIndicator></StepActiveIndicator>
                                    <div>
                                        <StepNumberLabel>Step {index + 1}</StepNumberLabel>
                                        <StepLabel>{step.label}</StepLabel>
                                    </div>
                                </div>

                                <FaArrowRight size={18} color="#fff" style={{ marginRight: 10 }} />
                            </SingleStepContainer>
                        </>
                    } else if (isPreviousStep) {
                        // render checkmarks
                        return <>
                            <SingleStepContainerDeselected onClick={() => onStepSelected(step)} style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StepInactiveIndicator />
                                    <div>
                                        <StepNumberLabel>Step {index + 1}</StepNumberLabel>
                                        <StepLabel>{step.label}</StepLabel>
                                    </div>
                                </div>
                                <FaCheck size={18} color="#fff" style={{ marginRight: 15 }} />
                            </SingleStepContainerDeselected>
                        </>
                    } else {
                        return <>
                            <SingleStepContainerDeselected onClick={() => onStepSelected(step)} style={{}}>
                                <StepInactiveIndicator></StepInactiveIndicator>
                                <div>
                                    <StepNumberLabel>Step {index + 1}</StepNumberLabel>
                                    <StepLabel>{step.label}</StepLabel>
                                </div>
                            </SingleStepContainerDeselected>
                        </>
                    }
                })}
            </StepsContainer>
        </>
    }

    const renderEditorStepPages = () => {
        switch (selectedEditorStep.key) {
            case "start":
                return <>
                    <CenteredHorizontally style={{ margin: 20 }}>
                        {`Use the left sidebar to navigate the editor`}
                    </CenteredHorizontally>
                </>
                break;
            case "face":
                return <>
                    <CenteredHorizontally style={{ margin: 20 }}>
                        {`Drag the box to fill the streamer's webcam`}
                    </CenteredHorizontally>
                </>
                break;
            case "gameplay":
                return <>
                    <CenteredHorizontally style={{ margin: 20 }}>
                        {`Drag the box to fill the main video`}
                    </CenteredHorizontally>
                </>
                break;
            case "render":
                return <>
                    <div style={{ margin: 20, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <div><Button onClick={renderFacecrop} kind="secondary" isLoading={isRendering}>Render</Button></div>

                        {isRendering ? <>
                            <div style={{ height: 20 }}></div>
                            {Math.min(Math.max(Math.round(ffmpegProgress * 100), 0), 100)}{`%`}
                            <ProgressBar value={ffmpegProgress * 100} />
                            {`Hang tight, we're rendering your video!`}
                        </> : <></>}
                    </div>
                </>
                break;
            default:
                break;
        }
    }

    return <>
        <div>
            <Header pageActive="Editor" />

            <Container>
                <ContainerLeft>
                    {/* <div style={{margin: 5, textAlign: 'left', marginBottom: 10, opacity: 0.6}}>Navigate the Editor</div> */}
                    {renderEditorSteps()}
                </ContainerLeft>
                <ContainerRight>
                    <div>
                        <H1 style={{ textAlign: 'center', marginBottom: 30 }}>Facecam</H1>
                        {renderToolOverlay()}
                        <video src={clipProxyUrl} style={{ width: '100%' }} ref={videoRef}></video>
                        {renderEditorStepPages()}
                    </div>
                </ContainerRight>

            </Container>

        </div>
    </>
}

const CropRectangleUI = styled.div`
    pointer-events: none;
    top: 0;
    left: 0;
    position: absolute;
    border: 2px solid #24FF00;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
    z-index: 1;
`
const CropCornerUI = styled.div`
    top: 0;
    left: 0;
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #24FF00;
    z-index: 2;
`

export const StepsContainer = styled.div`
    display: flex;
    flex-direction: column;
`
export const SingleStepContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #414141;
    margin: 5px;
    cursor: default;
    transition: 0.05s ease-in;
    border: 2px solid #fff;
    border-radius: 10px;
    &:hover{
        /* border: 2px solid #fff; */
        /* background-color: #535353; */
    }
`
export const SingleStepContainerDeselected = styled(SingleStepContainer)`
    border: 2px solid rgba(0,0,0,0);
`
export const StepActiveIndicator = styled.div`
    width: 13px;
    height: 60px;
    border-radius: 7px 0 0 7px;
    background-color: #24FF00;
    margin-right: 10px;
`
export const StepInactiveIndicator = styled(StepActiveIndicator)`
    background-color: #68686800;
`
export const StepNumberLabel = styled.div`
    font-size: 12px;
    color: #c6c6c6;
`
export const StepLabel = styled.div`
    font-weight: 600;
    font-size: 18px;
`

export const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
`

export const ContainerLeft = styled.div`
    flex: 1 1 0;
    padding: 20px;
    background-color: #212121;
    flex-shrink: 0;
`

export const ContainerRight = styled.div`
    flex: 3 3 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #121212;
`

export default Facecam;