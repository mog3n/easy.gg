import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { Header } from "../components/ui/Header";
import { SelectVideoSourceModal } from "../components/ui/SelectVideoSourceModal";
import { selectedTemplateState } from "../state/atoms/ui";
import { MakeTemplate } from "../types/ui";
import { Grid, Cell, ALIGNMENT } from 'baseui/layout-grid'
import { toaster } from "baseui/toast";
import { HomepageEffectsView } from "../components/pages/Homepage/HomepageComponents";


const Index: NextPage = () => {
    const [selectedTemplate, setSelectedTemplate] = useRecoilState(selectedTemplateState);

    return <>
        <Header pageActive="Home" />
        
        <Grid>
            <HeaderBannerContainer>
                <BannerHero>ONE-CLICK GAMING EDITOR</BannerHero>
                <BannerSubtitle>Create viral gaming content in seconds.</BannerSubtitle>
            </HeaderBannerContainer>
        </Grid>
        <HomepageEffectsView />
        <div style={{height: 100}}></div>
        <HeroGroup>
            <Grid>
                <Cell span={[2, 4, 8]}>
                    <HeroContainer>
                        <HeroTitle>Grow Your Twitch Audience</HeroTitle>
                        <HeroDescription>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc, adipiscing laoreet quam tristique lobortis vitae nisi. Aliquet lectus quis.
                        </HeroDescription>
                    </HeroContainer>
                </Cell>
                <Cell span={[2, 4, 4]}>
                    <HeroContainer>
                        <HeroImage>
                            <Image src="/assets/homepage/rayna.png" alt="" layout="fill" objectFit="contain" />
                        </HeroImage>
                    </HeroContainer>
                </Cell>
            </Grid>
        </HeroGroup>
        <Grid>
            <Cell span={[2, 4, 4]}>
                <HeroContainer>
                    <HeroImage>
                        <Image src="/assets/homepage/ghost.png" alt="" layout="fill" objectFit="contain" />
                    </HeroImage>
                </HeroContainer>
            </Cell>

            <Cell span={[2, 4, 8]}>
                <HeroContainer>
                    <HeroTitle>Grow Your Twitch Audience</HeroTitle>
                    <HeroDescription>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc, adipiscing laoreet quam tristique lobortis vitae nisi. Aliquet lectus quis.
                    </HeroDescription>
                </HeroContainer>
            </Cell>
        </Grid>
        <HeroGroup>
        <Grid>
            <Cell span={[2, 4, 8]}>
                <HeroContainer>
                    <HeroTitle>Grow Your Twitch Audience</HeroTitle>
                    <HeroDescription>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc, adipiscing laoreet quam tristique lobortis vitae nisi. Aliquet lectus quis.
                    </HeroDescription>
                </HeroContainer>
            </Cell>
            <Cell span={[2, 4, 4]}>
                <HeroContainer>
                    <HeroImage>
                        <Image src="/assets/homepage/fortnite.png" alt="" layout="fill" objectFit="contain" />
                    </HeroImage>
                </HeroContainer>
            </Cell>

        </Grid>
        </HeroGroup>
        <Grid>
            <div style={{ height: '15vh' }} />
        </Grid>
    </>
}

export default Index;

export const HeroGroup = styled.div`
    background-color: #181624;
`

export const HeroContainer = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
`

export const HeroTitle = styled.div`
font-family: Kanit;
font-style: normal;
font-weight: 700;
font-size: 36px;
`

export const HeroDescription = styled.div`
    font-family: 'Roboto Condensed';
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
`

export const HeroImage = styled.div`
    position: relative;
    width: 100%;
    height: 320px;
    margin-top: 50px;
`


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
    /* background: linear-gradient(93.9deg, #4B00EC 21.87%, #B10066 61.05%, #FF0000 91.53%); */
    border-radius: 8px;
    margin: 20px;
    width: 100%;
    padding: 35px;
    display: flex;
    flex-direction: column;
    height: 250px;
    background-image: url(/assets/backgrounds/headerbg.jpg);
    background-position: 50% 50%;
    background-size: cover;
    background-repeat: no-repeat;

    /* animation: ${hueAnimation} 1s ease-in-out; */
    justify-content: flex-end;
`
export const TemplateSelectContainer = styled.div`
    padding: 10px;
    padding-left: 15px;
    padding-right: 15px;
    background-color: #181624;
    margin-top: 20px;
    border-radius: 10px;
    min-height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`
export const BannerHero = styled.div`
    font-family: Kanit;
    font-weight: 900;
    font-size: 36px;
    /* identical to box height */
    color: #FFFFFF;
`

export const BannerSubtitle = styled.div`
    font-family: Roboto Condensed;
    font-weight: 500;
    font-size: 16px;
    color: #FFFFFF;
`
export const Container = styled.div`
    margin: 20px;
`
export const ContainerRow = styled.div`
    display: flex;
    flex-wrap: wrap;
`
export const EffectIcon = styled.div`
    background-color: #181624;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    padding-left: 15px;
    padding-right: 15px;

    border-radius: 10px 0 0 10px;
    & + & {
        padding-left: 20px;
        border-radius: 0;
    }
    &:last-of-type {
        border-radius: 0 10px 10px 0;
    }
`
export const EffectIconSelected = styled(EffectIcon)`
    background-color: #2800FF;
`
export const EffectIconSingle = styled(EffectIcon)`
    border-radius: 10px;
    & + & {
        border-radius: 10px;
    }
    &:last-of-type {
        border-radius: 10px;
    }
`

export const ContainerTitle = styled.div`
    font-family: Kanit;
    font-weight: 600;
    font-size: 22px;
    margin-bottom: 10px;
`
export const ContainerSubtitle = styled.div`
font-family: Roboto Condensed;
font-style: normal;
font-weight: 500;
font-size: 18px;

color: #FFFFFF;

`
export const EffectTitle = styled.div`
    margin-top: 5px;
    font-family: Roboto Condensed;
    font-style: italic;
    font-weight: 600;
    font-size: 13px;
    /* identical to box height */
    color: #FFFFFF;
`

export const TemplateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
font-size: 15px;
width: 120px;
`
export const TemplateDescription = styled.div`
font-family: Roboto;
font-style: italic;
font-size: 12px;
opacity: 0.6;
    width: 120px;
`