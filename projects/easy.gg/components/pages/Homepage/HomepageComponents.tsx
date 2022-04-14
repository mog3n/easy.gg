import { ALIGNMENT, Cell, Grid } from "baseui/layout-grid";
import { toaster } from "baseui/toast";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState } from "recoil"
import { Container, ContainerRow, ContainerTitle, TemplateDescription, TemplateSelectContainer, TemplateTitle, TemplateContainer, EffectIcon, EffectTitle, EffectIconSelected } from "../../../pages";
import { selectedTemplateState } from "../../../state/atoms/ui"
import { MakeTemplate } from "../../../types/ui";
import { SelectVideoSourceModal } from "../../ui/SelectVideoSourceModal";

const effectTemplates: MakeTemplate[] = [
    {
        name: 'Hospital Flick',
        description: `Why's it called a hospital flick?`,
        preview_img: '',
        redirect: '/stepEditor',
        preview_mp4: '/audioPreviews/hospital.mp4'
    },
    {
        name: 'Master at Work',
        description: `You are watching a...`,
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
        name: `Stay with Me`,
        description: `Na nee...`,
        preview_img: '',
        redirect: '/overlayEditor',
        preview_mp4: '/overlays/staywithmeoverlay2.mp4'
    },
    {
        name: `I'm Obsessed`,
        description: `No, I don't think you understand...`,
        preview_img: '',
        redirect: '/overlayEditor',
        preview_mp4: '/overlays/idk.mp4'
    },
]
const freeformTemplates: MakeTemplate[] = [
    {
        name: 'Facecam',
        description: `Split the top half of the screen with streamer`,
        preview_img: '/assets/previews/facecam.png',
        redirect: '/facecam',
    },
    {
        name: 'Captions (Coming Soon)',
        description: `Text on top of gameplay`,
        preview_img: '/assets/previews/text.png',
        redirect: '/stepEditor',
        coming_soon: true,
    },
]

interface PageState {
    name: string;
    key: string;
    iconPath: string;
}
const PageStates: PageState[] = [
    { name: "For You", key: 'foryou', iconPath: '/icons/foryou.svg' },
    { name: "Templates", key: 'templates', iconPath: '/icons/templates.svg' },
    { name: "Songs", key: 'songs', iconPath: '/icons/songs.svg' },
    { name: "Facecam", key: 'facecam', iconPath: '/icons/facecam.svg' },
]

export const HomepageEffectsView = () => {
    const [selectedTemplate, setSelectedTemplate] = useRecoilState(selectedTemplateState);
    const [isVideoSourceOpen, setIsVideoSourceOpen] = useState(false);
    const [muted, setMuted] = useState(true);
    const [selectedPage, setSelectedPage] = useState<PageState>(PageStates[0]);


    const renderTemplates = (templates: MakeTemplate[]) => {
        return templates.map(template => {
            return <TemplateContainer key={template.preview_img || template.preview_mp4} onClick={() => {
                if (template.coming_soon) {
                    toaster.info(<>
                        This effect is coming soon!
                    </>, {
                        autoHideDuration: 5000
                    });
                } else {
                    setSelectedTemplate(template);
                    setIsVideoSourceOpen(true);
                }
            }}>
                {template.preview_mp4 ? <>
                    <video
                        src={template.preview_mp4}
                        style={{
                            width: 120,
                            height: 200,
                            backgroundColor: '#181624',
                            objectFit: 'cover',
                            borderRadius: 5,
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
                    <div style={{ width: 120, height: 200, position: 'relative', borderRadius: 5 }}>
                        <Image src={template.preview_img} alt="" layout="fill" />
                    </div>
                </>}
                <TemplateTitle>{template.name}</TemplateTitle>
                <TemplateDescription>{template.description}</TemplateDescription>
            </TemplateContainer>
        });
    }

    return <>
        <SelectVideoSourceModal
            isOpen={isVideoSourceOpen}
            onCloseModal={() => setIsVideoSourceOpen(false)}
        />
        <Grid>
            <Cell span={[2, 4, 8]}>
                <ContainerRow style={{ margin: 0 }}>
                    {PageStates.map(page => {
                        if (page.key === selectedPage.key) {
                            return <EffectIconSelected key={page.key}>
                                <Image src={page.iconPath} alt="Facecam" width={50} height={50} />
                                <EffectTitle>{page.name}</EffectTitle>
                            </EffectIconSelected>
                        } else {
                            return <EffectIcon key={page.key} onClick={() => setSelectedPage(page)}>
                                <Image src={page.iconPath} alt="Facecam" width={50} height={50} />
                                <EffectTitle>{page.name}</EffectTitle>
                            </EffectIcon>
                        }
                    })}
                </ContainerRow>

            </Cell>
            <Cell span={[2, 4, 4]} align={ALIGNMENT.end}>
                {/* <ContainerRow style={{ margin: 0 }}>
                    <EffectIconSingle>
                        <Image src="/icons/myclips.svg" alt="Facecam" width={50} height={50} />
                        <EffectTitle>My Clips</EffectTitle>
                    </EffectIconSingle>
                </ContainerRow> */}
            </Cell>
        </Grid>
        <Grid>
            <Cell span={[2, 4, 8]}>
                <TemplateSelectContainer>
                    <Container style={{ margin: 0 }}>
                        <ContainerTitle>Templates</ContainerTitle>
                        {/* <ContainerRow style={{ margin: 0, marginTop: 10 }}>
                    <Image src="/icons/hover-icon.svg" alt="hover" width={30} height={30} />
                <div style={{ width: 10 }}></div>
                <ContainerSubtitle>Hover mouse to preview effect. Choose a template to get started!</ContainerSubtitle>
                </ContainerRow> */}
                    </Container>
                    <ContainerRow style={{ margin: 0, marginTop: 0, flexWrap: 'wrap' }}>
                        {renderTemplates(effectTemplates)}
                    </ContainerRow>
                </TemplateSelectContainer>
            </Cell>
            <Cell span={[2, 4, 4]}>
                <TemplateSelectContainer>
                    <Container style={{ margin: 0 }}>
                        <ContainerTitle>Popular Effects</ContainerTitle>
                    </Container>
                    <ContainerRow style={{ margin: 0, marginTop: 0, flexWrap: 'wrap' }}>
                        {renderTemplates(freeformTemplates)}
                    </ContainerRow>
                </TemplateSelectContainer>
            </Cell>
        </Grid>
    </>
}