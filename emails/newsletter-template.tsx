import { Html, Body, Head, Container, Img, Text, Link, Row, Column, Section } from '@react-email/components';
import * as React from 'react';

interface NewsletterProps {
  lang: 'EN' | 'UA';
  headerText: string;
  imageUrl: string;
  description: string;
  linkUrl: string;
}

export const NewsletterTemplate = ({ lang, headerText, imageUrl, description, linkUrl }: NewsletterProps) => {
  const date = new Date().toLocaleDateString('en-US');

  const t = {
    visit: lang === 'UA' ? 'Відвідати магазин' : 'Visit online shop',
  };

  return (
    <Html>
      <Head />
      <Body style={{ 
        fontFamily: 'monospace', 
        backgroundColor: '#ffffff', 
        padding: '20px',
        color: '#000000'
      }}>
        <Container style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          border: '1px solid #000', 
          padding: '20px' 
        }}>
          {/* Верхняя часть: Логотип (new.png) и Дата */}
          <Section style={{ marginBottom: '30px' }}>
            <Row>
              <Column align="left">
                {/* Замена красной плашки на изображение */}
                <Img 
                  src="stirol.xyz/newslogo.png" 
                  alt="Stirol" 
                  width="80" 
                  style={{ display: 'block', border: 'none' }} 
                />
              </Column>
              <Column align="right">
                <Text style={{ margin: 0, fontSize: '14px' }}>{date}</Text>
              </Column>
            </Row>
          </Section>

          {/* Заголовок */}
          <Text style={{ 
            fontSize: '16px', 
            fontWeight: 'normal', 
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px'
          }}>
            {headerText}
          </Text>

          {/* Картинка-ссылка */}
          <Link href={linkUrl} style={{ display: 'block', marginBottom: '20px' }}>
            <Img 
              src={imageUrl} 
              width="100%" 
              alt="Drop Image" 
              style={{ display: 'block', border: 'none' }}
            />
          </Link>

          {/* Описание */}
          <Text style={{ 
            fontSize: '14px', 
            lineHeight: '1.5', 
            color: '#333', 
            marginBottom: '20px' 
          }}>
            {description}
          </Text>
          
          {/* Футер-ссылка */}
          <Link 
            href={linkUrl} 
            style={{ 
              color: '#ff0000', 
              textDecoration: 'underline', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {t.visit}
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterTemplate;