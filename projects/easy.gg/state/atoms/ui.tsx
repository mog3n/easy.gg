import { atom } from "recoil";
import { MakeTemplate } from "../../types/ui";

export const signInModalVisibleState = atom({
    default: false,
    key: 'signInModalVisibleState'
})

export const selectedTemplateState = atom<MakeTemplate>({
    default: {name: '', description: '', preview_img: '', preview_mp4: '', redirect: ''},
    key: 'selectedTemplate'
})