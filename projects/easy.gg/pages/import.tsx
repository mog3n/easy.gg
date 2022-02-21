import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { useGetClipMP4Data, useGetTwitchClipsFromBroadcasterID, useSearchTwitchCreators } from "../state/queries/twitch";
import { TwitchClip, TwitchCreator } from "../types/twitchTypes";

const ImportPage: NextPage = (props) => {
    const [selectedCreator, setSelectedCreator] = useState<TwitchCreator>();
    const [selectedClip, setSelectedClip] = useState<TwitchClip>();

    const [creatorSearchQuery, setCreatorSearchQuery] = useState<string>('');

    const searchQuery = useSearchTwitchCreators(creatorSearchQuery);
    const clipQuery = useGetTwitchClipsFromBroadcasterID(selectedCreator ? selectedCreator.id : '');
    const clipVideoData = useGetClipMP4Data(selectedClip ? selectedClip.url : '');

    if (selectedClip && clipVideoData.isSuccess) {
        const clipData = clipVideoData.data.data.data.clip;
        const videoLink = new URL(clipData.videoQualities[0].sourceURL)
        videoLink.searchParams.append('sig', clipData.playbackAccessToken.signature);
        videoLink.searchParams.append('token', clipData.playbackAccessToken.value);
        return <>
        <div>
            <button onClick={() => setSelectedClip(undefined)}>Back</button>
        </div>
            <video src={videoLink.href} controls style={{width: '100%'}} autoPlay/>
        </>
    }

    if (selectedCreator && clipQuery.data) {
        return <>
            <div>
                <button onClick={() => setSelectedCreator(undefined)}>Back</button>
            </div>
            {clipQuery.data.data.data.map(clip => {
                return <button key={clip.id} onClick={() => setSelectedClip(clip)}>
                    <div><img src={clip.thumbnail_url} style={{ width: 300 }} /></div>
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
                    <img style={{ width: 200 }} src={creator.thumbnail_url} alt={creator.display_name} />
                    <div>{creator.display_name}</div>
                </button>
            })}
        </> : <></>}
    </>
}

export default ImportPage;