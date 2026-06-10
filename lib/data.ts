// ─────────────────────────────────────────────────────────────
// Two Stars Atlas — local data only.
// All "secret" content is bundled in client JS by design.
// ─────────────────────────────────────────────────────────────

export type TripStatus = 'planned' | 'in-progress' | 'completed';
export type StarPalette = 'gold' | 'teal' | 'rose' | 'amber' | 'ivory' | 'ember';

export interface Memory {
  id: string;
  name: string;            // e.g., '함덕 해변'
  nameEn?: string;
  region: string;
  date: string;            // YYYY-MM-DD
  tripId: string;          // which constellation
  star: {
    palette: StarPalette;
    size?: number;         // relative; default 1
  };
  quote?: string;
  emotion: string[];
  memories: string[];
  photoColor?: string;     // tailwind gradient e.g. 'from-teal-200 to-cyan-400'
  favorite?: boolean;
  status?: TripStatus;
  isSecret?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  nameKo?: string;
  date: string;            // canonical (start) date
  endDate?: string;
  status: TripStatus;
  lineColor: string;       // hex for the constellation line
  emotionTheme: string;    // one-line theme
  // optional ordering: explicit memoryIds list orders the constellation lines
  memoryOrder?: string[];
}

export const atlas = {
  title: 'Two Stars Atlas',
  titleKo: '우리만의 밤하늘',
  tagline: '모든 기억은 별이 되었다.',
  taglineEn: 'A constellation made of us.',
  authors: ['태윤', '지은'],
  period: { from: '2025', to: '∞' },
};

// Star palette → hex
export const PALETTE: Record<StarPalette, string> = {
  gold:  '#F4D58D',
  teal:  '#7FB3D5',
  rose:  '#E8B4B8',
  amber: '#D4B26A',
  ivory: '#F4EEE3',
  ember: '#C44A3F',
};

// ── Trips (constellations) ──────────────────────────────────
export const trips: Trip[] = [
  {
    id: 'jeju-2025',
    name: 'Jeju, late summer',
    nameKo: '제주의 9월',
    date: '2025-09-04',
    endDate: '2025-09-07',
    status: 'completed',
    lineColor: '#7FB3D5',
    emotionTheme: '여름 끝자락의 빛',
  },
  {
    id: 'busan-2026',
    name: 'Busan weekend',
    nameKo: '부산 주말',
    date: '2026-03-08',
    endDate: '2026-03-09',
    status: 'completed',
    lineColor: '#9B7CD8',
    emotionTheme: '야경의 다리',
  },
  {
    id: 'gyeongju-2026',
    name: 'Gyeongju spring',
    nameKo: '경주의 봄',
    date: '2026-04-12',
    endDate: '2026-04-13',
    status: 'completed',
    lineColor: '#E8B4B8',
    emotionTheme: '꽃비가 내리던 날',
  },
  {
    id: 'gangneung-2026',
    name: 'Gangneung coast',
    nameKo: '강릉 바다',
    date: '2026-05-04',
    endDate: '2026-05-05',
    status: 'completed',
    lineColor: '#8EC8E8',
    emotionTheme: '오월의 바람',
  },
  {
    id: 'seoul-river',
    name: 'Han River walks',
    nameKo: '한강의 저녁',
    date: '2026-05-18',
    status: 'completed',
    lineColor: '#F4D58D',
    emotionTheme: '도시의 노을',
  },
  {
    id: 'alov-2026',
    name: 'ALOV Yangju villa',
    nameKo: '양주의 빌라',
    date: '2026-07-15',
    endDate: '2026-07-16',
    status: 'planned',
    lineColor: '#D4B26A',
    emotionTheme: '다음 챕터',
  },
];

// ── Memories (stars) ────────────────────────────────────────
export const memories: Memory[] = [
  // Jeju
  {
    id: 'hamdeok',
    name: '함덕 해변',
    nameEn: 'Hamdeok Beach',
    region: '제주 조천읍',
    date: '2025-09-04',
    tripId: 'jeju-2025',
    star: { palette: 'teal', size: 1.4 },
    quote: '바닷빛은 매번 다르고, 매번 같다.',
    emotion: ['청량함', '느림', '햇살'],
    memories: ['발끝까지 차오른 모래의 온도.', '갈매기 그림자가 모자를 스쳐갔다.'],
    photoColor: 'from-teal-200 to-cyan-400',
    favorite: true,
    status: 'completed',
  },
  {
    id: 'jeju-cafe',
    name: '카페 그초',
    region: '제주 조천읍',
    date: '2025-09-05',
    tripId: 'jeju-2025',
    star: { palette: 'ivory' },
    quote: '바람이 들어오는 창가가 가장 좋은 자리였다.',
    emotion: ['여유', '바다'],
    memories: ['손에 묻은 모래를 털고 라떼를 천천히 마셨다.'],
    photoColor: 'from-amber-100 to-cyan-200',
    status: 'completed',
  },
  {
    id: 'jeju-airport',
    name: '돌아오는 비행기',
    region: '제주공항',
    date: '2025-09-07',
    tripId: 'jeju-2025',
    star: { palette: 'gold', size: 0.7 },
    quote: '돌아가는 길이 가장 길었다.',
    emotion: ['아쉬움'],
    memories: ['창밖으로 한라산이 멀어졌다.'],
    photoColor: 'from-stone-200 to-amber-200',
    status: 'completed',
  },
  // Busan
  {
    id: 'gwangalli',
    name: '광안리 해변',
    region: '부산 수영구',
    date: '2026-03-08',
    tripId: 'busan-2026',
    star: { palette: 'amber', size: 1.3 },
    quote: '도시의 끝에서 바다가 시작될 때.',
    emotion: ['반짝임', '밤'],
    memories: ['광안대교 불빛이 파도 위에서 흔들렸다.'],
    photoColor: 'from-indigo-400 to-purple-600',
    status: 'completed',
  },
  {
    id: 'gamcheon',
    name: '감천문화마을',
    region: '부산 사하구',
    date: '2026-03-09',
    tripId: 'busan-2026',
    star: { palette: 'rose' },
    quote: '비탈마다 다른 색을 가진 동네.',
    emotion: ['색', '오래된'],
    memories: ['좁은 골목에서 길을 잃었다가 다시 찾았다.'],
    photoColor: 'from-rose-200 to-amber-200',
    status: 'completed',
  },
  // Gyeongju
  {
    id: 'bomun',
    name: '보문호 벚꽃길',
    region: '경주 신평동',
    date: '2026-04-12',
    tripId: 'gyeongju-2026',
    star: { palette: 'rose', size: 1.5 },
    quote: '봄은 짧고 우리는 길게 걸었다.',
    emotion: ['두근거림', '봄', '꽃'],
    memories: ['벚꽃이 바람에 한꺼번에 쏟아졌다.'],
    photoColor: 'from-pink-200 to-rose-300',
    favorite: true,
    status: 'completed',
  },
  {
    id: 'hwangridanggil',
    name: '황리단길',
    region: '경주 황남동',
    date: '2026-04-13',
    tripId: 'gyeongju-2026',
    star: { palette: 'amber' },
    quote: '오래된 것은 가끔 가장 새롭게 보인다.',
    emotion: ['따스함'],
    memories: ['한옥 카페에서 마신 한 잔.'],
    photoColor: 'from-stone-200 to-amber-200',
    status: 'completed',
  },
  // Gangneung
  {
    id: 'gyeongpo',
    name: '경포 해변',
    region: '강릉 안현동',
    date: '2026-05-04',
    tripId: 'gangneung-2026',
    star: { palette: 'teal', size: 1.1 },
    quote: '바다는 조용해서 멀리까지 들렸다.',
    emotion: ['고요', '바람'],
    memories: ['긴 백사장을 한참 걸었다.'],
    photoColor: 'from-sky-200 to-blue-400',
    status: 'completed',
  },
  {
    id: 'anmok',
    name: '안목 커피거리',
    region: '강릉 견소동',
    date: '2026-05-05',
    tripId: 'gangneung-2026',
    star: { palette: 'gold' },
    quote: '바다를 끓여 만든 커피라는 농담.',
    emotion: ['여유'],
    memories: ['통창 너머 아침 바다.'],
    photoColor: 'from-amber-200 to-orange-300',
    status: 'completed',
  },
  // Seoul / Han River
  {
    id: 'hanriver',
    name: '잠수교 산책',
    region: '서울 서초',
    date: '2026-05-18',
    tripId: 'seoul-river',
    star: { palette: 'gold', size: 1.0 },
    quote: '도시도 가끔은 자연처럼 빛난다.',
    emotion: ['평온함'],
    memories: ['노을이 한강에 천천히 내려앉았다.'],
    photoColor: 'from-orange-200 to-pink-300',
    status: 'completed',
  },
  // ALOV (planned)
  {
    id: 'alov-yangju',
    name: 'ALOV 양주',
    region: '경기 양주 회암동',
    date: '2026-07-15',
    tripId: 'alov-2026',
    star: { palette: 'amber', size: 1.2 },
    quote: '아직 가지 않은 곳을 함께 그려본다.',
    emotion: ['설렘', '기대'],
    memories: ['빌라 독채에서 늦은 아침을 천천히.'],
    photoColor: 'from-amber-100 to-stone-300',
    status: 'planned',
  },
];

export function getMemory(id: string) {
  return memories.find(m => m.id === id) ?? null;
}
export function getTrip(id: string) {
  return trips.find(t => t.id === id) ?? null;
}
export function memoriesOfTrip(tripId: string) {
  return memories
    .filter(m => m.tripId === tripId)
    .sort((a, b) => a.date.localeCompare(b.date));
}
