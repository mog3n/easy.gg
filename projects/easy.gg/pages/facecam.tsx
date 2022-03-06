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
    const [faceCrop, setFaceCrop] = useState<CropPosition>({
        x: 0, y: 0, width: 100, height: 100
    })
    const [showVideoCrop, setShowVideoCrop] = useState(false);

    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
        setClipProxyUrl(twitchClipProxy(blobUrl));
    }, [router]);

    return <>
        <div style={{
            width: 600,
        }}>
            <div
                style={{
                    position: 'absolute',
                    width: faceCrop.width,
                    height: faceCrop.height,
                    border: '1px solid #000',
                    translate: `transformX(${faceCrop.x}), transformY(${faceCrop.y})`,
                }}
                
            />
            <video src={clipProxyUrl} controls style={{ width: 600 }} />
        </div>
    </>
}

export default Facecam;