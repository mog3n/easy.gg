import { useRecoilState, useRecoilValue } from "recoil";
import { signInModalVisibleState } from "../../state/atoms/ui";
import { Modal, SIZE } from 'baseui/modal';
import { SignIn } from "./SignIn";

export const GlobalUI = () => {
    const [signInModalVisible, setSignInModalVisible] = useRecoilState(signInModalVisibleState);
    return <>
        <Modal
            closeable
            isOpen={signInModalVisible}
            animate
            autoFocus
            onClose={() => setSignInModalVisible(false)}
        >
            <SignIn />
        </Modal>
    </>
}