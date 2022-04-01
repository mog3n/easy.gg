import { useState } from "react";
import { SimpleSoundClip } from "../../../types/editor";
import { Header } from "../../ui/Header";
import { EditorStep, Steps, StepsUI } from "../../ui/StepsUI";
import { MarkVideo } from "./MarkVideo";
import { SelectAudio } from "./SelectAudio";

const Edit = () => {
    // Audio selector
    const [selectedAudio, setSelectedAudio] = useState<SimpleSoundClip>();

    // Video editor
    const [videoMarker, setVideoMarker] = useState(0);
    const [videoTimelinePos, setVideoTimelinePos] = useState(0);

    const editSteps: EditorStep[] = [
        { key: 'audioEffect', label: 'Select Audio Effect' },
        { key: 'markVideo', label: 'Mark Video' },
        { key: 'customizeEffects', label: 'Customize Video Effects' },
        { key: 'preview', label: 'Preview' },
    ]

    console.log(videoMarker, videoTimelinePos);

    return <>
        <Header pageActive="Create" />
        <StepsUI
            steps={editSteps}
            onRenderPage={(step) => {
                switch (step.key) {
                    case "audioEffect":
                        return <SelectAudio preSelectedAudioClip={selectedAudio} onSoundClipSelected={audio => setSelectedAudio(audio)} />
                    case "markVideo":
                        return <MarkVideo
                            selectedSoundClip={selectedAudio}
                            timelinePos={videoTimelinePos}
                            videoMarker={videoMarker}

                            onSetVideoMarker={(timestamp, pos) => {
                                setVideoMarker(timestamp);
                                setVideoTimelinePos(pos);
                            }} />

                    case "customizeEffects":
                        return <>customize</>
                    case "preview":
                        return <>preview</>
                    default:
                        return <></>
                }
            }}
            onStepSelected={() => {

            }}
        />
    </>
}

export default Edit;