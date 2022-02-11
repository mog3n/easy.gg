import { NextPage } from "next";
import styled from "styled-components";
import { SiteContainer } from "../components/ui/Body";
import { Header } from "../components/ui/Header";
import Image from "next/image";

const HeroContainer = styled.div`
    margin-top: 60px;
    margin-bottom: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    @media (max-width: 600px){
        padding: 30px;
    }
`

const HeroText1 = styled.div`
    text-align: center;
    font-family: 'Righteous';
    font-size: 64px;
    color: #fff;
    @media (max-width: 600px) {
        font-size: 36px;
        line-height: 0.8em;
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
`
const VideoHeroContainer = styled.div`
    display: flex;
    justify-content: center;
`
const VideoHeroComponent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
`
const VideoHeroComponentLeft = styled(VideoHeroComponent)`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`
const VideoHeroComponentRight = styled(VideoHeroComponentLeft)`
    align-items: flex-start;
`
const JoinInstructions = styled.div`
    font-family: 'Roboto Mono';
    font-size: 18px;
    color: #fff;
    max-width: 500px;
    text-align: center;
`
const Editor = styled(Image)``

const Home: NextPage = () => {
    return <SiteContainer>
        <Header />
        <HeroContainer>
            <HeroText1>Professional gaming clips</HeroText1>
            <HeroText2>in seconds.</HeroText2>
            <Editor src="/editor.svg" width={778} height={126} />
        </HeroContainer>

        <VideoHeroContainer>
            <VideoHeroComponentLeft>
                <div style={{ height: 260 }} />
                <Image src="/landing/2.svg" width={294} height={118} alt="Drag and drop templates" />
            </VideoHeroComponentLeft>
            <VideoHeroComponent>
                <video src="/landing/hospital.mp4" style={{ width: 300, borderRadius: 10 }} autoPlay muted loop />
            </VideoHeroComponent>
            <VideoHeroComponentRight>
                <div style={{ height: 60 }} />
                <Image src="/landing/1.svg" width={294} height={118} alt="Drag and drop templates" />

                <div style={{ height: 220 }} />
                <Image src="/landing/3.svg" width={294} height={118} alt="Drag and drop templates" />
            </VideoHeroComponentRight>
        </VideoHeroContainer>


        <div style={{ height: 60 }} />

        <HeroContainer>
            <HeroText2>Interested in joining?</HeroText2>
            <JoinInstructions>Join our discord channel to reserve a spot in the EZ closed beta.</JoinInstructions>
            <div style={{ height: 30 }} />
            <a href="https://discord.com/invite/P8kdG7XD5M"><Image src="/joinbutton.svg" width={276} height={54} alt="Join beta test" /></a>
        </HeroContainer>

        <div style={{ height: 120 }} />

    </SiteContainer>
}



export default Home;