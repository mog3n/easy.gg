import axios from "axios";
import { useMutation } from "react-query";
import { twitchClipProxy } from "../../helpers/helpers";

interface GetTwitchClipMutationRequest {
    videoUrl: string;
}
export const useGetTwitchClip = () =>
    useMutation((request: GetTwitchClipMutationRequest) => {
        return axios.get(`${request.videoUrl}`, { responseType: 'blob' });
    });