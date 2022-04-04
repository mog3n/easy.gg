import { useState } from "react";
import { SimpleOverlayClip, SimpleSoundClip } from "../../../types/editor";
import { Header } from "../../ui/Header";
import { EditorStep, StepsUI } from "../../ui/StepsUI";
import { MarkVideo } from "../Edit/MarkVideo";
import { OverlayEditPreview } from "./Preview";
import { SelectOverlay } from "./SelectOverlay";

const OverlayEdit = () => {
    // Audio selector
    const [selectedOverlay, setSelectedOverlay] = useState<SimpleOverlayClip>();

    // Video editor
    const [videoMarker, setVideoMarker] = useState(0);
    const [videoTimelinePos, setVideoTimelinePos] = useState(0);

    const editSteps: EditorStep[] = [
        { key: 'overlayEffect', label: 'Select Overlay' },
        { key: 'markVideo', label: 'Mark Video' },
        { key: 'preview', label: 'Preview' },
    ]

    return <>
        <Header pageActive="Create" />
        <StepsUI
            steps={editSteps}
            onRenderPage={(step) => {
                switch (step.key) {
                    case "overlayEffect":
                        return <SelectOverlay
                            preSelectedOverlay={selectedOverlay}
                            onOverlaySelected={audio => setSelectedOverlay(audio)}
                        />
                    case "markVideo":
                        return <MarkVideo
                            timelinePos={videoTimelinePos}
                            videoMarker={videoMarker}

                            onSetVideoMarker={(timestamp, pos) => {
                                setVideoMarker(timestamp);
                                setVideoTimelinePos(pos);
                            }} />
                    case "preview":
                        return <OverlayEditPreview videoMarker={videoMarker} overlay={selectedOverlay} />;
                    default:
                        return <></>
                }
            }}
            onStepSelected={() => {

            }}
        />
    </>
}

export default OverlayEdit;