interface NewsPage {
  image: string;
  text: {
    EN: string;
    UA: string;
  };
}

export interface MagazinePost {
  id: string;
  tag: string;
  title: {
    EN: string;
    UA: string;
  };
  date: string; 
  pages: NewsPage[];
}

export const MAGAZINE_POSTS: MagazinePost[] = [
  {
    id: 'chronicle-01',
    tag: 'REBOOT',
    title: {
      EN: 'STIROL: CHAPTER II / THE REBOOT',
      UA: 'STIROL: ГЛАВА II / ПЕРЕЗАПУСК'
    },
    date: '24/06/2026',
    pages: [
      {
        image: '/news/run.png',
        text: {
          EN: 'We are fully shifting our focus back to STIROL. This website is a basic setup for everything we want to release next. From our roots in the industrial landscapes of Horlivka to this new system, we are just quietly doing what we love. More attention to product quality, custom cuts, and bright contrast graphics. The framework is ready, and Drop 1 is loading. Stay tuned.',
          UA: 'Ми повністю повертаємо фокус на STIROL. Цей сайт — базова інфраструктура для всього, що ми хочемо релізити далі. Від нашого коріння в індустріальній Горлівці до цієї нової системи, ми просто спокійно робимо те, що любимо. Більше уваги до якості речей, правильного крою та яскравої контрастної графіки. Система готова, первый дроп уже завантажується. На звʼязку.'
        }
      }
    ]
  },

];