import { FileUploader } from "baseui/file-uploader";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CenteredDiv } from "../components/ui/Body";
import { Header } from "../components/ui/Header";

const Upload: NextPage = () => {
    const router = useRouter();
    return <>
        <Header pageActive="Create" />
        <CenteredDiv>
            <FileUploader
                onDrop={async (acceptedFiles) => {
                    const file = acceptedFiles[0];
                    const url = URL.createObjectURL(file);
                    router.push({
                        pathname: '/create',
                        query: {
                            clip: url
                        }
                    })
                }}
            />
        </CenteredDiv>
    </>
}

export default Upload;