import VideosClient from './VideoClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIDEOS',
};

export default function VideosPage() {
  return <VideosClient />;
}