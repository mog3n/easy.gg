import { FileUploader } from "baseui/file-uploader";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { CenteredDiv } from "../components/ui/Body";
import { Header } from "../components/ui/Header";
import { selectedTemplateState } from "../state/atoms/ui";

const Upload: NextPage = () => {
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useRecoilState(selectedTemplateState);
    return <>
        <Header pageActive="Create" />
        <CenteredDiv>
            <FileUploader
                onDrop={async (acceptedFiles) => {
                    const file = acceptedFiles[0];
                    const url = URL.createObjectURL(file);

                    if (router.query.useTemplate) {
                        router.push({
                            pathname: selectedTemplate.redirect,
                            query: {
                                clip: url
                            },
                        });
                    } else {
                        router.push({
                            pathname: '/create',
                            query: {
                                clip: url
                            }
                        })
                    }
                }}
            />
        </CenteredDiv>
    </>
}

export default Upload;