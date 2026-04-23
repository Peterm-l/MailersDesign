import type { Product, TextSlotId } from './products';
import { TEXT_SLOT_DEFAULTS } from './products';
import { FnskuLabel } from './FnskuLabel';
import { QrBlock } from './QrBlock';

function slot(product: Product, id: TextSlotId): { text: string; dx: number; dy: number } {
  const ov = product.textOverrides?.[id];
  return {
    text: ov?.text ?? TEXT_SLOT_DEFAULTS[id],
    dx: ov?.dx ?? 0,
    dy: ov?.dy ?? 0,
  };
}

function Editable({ slotId, children }: { slotId: TextSlotId; children: React.ReactNode }) {
  return (
    <g data-slot-id={slotId} style={{ cursor: 'pointer' }}>
      {children}
    </g>
  );
}

/* Dieline — 4×4×1 mailer, calibrated against reference image.
   Total die: 9.88" × 11.81". Scale: 100 px = 1 inch. */

const IN = 100;

const TOTAL_W = 9.88 * IN;
const TOTAL_H = 11.81 * IN;

const FACE = 4 * IN;
const DEPTH = 1 * IN;
const FLAP = 0.5 * IN;
const TUCK = 0.73 * IN;
const OUTER_EAR_W = 1.44 * IN;

const Y_BOT_TOP_WALL = 0;
const Y_BOT_FACE = Y_BOT_TOP_WALL + DEPTH;
const Y_BOT_BOT_WALL = Y_BOT_FACE + FACE;
const Y_HINGE = Y_BOT_BOT_WALL + DEPTH;
const Y_TOP_FACE = Y_HINGE;
const Y_TOP_FRONT = Y_TOP_FACE + FACE;
const Y_TOP_TUCK = Y_TOP_FRONT + DEPTH;

const X0 = 0;
const X1 = X0 + OUTER_EAR_W;
const X2 = X1 + FLAP;
const X3 = X2 + DEPTH;
const X4 = X3 + FACE;
const X5 = X4 + DEPTH;

const TOP_BLOCK_W = DEPTH + FACE + DEPTH;
const X_TOP_BLOCK = (TOTAL_W - TOP_BLOCK_W) / 2;
const X_TOP_SIDE_L = X_TOP_BLOCK;
const X_TOP_FACE_L = X_TOP_SIDE_L + DEPTH;
const X_TOP_FACE_R = X_TOP_FACE_L + FACE;
const X_TOP_SIDE_R = X_TOP_FACE_R;

const c = {
  bg: '#0a0a0b', border: '#2a2a30',
  accent: '#c8ff00', accentDim: 'rgba(200,255,0,0.08)',
  pink: '#ff4d9e',
  text: '#e8e8ec', textDim: '#8b8b96', textMuted: '#5a5a65',
  white: '#ffffff', kraft: '#f4f1e8', kraftEdge: '#e0dcc7',
  cutLine: '#ff4d6a',
};
const FONT_DISPLAY = "'Outfit', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', ui-monospace, monospace";

type PanelDef = {
  x: number; y: number; w: number; h: number;
  key: string; label?: string;
  tapered?: 'left' | 'right' | 'top' | 'bottom';
  noprint?: boolean;
};

const PANELS: Record<string, PanelDef> = {
  botLongTop: { x: X3, y: Y_BOT_TOP_WALL, w: FACE, h: DEPTH, key: 'botLongTop' },
  botEarTL:   { x: X0, y: Y_BOT_TOP_WALL, w: X3, h: DEPTH, tapered: 'left', noprint: true, key: 'botEarTL' },
  botEarTR:   { x: X4, y: Y_BOT_TOP_WALL, w: TOTAL_W - X4, h: DEPTH, tapered: 'right', noprint: true, key: 'botEarTR' },

  botFlapL:   { x: X1, y: Y_BOT_FACE, w: FLAP, h: FACE, tapered: 'left', noprint: true, key: 'botFlapL' },
  botShortL:  { x: X2, y: Y_BOT_FACE, w: DEPTH, h: FACE, key: 'botShortL' },
  bot:        { x: X3, y: Y_BOT_FACE, w: FACE, h: FACE, key: 'bot', label: 'BOTTOM' },
  botShortR:  { x: X4, y: Y_BOT_FACE, w: DEPTH, h: FACE, key: 'botShortR' },
  botFlapR:   { x: X5, y: Y_BOT_FACE, w: FLAP, h: FACE, tapered: 'right', noprint: true, key: 'botFlapR' },

  botLongBot: { x: X3, y: Y_BOT_BOT_WALL, w: FACE, h: DEPTH, key: 'botLongBot' },
  botEarBL:   { x: X0, y: Y_BOT_BOT_WALL, w: X3, h: DEPTH, tapered: 'left', noprint: true, key: 'botEarBL' },
  botEarBR:   { x: X4, y: Y_BOT_BOT_WALL, w: TOTAL_W - X4, h: DEPTH, tapered: 'right', noprint: true, key: 'botEarBR' },

  topSideL:   { x: X_TOP_SIDE_L, y: Y_TOP_FACE, w: DEPTH, h: FACE, key: 'topSideL' },
  topFace:    { x: X_TOP_FACE_L, y: Y_TOP_FACE, w: FACE, h: FACE, key: 'topFace', label: 'TOP' },
  topSideR:   { x: X_TOP_SIDE_R, y: Y_TOP_FACE, w: DEPTH, h: FACE, key: 'topSideR' },

  topFront:   { x: X_TOP_FACE_L, y: Y_TOP_FRONT, w: FACE, h: DEPTH, key: 'topFront' },
  topWingL:   { x: X_TOP_SIDE_L, y: Y_TOP_FRONT, w: DEPTH, h: DEPTH, tapered: 'left', noprint: true, key: 'topWingL' },
  topWingR:   { x: X_TOP_SIDE_R, y: Y_TOP_FRONT, w: DEPTH, h: DEPTH, tapered: 'right', noprint: true, key: 'topWingR' },

  topTuck:    { x: X_TOP_FACE_L, y: Y_TOP_TUCK, w: FACE, h: TUCK, tapered: 'bottom', noprint: true, key: 'topTuck' },
};

function taperedFlapPath(x: number, y: number, w: number, h: number, side: PanelDef['tapered']) {
  const inset = Math.min(Math.min(w, h) * 0.3, 14);
  switch (side) {
    case 'left':
      return `M${x + w},${y} L${x + inset},${y} Q${x},${y} ${x},${y + inset} L${x},${y + h - inset} Q${x},${y + h} ${x + inset},${y + h} L${x + w},${y + h} Z`;
    case 'right':
      return `M${x},${y} L${x + w - inset},${y} Q${x + w},${y} ${x + w},${y + inset} L${x + w},${y + h - inset} Q${x + w},${y + h} ${x + w - inset},${y + h} L${x},${y + h} Z`;
    case 'top':
      return `M${x},${y + h} L${x + w},${y + h} L${x + w},${y + inset} Q${x + w},${y} ${x + w - inset},${y} L${x + inset},${y} Q${x},${y} ${x},${y + inset} Z`;
    case 'bottom':
      return `M${x},${y} L${x + w},${y} L${x + w},${y + h - inset} Q${x + w},${y + h} ${x + w - inset},${y + h} L${x + inset},${y + h} Q${x},${y + h} ${x},${y + h - inset} Z`;
    default:
      return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
  }
}

type MonoProps = {
  x: number; y: number; children: React.ReactNode;
  color?: string; size?: number; ls?: number;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number; upper?: boolean;
};
function Mono({ x, y, children, color = c.textDim, size = 9, ls = 1, anchor = 'start', weight = 400, upper = true }: MonoProps) {
  return (
    <text x={x} y={y} fill={color} fontFamily={FONT_MONO} fontSize={size} fontWeight={weight}
      letterSpacing={ls} textAnchor={anchor} style={{ textTransform: upper ? 'uppercase' : 'none' }}>
      {children}
    </text>
  );
}

type DisplayProps = {
  x: number; y: number; children: React.ReactNode;
  size?: number; color?: string; weight?: number; ls?: number;
  anchor?: 'start' | 'middle' | 'end';
};
function Display({ x, y, children, size = 28, color = c.text, weight = 800, ls = -1, anchor = 'start' }: DisplayProps) {
  return (
    <text x={x} y={y} fill={color} fontFamily={FONT_DISPLAY} fontSize={size} fontWeight={weight}
      letterSpacing={ls} textAnchor={anchor}>
      {children}
    </text>
  );
}

type BodyProps = {
  x: number; y: number; children: React.ReactNode;
  size?: number; color?: string; weight?: number;
  anchor?: 'start' | 'middle' | 'end';
};
function Body({ x, y, children, size = 10, color = c.textDim, weight = 400, anchor = 'start' }: BodyProps) {
  return (
    <text x={x} y={y} fill={color} fontFamily={FONT_BODY} fontSize={size} fontWeight={weight} textAnchor={anchor}>
      {children}
    </text>
  );
}

export type SpectrumConfig = {
  color: string;
  primary: number;
  secondary: number;
  secondaryAmp: number;
};

const DEFAULT_SPECTRUM: SpectrumConfig = {
  color: c.pink,
  primary: 28,
  secondary: 62,
  secondaryAmp: 58,
};

function SpectrumAccent({ x, y, w, h, bars = 96, config = DEFAULT_SPECTRUM, peakColor = c.accent }: { x: number; y: number; w: number; h: number; bars?: number; config?: SpectrumConfig; peakColor?: string }) {
  const gap = 1;
  const bw = (w - gap * (bars - 1)) / bars;

  // Stable hash noise — same render every time for the same config.
  const noise = (i: number) => {
    const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return v - Math.floor(v);
  };

  // A smooth envelope made of several gaussians spread across the full
  // width gives visual balance (no dead zone on the right). Per-bar
  // jitter on top of the envelope breaks up the smoothness so it reads
  // as "data" rather than a drawn curve.
  const primary = config.primary / 100;
  const secondary = config.secondary / 100;
  const secAmp = config.secondaryAmp / 100;

  const envelopes = [
    { mu: primary,                        sigma: 0.030, amp: 1.00 },  // main — becomes green
    { mu: Math.min(0.98, primary + 0.09), sigma: 0.045, amp: 0.55 },  // near-primary shoulder
    { mu: secondary,                      sigma: 0.060, amp: 0.80 * secAmp },
    { mu: 0.48,                           sigma: 0.10,  amp: 0.22 },  // mid filler
    { mu: 0.86,                           sigma: 0.09,  amp: 0.28 },  // right-side filler
  ];

  const values: number[] = new Array(bars);
  for (let i = 0; i < bars; i++) {
    const t = i / (bars - 1);
    let env = 0;
    for (const p of envelopes) {
      const d = (t - p.mu) / p.sigma;
      env += p.amp * Math.exp(-0.5 * d * d);
    }
    // Jitter: each bar's height is the envelope scaled by 0.55-1.0,
    // with a small baseline so there's always visible texture.
    const jitter = 0.55 + 0.45 * noise(i);
    const baseline = 0.025 + noise(i + 101) * 0.045;
    values[i] = Math.max(baseline, Math.min(1, env * jitter));
  }

  // Tallest bar → Grayvolt green accent; everything else is the user color.
  let maxIdx = 0;
  for (let i = 1; i < bars; i++) {
    if (values[i] > values[maxIdx]) maxIdx = i;
  }

  const items: React.ReactElement[] = values.map((v, i) => {
    const bh = Math.max(1, v * h);
    return (
      <rect
        key={i}
        x={x + i * (bw + gap)}
        y={y + (h - bh)}
        width={bw}
        height={bh}
        rx={Math.min(0.8, bw / 2)}
        fill={i === maxIdx ? peakColor : config.color}
      />
    );
  });

  return <g>{items}</g>;
}

function WaveformAccent({ x, y, w, h, color = c.accent }: { x: number; y: number; w: number; h: number; color?: string }) {
  const pts: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const px = x + (i / steps) * w;
    const py = y + h / 2 + Math.sin((i / steps) * Math.PI * 3) * (h / 2 - 1);
    pts.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return <path d={pts.join(' ')} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />;
}

type MarkProps = { x: number; y: number; size?: number; anchor?: 'start' | 'middle' | 'end' };
function Wordmark({ x, y, size = 18, anchor = 'start' }: MarkProps) {
  const w = size * 3.667;
  const h = size;
  const dx = anchor === 'end' ? -w : anchor === 'middle' ? -w / 2 : 0;
  return <image href="/assets/graywolt-logo.png" x={x + dx} y={y - h * 0.8} width={w} height={h} preserveAspectRatio="xMidYMid meet" />;
}
function IconMark({ x, y, size = 20, anchor = 'start' }: MarkProps) {
  const w = size * 1.287;
  const h = size;
  const dx = anchor === 'end' ? -w : anchor === 'middle' ? -w / 2 : 0;
  return <image href="/assets/graywolt-icon.png" x={x + dx} y={y - h / 2} width={w} height={h} preserveAspectRatio="xMidYMid meet" />;
}

type AccentStyle = 'spectrum' | 'waveform';

function TopFace({ w, h, product, accentStyle, productImage, glowIntensity = 28, spectrum }: { w: number; h: number; product: Product; accentStyle: AccentStyle; productImage: string; glowIntensity?: number; spectrum?: SpectrumConfig }) {
  const pad = 22;
  const nameParts = product.name.split(' ');
  const first = nameParts[0];
  const rest = nameParts.slice(1).join(' ');
  const glowOpacity = Math.max(0, Math.min(1, glowIntensity / 100));

  return (
    <>
      <defs>
        <pattern id={`grid-${product.key}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={c.accent} strokeWidth="0.3" opacity="0.08" />
        </pattern>
        <radialGradient id={`glow-top-${product.key}`} cx="15%" cy="15%" r="75%">
          <stop offset="0%" stopColor={c.accent} stopOpacity={glowOpacity} />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill={`url(#glow-top-${product.key})`} />
      <rect x="0" y="0" width={w} height={h} fill={`url(#grid-${product.key})`} />

      {[[pad, pad, 1, 1], [w - pad, pad, -1, 1], [pad, h - pad, 1, -1], [w - pad, h - pad, -1, -1]].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M${x + sx * 22},${y} L${x},${y} L${x},${y + sy * 22}`} stroke={c.accent} strokeWidth="1.5" fill="none" />
      ))}

      {(() => {
        const s = slot(product, 'topFaceEyebrow');
        return (
          <Editable slotId="topFaceEyebrow">
            <Mono x={pad + 8 + s.dx} y={pad + 14 + s.dy} size={9} ls={2} color={c.accent} weight={500}>
              {s.text}
            </Mono>
          </Editable>
        );
      })()}
      <IconMark x={w - pad - 8} y={pad + 11} size={18} anchor="end" />
      <Mono x={w - pad - 32} y={pad + 14} anchor="end" size={9} ls={1.5} color={c.textDim} weight={500}>
        {product.sku}
      </Mono>

      <g transform={`translate(${pad + 8}, ${pad + 52})`}>
        <Wordmark x={0} y={0} size={28} />
      </g>

      <text x={pad + 8} y={pad + 110} fill={c.text} fontFamily={FONT_DISPLAY} fontSize="44" fontWeight="800" letterSpacing="-2.2">{first}</text>
      <text x={pad + 8} y={pad + 152} fill={c.accent} fontFamily={FONT_DISPLAY} fontSize="44" fontWeight="800" letterSpacing="-2.2">{rest}.</text>

      <text x={pad + 8} y={pad + 182} fill={c.textDim} fontFamily={FONT_BODY} fontSize="11" fontWeight="400">{product.tagline.toLowerCase()}</text>

      {productImage && product.showProductImage !== false && (
        <image href={productImage} x={pad + 40} y={pad + 210} width={w - pad * 2 - 80} height={h - pad - 300} preserveAspectRatio="xMidYMid meet" opacity="0.96" />
      )}

      <g transform={`translate(${pad + 8}, ${h - pad - 54})`}>
        {accentStyle === 'spectrum'
          ? <SpectrumAccent x={0} y={0} w={w - pad * 2 - 16} h={18} config={spectrum ?? DEFAULT_SPECTRUM} />
          : <WaveformAccent x={0} y={0} w={w - pad * 2 - 16} h={18} />}
      </g>

      <line x1={pad + 8} y1={h - pad - 28} x2={w - pad - 8} y2={h - pad - 28} stroke={c.accent} strokeWidth="0.8" opacity="0.4" />
      {(() => {
        const sL = slot(product, 'topFaceBottomLeft');
        const sR = slot(product, 'topFaceBottomRight');
        return (
          <>
            <Editable slotId="topFaceBottomLeft">
              <Mono x={pad + 8 + sL.dx} y={h - pad - 12 + sL.dy} size={9} ls={1.8} color={c.text} weight={500}>
                {sL.text}
              </Mono>
            </Editable>
            <Editable slotId="topFaceBottomRight">
              <Mono x={w - pad - 8 + sR.dx} y={h - pad - 12 + sR.dy} anchor="end" size={9} ls={1.5} color={c.accent} weight={500}>
                {sR.text}
              </Mono>
            </Editable>
          </>
        );
      })()}
    </>
  );
}

function BotFace({ w, h, product }: { w: number; h: number; product: Product }) {
  const pad = 22;
  const steps = product.connect ?? [];
  const hasBarcode = product.barcode?.enabled;

  // Sit in the empty zone between connect-step bottoms (~y=210) and
  // the footer top (h - pad - 62 = ~y=316). DataMatrix is square so
  // it gets a slightly taller, narrower box; linear codes get a strip.
  const isSquare = product.barcode?.type === 'gs1-datamatrix';
  const isRetail = product.barcode?.type === 'upc-a' || product.barcode?.type === 'ean-13';
  const labelW = isSquare ? 90 : isRetail ? 150 : 170;
  const labelH = isSquare ? 78 : isRetail ? 88 : 60;
  const labelX = (w - labelW) / 2;
  const labelY = h - pad - 62 - labelH - 8;

  const sHeader = slot(product, 'botFaceHeader');
  const sTitle = slot(product, 'botFaceTitle');
  const sModel = slot(product, 'botFaceModelLabel');
  const sFcc = slot(product, 'botFaceFccLabel');
  const sInputL = slot(product, 'botFaceInputLabel');
  const sInputV = slot(product, 'botFaceInputValue');
  const sOrigin = slot(product, 'botFaceOrigin');
  const sCopyright = slot(product, 'botFaceCopyright');

  return (
    <>
      <Editable slotId="botFaceHeader">
        <Mono x={pad + sHeader.dx} y={pad + 4 + sHeader.dy} size={10} ls={2} color={c.accent} weight={500}>{sHeader.text}</Mono>
      </Editable>
      <Editable slotId="botFaceTitle">
        <Display x={pad + sTitle.dx} y={pad + 34 + sTitle.dy} size={22} weight={700} ls={-0.5}>{sTitle.text}</Display>
      </Editable>
      <line x1={pad} y1={pad + 48} x2={w - pad} y2={pad + 48} stroke={c.accent} strokeWidth="1" opacity="0.4" />

      <g transform={`translate(${pad}, ${pad + 68})`}>
        {steps.slice(0, 4).map((s, i) => {
          const col = (w - pad * 2) / 4;
          const x = i * col;
          const words = s.body.split(' ');
          const maxChars = Math.floor((col - 10) / 5.2);
          const lines: string[] = [];
          let line = '';
          for (const wd of words) {
            if ((line + ' ' + wd).trim().length > maxChars) { lines.push(line); line = wd; }
            else line = (line + ' ' + wd).trim();
          }
          if (line) lines.push(line);
          return (
            <g key={i} transform={`translate(${x}, 0)`}>
              <text x={0} y={20} fill={c.accent} fontFamily={FONT_DISPLAY} fontSize="30" fontWeight="800" letterSpacing="-1.5">{s.n}</text>
              <line x1={0} y1={32} x2={36} y2={32} stroke={c.accent} strokeWidth="1.5" />
              <text x={0} y={54} fill={c.text} fontFamily={FONT_DISPLAY} fontSize="13" fontWeight="700" letterSpacing="-0.3">{s.title}</text>
              {lines.slice(0, 5).map((ln, j) => (
                <text key={j} x="0" y={72 + j * 12} fill={c.textDim} fontFamily={FONT_BODY} fontSize="9.5">{ln}</text>
              ))}
            </g>
          );
        })}
      </g>

      {hasBarcode && (
        <FnskuLabel
          x={labelX}
          y={labelY}
          w={labelW}
          h={labelH}
          barcode={product.barcode}
          fallbackTitle={product.name}
        />
      )}

      <g transform={`translate(0, ${h - pad - 62})`}>
        <line x1={pad} y1={0} x2={w - pad} y2={0} stroke={c.border} strokeWidth="1" opacity="0.5" />

        <Editable slotId="botFaceModelLabel">
          <Mono x={pad + sModel.dx} y={14 + sModel.dy} size={7} ls={1.2} color={c.textMuted}>{sModel.text}</Mono>
        </Editable>
        <Body x={pad} y={27} size={9.5} color={c.text} weight={500}>{product.sku}</Body>

        <Editable slotId="botFaceFccLabel">
          <Mono x={pad + 100 + sFcc.dx} y={14 + sFcc.dy} size={7} ls={1.2} color={c.textMuted}>{sFcc.text}</Mono>
        </Editable>
        <Body x={pad + 100} y={27} size={9.5} color={c.text} weight={500}>{product.fcc || '________'}</Body>

        <Editable slotId="botFaceInputLabel">
          <Mono x={w - pad + sInputL.dx} y={14 + sInputL.dy} anchor="end" size={7} ls={1.2} color={c.textMuted}>{sInputL.text}</Mono>
        </Editable>
        <Editable slotId="botFaceInputValue">
          <text x={w - pad + sInputV.dx} y={27 + sInputV.dy} fill={c.text} fontFamily={FONT_BODY} fontSize="9.5" fontWeight="500" textAnchor="end">
            {sInputV.text}
          </text>
        </Editable>

        <Editable slotId="botFaceOrigin">
          <Mono x={w / 2 + sOrigin.dx} y={46 + sOrigin.dy} anchor="middle" size={7.5} ls={1.5} color={c.accent} weight={500}>
            {sOrigin.text}
          </Mono>
        </Editable>

        <Editable slotId="botFaceCopyright">
          <text x={w / 2 + sCopyright.dx} y={60 + sCopyright.dy} fill={c.textMuted} fontFamily={FONT_MONO} fontSize="7" letterSpacing="0.8" textAnchor="middle">
            {sCopyright.text}
          </text>
        </Editable>
      </g>
    </>
  );
}

function LongWall({ w, h, product, flip, variant = 'brand' }: { w: number; h: number; product: Product; flip?: boolean; variant?: 'brand' | 'tagline' }) {
  const pad = 12;
  const sEb = slot(product, 'longWallEyebrow');
  const sT1 = slot(product, 'longWallTaglinePart1');
  const sT2 = slot(product, 'longWallTaglinePart2');
  const sBrand = slot(product, 'longWallBrand');
  const inner = variant === 'tagline' ? (
    <>
      <Editable slotId="longWallEyebrow">
        <Mono x={pad + sEb.dx} y={h / 2 - 6 + sEb.dy} size={7} ls={1.5} color={c.textMuted} weight={500}>
          {sEb.text}
        </Mono>
      </Editable>
      <Editable slotId="longWallTaglinePart1">
        <text x={pad + sT1.dx} y={h / 2 + 16 + sT1.dy} fill={c.text} fontFamily={FONT_DISPLAY} fontSize="18" fontWeight="800" letterSpacing="-0.8">
          {sT1.text}<tspan fill={c.accent} dx={sT2.dx} dy={sT2.dy}> {sT2.text}</tspan>
        </text>
      </Editable>
      <Editable slotId="longWallBrand">
        <Mono x={w - pad + sBrand.dx} y={h / 2 + 14 + sBrand.dy} anchor="end" size={8} ls={1.5} color={c.accent} weight={500}>
          {sBrand.text}
        </Mono>
      </Editable>
    </>
  ) : (
    <>
      <g transform={`translate(${pad}, ${h / 2 + 5})`}>
        <Wordmark x={0} y={0} size={15} />
      </g>
      <g transform={`translate(${w / 2}, ${h / 2})`}>
        <circle cx="-70" cy="-1" r="2" fill={c.accent} />
        <text x="0" y="4" fill={c.textDim} fontFamily={FONT_MONO} fontSize="9" fontWeight="500"
          letterSpacing="1.5" textAnchor="middle" style={{ textTransform: 'uppercase' }}>
          {product.name}
        </text>
        <circle cx="70" cy="-1" r="2" fill={c.accent} />
      </g>
      <Mono x={w - pad} y={h / 2 + 4} anchor="end" size={8.5} ls={1.5} color={c.accent} weight={500}>
        {product.sku}
      </Mono>
    </>
  );
  return flip ? <g transform={`translate(${w}, ${h}) rotate(180)`}>{inner}</g> : <>{inner}</>;
}

function ShortWall({ w, h, product, rotateDir = -90, side }: { w: number; h: number; product: Product; rotateDir?: number; side: 'L' | 'R' }) {
  const pad = 10;
  const qr = product.qrCode;
  const showQr = !!qr?.enabled && !!qr?.panels?.[side === 'L' ? 'botShortL' : 'botShortR'];
  const qrSize = Math.min(w - pad * 2, 58);
  // Panel is rotated -90° so increasing qrX moves UP on the flat dieline.
  // The right-side scaleX(-1) wrapper flips horizontally only, so vertical
  // position is shared — same formula on both sides keeps the QRs aligned.
  // Slider: 0 = top of panel on dieline, 100 = bottom.
  const pos = Math.max(0, Math.min(100, qr?.position ?? 50)) / 100;
  const qrX = (h - qrSize) * (1 - pos);
  const qrY = (w - qrSize) / 2;

  return (
    <g transform={`translate(${w / 2}, ${h / 2}) rotate(${rotateDir}) translate(${-h / 2}, ${-w / 2})`}>
      <Mono x={pad} y={w / 2 + 3} size={7.5} ls={1.4} color={c.accent} weight={500}>
        {product.name.toUpperCase()}
      </Mono>
      <Mono x={h - pad} y={w / 2 + 3} anchor="end" size={7.5} ls={1.4} color={c.textDim}>
        {product.sku}
      </Mono>
      {showQr && <QrBlock x={qrX} y={qrY} size={qrSize} enabled data={qr.data} />}
    </g>
  );
}

function TopSideWall({ w, h, product, side }: { w: number; h: number; product: Product; side: 'L' | 'R' }) {
  const pad = 10;
  const sStart = slot(product, 'topSideStart');
  const sEnd = slot(product, 'topSideEnd');
  const qr = product.qrCode;
  const showQr = !!qr?.enabled && !!qr?.panels?.[side === 'L' ? 'topSideL' : 'topSideR'];
  const qrSize = Math.min(w - pad * 2, 58);
  const pos = Math.max(0, Math.min(100, qr?.position ?? 50)) / 100;
  const qrX = (h - qrSize) * (1 - pos);
  const qrY = (w - qrSize) / 2;

  return (
    <g transform={`translate(${w / 2}, ${h / 2}) rotate(-90) translate(${-h / 2}, ${-w / 2})`}>
      <Editable slotId="topSideStart">
        <Mono x={pad + sStart.dx} y={w / 2 + 3 + sStart.dy} size={7.5} ls={1.4} color={c.textDim} weight={500}>
          {sStart.text}
        </Mono>
      </Editable>
      <Editable slotId="topSideEnd">
        <Mono x={h - pad + sEnd.dx} y={w / 2 + 3 + sEnd.dy} anchor="end" size={7.5} ls={1.4} color={c.accent} weight={500}>
          {sEnd.text}
        </Mono>
      </Editable>
      {showQr && <QrBlock x={qrX} y={qrY} size={qrSize} enabled data={qr.data} />}
    </g>
  );
}

function TopFrontWall({ w, h, product }: { w: number; h: number; product: Product }) {
  const pad = 10;
  const sPrefix = slot(product, 'topFrontPrefix');
  return (
    <>
      <g transform={`translate(${pad}, ${h / 2 + 5})`}>
        <Wordmark x={0} y={0} size={14} />
      </g>
      <Editable slotId="topFrontPrefix">
        <Mono x={w - pad + sPrefix.dx} y={h / 2 + 4 + sPrefix.dy} anchor="end" size={8.5} ls={1.5} color={c.accent} weight={500}>
          {sPrefix.text} {product.sku}
        </Mono>
      </Editable>
    </>
  );
}

function SinglePanel({ panel, product, accentStyle, productImage, bgColor, glowIntensity, spectrum }: { panel: PanelDef; product: Product; accentStyle: AccentStyle; productImage: string; bgColor: string; glowIntensity?: number; spectrum?: SpectrumConfig }) {
  const W = panel.w, H = panel.h;
  const content = () => {
    switch (panel.key) {
      case 'topFace':    return <TopFace w={W} h={H} product={product} accentStyle={accentStyle} productImage={productImage} glowIntensity={glowIntensity} spectrum={spectrum} />;
      case 'bot':        return <BotFace w={W} h={H} product={product} />;
      case 'botLongTop': return <LongWall w={W} h={H} product={product} variant="brand" />;
      case 'botLongBot': return <LongWall w={W} h={H} product={product} variant="tagline" flip />;
      case 'botShortL':  return <ShortWall w={W} h={H} product={product} rotateDir={-90} side="L" />;
      case 'botShortR':  return (
        <g transform={`translate(${W}, 0) scale(-1, 1)`}>
          <ShortWall w={W} h={H} product={product} rotateDir={-90} side="R" />
        </g>
      );
      case 'topSideL':   return <TopSideWall w={W} h={H} product={product} side="L" />;
      case 'topSideR':   return (
        <g transform={`translate(${W}, 0) scale(-1, 1)`}>
          <TopSideWall w={W} h={H} product={product} side="R" />
        </g>
      );
      case 'topFront':   return <TopFrontWall w={W} h={H} product={product} />;
      default: return null;
    }
  };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={W} height={H} fill={bgColor} />
      {content()}
    </svg>
  );
}

export type DielineProps = {
  product: Product;
  accentStyle?: AccentStyle;
  productImage: string;
  bgColor?: string;
  glowIntensity?: number;
  spectrum?: SpectrumConfig;
  showAnnotations?: boolean;
  panelId?: string | null;
};

export function Dieline({ product, accentStyle = 'spectrum', productImage, bgColor = c.bg, glowIntensity = 28, spectrum, showAnnotations = true, panelId = null }: DielineProps) {
  if (panelId && PANELS[panelId]) {
    return <SinglePanel panel={PANELS[panelId]} product={product} accentStyle={accentStyle} productImage={productImage} bgColor={bgColor} glowIntensity={glowIntensity} spectrum={spectrum} />;
  }

  const printed = ['botLongTop', 'botShortL', 'bot', 'botShortR', 'botLongBot', 'topSideL', 'topFace', 'topSideR', 'topFront'];

  return (
    <svg width={TOTAL_W} height={TOTAL_H} viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        {Object.values(PANELS).map(p => (
          <clipPath key={`clip-${p.key}`} id={`clip-${p.key}-${product.key}`}>
            {p.tapered
              ? <path d={taperedFlapPath(p.x, p.y, p.w, p.h, p.tapered)} />
              : <rect x={p.x} y={p.y} width={p.w} height={p.h} />}
          </clipPath>
        ))}
      </defs>

      {Object.values(PANELS).filter(p => p.noprint).map(p => (
        <path key={p.key} d={taperedFlapPath(p.x, p.y, p.w, p.h, p.tapered)} fill={c.kraft} stroke={c.kraftEdge} strokeWidth="0.5" />
      ))}

      {printed.map(key => {
        const p = PANELS[key];
        return (
          <g key={key} clipPath={`url(#clip-${key}-${product.key})`}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={bgColor} />
            <g transform={`translate(${p.x}, ${p.y})`}>
              {key === 'topFace' && <TopFace w={p.w} h={p.h} product={product} accentStyle={accentStyle} productImage={productImage} glowIntensity={glowIntensity} spectrum={spectrum} />}
              {key === 'bot' && <BotFace w={p.w} h={p.h} product={product} />}
              {key === 'botLongTop' && <LongWall w={p.w} h={p.h} product={product} variant="brand" />}
              {key === 'botLongBot' && <LongWall w={p.w} h={p.h} product={product} variant="tagline" flip />}
              {key === 'botShortL' && <ShortWall w={p.w} h={p.h} product={product} rotateDir={-90} side="L" />}
              {key === 'botShortR' && (
                <g transform={`translate(${p.w}, 0) scale(-1, 1)`}>
                  <ShortWall w={p.w} h={p.h} product={product} rotateDir={-90} side="R" />
                </g>
              )}
              {key === 'topSideL' && <TopSideWall w={p.w} h={p.h} product={product} side="L" />}
              {key === 'topSideR' && (
                <g transform={`translate(${p.w}, 0) scale(-1, 1)`}>
                  <TopSideWall w={p.w} h={p.h} product={product} side="R" />
                </g>
              )}
              {key === 'topFront' && <TopFrontWall w={p.w} h={p.h} product={product} />}
            </g>
          </g>
        );
      })}

      <g stroke={c.cutLine} strokeWidth="1" fill="none">
        <rect x={X2 + 30} y={Y_BOT_FACE + FACE * 0.18} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
        <rect x={X2 + 30} y={Y_BOT_FACE + FACE * 0.64} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
        <rect x={X4 + DEPTH - 37} y={Y_BOT_FACE + FACE * 0.18} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
        <rect x={X4 + DEPTH - 37} y={Y_BOT_FACE + FACE * 0.64} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
      </g>

      <g stroke={c.cutLine} strokeWidth="0.7" strokeDasharray="3 2.5" opacity="0.55" fill="none">
        <line x1={X3} y1={Y_BOT_FACE} x2={X4} y2={Y_BOT_FACE} />
        <line x1={X3} y1={Y_BOT_BOT_WALL} x2={X4} y2={Y_BOT_BOT_WALL} />
        <line x1={X3} y1={Y_BOT_FACE} x2={X3} y2={Y_BOT_BOT_WALL} />
        <line x1={X4} y1={Y_BOT_FACE} x2={X4} y2={Y_BOT_BOT_WALL} />
        <line x1={X3} y1={Y_BOT_TOP_WALL} x2={X4} y2={Y_BOT_TOP_WALL} />
        <line x1={X2} y1={Y_BOT_FACE} x2={X2} y2={Y_BOT_BOT_WALL} />
        <line x1={X5} y1={Y_BOT_FACE} x2={X5} y2={Y_BOT_BOT_WALL} />
        <line x1={X3} y1={Y_HINGE} x2={X4} y2={Y_HINGE} />
        <line x1={X_TOP_FACE_L} y1={Y_TOP_FRONT} x2={X_TOP_FACE_R} y2={Y_TOP_FRONT} />
        <line x1={X_TOP_FACE_L} y1={Y_TOP_FACE} x2={X_TOP_FACE_L} y2={Y_TOP_FRONT} />
        <line x1={X_TOP_FACE_R} y1={Y_TOP_FACE} x2={X_TOP_FACE_R} y2={Y_TOP_FRONT} />
        <line x1={X_TOP_FACE_L} y1={Y_TOP_TUCK} x2={X_TOP_FACE_R} y2={Y_TOP_TUCK} />
      </g>

      {showAnnotations && (
        <g style={{ pointerEvents: 'none' }}>
          <Mono x={TOTAL_W / 2} y={14} anchor="middle" size={8} ls={2} color="#888">BOT · TRAY</Mono>
          <Mono x={TOTAL_W / 2} y={Y_HINGE - 4} anchor="middle" size={7} ls={2} color="#666">— HINGE —</Mono>
          <Mono x={TOTAL_W / 2} y={TOTAL_H - 6} anchor="middle" size={8} ls={2} color="#888">TOP · LID</Mono>
          <Mono x={4} y={10} size={7} color="#888" ls={0.5}>GRAYVOLT · 4×4×1 MAILER · {product.name.toUpperCase()}</Mono>
          <Mono x={TOTAL_W - 4} y={10} anchor="end" size={7} color="#888" ls={0.5}>9.88 × 11.81 IN · 1:1 @ 100 PX/IN</Mono>
        </g>
      )}
    </svg>
  );
}

export const EXPORTABLE_PANELS = [
  { key: 'topFace',    label: 'Top face (lid)',      size: '4 × 4 in' },
  { key: 'bot',        label: 'Bottom face (tray)',  size: '4 × 4 in' },
  { key: 'botLongTop', label: 'BOT long wall — top', size: '4 × 1 in' },
  { key: 'botLongBot', label: 'BOT long wall — btm', size: '4 × 1 in' },
  { key: 'botShortL',  label: 'BOT short — left',    size: '1 × 4 in' },
  { key: 'botShortR',  label: 'BOT short — right',   size: '1 × 4 in' },
  { key: 'topSideL',   label: 'TOP side — left',     size: '1 × 4 in' },
  { key: 'topSideR',   label: 'TOP side — right',    size: '1 × 4 in' },
  { key: 'topFront',   label: 'TOP front lip',       size: '4 × 1 in' },
];

export { TOTAL_W as DIELINE_W, TOTAL_H as DIELINE_H };
export type { AccentStyle };
