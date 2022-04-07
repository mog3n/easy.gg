import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { FaVolumeMute, FaVolumeOff, FaVolumeUp } from "react-icons/fa";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { Header } from "../components/ui/Header";
import { SelectVideoSourceModal } from "../components/ui/SelectVideoSourceModal";
import { selectedTemplateState } from "../state/atoms/ui";
import { MakeTemplate } from "../types/ui";

const templates: MakeTemplate[] = [
    {
        name: 'Facecam',
        description: `Split the top half of the screen with the streamer's face.`,
        preview_img: '/assets/previews/facecam.png',
        redirect: '/facecam',
    },
    // {
    //     name: 'Text Overlay',
    //     description: `Text captions on top of gameplay.`,
    //     preview_img: '/assets/previews/text.png',
    //     redirect: '/stepEditor',
    // },
    {
        name: 'Hospital Flick',
        description: `What's your reaction time?`,
        preview_img: '',
        redirect: '/stepEditor',
        preview_mp4: '/audioPreviews/hospital.mp4'
    },
    {
        name: 'Master at Work',
        description: `Show off your skills.`,
        preview_img: '',
        redirect: '/stepEditor',
        preview_mp4: '/audioPreviews/previewMasterAtWork.mp4'
    },
    {
        name: 'Deja Vu - Olivia Rodrigo',
        description: `Do you get deja vu?`,
        preview_img: '',
        redirect: '/overlayEditor',
        preview_mp4: '/overlays/a.mp4'
    },
    {
        name: `I'm Obsessed`,
        description: `No, I don't think you understand...`,
        preview_img: '',
        redirect: '/overlayEditor',
        preview_mp4: '/overlays/idk.mp4'
    },
]

const Index: NextPage = () => {
    const [muted, setMuted] = useState(true);
    const [isVideoSourceOpen, setIsVideoSourceOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useRecoilState(selectedTemplateState);

    const renderTemplates = () => {

        return templates.map(template => {
            return <TemplateContainer key={template.preview_img} onClick={() => {
                setSelectedTemplate(template);
                setIsVideoSourceOpen(true);
            }}>
                {template.preview_mp4 ? <>
                    <video
                        src={template.preview_mp4}
                        style={{
                            width: 200,
                            height: 350,
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            objectFit: 'cover',
                        }}
                        onMouseOver={(evt) => {
                            if (!muted) {
                                evt.currentTarget.muted = false;
                            }
                            evt.currentTarget.play();
                            evt.currentTarget.currentTime = 0;
                        }}
                        onMouseLeave={(evt) => {
                            evt.currentTarget.muted = true;
                        }}
                        autoPlay
                        muted
                        loop
                    ></video>
                </> : <>
                    <Image src={template.preview_img} alt="" width={200} height={350} objectFit="cover" />
                </>}
                <TemplateTitle>{template.name}</TemplateTitle>
                <TemplateDescription>{template.description}</TemplateDescription>
            </TemplateContainer>
        });
    }

    return <>
        <Header pageActive="Home" />
        <SelectVideoSourceModal
            isOpen={isVideoSourceOpen}
            onCloseModal={() => setIsVideoSourceOpen(false)}
        />
        <HeaderBannerContainer>
            <BannerHero>Play, create, grow.</BannerHero>
            <BannerSubtitle>Make exciting gaming clips</BannerSubtitle>
        </HeaderBannerContainer>
        <ContainerRow>
            <EffectIcon>
                <Image src="/icons/facecam.svg" alt="Facecam" width={80} height={80} />
                <EffectTitle>Facecam</EffectTitle>
            </EffectIcon>
            <EffectIcon>
                <Image src="/icons/text.svg" alt="Text" width={80} height={80} />
                <EffectTitle>Text Overlays</EffectTitle>
            </EffectIcon>
            <EffectIcon>
                <Image src="/icons/templates.svg" alt="Templates" width={80} height={80} />
                <EffectTitle>Templates</EffectTitle>
            </EffectIcon>
        </ContainerRow>
        <Container>
            <ContainerTitle>Make</ContainerTitle>
            <ContainerRow style={{ margin: 0, marginTop: 10 }}>
                {/* <Image src="/icons/hover-icon.svg" alt="hover" width={30} height={30} />
                <div style={{ width: 10 }}></div>
                <ContainerSubtitle>Hover mouse to preview effect</ContainerSubtitle> */}
            </ContainerRow>
        </Container>
        <ContainerRow style={{ marginTop: -20 }}>
            <div style={{ cursor: 'pointer', }}>
                {muted ? <div onClick={() => setMuted(false)} style={{ display: 'flex', alignItems: 'center' }}>
                    <FaVolumeMute size={22} color="#fff" style={{ marginRight: 10 }} />
                    <ContainerSubtitle>Muted</ContainerSubtitle>
                </div>
                    :
                    <div onClick={() => setMuted(true)} style={{ display: 'flex', alignItems: 'center' }}>
                        <FaVolumeUp size={22} color="#fff" style={{ marginRight: 10 }} />
                        <ContainerSubtitle>Mute</ContainerSubtitle>
                    </div>}
            </div>
        </ContainerRow>
        <ContainerRow>
            {renderTemplates()}
        </ContainerRow>
        <div style={{ height: '15vh' }} />
    </>
}

export default Index;

const hueAnimation = keyframes`
  0% {
    filter: hue-rotate(-90deg);
    opacity: 0.0;
  }
  100% {
    filter: hue-rotate(0deg);
    opacity: 1;
  }
`
const HeaderBannerContainer = styled.div`
    background: linear-gradient(93.9deg, #4B00EC 21.87%, #B10066 61.05%, #FF0000 91.53%);
    border-radius: 8px;
    margin: 30px;
    padding: 35px;
    display: flex;
    flex-direction: column;
    height: 250px;

    animation: ${hueAnimation} 1s ease-in-out;
    justify-content: flex-end;
`
export const BannerHero = styled.div`
    font-family: Roboto Condensed;
    font-style: italic;
    font-weight: 900;
    font-size: 64px;
    line-height: 75px;
    /* identical to box height */
    color: #FFFFFF;
`

export const BannerSubtitle = styled.div`
font-family: Roboto Condensed;
font-style: italic;
font-weight: 500;
font-size: 20px;
line-height: 23px;

color: #FFFFFF;
`
export const Container = styled.div`
    margin: 30px;
`
export const ContainerRow = styled.div`
    margin: 30px;
    display: flex;
    flex-wrap: wrap;
`
export const EffectIcon = styled.div`
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
export const ContainerTitle = styled.div`
    font-family: Roboto;
    font-style: italic;
    font-weight: 700;
    font-size: 32px;
`
export const ContainerSubtitle = styled.div`
font-family: Roboto Condensed;
font-style: normal;
font-weight: 500;
font-size: 18px;

color: #FFFFFF;

`
export const EffectTitle = styled.div`
    margin-top: 10px;
    font-family: Roboto Condensed;
    font-style: italic;
    font-weight: 700;
    font-size: 15px;
/* identical to box height */
color: #FFFFFF;
`

export const TemplateContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    cursor: pointer;
    border: 2px solid rgba(0,0,0,0);
    padding: 5px;
    &:hover {
        border: 2px solid #fff;
    }
`
export const TemplateTitle = styled.div`
    font-family: Roboto;
    font-style: italic;
font-weight: 700;
margin-top: 5px;
font-size: 18px;
`
export const TemplateDescription = styled.div`
font-family: Roboto;
font-style: italic;
font-size: 13px;
opacity: 0.6;
width: 200px;
`

