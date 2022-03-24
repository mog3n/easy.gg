import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Create: NextPage = () => {
    const [clipUrl, setClipUrl] = useState('');
    const router = useRouter();

    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
    }, [])
    
    console.log(clipUrl);

    return <>
        <video controls autoPlay src={clipUrl} />
    </>
}

export default Create;