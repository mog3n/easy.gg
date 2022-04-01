import { useState } from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { StepsContainer, Container, ContainerLeft, ContainerRight, SingleStepContainer, SingleStepContainerDeselected, StepActiveIndicator, StepNumberLabel, StepLabel, StepInactiveIndicator } from '../../pages/facecam';

export interface EditorStep {
    label: string;
    key: string;
}
export type Steps = { [key:string]: EditorStep }

interface StepsUIProps {
    steps: EditorStep[],
    stepsDisabled?: boolean
    onStepSelected: (step: EditorStep) => unknown;
    onRenderPage: (selectedEditorStep: EditorStep) => JSX.Element;
}


export const StepsUI = (props: StepsUIProps) => {
    const [selectedEditorStep, setSelectedEditorStep] = useState<EditorStep>(props.steps[0]);

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
                {props.steps.map((step: EditorStep, index: number) => {
                    const isPreviousStep = Object.keys(props.steps).findIndex(searchStep => searchStep === selectedEditorStep.key) > index;
                    if (selectedEditorStep.key === step.key) {
                        return <>
                            <SingleStepContainer key={step.key} style={{ justifyContent: 'space-between' }}>
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
                            <SingleStepContainerDeselected key={step.key} onClick={() => onStepSelected(step)} style={{ justifyContent: 'space-between' }}>
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
                            <SingleStepContainerDeselected key={step.key} onClick={() => onStepSelected(step)} style={{}}>
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