import { useEffect, useState } from "react"
import { FaCheckSquare, FaClock, FaMusic, FaPlay, FaRegFileVideo, FaRegSquare, FaSquare, FaUser, FaVideo, FaVideoSlash } from "react-icons/fa"
import styled from "styled-components"
import { availableOverlays } from "../../../ffmpegEffects/overlays"
import { availableSoundClips, hospitalFlickSound, maskOffSound, masterAtWorkSound } from "../../../ffmpegEffects/sounds"
import { H1 } from "../../../pages/export"
import { SimpleOverlayClip, SimpleSoundClip } from "../../../types/editor"

interface SelectAudioProps {
    onOverlaySelected: (sound: SimpleOverlayClip) => any
    preSelectedOverlay?: SimpleOverlayClip
}

export const SelectOverlay = (props: SelectAudioProps) => {
    const [selectedSoundClip, setSelectedSoundClip] = useState<SimpleOverlayClip>();

    const [showHoverPreview, setShowHoverPreview] = useState(false);
    const [hoverPreviewClip, setHoverPreviewClip] = useState<SimpleOverlayClip>();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (props.preSelectedOverlay) {
            setSelectedSoundClip(props.preSelectedOverlay);
        }
    }, [])

    const renderHoverPreview = () => {
        if (showHoverPreview) {
            return <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translate(${mousePos.x + 20}px, ${mousePos.y + 20}px)`,
                zIndex: 9
            }}
                onMouseOver={() => {
                    setHoverPreviewClip(undefined);
                    setShowHoverPreview(false);
                }}
            >
                {hoverPreviewClip?.previewMP4 ? <>
                    <video
                        loop
                        src={hoverPreviewClip?.overlayURL}
                        style={{ width: 200, borderRadius: 5, border: '2px solid #606060' }}
                        autoPlay
                    />
                </> : <>
                    <audio
                        src={hoverPreviewClip?.overlayURL}
                        autoPlay
                        controls
                        loop
                        onMouseOver={() => {
                            setHoverPreviewClip(undefined);
                            setShowHoverPreview(false);
                        }}
                    />
                </>}

            </div>
        }
    }

    return <>
        {renderHoverPreview()}

        <H1>Select Audio Effect</H1>
        <AudioEffectsContainer>
            {availableOverlays.map((overlay: SimpleOverlayClip, index: number) => {
                const isSelected = selectedSoundClip && selectedSoundClip.overlayURL === overlay.overlayURL;
                const isHovering = hoverPreviewClip && hoverPreviewClip.overlayURL === overlay.overlayURL;

                const DynamicContainer = (isSelected || isHovering) ? AudioEffectsContainerSelected : AudioEffectContainer

                return <DynamicContainer
                    key={`sound-effect-${index}`}
                    onMouseMove={(mouseEvt) => {
                        setMousePos({
                            x: mouseEvt.clientX,
                            y: mouseEvt.clientY,
                        })
                    }}
                    onMouseOver={() => {
                        setShowHoverPreview(true);
                        setHoverPreviewClip(overlay);
                    }}
                    onMouseLeave={() => {
                        setShowHoverPreview(false);
                        setHoverPreviewClip(undefined);
                    }}
                    onClick={() => {
                        setSelectedSoundClip(overlay);
                        props.onOverlaySelected(overlay);
                    }}>
                    <AudioEffectLeft>
                        {isSelected ? <FaCheckSquare size={22} /> : <FaRegSquare size={22} />}
                        <FaVideo size={22} style={{ marginLeft: 20 }} />
                        <AudioEffectLabel>
                            <AudioEffectName>{overlay.name}</AudioEffectName>
                            <AudioEffectAuthor>{overlay.creator}</AudioEffectAuthor>
                        </AudioEffectLabel>
                    </AudioEffectLeft>
                    <AudioEffectRight>
                        {overlay.num_users ? <>
                            <FaUser style={{ margin: 5 }} />
                            {overlay.num_users}+ users
                        </> : <></>}
                        <FaClock style={{ margin: 5 }} />{overlay.duration.toFixed(0)}s
                    </AudioEffectRight>
                </DynamicContainer>
            })}
        </AudioEffectsContainer>
    </>
}

const AudioEffectsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const AudioEffectContainer = styled.div`
    cursor: pointer;
    padding: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    min-width: 600px;
    margin-bottom: 10px;
    background-color: #363636;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
    border: 2px solid rgba(0,0,0,0);
`
const AudioEffectsContainerSelected = styled(AudioEffectContainer)`
    border: 2px solid #fff;
`

const AudioEffectLeft = styled.div`
    display: flex;
    align-items: center;
`
const AudioEffectRight = styled.div`
    display: flex;
    align-items: center;
`
const AudioEffectLabel = styled.div`
    padding: 10px;
`
const AudioEffectName = styled.div`
    font-size: 16px;
    font-weight: 600;
`
const AudioEffectAuthor = styled.div`
    font-size: 12px;
    opacity: 0.6;
`