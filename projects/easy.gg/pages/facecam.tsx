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

    const [showFaceCrop, setShowCrop] = useState(false);
    const [isMovingFaceCrop, setIsMovingFaceCrop] = useState(false);
    const [faceCrop, setFaceCrop] = useState<CropPosition>({
        x: 0, y: 0, width: 100, height: 100
    })

    const [showVideoCrop, setShowVideoCrop] = useState(false);
    const [isMovingVideoCrop, setIsMovingVideoCrop] = useState(false);
    const [videoCrop, setVideoCrop] = useState<CropPosition>({
        x: 0, y: 0, width: 100, height: 200
    })

    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
        setClipProxyUrl(twitchClipProxy(blobUrl));
    }, [router]);

    return <>
        <div>
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
                onMouseMove={(mouseEvt) => {
                    if (isMovingFaceCrop) {
                        const { left, top } = mouseEvt.currentTarget.getBoundingClientRect();
                        const { clientX, clientY } = mouseEvt;
                        setFaceCrop({
                            x: clientX - mouseStartPos.x,
                            y: clientY - mouseStartPos.y,
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
                    transform: `translateX(${faceCrop.x}px) translateY(${faceCrop.y}px)`,
                    zIndex: 2,
                }}
                
            />
            <video src={clipProxyUrl} style={{ width: 600 }} />
        </div>
    </>
}

export default Facecam;