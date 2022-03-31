import type { NextPage } from 'next'
import Edit from '../components/pages/Edit/Edit';
import { Header } from '../components/ui/Header';

export const PROCESSING_VIDEO_STEP = 0;

const EditPage: NextPage = () => {
  return <>
    <Header pageActive="Editor" />
    <Edit />
  </>
}

export default EditPage