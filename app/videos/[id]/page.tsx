import { VIDEOS } from '@/app/data/videos';
import { notFound } from 'next/navigation';
import VideoClient from './VideoClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// Серверная генерация title + OG/Twitter превью для шеринга конкретного видео
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = VIDEOS.find((v) => v.id === id);

  if (!video) return { title: 'NOT FOUND' };

  const cleanTitle = video.title.replace(/"/g, '').replace('[ ', '').replace(' ]', '');
  const description = video.metaText?.EN  || 'STIROL video';
  const image = video.cover || '/logo-heavy.png';

  return {
    title: cleanTitle.toUpperCase(),
    description,
    openGraph: {
      title: cleanTitle.toUpperCase(),
      description,
      images: [{ url: image, width: 1200, height: 630, alt: cleanTitle }],
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle.toUpperCase(),
      description,
      images: [image],
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;

  const video = VIDEOS.find((v) => v.id === id);

  // Если видео не найдено или это анонс (Coming Soon), отдаем 404
  if (!video || video.isComingSoon) return notFound();

  return <VideoClient video={video} />;
}