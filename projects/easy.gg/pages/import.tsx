import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { getBaseUrl } from "../constants";
import { clipThumbnailUrlProxy, twitchClipProxy, urlProxy, userProfilePictureThumbnailProxy } from "../helpers/helpers";
import { useGetTwitchClip } from "../state/mutations/twitch";
import { useGetClipMP4Data, useGetTwitchClipsFromBroadcasterID, useSearchTwitchCreators } from "../state/queries/twitch";
import { TwitchClip, TwitchCreator } from "../types/twitchTypes";

const ImportPage: NextPage = (props) => {
    const router = useRouter();
    const [selectedCreator, setSelectedCreator] = useState<TwitchCreator>();
    const [selectedClip, setSelectedClip] = useState<TwitchClip>();

    const [creatorSearchQuery, setCreatorSearchQuery] = useState<string>('');

    const searchQuery = useSearchTwitchCreators(creatorSearchQuery);
    const clipQuery = useGetTwitchClipsFromBroadcasterID(selectedCreator ? selectedCreator.id : '');
    const clipVideoData = useGetClipMP4Data(selectedClip ? selectedClip.url : '');

    //
    const getTwitchClipMutation = useGetTwitchClip();

    const [videoBlobUrl, setVideoBlobUrl] = useState<string>();

    if (selectedClip && clipVideoData.isSuccess) {
        const clipData = clipVideoData.data.data.data.clip;
        const videoLink = new URL(clipData.videoQualities[0].sourceURL)
        videoLink.searchParams.append('sig', clipData.playbackAccessToken.signature);
        videoLink.searchParams.append('token', clipData.playbackAccessToken.value);

        return <>
        <div>
            <button onClick={() => setSelectedClip(undefined)}>Back</button>
        </div>
            <video src={twitchClipProxy(videoLink.href)} controls style={{width: '100%'}} autoPlay/>
            <button onClick={async () => {
                if (!getTwitchClipMutation.isLoading) {
                    const clipResp = await getTwitchClipMutation.mutateAsync({ videoUrl: videoLink.href });
                    const dataUrl = URL.createObjectURL(clipResp.data);
                    router.replace({
                        pathname: '/edit',
                        query: { clip: dataUrl },
                    });
                }
            }}>{getTwitchClipMutation.isLoading ? "Importing..." : "Import into Editor"}</button>
        </>
    }

    if (selectedCreator && clipQuery.data) {
        
        return <>
            <div>
                <button onClick={() => setSelectedCreator(undefined)}>Back</button>
            </div>
            {clipQuery.data.data.data.map(clip => {
                const clipProxy = clipThumbnailUrlProxy(clip.thumbnail_url);
                console.log(clip.thumbnail_url, clipProxy);
                return <button key={clip.id} onClick={() => setSelectedClip(clip)}>
                    <div><img src={`${clipThumbnailUrlProxy(clip.thumbnail_url)}`} style={{ width: 300 }} /></div>
                    <div>{clip.title}</div>
                </button>
            })}
            {clipQuery.data.data.data.length === 0 ? <>
                <div style={{ color: '#fff' }}>No recent clips from {selectedCreator.display_name}</div>
            </> : <></>}
        </>
    }

    return <>
        <div>
            <input value={creatorSearchQuery} onChange={(evt) => setCreatorSearchQuery(evt.target.value)} placeholder="Search for a creator" />
        </div>

        {searchQuery.data ? <>
            {searchQuery.data.data.data.map(creator => {
                return <button key={creator.id} onClick={() => {
                    setSelectedCreator(creator);
                }}>
                    <img style={{ width: 200 }} src={userProfilePictureThumbnailProxy(creator.thumbnail_url)} alt={creator.display_name} />
                    <div>{creator.display_name}</div>
                </button>
            })}
        </> : <></>}
    </>
}

export default ImportPage;