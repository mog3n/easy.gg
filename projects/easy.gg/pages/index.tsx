import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { FileUploader } from 'baseui/file-uploader';
import { Button } from 'baseui/button';
import { Input } from 'baseui/input';

import ffmpeg from '../components/ffmpeg';
import { fetchFile } from '@ffmpeg/ffmpeg';

const Home: NextPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [videoFile, setVideoFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();

  const [interestingAudioPoint, setInterestingAudioPoint] = useState<string>('');

  const [result, setResult] = useState<string>('');

  const checkFfmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
  }

  useEffect(() => {
    checkFfmpeg();
  }, [])

  const generateVideo = async () => {
    await checkFfmpeg();

    await ffmpeg.run(
      '-i', 'video',
      '-ss', '00:00:00',
      '-t', '8',
      '-r', '30',
      'tmp1.mp4'
    );

    await ffmpeg.run(
      '-i', 'tmp1.mp4',
      '-i', 'audio',
      '-filter_complex', '[1:a]apad[A],[0:a][A]amerge[out]',
      '-map', '0:v',
      '-map', '[out]',
      '-c:v', 'copy',
      '-c:a', 'aac',
      'output.mp4'
    );

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(new Blob([data.buffer]));
    setResult(url);
  }

  const displayVideo = () => {
    if (videoFile) {
      return <video controls width={500} src={URL.createObjectURL(videoFile)} />
    }
  }

  const loadFile = async (file: File) => {
    await checkFfmpeg();

    if (file.name.includes('mp3')) {
      setAudioFile(file);
      ffmpeg.FS('writeFile', 'audio', await fetchFile(file));
    } else {
      setVideoFile(file);
      ffmpeg.FS('writeFile', 'video', await fetchFile(file));
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>easy.gg Editor</title>
        <meta name="description" content="An editor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <FileUploader
          onDrop={(acceptedFiles) => {
            for (const file of acceptedFiles) {
              loadFile(file);
            }
          }}
        />
      </div>

      {displayVideo()}

      { audioFile ? <>
        <Input placeholder='Interesting point in audio' value={interestingAudioPoint} onChange={(evt) => {
          const target = evt.target as HTMLInputElement;
          setInterestingAudioPoint(target.value)
        }} />
      </> : <></>}

      {audioFile && videoFile ? <>
        <div>
          <Button onClick={generateVideo}>Generate Video</Button>
        </div>
      </> : <></>}
      
      {result ? <>
        <video style={{width: 300}} controls src={result} />
      </> : <></>}

    </div>
  )
}

export default Home