import { RecaptchaVerifier } from "firebase/auth"

declare global {
    interface Window {
        recaptcha: RecaptchaVerifier
    }
}