import { EditorStep, Steps, StepsUI } from "../../ui/StepsUI";

const Edit = () => {
    const editSteps: Steps  = {
        "editor": { key: '', label: '' }
    }
    return <>
        <StepsUI
            steps={editSteps}
            onRenderPage={() => <></>}
            onStepSelected={() => {}}
        />
    </>    
}

export default Edit;