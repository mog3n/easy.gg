import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { HeroText1 } from ".";
import { Header } from "../components/ui/Header";

const Export: NextPage = () => {
    const router = useRouter();
    const [clipUrl, setClipUrl] = useState('');

    useEffect(() => {
        const blobUrl = router.query.clip as string;
        setClipUrl(blobUrl);
    }, [router])

    const download = () => {
        const link = document.createElement('a');
        link.href = clipUrl;
        link.download = 'Hospital Flick - EZ.mp4';
        link.click();
    }

    if (!clipUrl) {
        return <SplitView>
            <H1>An error has occured.</H1>
        </SplitView>
    }

    return <>
        <Header />
        <SplitView>
            <SplitViewSectionLeft>
                <video style={{ width: 300 }} src={clipUrl}></video>
            </SplitViewSectionLeft>
            <SplitViewSectionRight>
                <H1>Save your clip!</H1>

                <ExportButton>
                    <ExportButtonIcon src="/assets/icons/tiktok.png" />
                    Send to TikTok
                </ExportButton>

                <ExportButton>
                    <ExportButtonIcon src="/assets/icons/youtube.png" />
                    Send to YouTube
                </ExportButton>

                <ExportButton onClick={(_) => download()}>
                    <ExportButtonIcon src="/assets/icons/download.png" style={{ width: 25 }} />
                    Download
                </ExportButton>

            </SplitViewSectionRight>
        </SplitView>
    </>
}
export default Export;

const SplitView = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-height: 100vh;
`
const SplitViewSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
const SplitViewSectionLeft = styled(SplitViewSection)`
    align-items: flex-end;
    margin: 30px;
`
const SplitViewSectionRight = styled(SplitViewSection)`
    align-items: flex-start;
    margin: 30px;
`
export const H1 = styled.div`
    font-size: 26px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 20px;
`

export const ExportButton = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border: 2px solid #4A4A4A;
    border-radius: 7px;
    padding: 10px;
    color: #fff;
    font-weight: 600;
    min-width: 250px;
    height: 60px;
    margin-top: 10px;
    transition: 0.1s ease-in;
    &:hover {
        background-color: #333;
    }
`
export const ExportButtonIcon = styled.img`
    width: 35px;
    margin-right: 5px;
`