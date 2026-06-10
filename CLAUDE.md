# Two Stars Atlas — AI Handoff

> 새 AI 세션은 이 파일을 먼저 읽어주세요. (Claude Code는 자동 로드)

---

## TL;DR
**태윤(`tylerlim0225`)과 지은의 별자리식 여행 추억 사이트.** Three.js 기반 시네마틱 메인 + 트립 플래너 PLAN 페이지의 듀얼 구조. **무료** 배포 절대 규칙.

- Live: (배포 후 채워질 예정 — `two-stars-atlas-*.vercel.app`)
- Repo: https://github.com/tylerlim0225/two-stars-atlas
- 자매 프로젝트 ([../our-journey](../our-journey)) — 이 사이트는 별자리·웅장 톤, 자매는 에디토리얼 톤. **둘은 독립적으로 운영**.

---

## 핵심 메타포

| 개념 | 시각화 |
|---|---|
| **하나의 추억** | 빛나는 별 (3D 공간 위치는 시간×감정×트립) |
| **한 번의 여행** | 별들을 잇는 별자리 라인 (트립별 컬러) |
| **계획중 여행** | 옅은 별 + 점선 라인 |
| **비밀 추억** | 진홍빛 깊은 곳 별 |

> "밤에는 우리 이야기가 별로 떠 있고, 낮에는 다음 별자리를 그린다."

---

## Tech Stack (locked-in)

| 영역 | 패키지 |
|---|---|
| 프레임워크 | Next.js 14 App Router + TypeScript strict |
| 3D | `three` 0.168 + `@react-three/fiber` 8 + `@react-three/drei` 9 + `@react-three/postprocessing` 2 |
| 스무스 스크롤 | `lenis` 1.x |
| DOM 모션 | `framer-motion` 11 |
| 아이콘 | `lucide-react` |
| 스타일 | Tailwind CSS 3.4 |
| 폰트 | Pretendard + Cinzel + Cormorant Garamond + Noto Serif KR (모두 CDN) |
| 데이터 | **로컬 TS only** — `lib/data.ts`. DB 없음. |

---

## 절대 어기지 말 것

1. **무료 호스팅 유지** — Vercel Hobby, 카드 등록 금지
2. **백엔드/DB/유료 API 금지** (Google Maps API 포함)
3. **Three.js는 client-only** — `dynamic({ ssr: false })`로 import, `app/page.tsx`에서 그렇게 처리됨
4. **모바일 폴백** — bloom/post-process는 모바일에서 비활성, 배경 별 350개로 감소
5. **prefers-reduced-motion 존중** — Lenis와 bloom 비활성

---

## 구조 (2-Act 구성)

```
two-stars-atlas/
├─ app/
│  ├─ layout.tsx                    # 폰트 + AtlasProvider + LenisProvider
│  ├─ globals.css                   # 다크 베이스
│  ├─ page.tsx                      # DestinationsHero → Bridge → ConstellationExperience + MemoryPortal
│  └─ plan/page.tsx                 # PLAN 허브 — Phase 4에서 본격 확장
├─ components/
│  ├─ LenisProvider.tsx             # 부드러운 스크롤만 담당 (progress publish 안 함)
│  │
│  │  ── ACT I: 시네마틱 3D 여행지 비행 ──
│  ├─ DestinationsHero.tsx          ★ OpeningTitle + 단일 sticky 3D 섹션 (Destinations3DSection)
│  │                                  + DestinationOverlay (DOM 텍스트, AnimatePresence 크로스페이드)
│  ├─ DestinationsScene3D.tsx       ★ NEW R3F Canvas — 6개 텍스처 카드를 곡선 경로에 배치,
│  │                                  카메라가 MotionValue 진행률 따라 그 사이를 비행.
│  │                                  Suspense per card, drei Stars 배경, bloom + vignette,
│  │                                  카드마다 frame/halo/reflection 3-레이어
│  ├─ BridgeSection.tsx             # "But our atlas is closer to home" 시적 전환
│  │
│  │  ── ACT II: 개인 별자리 ──
│  ├─ ConstellationExperience.tsx   ★ 자체 스크롤 섹션 (~400vh) + sticky inner wrap
│  │                                  useScroll(ref)로 자체 progress 계산 → AtlasContext에 publish
│  ├─ ConstellationCanvas.tsx       # R3F 캔버스 (별, 라인, 카메라 rig, bloom)
│  ├─ HeroOverlay.tsx               # 별자리 진입 시 타이틀 (absolute, 섹션 안)
│  ├─ ChapterIndex.tsx              # 좌측 챕터 표시 (absolute, 섹션 안)
│  ├─ HoverQuote.tsx                # 별 hover 인용구 (absolute, 섹션 안)
│  ├─ SiteFooter.tsx                # 끝에서 "Plan next constellation" CTA (absolute, 섹션 안)
│  │
│  │  ── 글로벌 ──
│  └─ MemoryPortal.tsx              # 별 클릭 시 모달 (fixed, 페이지 전체에 작동)
├─ lib/
│  ├─ data.ts                       # atlas/trips/memories (Act II 콘텐츠)
│  ├─ destinations.ts               ★ Act I — 6개 destination (Paris/Swiss/Maldives/Rockies/Kyoto/Iceland)
│  ├─ star-layout.ts                # 결정론적 3D 위치 + cameraPath
│  └─ atlas-context.tsx             # selectedId / hoveredId / scrollProgress 공유
```

**scrollProgress 의미**: 이제 "별자리 섹션 내부 진행률" (0~1). LenisProvider가 publish 안 하고
ConstellationExperience만 publish함. CameraRig/HeroOverlay/ChapterIndex/SiteFooter가 이 값 소비.

**페이지 전체 흐름**:
1. Opening title (100vh) — "Worlds Worth Seeing Together"
2. 6개 destination scenes (600vh) — 풀스크린 사진 + 3-레이어 패럴랙스
3. Bridge (110vh) — "우리만의 이야기는 더 가까이..."
4. ConstellationExperience (~400vh) — sticky 3D 별자리
5. (자연스럽게 끝)

---

## 메인 페이지가 작동하는 방식

1. `<Canvas>`는 `position: fixed; inset: 0; z: 0`에 깔림
2. `<ScrollSpacer>`가 `(trips.length + 2) * 100vh` 만큼 빈 공간 제공 → 페이지가 실제로 스크롤 가능
3. `LenisProvider`가 휠/터치를 보간하면서 `scrollProgress`를 0~1로 publish
4. `<CameraRig>`(R3F)가 `scrollProgress`를 `cameraPath`(lib/star-layout.ts) 위로 매핑 → 카메라가 별 사이를 비행
5. `<ChapterIndex>`도 `scrollProgress`를 보고 "지금 어느 트립 챕터인지" 표시 (좌측 사이드 텍스트)
6. 별 hover → `hoveredId` → `<HoverQuote>` 우측 인용구
7. 별 클릭 → `selectedId` → `<MemoryPortal>` 모달 + `<CameraRig>`가 그 별로 워프
8. ESC 또는 모달 클릭 외 영역 → `select(null)` → 다시 비행 모드 복귀

---

## 콘텐츠 수정

### 새 destination 추가 (Act I)
`lib/destinations.ts`의 `destinations: Destination[]`에 객체 추가:
```ts
{
  id: 'unique-slug',
  name: 'Paris',
  nameKo: '파리',
  region: 'Île-de-France · France',
  tagline: 'A city written in lights.',
  taglineKo: '빛으로 쓰인 도시.',
  image: u('photo-XXXX'),         // Unsplash photo ID (CDN hotlink, 무료)
  accent: '#E8D5A0',
  spec: '한 줄 메모.',
}
```
> 사진 교체: Unsplash에서 사진 페이지 URL 마지막의 `photo-XXXX` ID만 추출해 `u()`에 넣으세요. API 키 불필요.

### 새 별(추억) 추가 (Act II)
`lib/data.ts`의 `memories: Memory[]`에 객체 추가:
```ts
{
  id: 'unique-slug',
  name: '장소 이름',
  region: '경기 양주',
  date: '2026-08-01',
  tripId: 'alov-2026',           // 어떤 별자리에 속할지
  star: { palette: 'gold', size: 1.2 },  // 'gold'|'teal'|'rose'|'amber'|'ivory'|'ember'
  quote: '한 줄 인용.',
  emotion: ['설렘'],
  memories: ['그때의 한 장면.'],
  photoColor: 'from-amber-100 to-stone-300',
  favorite: true,
  status: 'planned',
}
```
→ `star-layout.ts`가 자동으로 3D 좌표 계산 (시간순 X + 트립 클러스터 Y/Z)

### 새 트립(별자리) 추가
`trips: Trip[]`에 추가하고 `lineColor`(hex)를 정하면 라인이 자동으로 그려짐.

### 별 컬러 팔레트 추가
`PALETTE` 객체에 키 추가 + `StarPalette` 타입에 추가.

---

## Local Dev

```powershell
cd "C:\Users\User\Desktop\Claude Coding\two-stars-atlas"
npm install   # 첫 클론 시
npm run dev   # http://localhost:3000
npm run build # 배포 전 타입 체크
```

---

## Deploy

```powershell
cd "C:\Users\User\Desktop\Claude Coding\two-stars-atlas"
git add . ; git commit -m "..." ; git push origin main
vercel --prod --yes
```

자매 프로젝트와 마찬가지로 GitHub→Vercel 자동배포 미연결 (`vercel --prod --yes` 직접 실행 필요).

---

## 다음 작업 (Phase 4~7)

- [ ] **Phase 4 — `/plan` 허브 확장**: 검색/필터, "다음 별자리" 큰 카드
- [ ] **Phase 5 — `/plan/[tripId]` 캔버스**: Overview header + Day Schedule (시간 슬롯 컬럼 캘린더) + 음식점 (Leaflet 미니맵)
- [ ] **Phase 6 — 활동/준비물/예산/이동·숙박** + "별자리에 등록" 폼
- [ ] **Phase 7 — 폴리시**: 사운드 토글, 모바일 깊은 테스트, Lighthouse 90+ 목표

`lib/data.ts`에 `Trip` 타입을 확장해서 `daySchedule[]`, `restaurants[]`, `activities[]`, `packing[]`, `budget` 필드 추가 필요.

---

## 흔한 함정

| 증상 | 원인 / 해결 |
|---|---|
| `Transition['ease']` does not exist | framer-motion 11에서 타입 제거됨. `[0.22, 1, 0.36, 1] as const`로 raw array 사용 |
| Three.js 빌드 실패 | `next.config.js`에 `transpilePackages: ['three']` 추가됨, 건드리지 말 것 |
| 모바일에서 렉 | bloom + parallax는 모바일 자동 비활성 (`ConstellationCanvas.tsx`에서 처리). 별 더 줄이려면 `bgCount` 조정 |
| 스크롤이 안 됨 | `ScrollSpacer`가 `display:none`이거나 `height:0`이면 안 됨. 페이지에 마운트됐는지 확인 |
| 마커 클릭이 안 잡힘 | `<HeroOverlay>` 등 fixed 오버레이가 `pointer-events: none`인지 확인 |
| 별이 어두침침 | `bloom` `luminanceThreshold`를 낮추거나 메모리 `star.size` 키우기 |

---

## What Not To Do

- ❌ Three.js를 SSR로 import (서버에서 `window` 접근 → 빌드 실패)
- ❌ 메인 페이지에 무거운 텍스처/HDR 추가 (모바일 폭주)
- ❌ DB 도입, Google Maps API 등 유료 서비스 (사용자 명시 동의 없이)
- ❌ `our-journey` 코드와 자동 동기화 (의도적으로 독립 운영)
