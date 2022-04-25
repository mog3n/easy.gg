import { Button } from 'baseui/button';
import { Grid } from 'baseui/layout-grid';
import { toaster } from 'baseui/toast';
import { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import styled from 'styled-components';
import { StepsContainer, Container, ContainerLeft, ContainerRight, SingleStepContainer, SingleStepContainerDeselected, StepActiveIndicator, StepNumberLabel, StepLabel, StepInactiveIndicator } from '../../pages/facecam';

export interface EditorStep {
    label: string;
    key: string;
    isNextStepConditionSatisfied: () => boolean;
}
export type Steps = { [key: string]: EditorStep }

interface StepsUIProps {
    steps: EditorStep[],
    stepsDisabled?: boolean
    onStepSelected: (step: EditorStep) => unknown;
    onRenderPage: (selectedEditorStep: EditorStep) => JSX.Element;
}


export const StepsUI = (props: StepsUIProps) => {
    const [selectedEditorStep, setSelectedEditorStep] = useState<EditorStep>(props.steps[0]);
    const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

    const onStepSelected = (step: EditorStep, index: number) => {
        // Disable changing steps while rendering
        if (!props.stepsDisabled) {
            setSelectedEditorStep(step);
            setSelectedStepIndex(index);
            props.onStepSelected(step);
        } else {
            toaster.info(<>You cannot change steps during this time.</>, {
                autoHideDuration: 3000,
            })
        }
    }

    const renderEditorSteps = () => {

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
                            <SingleStepContainerDeselected key={step.key} onClick={() => {
                                // onStepSelected(step, index)
                            }} style={{ justifyContent: 'space-between' }}>
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
                            <SingleStepContainerDeselected key={step.key} onClick={() => {
                                // onStepSelected(step, index)
                            }} style={{}}>
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

    const hasNextStep = props.steps.length !== (selectedStepIndex + 1);
    const hasPreviousStep = selectedStepIndex !== 0;

    const nextStepAllowed = hasNextStep && props.steps[selectedStepIndex].isNextStepConditionSatisfied();

    return <>
        <Container>
            <ContainerLeft>
                {renderEditorSteps()}
            </ContainerLeft>
            <ContainerRight>

                {props.onRenderPage(selectedEditorStep)}

                <PrevNextButtonContainer>
                    <Button kind="primary" onClick={() => {
                        if (hasPreviousStep) {
                            onStepSelected(props.steps[selectedStepIndex - 1], selectedStepIndex - 1);
                        }
                    }}
                        disabled={!hasPreviousStep || props.stepsDisabled}
                        startEnhancer={() => <FaArrowLeft />}
                    >{hasPreviousStep ? props.steps[selectedStepIndex - 1].label : "Back"}</Button>
                    <StepName>{selectedEditorStep.label}</StepName>
                    <Button kind="primary" onClick={() => {
                        if (hasNextStep) {
                            onStepSelected(props.steps[selectedStepIndex + 1], selectedStepIndex + 1);
                        }
                    }}
                        endEnhancer={() => <FaArrowRight />}
                        disabled={!hasNextStep || !nextStepAllowed || props.stepsDisabled}
                    >{hasNextStep ? props.steps[selectedStepIndex + 1].label : "Next Step"}</Button>
                </PrevNextButtonContainer>
            </ContainerRight>
        </Container>
    </>
}

export const StepName = styled.div`
    font-family: Kanit;
    font-size: 22px;
`

export const PrevNextButtonContainer = styled.div`
    position: sticky;
    width: 100%;
    align-items: center;
    bottom: 0;
    padding: 20px;
    background-color: #212121;
    display: flex;
    min-width: 420px;
    cursor: default;
    justify-content: space-between;
`