import { useState } from "react";
import { SimpleSoundClip } from "../../../types/editor";
import { Header } from "../../ui/Header";
import { EditorStep, StepsUI } from "../../ui/StepsUI";
import { MarkVideo } from "./MarkVideo";
import { EditPreview } from "./Preview";
import { Render } from "./Render";
import { SelectAudio } from "./SelectAudio";

const Edit = () => {
    // Audio selector
    const [selectedAudio, setSelectedAudio] = useState<SimpleSoundClip>();

    // Video editor
    const [videoMarker, setVideoMarker] = useState(0);
    const [videoTimelinePos, setVideoTimelinePos] = useState(0);
    const [isStepChangeDisabled, setDisableStepChange] = useState(false);

    const editSteps: EditorStep[] = [
        {
            key: 'audioEffect', label: 'Select Audio Effect',
            isNextStepConditionSatisfied: () => {
                return selectedAudio !== undefined;
            }
        },
        {
            key: 'markVideo', label: 'Mark Video',
            isNextStepConditionSatisfied: () => {
                return (selectedAudio && videoMarker >= selectedAudio.marker) || false;
            }
        },
        {
            key: 'preview', label: 'Preview',
            isNextStepConditionSatisfied: () => true
        },
        {
            key: 'export', label: 'Export',
            isNextStepConditionSatisfied: () => true
        },
    ]

    return <>
        <Header pageActive="Create" />
        <StepsUI
            steps={editSteps}
            stepsDisabled={isStepChangeDisabled}
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
                        return <EditPreview audio={selectedAudio} videoMarker={videoMarker} setDisableStepChange={setDisableStepChange} />
                    case "export":
                        return <Render audio={selectedAudio} videoMarker={videoMarker} setDisableStepChange={setDisableStepChange} />
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