import { useState } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { StepsContainer, Container, ContainerLeft, ContainerRight, SingleStepContainer, SingleStepContainerDeselected, StepActiveIndicator, StepNumberLabel, StepLabel, StepInactiveIndicator } from '../../pages/facecam';

export interface EditorStep {
    label: string;
    key: string;
}
export type Steps = { [key:string]: EditorStep }

interface StepsUIProps {
    steps: { [key: string]: EditorStep },
    stepsDisabled: boolean
    onStepSelected: (step: EditorStep) => null;
    onRenderPage: (selectedEditorStep: EditorStep) => JSX.Element;
}


export const StepsUI = (props: StepsUIProps) => {
    const [selectedEditorStep, setSelectedEditorStep] = useState<EditorStep>({ label: '', key: 'start' });

    const renderEditorSteps = () => {
        const onStepSelected = (step: EditorStep) => {
            // Disable changing steps while rendering
            if (!props.stepsDisabled) {
                setSelectedEditorStep(step);
            }
            props.onStepSelected(step);
        }

        return <>
            <StepsContainer>
                {Object.keys(props.steps).map((editorStepKey: string, index: number) => {
                    const step = props.steps[editorStepKey];

                    const isPreviousStep = Object.keys(props.steps).findIndex(searchStep => searchStep === selectedEditorStep.key) > index;

                    if (selectedEditorStep.key === step.key) {
                        return <>
                            <SingleStepContainer style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StepActiveIndicator></StepActiveIndicator>
                                    <div>
                                        <StepNumberLabel>Step {index + 1}</StepNumberLabel>
                                        <StepLabel>{step.label}</StepLabel>
                                    </div>
                                </div>

                                <FaArrowRight size={18} color="#fff" style={{ marginRight: 10 }} />
                            </SingleStepContainer>
                        </>
                    } else if (isPreviousStep) {
                        // render checkmarks
                        return <>
                            <SingleStepContainerDeselected onClick={() => onStepSelected(step)} style={{ justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <StepInactiveIndicator />
                                    <div>
                                        <StepNumberLabel>Step {index + 1}</StepNumberLabel>
                                        <StepLabel>{step.label}</StepLabel>
                                    </div>
                                </div>
                                <FaCheck size={18} color="#fff" style={{ marginRight: 15 }} />
                            </SingleStepContainerDeselected>
                        </>
                    } else {
                        return <>
                            <SingleStepContainerDeselected onClick={() => onStepSelected(step)} style={{}}>
                                <StepInactiveIndicator></StepInactiveIndicator>
                                <div>
                                    <StepNumberLabel>Step {index + 1}</StepNumberLabel>
                                    <StepLabel>{step.label}</StepLabel>
                                </div>
                            </SingleStepContainerDeselected>
                        </>
                    }
                })}
            </StepsContainer>
        </>
    }

    return <>
        <Container>
            <ContainerLeft>
                {renderEditorSteps()}
            </ContainerLeft>
            <ContainerRight>
                <div>
                    {props.onRenderPage(selectedEditorStep)}
                </div>
            </ContainerRight>
        </Container>
    </>
}