import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { handleAPIError, requireGetParam, requirePostParam } from "../../../helpers/api/helpers";
import { getStorage } from 'firebase-admin/storage';
import { initializeFirebase } from "../../../components/server/firebaseAdmin";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    initializeFirebase();
    const bucket = getStorage().bucket();
    try {
        const videoUrl = requireGetParam('url', 'No data requested', req, res);
        if (videoUrl.includes("twitch")) {
            // download file
            const url = new URL(videoUrl)
            const filename = url.pathname.replace("/", "");
            axios.get(videoUrl, { responseType: 'blob' }).then(data => {
                bucket.file(`clips/${filename}`).save(data.data).then(response => {
                    const fileUrl = bucket.file(`clips/${filename}`).publicUrl();
                    res.status(200).send({ fileUrl });
                }).catch(err => {
                    console.error("Could not save clip into bucket");
                    handleAPIError(err, 'Something went wrong...', res);
                })
            });
            // request(videoUrl).pipe(res);
        } else {
            handleAPIError(null, 'Invalid request', res);
        }
    } catch (err) {
        handleAPIError(err, 'Something went wrong', res);
    }
}