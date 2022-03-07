import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

    const [mouseStartPos, setMouseStartPos] = useState<MousePos>({ x: 0, y: 0 })

    const [showFaceCrop, setShowFaceCrop] = useState(false);
    const [isMovingFaceCrop, setIsMovingFaceCrop] = useState(false);
    const [faceCrop, setFaceCrop] = useState<CropPosition>({
        x: 0, y: 0, width: 100, height: 100
    })

    const [showVideoCrop, setShowVideoCrop] = useState(false);
    const [isMovingVideoCrop, setIsMovingVideoCrop] = useState(false);
    const [videoCrop, setVideoCrop] = useState<CropPosition>({
        x: 0, y: 0, width: 100, height: 200
    })
    const [heightRatio, setHeightRatio] = useState(0);

    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
        setClipProxyUrl(twitchClipProxy(blobUrl));
    }, [router]);

    const renderVideoCropTool = () => {
        return <>
            <div
                style={{
                    position: 'absolute',
                    width: videoCrop.width,
                    height: videoCrop.height,
                    border: '3px solid #fff',
                    transform: `translateX(${videoCrop.x}px) translateY(${videoCrop.y}px)`,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    zIndex: 1
                }}
                onMouseDown={(mouseEvt) => {
                    const { left, top } = mouseEvt.currentTarget.getBoundingClientRect();
                    setIsMovingVideoCrop(true);
                    setMouseStartPos({ x: mouseEvt.clientX - left, y: mouseEvt.clientY - top });
                }}
                onMouseUp={(mouseEvt) => {
                    setIsMovingVideoCrop(false);
                }}
                onMouseLeave={() => {
                    setIsMovingVideoCrop(false);
                }}
                onMouseMove={(mouseEvt) => {
                    if (isMovingVideoCrop) {
                        const { left, top } = mouseEvt.currentTarget.getBoundingClientRect();
                        const { clientX, clientY } = mouseEvt;
                        setVideoCrop({
                            x: clientX - mouseStartPos.x,
                            y: clientY - mouseStartPos.y,
                            width: videoCrop.width,
                            height: videoCrop.height,
                        })
                    }
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 15,
                    height: 15,
                    backgroundColor: '#fff',
                    transform: `translateX(${videoCrop.x + videoCrop.width - 15}px) translateY(${videoCrop.y + videoCrop.height - 15}px)`,
                    zIndex: 2,
                }}
                onMouseDown={(mouseEvt) => {
                    mouseEvt.preventDefault();
                    setIsMovingVideoCrop(true);
                }}
                onMouseUp={(mouseEvt) => {
                    mouseEvt.preventDefault();
                    setIsMovingVideoCrop(false);
                }}
                onMouseLeave={() => {
                    setIsMovingVideoCrop(false);
                }}
                onMouseMove={(mouseEvt) => {
                    mouseEvt.preventDefault();
                    if (isMovingVideoCrop) {
                        const { clientX, clientY } = mouseEvt;
                        const width = clientX - videoCrop.x + 7.5;
                        setVideoCrop({
                            x: videoCrop.x,
                            y: videoCrop.y,
                            width,
                            height: width * heightRatio
                        })
                    }
                }}
            />
        </>
    }

    const renderFaceCamCropTool = () => {
        return <>
            <div
                style={{
                    position: 'absolute',
                    width: faceCrop.width,
                    height: faceCrop.height,
                    border: '3px solid #fff',
                    transform: `translateX(${faceCrop.x}px) translateY(${faceCrop.y}px)`,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    zIndex: 1
                }}
                onMouseDown={(mouseEvt) => {
                    const { left, top } = mouseEvt.currentTarget.getBoundingClientRect();
                    setIsMovingFaceCrop(true);
                    setMouseStartPos({ x: mouseEvt.clientX - left, y: mouseEvt.clientY - top });
                }}
                onMouseUp={(mouseEvt) => {
                    setIsMovingFaceCrop(false);
                }}
                onMouseLeave={() => {
                    setIsMovingFaceCrop(false);
                }}
                onMouseMove={(mouseEvt) => {
                    if (isMovingFaceCrop) {
                        const { left, top } = mouseEvt.currentTarget.getBoundingClientRect();
                        const { clientX, clientY } = mouseEvt;
                        const x = Math.min(Math.max(clientX - mouseStartPos.x, 0), clientX+faceCrop.width);
                        const y = Math.min(Math.max(clientY - mouseStartPos.y, 0), clientY+faceCrop.height);
                        setFaceCrop({
                            x, y,
                            width: faceCrop.width,
                            height: faceCrop.height,
                        })
                    }
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 15,
                    height: 15,
                    backgroundColor: '#fff',
                    transform: `translateX(${faceCrop.x + faceCrop.width - 15}px) translateY(${faceCrop.y + faceCrop.height - 15}px)`,
                    zIndex: 2,
                }}
                onMouseDown={(mouseEvt) => {
                    mouseEvt.preventDefault();
                    setIsMovingFaceCrop(true);
                }}
                onMouseUp={(mouseEvt) => {
                    mouseEvt.preventDefault();
                    setIsMovingFaceCrop(false);
                }}
                onMouseLeave={() => {
                    setIsMovingFaceCrop(false);
                }}
                onMouseMove={(mouseEvt) => {
                    mouseEvt.preventDefault();
                    if (isMovingFaceCrop) {
                        const { clientX, clientY } = mouseEvt;
                        const faceCropWidth = clientX - faceCrop.x + 7.5;
                        const faceCropHeight = clientY - faceCrop.y + 7.5
                        setFaceCrop({
                            x: faceCrop.x,
                            y: faceCrop.y,
                            width: faceCropWidth,
                            height: faceCropHeight
                        })
                    }
                }}
            />
        </>
    }

    return <>
        <div>
            {showVideoCrop ? renderVideoCropTool() : <></>}
            {showFaceCrop ? renderFaceCamCropTool() : <></>}
            <video src={clipProxyUrl} style={{ width: 600 }} />

            <div>
                {showVideoCrop ? <>Video Crop</> : <></>}
                {showFaceCrop ? <>Face Crop</> : <></>}

                <button
                    onClick={() => {
                        const ratio = (16 - ((9 * faceCrop.height) / faceCrop.width)) / 9;
                        setVideoCrop({
                            x: videoCrop.x,
                            y: videoCrop.y,
                            width: faceCrop.width,
                            height: faceCrop.width * ratio
                        })
                        setHeightRatio(ratio);
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
            </div>

        </div>
    </>
}

export default Facecam;