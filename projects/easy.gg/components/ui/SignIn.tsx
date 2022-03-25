import { NextPage } from "next";
import { CenteredDiv, CenteredHorizontally } from "./Body";
import { ExportButton, ExportButtonIcon, H1 } from "../../pages/export";
import { MdSmartphone } from 'react-icons/md';
import { ConfirmationResult, getAuth, getRedirectResult, GoogleAuthProvider, RecaptchaVerifier, sendSignInLinkToEmail, signInWithPhoneNumber, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useEffect, useState } from "react";
import { isClient } from "../../helpers/helpers";
import { Button } from "baseui/button";
import { PinCode } from 'baseui/pin-code';
import { Input } from "baseui/input";
import { COUNTRIES, PhoneInput } from "baseui/phone-input";
import { toaster } from "baseui/toast";
import { useRouter } from "next/router";
import { app } from "../../pages/_app";
import { useAuth } from "../hooks/useAuth";
import { ModalBody, ModalButton, ModalFooter, ModalHeader } from "baseui/modal";
import { useSetRecoilState } from "recoil";
import { signInModalVisibleState } from "../../state/atoms/ui";

export const SignIn = () => {
    const setSignInModalVisible = useSetRecoilState(signInModalVisibleState);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState(COUNTRIES.CA);

    const [isSendingVerificationCode, setIsSendingVerificationCode] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>();
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);

    const signIn = () => {
        const auth = getAuth(app);
        const pnWithCountryCode = `${country.dialCode}${phoneNumber}`;
        setIsSendingVerificationCode(true);
        signInWithPhoneNumber(auth, pnWithCountryCode, window.recaptcha)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                toaster.info(<>A verification code was sent.</>, { autoHideDuration: 3000 })
                setIsVerifying(true);
                setConfirmationResult(confirmationResult);
                setIsSendingVerificationCode(false);
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                console.error(error);
                toaster.negative(<>{error.code}</>, { autoHideDuration: 5000 })
                setIsSendingVerificationCode(false);
            });
    }

    const verifyCode = (values: string[]) => {
        const code = values.join("");
        confirmationResult?.confirm(code)
            .then(result => {
                toaster.positive(<>Welcome back!</>, { autoHideDuration: 6000 });
                setSignInModalVisible(false);
            })
            .catch(err => {
                toaster.negative(<>Invalid verification code</>, { autoHideDuration: 5000 })
                setVerificationCode(["", "", "", "", "", ""])
                console.error(err);
            })
    }

    // Show a different UI when user is being verified
    if (isVerifying) {
        return <>
            <CenteredHorizontally>
                <ModalHeader>Enter verification code</ModalHeader>
                <ModalBody>
                    <PinCode autoFocus values={verificationCode} onChange={({ values }) => {
                        setVerificationCode(values)
                        if (values.join("").length === 6) {
                            verifyCode(values);
                        }
                    }} />
                    <div style={{ height: 30 }}></div>
                    <Button onClick={() => setIsVerifying(false)}
                        overrides={{
                            Root: {
                                style: {
                                    width: '100%',
                                }
                            }
                        }}
                        kind="minimal"
                    >Back</Button>
                    <Button onClick={signIn}
                        kind="minimal"
                        isLoading={isSendingVerificationCode}
                        overrides={{
                            Root: {
                                style: {
                                    width: '100%',
                                }
                            }
                        }}>Resend</Button>
                </ModalBody>

                <ModalFooter></ModalFooter>
            </CenteredHorizontally>
        </>
    }

    return <>
        <CenteredHorizontally>
            <img src="/logo.svg" style={{width: 90, marginTop: 50}}/>
            <ModalHeader>Login or Sign Up</ModalHeader>
            <ModalBody>{`A verification code will be sent to your device`}</ModalBody>
            <ModalBody>
                <PhoneInput
                    autoFocus
                    country={country}
                    onCountryChange={({ option }) => {
                        if (option) {
                            setCountry(option);
                        }
                    }}
                    text={phoneNumber}
                    onTextChange={(evt) => setPhoneNumber(evt.currentTarget.value)} />
                <Button onClick={signIn}
                    isLoading={isSendingVerificationCode}
                    overrides={{
                        Root: {
                            style: {
                                width: '100%',
                            }
                        }
                    }}
                >Continue</Button>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </CenteredHorizontally>
    </>
}