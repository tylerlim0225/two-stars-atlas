// Aspirational destinations shown on the main hero — parallax photo gallery.
// All images are Unsplash hotlinks (free, no API key, allowed under Unsplash
// license for editorial/personal use). Swap by changing the `image` URL.

export interface Destination {
  id: string;
  name: string;
  nameKo: string;
  region: string;
  tagline: string;
  taglineKo: string;
  image: string;
  // soft accent color for the destination's label / decorative elements
  accent: string;
  // 1-line spec / aspirational note
  spec: string;
}

// Helper to build Unsplash URL with sizing
const u = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const destinations: Destination[] = [
  {
    id: 'paris',
    name: 'Paris',
    nameKo: '파리',
    region: 'Île-de-France · France',
    tagline: 'A city written in lights.',
    taglineKo: '빛으로 쓰인 도시.',
    image: u('photo-1502602898657-3e91760cbb34'),
    accent: '#E8D5A0',
    spec: '한 번쯤은 함께, 늦여름의 밤거리를.',
  },
  {
    id: 'swiss',
    name: 'Swiss Alps',
    nameKo: '스위스 알프스',
    region: 'Valais · Switzerland',
    tagline: 'Where silence has a shape.',
    taglineKo: '침묵이 형상을 갖는 자리.',
    image: u('photo-1530122037265-a5f1f91d3b99'),
    accent: '#B6CFE3',
    spec: '눈 덮인 능선을 따라, 천천히.',
  },
  {
    id: 'maldives',
    name: 'Maldives',
    nameKo: '몰디브',
    region: 'Indian Ocean',
    tagline: 'A horizon dissolved into two blues.',
    taglineKo: '두 가지 푸름으로 녹아내린 수평선.',
    image: u('photo-1514282401047-d79a71a590e8'),
    accent: '#7FCBD5',
    spec: '바닥이 보이는 바다, 위에 작은 집 하나.',
  },
  {
    id: 'rockies',
    name: 'Canadian Rockies',
    nameKo: '캐나디안 로키',
    region: 'Banff · Alberta',
    tagline: 'Old stones, fresh weather.',
    taglineKo: '오래된 돌과 새로 부는 바람.',
    image: u('photo-1561731216-c3a4d99437d5'),
    accent: '#9FB89A',
    spec: '루이스 호수 새벽의 첫 빛.',
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    nameKo: '교토',
    region: '京都 · Japan',
    tagline: 'A season, slowed down to look at.',
    taglineKo: '천천히 바라보는 한 계절.',
    image: u('photo-1493976040374-85c8e12f0c0e'),
    accent: '#E9B4A4',
    spec: '늦가을, 사원과 사이의 좁은 골목.',
  },
  {
    id: 'iceland',
    name: 'Iceland',
    nameKo: '아이슬란드',
    region: 'Suðurland',
    tagline: 'A planet rehearsing other planets.',
    taglineKo: '다른 행성을 연습 중인 행성.',
    image: u('photo-1531366936337-7c912a4589a7'),
    accent: '#B8C8D8',
    spec: '오로라 아래, 따뜻한 차 한 잔.',
  },
];
