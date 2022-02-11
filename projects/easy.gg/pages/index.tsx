import { NextPage } from "next";
import styled from "styled-components";
import { SiteContainer } from "../components/ui/Body";
import { Header } from "../components/ui/Header";
import Image from "next/image";
import { LANDING_MOBILE_BREAKPOINT } from "../constants";

const HeroContainer = styled.div`
    margin-top: 60px;
    margin-bottom: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}){
        margin-top: 20px;
        margin-bottom: 20px;
        padding-top: 60px;
        margin: 0;
    }
`

const HeroText1 = styled.div`
    text-align: center;
    font-family: 'Righteous';
    font-size: 64px;
    color: #fff;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}) {
        padding-left: 10px;
        padding-right: 10px;
        font-size: 36px;
        line-height: 0.9em;
    }
`
const HeroText2 = styled.div`
    text-align: center;
    margin-top: -20px;
    font-family: 'Righteous';
    font-size: 64px;
    color: rgba(0,0,0,0.0);
    -webkit-text-stroke: 1px #52FF00;
    margin-bottom: 30px;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}) {
        padding-left: 10px;
        padding-right: 10px;
        margin-top: 0;
        font-size: 36px;
    }
`
const VideoHeroContainer = styled.div`
    display: flex;
    justify-content: center;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}) {
        flex-direction: column-reverse;
        align-items: center;
        margin-top: 60px;
        margin-bottom: 60px;
    }
`
const VideoHeroComponent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}) {
        margin-top: 20px;
        margin-bottom: 20px;
    }
`
const VideoHeroComponentLeft = styled(VideoHeroComponent)`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}) {
        align-items: center;
    }
`
const VideoHeroComponentRight = styled(VideoHeroComponentLeft)`
    align-items: flex-start;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}) {
        align-items: center;
    }
`
const JoinInstructions = styled.div`
    font-family: 'Roboto Mono';
    font-size: 18px;
    color: #fff;
    max-width: 500px;
    text-align: center;
`
const EditorMobile = styled.img`
    width: 100%;
    @media(min-width: ${LANDING_MOBILE_BREAKPOINT}) {
        display: none;
    }
`
const Editor = styled.img` 
    width: 778px;
    height: 126px;
    @media (max-width: ${LANDING_MOBILE_BREAKPOINT}) {
        display: none;
    }
`
const DesktopSpacing1 = styled.div`
    @media (min-width: ${LANDING_MOBILE_BREAKPOINT}) {
        height: 260px;
    }
`
const DesktopSpacing2 = styled.div`
    @media (min-width: ${LANDING_MOBILE_BREAKPOINT}) {
        height: 60px;
    }
`
const DesktopSpacing3 = styled.div`
    height: 30px;
    @media (min-width: ${LANDING_MOBILE_BREAKPOINT}) {
        height: 220px;
    }
`

const Home: NextPage = () => {
    return <SiteContainer>
        <Header />
        <HeroContainer>
            <HeroText1>Professional gaming clips</HeroText1>
            <HeroText2>in seconds.</HeroText2>
                <EditorMobile src="/editormobile.svg" alt="Editor" />
                <Editor src="/editor.svg" alt="Editor" />
        </HeroContainer>

        <VideoHeroContainer>
            <VideoHeroComponentLeft>
                <DesktopSpacing1 />
                <Image src="/landing/2.svg" width={294} height={118} alt="Effortless editing tools" />
            </VideoHeroComponentLeft>
            <VideoHeroComponent>
                <video src="/landing/hospital.mp4" style={{ width: 300, borderRadius: 10 }} autoPlay muted loop />
            </VideoHeroComponent>
            <VideoHeroComponentRight>
                <DesktopSpacing2 />
                <Image src="/landing/1.svg" width={294} height={118} alt="Grow your audience" />
                <DesktopSpacing3 />
                <Image src="/landing/3.svg" width={294} height={118} alt="Drag and drop" />
            </VideoHeroComponentRight>
        </VideoHeroContainer>

        <DesktopSpacing2 />

        <HeroContainer style={{paddingTop: 0}}>
            <HeroText2>Interested in joining?</HeroText2>
            <JoinInstructions>Join our discord channel to reserve a spot in the EZ closed beta.</JoinInstructions>
            <div style={{ height: 30 }} />
            <a href="https://discord.com/invite/P8kdG7XD5M"><Image src="/joinbutton.svg" width={276} height={54} alt="Join beta test" /></a>
        </HeroContainer>

        <div style={{ height: 120 }} />

    </SiteContainer>
}



export default Home;