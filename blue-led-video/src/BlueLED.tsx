import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ---------- Timing (30 fps) ----------
const S = 30;
const SCENES = [
  {id: 'title', dur: 4.5 * S},
  {id: 'what', dur: 8 * S},
  {id: 'colors', dur: 7 * S},
  {id: 'why', dur: 8 * S},
  {id: 'breakthrough', dur: 7.5 * S},
  {id: 'white', dur: 7.5 * S},
  {id: 'impact', dur: 7.5 * S},
] as const;
export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + s.dur, 0);

// ---------- Palette ----------
const BG = '#050816';
const BLUE = '#3b82ff';
const CYAN = '#5ee7ff';
const RED = '#ff4d5e';
const GREEN = '#3dff8a';
const YELLOW = '#ffd23f';
const WHITE = '#f4f7ff';
const MUTED = '#8b95b8';
const FONT = 'Inter, "DejaVu Sans", Arial, sans-serif';

// ---------- Helpers ----------
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 120}});
};

/** Fades a whole scene in at the start and out at the end. */
const SceneFade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const Title: React.FC<{children: React.ReactNode; delay?: number; size?: number; color?: string; top?: number}> = ({
  children,
  delay = 0,
  size = 84,
  color = WHITE,
  top = 220,
}) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        width: '100%',
        padding: '0 80px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px)`,
        letterSpacing: -1,
      }}
    >
      {children}
    </div>
  );
};

const Caption: React.FC<{children: React.ReactNode; delay?: number; bottom?: number; size?: number}> = ({
  children,
  delay = 0,
  bottom = 260,
  size = 50,
}) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        width: '100%',
        padding: '0 90px',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.3,
        color: WHITE,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** A stylised LED bulb drawn with SVG. `on` goes 0..1. */
const LED: React.FC<{color: string; on: number; size?: number}> = ({color, on, size = 260}) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 100 160" style={{overflow: 'visible'}}>
    <defs>
      <radialGradient id={`glow-${color}`}>
        <stop offset="0%" stopColor={color} stopOpacity={0.9 * on} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx="50" cy="45" r={90} fill={`url(#glow-${color})`} />
    {/* dome */}
    <path
      d="M20 95 V45 A30 30 0 0 1 80 45 V95 Z"
      fill={color}
      fillOpacity={0.25 + 0.75 * on}
      stroke={color}
      strokeWidth={2}
    />
    <rect x="14" y="92" width="72" height="10" rx="3" fill={color} fillOpacity={0.35 + 0.65 * on} />
    {/* legs */}
    <rect x="34" y="102" width="5" height="55" fill="#9aa3bf" />
    <rect x="61" y="102" width="5" height="45" fill="#9aa3bf" />
  </svg>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 40;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${45 + drift / 20}%, #0f1d4a 0%, ${BG} 60%)`,
      }}
    >
      {/* subtle floating dots */}
      {new Array(28).fill(0).map((_, i) => {
        const x = (i * 137) % 1080;
        const y = ((i * 251 + frame * (0.4 + (i % 5) * 0.15)) % 2100) - 90;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: 1920 - y,
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              borderRadius: '50%',
              background: BLUE,
              opacity: 0.18,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Scene 1: Title ----------
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [15, 45], [0, 1], clamp);
  const flicker = frame > 15 && frame < 45 && frame % 6 < 2 ? 0.3 : 1;
  const p = useEnter(10);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top: 430, transform: `scale(${0.6 + 0.4 * p})`}}>
        <LED color={BLUE} on={on * flicker} size={300} />
      </div>
      <Title top={1050} size={120} delay={30} color={CYAN}>
        The Blue LED
      </Title>
      <Caption bottom={560} delay={50} size={56}>
        The tiny light that took <b style={{color: YELLOW}}>30 years</b> to invent
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- Scene 2: What is an LED ----------
const SceneWhat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chip = spring({frame: frame - 15, fps, config: {damping: 15}});
  const W = 760;
  const left = (1080 - W) / 2;
  const top = 700;
  const H = 420;

  // electrons travel from left (n-type) and holes from right (p-type) to the junction
  const pairs = new Array(6).fill(0).map((_, i) => {
    const start = 50 + i * 22;
    const t = interpolate(frame, [start, start + 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
    const photonT = interpolate(frame, [start + 30, start + 60], [0, 1], clamp);
    return {i, t, photonT, y: top + 70 + i * 52};
  });

  return (
    <AbsoluteFill>
      <Title>What is an LED?</Title>
      <Title top={330} size={46} color={MUTED} delay={8}>
        Light-Emitting Diode
      </Title>

      <div style={{position: 'absolute', left, top, width: W, height: H, opacity: chip, transform: `scale(${0.8 + 0.2 * chip})`}}>
        <div style={{display: 'flex', height: '100%', borderRadius: 24, overflow: 'hidden', border: `3px solid ${MUTED}`}}>
          <div style={{flex: 1, background: '#16234f', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 18}}>
            <span style={{fontFamily: FONT, color: CYAN, fontSize: 38, fontWeight: 700}}>n-type</span>
          </div>
          <div style={{width: 8, background: YELLOW, boxShadow: `0 0 30px ${YELLOW}`}} />
          <div style={{flex: 1, background: '#3a1630', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 18}}>
            <span style={{fontFamily: FONT, color: RED, fontSize: 38, fontWeight: 700}}>p-type</span>
          </div>
        </div>
      </div>

      {pairs.map(({i, t, photonT, y}) => {
        const center = 540;
        const eX = interpolate(t, [0, 1], [left + 60, center - 18]);
        const hX = interpolate(t, [0, 1], [left + W - 60, center + 18]);
        const visible = t > 0 && t < 1 ? 1 : 0;
        const dir = i % 2 === 0 ? -1 : 1;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: eX - 18, top: y - 18, width: 36, height: 36, borderRadius: '50%', background: CYAN, opacity: visible, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: BG, textAlign: 'center', lineHeight: '36px'}}>−</div>
            <div style={{position: 'absolute', left: hX - 18, top: y - 18, width: 36, height: 36, borderRadius: '50%', border: `4px solid ${RED}`, boxSizing: 'border-box', opacity: visible, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: RED, textAlign: 'center', lineHeight: '28px'}}>+</div>
            {photonT > 0 && photonT < 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: center - 22 + dir * photonT * 380,
                  top: y - 22 - photonT * 420,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: BLUE,
                  boxShadow: `0 0 40px 18px ${BLUE}`,
                  opacity: 1 - photonT * 0.6,
                }}
              />
            )}
          </React.Fragment>
        );
      })}

      <Caption delay={60} bottom={330}>
        Electrons <span style={{color: CYAN}}>(−)</span> meet holes <span style={{color: RED}}>(+)</span> at the junction…
      </Caption>
      <Caption delay={130} bottom={190}>
        …and release energy as <b style={{color: BLUE}}>light</b> ✨
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- Scene 3: The colour problem ----------
const SceneColors: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    {color: RED, label: 'Red', year: '1962', delay: 20},
    {color: GREEN, label: 'Green', year: '1970s', delay: 50},
    {color: BLUE, label: 'Blue', year: '???', delay: 80},
  ];
  return (
    <AbsoluteFill>
      <Title>Red and green came fast…</Title>
      <div style={{position: 'absolute', top: 620, width: '100%', display: 'flex', justifyContent: 'space-evenly'}}>
        {items.map((it) => {
          const p = interpolate(frame, [it.delay, it.delay + 15], [0, 1], clamp);
          const isBlue = it.color === BLUE;
          // blue tries to turn on but fails (flicker then dark)
          const on = isBlue ? (frame > it.delay && frame < it.delay + 40 && frame % 8 < 2 ? 0.5 : 0) : p;
          return (
            <div key={it.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: interpolate(frame, [it.delay - 15, it.delay], [0, 1], clamp)}}>
              <LED color={it.color} on={on} size={220} />
              <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: it.color, marginTop: 20}}>{it.label}</div>
              <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 44, color: isBlue ? YELLOW : MUTED}}>{it.year}</div>
            </div>
          );
        })}
      </div>
      <Caption delay={110} bottom={300} size={56}>
        But <b style={{color: BLUE}}>blue</b> stumped scientists for <b style={{color: YELLOW}}>three decades</b>.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- Scene 4: Why was blue so hard? ----------
const SceneWhy: React.FC = () => {
  const frame = useCurrentFrame();
  const bars = [
    {color: RED, label: 'Red', ev: 1.9},
    {color: GREEN, label: 'Green', ev: 2.3},
    {color: BLUE, label: 'Blue', ev: 2.8},
  ];
  const maxH = 520;
  return (
    <AbsoluteFill>
      <Title>Why was blue so hard?</Title>
      <Caption delay={10} bottom={1290} size={46}>
        Blue light carries <b>more energy</b>. It needs a material with a bigger “band gap”.
      </Caption>
      <div style={{position: 'absolute', top: 640, height: maxH + 120, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 90}}>
        {bars.map((b, i) => {
          const g = interpolate(frame, [30 + i * 15, 60 + i * 15], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          return (
            <div key={b.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: WHITE, opacity: g}}>{b.ev} eV</div>
              <div style={{width: 150, height: (b.ev / 3) * maxH * g, background: b.color, borderRadius: 16, marginTop: 10, boxShadow: `0 0 40px ${b.color}88`}} />
              <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, color: b.color, marginTop: 14}}>{b.label}</div>
            </div>
          );
        })}
      </div>
      <Caption delay={110} bottom={300} size={50}>
        The answer was <b style={{color: CYAN}}>gallium nitride (GaN)</b>, but its crystals were almost impossible to grow well.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- Scene 5: Breakthrough ----------
const SceneBreakthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const people = ['Isamu Akasaki', 'Hiroshi Amano', 'Shuji Nakamura'];
  const medal = spring({frame: frame - 120, fps, config: {damping: 10}});
  return (
    <AbsoluteFill>
      <Title>The breakthrough</Title>
      <Title top={330} size={50} color={MUTED} delay={8}>
        Japan, late 1980s – 1993
      </Title>
      <div style={{position: 'absolute', top: 560, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
        {people.map((name, i) => {
          const p = spring({frame: frame - (25 + i * 18), fps, config: {damping: 14}});
          return (
            <div
              key={name}
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 62,
                color: WHITE,
                padding: '26px 60px',
                borderRadius: 999,
                border: `3px solid ${BLUE}`,
                background: '#0f1d4acc',
                boxShadow: `0 0 30px ${BLUE}55`,
                opacity: p,
                transform: `translateX(${(1 - p) * (i % 2 ? 300 : -300)}px)`,
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1150, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, #fff3b0, ${YELLOW} 45%, #b8860b)`,
            boxShadow: `0 0 ${60 * medal}px ${YELLOW}`,
            transform: `scale(${medal}) rotate(${(1 - medal) * -90}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 64,
            color: '#5a3d00',
          }}
        >
          2014
        </div>
      </div>
      <Caption delay={135} bottom={260} size={54}>
        They grew high-quality GaN and won the <b style={{color: YELLOW}}>Nobel Prize in Physics</b>.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- Scene 6: Blue + phosphor = white ----------
const SceneWhite: React.FC = () => {
  const frame = useCurrentFrame();
  const merge = interpolate(frame, [70, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const appear = (d: number) => interpolate(frame, [d, d + 15], [0, 1], clamp);
  const circle = (color: string, x: number, label: string, op: number) => (
    <div style={{position: 'absolute', left: x - 150, top: 820, width: 300, height: 300, borderRadius: '50%', background: color, opacity: op * (1 - merge), boxShadow: `0 0 80px ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 40, color: BG, textAlign: 'center'}}>
      {label}
    </div>
  );
  return (
    <AbsoluteFill>
      <Title>Why it matters: white light</Title>
      {circle(BLUE, interpolate(merge, [0, 1], [290, 540]), 'Blue LED', appear(15))}
      <div style={{position: 'absolute', top: 920, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 110, fontWeight: 900, color: WHITE, opacity: appear(30) * (1 - merge)}}>+</div>
      {circle(YELLOW, interpolate(merge, [0, 1], [790, 540]), 'Yellow phosphor', appear(40))}
      <div
        style={{
          position: 'absolute',
          left: 540 - 190,
          top: 780,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: WHITE,
          opacity: merge,
          transform: `scale(${0.6 + 0.4 * merge})`,
          boxShadow: `0 0 ${160 * merge}px 40px #ffffffaa`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 64,
          color: BG,
        }}
      >
        WHITE
      </div>
      <Caption delay={130} bottom={300} size={52}>
        Coat a blue LED with yellow phosphor and you get <b>bright white light</b>.
      </Caption>
    </AbsoluteFill>
  );
};

// ---------- Scene 7: Impact + outro ----------
const SceneImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const uses = ['💡 LED bulbs', '📱 Phone screens', '📺 TVs', '🚦 Traffic lights'];
  const stat = (d: number) => spring({frame: frame - d, fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Title>It lights the modern world</Title>
      <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', gap: 50}}>
        {[
          {big: '75%', small: 'less energy*', d: 15, c: GREEN},
          {big: '25×', small: 'longer life*', d: 30, c: CYAN},
        ].map((s) => (
          <div key={s.big} style={{textAlign: 'center', fontFamily: FONT, transform: `scale(${stat(s.d)})`, background: '#0f1d4acc', border: `3px solid ${s.c}`, borderRadius: 30, padding: '30px 50px'}}>
            <div style={{fontSize: 120, fontWeight: 900, color: s.c}}>{s.big}</div>
            <div style={{fontSize: 40, color: WHITE}}>{s.small}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 900, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, padding: '0 90px', boxSizing: 'border-box'}}>
        {uses.map((u, i) => {
          const p = stat(55 + i * 10);
          return (
            <div key={u} style={{fontFamily: FONT, fontSize: 46, fontWeight: 700, color: WHITE, background: '#ffffff12', borderRadius: 24, padding: '28px 20px', textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
              {u}
            </div>
          );
        })}
      </div>
      <Caption delay={110} bottom={330} size={58}>
        One tiny <b style={{color: BLUE}}>blue</b> light changed everything.
      </Caption>
      <div style={{position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 28, color: MUTED, opacity: interpolate(frame, [40, 60], [0, 1], clamp)}}>
        *LED vs. incandescent bulbs (US Dept. of Energy)
      </div>
    </AbsoluteFill>
  );
};

const COMPONENTS: Record<(typeof SCENES)[number]['id'], React.FC> = {
  title: SceneTitle,
  what: SceneWhat,
  colors: SceneColors,
  why: SceneWhy,
  breakthrough: SceneBreakthrough,
  white: SceneWhite,
  impact: SceneImpact,
};

export const BlueLED: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <Background />
      {SCENES.map((s) => {
        const Comp = COMPONENTS[s.id];
        const start = from;
        from += s.dur;
        return (
          <Sequence key={s.id} from={start} durationInFrames={s.dur}>
            <SceneFade dur={s.dur}>
              <Comp />
            </SceneFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
