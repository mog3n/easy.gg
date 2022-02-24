import axios from "axios";
import { useMutation } from "react-query";

interface GetTwitchClipMutationRequest {
    videoUrl: string;
}
export const useGetTwitchClip = () =>
    useMutation((request: GetTwitchClipMutationRequest) => {
        return axios.get(`/api/twitch/proxy`, { responseType: 'blob', params: { url: request.videoUrl} });
    });