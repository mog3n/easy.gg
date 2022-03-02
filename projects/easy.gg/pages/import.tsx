import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { HeroText1, HeroText2 } from ".";
import { getBaseUrl } from "../constants";
import { clipThumbnailUrlProxy, twitchClipProxy, userProfilePictureThumbnailProxy } from "../helpers/helpers";
import { useGetTwitchClip } from "../state/mutations/twitch";
import { useGetClipMP4Data, useGetTwitchClipsFromBroadcasterID, useSearchTwitchCreators } from "../state/queries/twitch";
import { TwitchClip, TwitchCreator } from "../types/twitchTypes";
import { H1 } from "./export";

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

    const memoizedVideoPlayer = useMemo(() => {
        if (clipVideoData.isSuccess) {
            const clipData = clipVideoData.data.data.data.clip;
            const videoLink = new URL(clipData.videoQualities[0].sourceURL)
            videoLink.searchParams.append('sig', clipData.playbackAccessToken.signature);
            videoLink.searchParams.append('token', clipData.playbackAccessToken.value);
            return <FullWidthVideoPlayer autoPlay src={twitchClipProxy(videoLink.href)} controls />;
        }
    }, [clipVideoData, selectedClip])

    if (selectedClip && clipVideoData.isSuccess) {
        const clipData = clipVideoData.data.data.data.clip;
        const videoLink = new URL(clipData.videoQualities[0].sourceURL)
        videoLink.searchParams.append('sig', clipData.playbackAccessToken.signature);
        videoLink.searchParams.append('token', clipData.playbackAccessToken.value);

        return <>
            <HeaderBar>
                <HeaderBackButton onClick={() => setSelectedClip(undefined)} src="/assets/icons/arrow-left.svg" />
                <HeaderText>{selectedClip.title}</HeaderText>
                <div></div>
            </HeaderBar>

            {memoizedVideoPlayer}

            <FlexCenterHorizontally>
                {getTwitchClipMutation.isLoading ?
                    <div style={{ color: '#fff' }}>Importing...</div>
                    : <>
                        <Image src="/assets/import-btn.svg" width={80} height={80} alt="Import" onClick={async () => {
                            if (!getTwitchClipMutation.isLoading) {
                                const clipResp = await getTwitchClipMutation.mutateAsync({ videoUrl: videoLink.href });
                                const dataUrl = URL.createObjectURL(clipResp.data);
                                router.push({
                                    pathname: '/edit',
                                    query: { clip: dataUrl },
                                });
                            }
                        }}></Image>
                    </>}
            </FlexCenterHorizontally>

        </>
    }

    if (selectedCreator && clipQuery.data) {
        return <>
            <HeaderBar>
                <HeaderBackButton src="/assets/icons/arrow-left.svg" onClick={() => setSelectedCreator(undefined)} />
                <HeaderText>{selectedCreator.display_name}&apos;s Twitch Clips</HeaderText>
                <div></div>
            </HeaderBar>
            <UserSearchResults>
                {clipQuery.data.data.data.map(clip => {
                    const clipProxy = clipThumbnailUrlProxy(clip.thumbnail_url);
                    console.log(clip.thumbnail_url, clipProxy);
                    return <ClipPreviewContainer key={clip.id} onClick={() => setSelectedClip(clip)}>
                        <div><ClipPreviewImage src={`${clipThumbnailUrlProxy(clip.thumbnail_url)}`} style={{ width: 300 }} /></div>
                        <ClipPreviewRow>
                            <div>
                                {Math.round(clip.duration)}s
                            </div>
                            <FlexCenterVertically>
                                <SmallIcon src="/assets/icons/eye.svg" style={{ marginRight: 5 }} />
                                {clip.view_count}
                            </FlexCenterVertically>
                        </ClipPreviewRow>
                        <ClipPreviewTitle>{clip.title}</ClipPreviewTitle>

                    </ClipPreviewContainer>
                })}
            </UserSearchResults>
            {clipQuery.data.data.data.length === 0 ? <>
                <div style={{ color: '#fff' }}>No recent clips from {selectedCreator.display_name}</div>
            </> : <></>}
        </>
    }

    return <>
        <div style={{ marginTop: 60 }}>
            <HeroText2 style={{marginBottom: 20, fontSize: 48}}>Import from Twitch</HeroText2>
            <LargeSearchBar value={creatorSearchQuery} onChange={(evt) => setCreatorSearchQuery(evt.target.value)} placeholder="Search for a creator" />
        </div>

        {searchQuery.data ? <UserSearchResults>
            {searchQuery.data.data.data.map(creator => {
                return <UserSearchResultContainer key={creator.id} onClick={() => {
                    setSelectedCreator(creator);
                }}>
                    <UserSearchResultProfileImg src={userProfilePictureThumbnailProxy(creator.thumbnail_url)} alt={creator.display_name} />
                    <UserSearchResultName>{creator.display_name}</UserSearchResultName>
                </UserSearchResultContainer>
            })}
        </UserSearchResults> : <></>}
    </>
}

export default ImportPage;

export const LargeSearchBar = styled.input`
    background-color: #333333;
    border-radius: 15px;
    flex: 1;
    margin-left: 40px;
    margin-right: 40px;
    border: 0;
    width: calc(100% - 80px);
    padding: 15px;
    font-size: 18px;
    text-align: center;
    color: #fff;
    &:active {
        border: 0;
    }
    &:focus {
        border: 0;
    }
`

const UserSearchResults = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    justify-content: center;
`

const UserSearchResultContainer = styled.div`
    cursor: pointer;
    border-radius: 15px;
    background-color: #1E1E1E;
    margin: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 0.1s ease-in;
    &:hover {
        background-color: #424242;
    }
`
const UserSearchResultProfileImg = styled.img`
    width: 120px;
    border-radius: 60px;
`
const UserSearchResultName = styled.div`
    margin-top: 15px;
    font-weight: 600;
    text-align: center;
    color: #fff;
    word-wrap: break-word;
    max-width: 120px;
    font-size: 13px;
`

export const HeaderBar = styled.div`
    padding: 30px;
    display: flex;
    justify-content: space-between;
`
export const HeaderText = styled.div`
    font-size: 26px;
    color: #fff;
`
export const HeaderBackButton = styled.img`
    width: 30px;
    cursor: pointer;
`

export const ClipPreviewContainer = styled.div`
    background-color: #1E1E1E;
    border-radius: 15px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    transition: 0.1s ease-in;
    &:hover {
        background-color: #424242;
    }
`

export const ClipPreviewImage = styled.img`
    width: 300px;
    border-radius: 9px;
`

export const ClipPreviewRow = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 13px;
`
export const FlexCenterVertically = styled.div`
    display: flex;
    align-items: center;
`
export const FlexCenterHorizontally = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`
export const SmallIcon = styled.img`
    width: 16px;
`
export const ClipPreviewTitle = styled.div`
    word-wrap: break-word;
    max-width: 300px;
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 10px;
`

export const FullWidthVideoPlayer = styled.video`
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    border-radius: 15px;
`