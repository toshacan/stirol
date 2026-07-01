import { VIDEOS } from '@/app/data/videos';
import { notFound } from 'next/navigation';
import VideoClient from './VideoClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// Серверная генерация идеального тайтла без кавычек и префиксов
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = VIDEOS.find((v) => v.id === id);

  if (!video) return { title: 'NOT FOUND' };

  const cleanTitle = video.title.replace(/"/g, '').replace('[ ', '').replace(' ]', '');

  return {
    title: `${cleanTitle.toUpperCase()} - STIROL`,
  };
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  
  const video = VIDEOS.find((v) => v.id === id);
  
  // Если видео не найдено или это анонс (Coming Soon), отдаем 404
  if (!video || video.isComingSoon) return notFound();

  return <VideoClient video={video} />;
}