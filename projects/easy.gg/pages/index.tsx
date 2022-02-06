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

  const [file, setFile] = useState<File>();
  const [audioFile, setAudioFile] = useState<File>();

  const [interestingAudioPoint, setInterestingAudioPoint] = useState<string>('');

  const checkFfmpeg = async () => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
  }

  useEffect(() => {
    checkFfmpeg();
  }, [])

  const generateVideo = () => {
    checkFfmpeg();
    ffmpeg.run('-i', 'video', '-f', 'output.mp4');
  }

  const displayVideo = () => {
    if (file) {
      return <video controls width={500} src={URL.createObjectURL(file)} />
    }
  }

  const loadFile = async (file: File) => {
    await checkFfmpeg();

    if (file.name.includes('mp3')) {
      setAudioFile(file);
      ffmpeg.FS('writeFile', 'sound', await fetchFile(file));
    } else {
      setFile(file);
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
        <Input value={interestingAudioPoint} onChange={(evt) => {
          const target = evt.target as HTMLInputElement;
          setInterestingAudioPoint(target.value)
        }} />
      </> : <></>}

      {audioFile && file ? <>
        <div>
          <Button onClick={generateVideo}>Generate Video</Button>
        </div>
      </> : <></>}

    </div>
  )
}

export default Home