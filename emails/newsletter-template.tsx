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
    visit: lang === 'UA' ? 'ДО МАГАЗИНУ' : 'SHOP NOW',
  };

  return (
    <Html>
      <Head />
      <Body style={{ 
        fontFamily: 'monospace', 
        backgroundColor: '#f5f5f5', 
        padding: '20px',
        color: '#000000'
      }}>
        <Container style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          backgroundColor: '#ffffff',
          border: '2px solid #000', 
          padding: '30px' 
        }}>
          {/* Верхняя часть: Логотип и Дата */}
          <Section style={{ marginBottom: '30px' }}>
            <Row>
              <Column align="left">
                <Img 
                  src="stirol.xyz/newslogo.png" 
                  alt="Stirol" 
                  width="80" 
                  style={{ display: 'block', border: 'none' }} 
                />
              </Column>
              <Column align="right">
                <Text style={{ margin: 0, fontSize: '11px', letterSpacing: '0.05em', color: '#666' }}>{date}</Text>
              </Column>
            </Row>
          </Section>

          {/* Заголовок */}
          <Text style={{ 
            fontSize: '15px', 
            fontWeight: 'bold', 
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            borderBottom: '2px solid #000',
            paddingBottom: '14px'
          }}>
            {headerText}
          </Text>

          {/* Картинка-ссылка */}
          <Link href={linkUrl} style={{ display: 'block', marginBottom: '24px' }}>
            <Img 
              src={imageUrl} 
              width="100%" 
              alt="Drop Image" 
              style={{ display: 'block', border: '1px solid #000' }}
            />
          </Link>

          {/* Описание */}
          <Text style={{ 
            fontSize: '13px', 
            lineHeight: '1.7', 
            color: '#333', 
            marginBottom: '28px' 
          }}>
            {description}
          </Text>

          {/* CTA — чёрная кнопка вместо красной ссылки, тот же стиль, что в остальных письмах */}
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '10px' }}>
            <tr>
              <td align="center">
                <Link
                  href={linkUrl}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '14px 36px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  {t.visit}
                </Link>
              </td>
            </tr>
          </table>

          {/* Футер */}
          <Text style={{
            textAlign: 'center',
            fontSize: '9px',
            letterSpacing: '0.1em',
            color: '#999',
            marginTop: '24px',
            borderTop: '1px solid #eee',
            paddingTop: '16px'
          }}>
            © {new Date().getFullYear()} STIROL
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterTemplate;