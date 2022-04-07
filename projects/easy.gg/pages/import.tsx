import axios from "axios";
import { Button } from "baseui/button";
import { Input } from "baseui/input";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FaClock, FaEye, FaSearch, FaTimes } from "react-icons/fa";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { Header } from "../components/ui/Header";
import { clipThumbnailUrlProxy, twitchClipProxy, userProfilePictureThumbnailProxy } from "../helpers/helpers";
import { selectedTemplateState } from "../state/atoms/ui";
import { useGetTwitchClip } from "../state/mutations/twitch";
import { useGetClipMP4Data, useGetTwitchClipsFromBroadcasterID, useSearchTwitchCreators } from "../state/queries/twitch";
import { TwitchClip, TwitchCreator } from "../types/twitchTypes";
import { MakeTemplate } from "../types/ui";
import { H1 } from "./export";

const ImportPage: NextPage = (props) => {
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useRecoilState<MakeTemplate>(selectedTemplateState);

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
            return <FullWidthVideoPlayer autoPlay src={clipVideoData.data.data.ezLink} controls />;
        }
    }, [selectedClip, clipVideoData.isSuccess])

    if (selectedClip && clipVideoData.isSuccess) {
        return <>
            <Header pageActive="Create" />
            <HeaderBar>
                <HeaderBackButton onClick={() => setSelectedClip(undefined)} src="/assets/icons/arrow-left.svg" />
                <HeaderText>{selectedClip.title}</HeaderText>
                <div></div>
            </HeaderBar>
            {memoizedVideoPlayer}
            <FlexCenterHorizontally>
                <div style={{ height: 20 }}></div>
                <Button isLoading={getTwitchClipMutation.isLoading} onClick={async () => {
                    if (!getTwitchClipMutation.isLoading) {
                        const clipResp = await getTwitchClipMutation.mutateAsync({ videoUrl: clipVideoData.data.data.ezLink });
                        const dataUrl = URL.createObjectURL(clipResp.data);

                        // check if user has already chosen a clip
                        if (router.query.useTemplate) {
                            router.push({
                                pathname: selectedTemplate.redirect,
                                query: { clip: dataUrl },
                            });
                        } else {
                            router.push({
                                pathname: '/create',
                                query: { clip: dataUrl },
                            });
                        }

                    }
                }} kind="secondary">Select Clip</Button>
            </FlexCenterHorizontally>
        </>
    }

    if (selectedCreator && clipQuery.data) {
        return <>
            <Header pageActive="Create" />
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
                            <div style={{ opacity: 0.7 }}>
                                {new Date(clip.created_at).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </div>
                            <FlexCenterVertically style={{ opacity: 0.7 }}>
                                <div style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>
                                    <FaClock size={13} style={{ marginRight: 5 }} />{Math.round(clip.duration)}
                                </div>
                                <div style={{ marginRight: 10, display: 'flex', alignItems: 'center' }}>
                                    <FaEye size={16} style={{ marginRight: 5 }} /> {clip.view_count.toLocaleString()}
                                </div>

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
        <Header pageActive="Create" />
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20, marginRight: 20 }}>
            <H1 style={{ fontSize: 32, margin: 0 }}>Search Twitch Creator</H1>
            <Input
                endEnhancer={<FaSearch size={16} />}
                autoFocus
                placeholder="Search for a creator"
                value={creatorSearchQuery}
                onChange={(evt) => setCreatorSearchQuery(evt.currentTarget.value)}
                overrides={{
                    Root: {
                        style: {
                            width: '350px'
                        }
                    },
                }}
            />
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
    background-color: #1E1E1E;
    margin: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: 0.05s ease-in;
    border: 2px solid #ffffff00;
    &:hover {
        background-color: #333;
        /* border: 2px solid #ffffff; */
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
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    transition: 0.1s ease-in;
    border: 2px solid rgba(0,0,0,0);
    &:hover {
        /* border: 2px solid #fff; */
        background-color: #333;
    }
`

export const ClipPreviewImage = styled.img`
    width: 300px;
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