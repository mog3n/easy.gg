import { NextPage } from "next";
import { CenteredDiv } from "../components/ui/Body";
import { FaFileUpload, FaSearch, FaUpload } from 'react-icons/fa';
import styled from "styled-components";
import { Header } from "../components/ui/Header";
import { useRouter } from "next/router";

const SelectSource: NextPage = () => {
    const router = useRouter();

    return <>
        <Header />
        <CenteredDiv>
            <OptionsContainer>
                <Option onClick={() => router.push('/upload')}>
                    <FaUpload size={88} />
                    <OptionLabel>
                        Upload a clip
                    </OptionLabel>
                </Option>

                <Option onClick={() => router.push('/import')}>
                    <FaSearch size={68} />
                    <OptionLabel>
                        Search Twitch
                    </OptionLabel>
                </Option>
            </OptionsContainer>

        </CenteredDiv>
    </>
}

const OptionsContainer = styled.div`
    display: flex;
`

const Option = styled.div`
    width: 400px;
    height: 600px;
    background-color: #262626;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;

    margin: 20px;
`

const OptionLabel = styled.div`
    position: absolute;
    margin-top: 450px;
    font-size: 24px;
    font-weight: 500;
`

export default SelectSource;