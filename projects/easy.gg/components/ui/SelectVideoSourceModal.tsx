import { Modal, ModalBody, ModalHeader } from "baseui/modal";
import { useRouter } from "next/router"
import { FaSearch, FaUpload } from "react-icons/fa"
import styled from "styled-components";
import { MakeTemplate } from "../../types/ui";
import { CenteredDiv } from "./Body"

interface ModalProps {
    isOpen: boolean;
    onCloseModal: () => void;
}

export const SelectVideoSourceModal = (props: ModalProps) => {
    const router = useRouter();

    return <Modal
        closeable
        isOpen={props.isOpen}
        onClose={props.onCloseModal}
        animate
        autoFocus
    >
        <ModalHeader>Choose a clip</ModalHeader>
        <ModalBody>
            <OptionsContainer>
                <Option onClick={() => router.push({
                    pathname: '/upload',
                    query: {
                        useTemplate: true
                    }
                })}>
                    <FaUpload size={88} />
                    <OptionLabel>
                        Upload clip
                    </OptionLabel>
                </Option>

                <Option onClick={() => router.push({
                    pathname: '/import',
                    query: {
                        useTemplate: true
                    }
                })}>
                    <FaSearch size={68} />
                    <OptionLabel>
                        Search Twitch
                    </OptionLabel>
                </Option>
            </OptionsContainer>
        </ModalBody>

    </Modal>
}


const OptionsContainer = styled.div`
    display: flex;
`

const Option = styled.div`
    width: 100%;
    height: 300px;
    background-color: #262626;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;

    border: 2px solid rgba(0,0,0,0);
    transition: 0.05s ease-in;
    &:hover {
        border: 2px solid #fff;
    }
    color: #fff;

    &+ &{
        margin-left: 20px;
    }
`

const OptionLabel = styled.div`
    position: absolute;
    margin-top: 220px;
    font-size: 18px;
    font-weight: 500;
`