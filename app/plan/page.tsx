import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { trips, memoriesOfTrip } from '@/lib/data';

export default function PlanHub() {
  return (
    <main className="min-h-screen bg-night-950 text-ivory">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] tracking-widest2 uppercase text-ivory/55 hover:text-ivory transition mb-12"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to the sky
        </Link>

        <p className="text-[10px] tracking-widest3 uppercase text-gold-300 mb-4">
          Plan · 다음 별자리를 그리기
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-ivory leading-tight">
          Trip Canvas
        </h1>
        <p className="mt-4 font-serif italic text-lg text-ivory/65">
          “별을 찍기 전에, 먼저 자리를 정한다.”
        </p>

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {trips.map(t => (
            <article
              key={t.id}
              className="group relative overflow-hidden rounded-2xl border border-ivory/8 hover:border-gold-500/50 transition"
            >
              <div
                className="h-44 relative"
                style={{
                  background: `linear-gradient(135deg, ${t.lineColor}33, #11101A)`,
                }}
              >
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_55%)]" />
                <div className="absolute top-4 left-4 text-[10px] tracking-widest2 uppercase text-ivory/70">
                  {t.status === 'planned' ? '· upcoming ·' : t.status === 'in-progress' ? '· ongoing ·' : '· past ·'}
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] tracking-widest2 uppercase text-ivory/55">
                  {memoriesOfTrip(t.id).length} stars
                </div>
              </div>
              <div className="p-6 bg-night-800/70">
                <p className="text-[10px] tracking-widest2 uppercase text-gold-300/85">
                  {t.date}
                  {t.endDate && ` — ${t.endDate}`}
                </p>
                <h2 className="mt-2 font-display text-2xl text-ivory">
                  {t.nameKo ?? t.name}
                </h2>
                <p className="mt-2 text-sm italic font-serif text-ivory/55">
                  “{t.emotionTheme}”
                </p>
                <p className="mt-4 text-[11px] tracking-wider2 text-ivory/40">
                  Canvas coming in the next pass.
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-2xl border border-dashed border-ivory/15 text-center">
          <p className="text-[10px] tracking-widest3 uppercase text-ivory/45 mb-2">
            Phase 4 · 다음 세션
          </p>
          <h3 className="font-display text-2xl text-ivory">
            Day Schedule · 음식점 · 놀이 · 준비물 · 예산
          </h3>
          <p className="mt-2 text-sm text-ivory/55">
            트립별 캔버스가 곧 펼쳐집니다.
          </p>
        </div>
      </div>
    </main>
  );
}
