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

const Facecam: NextPage = () => {
    const router = useRouter();
    const [clipUrl, setClipUrl] = useState('');
    const [clipProxyUrl, setClipProxyUrl] = useState('');

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
                    translate: `transformX(${faceCrop.x}), transformY(${faceCrop.y})`,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    zIndex: 99
                }}
                onMouseDown={(mouseEvt) => {
                    setIsMovingFaceCrop(true);
                }}
                onMouseUp={(mouseEvt) => {
                    setIsMovingFaceCrop(false);
                }}
                onMouseMove={(mouseEvt) => {
                    const { left, top } = mouseEvt.currentTarget.getBoundingClientRect();
                    const { clientX, clientY } = mouseEvt;
                    setFaceCrop({
                        x: clientX-left,
                        y: clientY-top,
                        width: faceCrop.width,
                        height: faceCrop.height,
                    })
                }}
            />
            <video src={clipProxyUrl} style={{ width: 600 }} />
        </div>
    </>
}

export default Facecam;