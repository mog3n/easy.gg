import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "../components/ui/Header";
import { H1 } from "./export";

const Create: NextPage = () => {
    const [clipUrl, setClipUrl] = useState('');
    const router = useRouter();

    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
    }, [])

    return <>
        <Header pageActive="Create" />
        <ColumnsContainer>
            <VideoContainer>
                <video style={{width: '100%', borderRadius: 10}} controls autoPlay loop src={clipUrl} />
            </VideoContainer>
            <ContentSelectContainer>
                <H1 style={{marginBottom: 5}}>Apply a template</H1>
                <Description>Choose a template from TikTok trends to facecam effects</Description>
                <EffectsContainer>
                    <Effect onClick={() => {
                        router.push({
                            pathname: '/facecam',
                            query: {
                                clip: clipUrl
                            }
                        })
                    }}>
                        <EffectPreview src="/effectPreviews/facecrop.png"></EffectPreview>
                        <EffectName>Facecam</EffectName>
                    </Effect>
                    <Effect onClick={() => {
                        router.push({
                            pathname: '/facecam',
                            query: {
                                clip: clipUrl
                            }
                        })
                    }}>
                        <EffectPreview src="/effectPreviews/hospital_flick.png"></EffectPreview>
                        <EffectName>Hospital Flick</EffectName>
                    </Effect>
                </EffectsContainer>
            </ContentSelectContainer>
        </ColumnsContainer>
    </>
}

const Description = styled.div`
    font-size: 13px;
    color: #BEBEBE;
`
const ColumnsContainer = styled.div`
    display: flex;
    height: 100vh;
`
const VideoContainer = styled.div`
    padding: 30px;
    flex: 1;
    background-color: #121212;
`
const ContentSelectContainer = styled.div`
    padding: 30px;
    flex: 2;
    background-color: #212121;
`

const EffectsContainer = styled.div`
    display: flex;
    margin-top: 20px;
`

const Effect = styled.div`
    cursor: pointer;
    /* border-radius: 3px; */
    transition: 0.05s ease-in;
    border: 2px solid rgba(0,0,0,0);
    border-radius: 8px;
    margin-right: 20px;
    &:hover {
        border: 2px solid #ffffff;
    }
`
const EffectPreview = styled.img`
    width: 200px;
    height: 400px;
    border-radius: 5px 5px 5px 5px;
    object-fit: cover;
`
const EffectName = styled.div`
    font-size: 16px;
    font-weight: 600;
    margin-top: 5px;
    padding-bottom: 10px;
    padding-left: 5px;
`

export default Create;