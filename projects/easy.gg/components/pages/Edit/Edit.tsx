import { useState } from "react";
import { SimpleSoundClip } from "../../../types/editor";
import { Header } from "../../ui/Header";
import { EditorStep, Steps, StepsUI } from "../../ui/StepsUI";
import { MarkVideo } from "./MarkVideo";
import { SelectAudio } from "./SelectAudio";

const Edit = () => {
    const [selectedAudio, setSelectedAudio] = useState<SimpleSoundClip>();

    const editSteps: EditorStep[] = [
        { key: 'audioEffect', label: 'Select Audio Effect' },
        { key: 'markVideo', label: 'Mark Video' },
        { key: 'customizeEffects', label: 'Customize Video Effects' },
        { key: 'preview', label: 'Preview' },
    ]

    return <>
        <Header pageActive="Create"/>
        <StepsUI
            steps={editSteps}
            onRenderPage={(step) => {
                switch (step.key) {
                    case "audioEffect":
                        return <SelectAudio preSelectedAudioClip={selectedAudio} onSoundClipSelected={audio => setSelectedAudio(audio)} />
                    case "markVideo":
                        return <MarkVideo />
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