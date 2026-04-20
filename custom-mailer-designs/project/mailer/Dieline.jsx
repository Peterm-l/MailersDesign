/* Dieline.jsx — 4×4×1 mailer, calibrated against reference image.
   Total die: 9.88" × 11.81". Scale: 100 px = 1 inch.

   Structure (derived from reference image scans):

   ── BOT half (upper, tray) ──
     Row 1  (y 0.00 → 1.08) : BOT top long wall + tapered outer ears
     Row 2  (y 1.08 → 5.08) : [outer dust 0.44"][flap 0.50"][short wall 1.00"][BOT FACE 4.00"][short wall 1.00"][flap 0.50"][outer dust 0.44"]
     Row 3  (y 5.08 → 6.08) : BOT bottom long wall + tapered outer ears (hinge sits at y 6.08)

   ── TOP half (lower, lid) ──
     Row 4  (y 6.08 → 10.08): TOP face block, 6" wide (side wall 1" + face 4" + side wall 1"), centered
     Row 5  (y 10.08 → 11.08): TOP front wall, 4" wide, with curved wing transitions
     Row 6  (y 11.08 → 11.81): TOP tuck flap, 4" wide tapered

   BOT short walls have 2 insert slots each.
*/

const IN = 100;

// Total die
const TOTAL_W = 9.88 * IN;
const TOTAL_H = 11.81 * IN;

// Core box dims
const FACE = 4 * IN;      // 400
const DEPTH = 1 * IN;     // 100  (wall height)
const FLAP = 0.50 * IN;   // 50   (dust flap on short sides)
const OUTER_EAR = 0.94 * IN; // 94  (tapered outer ear on BOT long walls)
const TUCK = 0.73 * IN;   // 73

// ── BOT half Y coords ──
const Y_BOT_TOP_WALL = 0;
const Y_BOT_FACE     = Y_BOT_TOP_WALL + DEPTH;
const Y_BOT_BOT_WALL = Y_BOT_FACE + FACE;
const Y_HINGE        = Y_BOT_BOT_WALL + DEPTH;
// ── TOP half Y coords ──
const Y_TOP_FACE     = Y_HINGE;
const Y_TOP_FRONT    = Y_TOP_FACE + FACE;
const Y_TOP_TUCK     = Y_TOP_FRONT + DEPTH;
// total = 1 + 4 + 1 + 4 + 1 + 0.73 = 11.73 (target 11.81 — close, adjust tuck slightly)

// ── X coords (BOT half, widest row) ──
// Widest row = 9.88". Layout: OUTER_EAR | FLAP | DEPTH | FACE | DEPTH | FLAP | OUTER_EAR
// 0.94 + 0.50 + 1.00 + 4.00 + 1.00 + 0.50 + 0.94 = 8.88" ... short by 1"
// Adjusting OUTER_EAR to 1.44": 1.44+0.5+1+4+1+0.5+1.44 = 9.88 ✓
const OUTER_EAR_W = 1.44 * IN;

const X_OUTER_L_EAR = 0;
const X_FLAP_L      = X_OUTER_L_EAR + OUTER_EAR_W;  // 1.44
const X_SHORT_L     = X_FLAP_L + FLAP;              // 1.94
const X_FACE_L      = X_SHORT_L + DEPTH;            // 2.94
const X_FACE_R      = X_FACE_L + FACE;              // 6.94
const X_SHORT_R     = X_FACE_R + DEPTH;             // 7.94  (? depth already)
// correction: short wall is on the SIDE of the face (depth wide). face_R should come after depth.
// layout along X in BOT row: ear | flap | shortL | FACE | shortR | flap | ear
// widths:                     1.44 + 0.5 + 1 + 4 + 1 + 0.5 + 1.44 = 9.88 ✓
// redo:
const X0 = 0;
const X1 = X0 + OUTER_EAR_W;          // 1.44 — flap L start
const X2 = X1 + FLAP;                  // 1.94 — short L start
const X3 = X2 + DEPTH;                 // 2.94 — FACE start
const X4 = X3 + FACE;                  // 6.94 — short R start
const X5 = X4 + DEPTH;                 // 7.94 — flap R start
const X6 = X5 + FLAP;                  // 8.44 — ear R start
const X7 = X6 + OUTER_EAR_W;           // 9.88 — end ✓

// TOP half X coords. TOP face block = side wall 1 + face 4 + side wall 1 = 6". Centered in 9.88 → starts at 1.94.
const TOP_BLOCK_W = DEPTH + FACE + DEPTH; // 600
const X_TOP_BLOCK = (TOTAL_W - TOP_BLOCK_W) / 2;    // 194 = same as X2
const X_TOP_SIDE_L = X_TOP_BLOCK;                   // 194
const X_TOP_FACE_L = X_TOP_SIDE_L + DEPTH;          // 294 = X3 ✓
const X_TOP_FACE_R = X_TOP_FACE_L + FACE;           // 694 = X4 ✓
const X_TOP_SIDE_R = X_TOP_FACE_R;                  // 694

// ── Colors & fonts ──
const c = {
  bg: '#0a0a0b', border: '#2a2a30',
  accent: '#c8ff00', accentDim: 'rgba(200,255,0,0.08)',
  text: '#e8e8ec', textDim: '#8b8b96', textMuted: '#5a5a65',
  white: '#ffffff', kraft: '#f4f1e8', kraftEdge: '#e0dcc7',
  cutLine: '#ff4d6a',
};
const FONT_DISPLAY = "'Outfit', system-ui, sans-serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";
const FONT_MONO    = "'JetBrains Mono', ui-monospace, monospace";

// ── Panel definitions ──
const PANELS = {
  // BOT half
  botLongTop:  { x: X3,            y: Y_BOT_TOP_WALL, w: FACE,        h: DEPTH, key: 'botLongTop'  },
  botEarTL:    { x: X0,            y: Y_BOT_TOP_WALL, w: X3,          h: DEPTH, tapered: 'left',  noprint: true, key: 'botEarTL' },
  botEarTR:    { x: X4,            y: Y_BOT_TOP_WALL, w: TOTAL_W - X4, h: DEPTH, tapered: 'right', noprint: true, key: 'botEarTR' },

  botFlapL:    { x: X1,            y: Y_BOT_FACE, w: FLAP,   h: FACE, tapered: 'left',  noprint: true, key: 'botFlapL' },
  botShortL:   { x: X2,            y: Y_BOT_FACE, w: DEPTH,  h: FACE, key: 'botShortL' },
  bot:         { x: X3,            y: Y_BOT_FACE, w: FACE,   h: FACE, key: 'bot', label: 'BOTTOM' },
  botShortR:   { x: X4,            y: Y_BOT_FACE, w: DEPTH,  h: FACE, key: 'botShortR' },
  botFlapR:    { x: X5,            y: Y_BOT_FACE, w: FLAP,   h: FACE, tapered: 'right', noprint: true, key: 'botFlapR' },

  botLongBot:  { x: X3,            y: Y_BOT_BOT_WALL, w: FACE,        h: DEPTH, key: 'botLongBot'  },
  botEarBL:    { x: X0,            y: Y_BOT_BOT_WALL, w: X3,          h: DEPTH, tapered: 'left',  noprint: true, key: 'botEarBL' },
  botEarBR:    { x: X4,            y: Y_BOT_BOT_WALL, w: TOTAL_W - X4, h: DEPTH, tapered: 'right', noprint: true, key: 'botEarBR' },

  // TOP half
  topSideL:    { x: X_TOP_SIDE_L,  y: Y_TOP_FACE,  w: DEPTH, h: FACE, key: 'topSideL' },
  topFace:     { x: X_TOP_FACE_L,  y: Y_TOP_FACE,  w: FACE,  h: FACE, key: 'topFace', label: 'TOP' },
  topSideR:    { x: X_TOP_SIDE_R,  y: Y_TOP_FACE,  w: DEPTH, h: FACE, key: 'topSideR' },

  topFront:    { x: X_TOP_FACE_L,  y: Y_TOP_FRONT, w: FACE,  h: DEPTH, key: 'topFront' },
  topWingL:    { x: X_TOP_SIDE_L,  y: Y_TOP_FRONT, w: DEPTH, h: DEPTH, tapered: 'left',  noprint: true, key: 'topWingL' },
  topWingR:    { x: X_TOP_SIDE_R,  y: Y_TOP_FRONT, w: DEPTH, h: DEPTH, tapered: 'right', noprint: true, key: 'topWingR' },

  topTuck:     { x: X_TOP_FACE_L,  y: Y_TOP_TUCK,  w: FACE,  h: TUCK,  tapered: 'bottom', noprint: true, key: 'topTuck' },
};

function taperedFlapPath(x, y, w, h, side) {
  const inset = Math.min(Math.min(w, h) * 0.30, 14);
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

function Mono({ x, y, children, color = c.textDim, size = 9, ls = 1, anchor = 'start', weight = 400, upper = true }) {
  return <text x={x} y={y} fill={color} fontFamily={FONT_MONO} fontSize={size} fontWeight={weight}
               letterSpacing={ls} textAnchor={anchor} style={{ textTransform: upper ? 'uppercase' : 'none' }}>{children}</text>;
}
function Display({ x, y, children, size = 28, color = c.text, weight = 800, ls = -1, anchor = 'start' }) {
  return <text x={x} y={y} fill={color} fontFamily={FONT_DISPLAY} fontSize={size} fontWeight={weight}
               letterSpacing={ls} textAnchor={anchor}>{children}</text>;
}
function Body({ x, y, children, size = 10, color = c.textDim, weight = 400, anchor = 'start' }) {
  return <text x={x} y={y} fill={color} fontFamily={FONT_BODY} fontSize={size} fontWeight={weight} textAnchor={anchor}>{children}</text>;
}
function SpectrumAccent({ x, y, w, h, bars = 24, color = c.accent }) {
  const items = []; const gap = 2; const bw = (w - gap * (bars - 1)) / bars;
  for (let i = 0; i < bars; i++) {
    const t = (Math.sin(i * 1.7) + Math.sin(i * 0.9) + 2) / 4;
    const bh = Math.max(2, t * h);
    items.push(<rect key={i} x={x + i * (bw + gap)} y={y + (h - bh)} width={bw} height={bh} fill={color} rx="0.5" />);
  }
  return <g>{items}</g>;
}
function WaveformAccent({ x, y, w, h, color = c.accent }) {
  const pts = []; const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const px = x + (i / steps) * w;
    const py = y + h / 2 + Math.sin((i / steps) * Math.PI * 3) * (h / 2 - 1);
    pts.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return <path d={pts.join(' ')} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />;
}
function Wordmark({ x, y, size = 18, anchor = 'start' }) {
  // size = cap height of the wordmark; image aspect ~3.667:1 (2457/670)
  const w = size * 3.667;
  const h = size;
  const dx = anchor === 'end' ? -w : anchor === 'middle' ? -w / 2 : 0;
  return <image href="assets/graywolt-logo.png" x={x + dx} y={y - h * 0.8} width={w} height={h}
                preserveAspectRatio="xMidYMid meet" />;
}
function IconMark({ x, y, size = 20, anchor = 'start' }) {
  // waveform-W mark; image aspect ~1.287:1 (1434/1114)
  const w = size * 1.287;
  const h = size;
  const dx = anchor === 'end' ? -w : anchor === 'middle' ? -w / 2 : 0;
  return <image href="assets/graywolt-icon.png" x={x + dx} y={y - h / 2} width={w} height={h}
                preserveAspectRatio="xMidYMid meet" />;
}

// ── TOP FACE (customer-facing lid) — hero ──
function TopFace({ w, h, product, accentStyle, productImage }) {
  const pad = 22;
  const nameParts = product.name.split(' ');
  const first = nameParts[0];
  const rest = nameParts.slice(1).join(' ');

  return (
    <>
      {/* Subtle grid pattern for texture */}
      <defs>
        <pattern id={`grid-${product.key}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={c.accent} strokeWidth="0.3" opacity="0.08" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill={`url(#grid-${product.key})`} />

      {/* Corner brackets */}
      {[[pad, pad, 1, 1], [w - pad, pad, -1, 1], [pad, h - pad, 1, -1], [w - pad, h - pad, -1, -1]].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M${x + sx * 22},${y} L${x},${y} L${x},${y + sy * 22}`}
              stroke={c.accent} strokeWidth="1.5" fill="none" />
      ))}

      {/* Top meta strip */}
      <Mono x={pad + 8} y={pad + 14} size={9} ls={2} color={c.accent} weight={500}>
        INDUSTRIAL · EDGE · WIRELESS
      </Mono>
      <IconMark x={w - pad - 8} y={pad + 11} size={18} anchor="end" />
      <Mono x={w - pad - 32} y={pad + 14} anchor="end" size={9} ls={1.5} color={c.textDim} weight={500}>
        {product.sku}
      </Mono>

      {/* Wordmark */}
      <g transform={`translate(${pad + 8}, ${pad + 52})`}>
        <Wordmark x={0} y={0} size={28} />
      </g>

      {/* Big product name stack */}
      <text x={pad + 8} y={pad + 110} fill={c.text} fontFamily={FONT_DISPLAY}
            fontSize="44" fontWeight="800" letterSpacing="-2.2">{first}</text>
      <text x={pad + 8} y={pad + 152} fill={c.accent} fontFamily={FONT_DISPLAY}
            fontSize="44" fontWeight="800" letterSpacing="-2.2">{rest}.</text>

      {/* Tagline */}
      <text x={pad + 8} y={pad + 182} fill={c.textDim} fontFamily={FONT_BODY}
            fontSize="11" fontWeight="400">{product.tagline.toLowerCase()}</text>

      {/* Product image — centered lower */}
      {productImage && (
        <image href={productImage} x={pad + 40} y={pad + 210} width={w - pad * 2 - 80}
               height={h - pad - 300} preserveAspectRatio="xMidYMid meet" opacity="0.96" />
      )}

      {/* Accent visualizer */}
      <g transform={`translate(${pad + 8}, ${h - pad - 54})`}>
        {accentStyle === 'spectrum'
          ? <SpectrumAccent x={0} y={0} w={w - pad * 2 - 16} h={18} bars={32} />
          : <WaveformAccent x={0} y={0} w={w - pad * 2 - 16} h={18} />}
      </g>

      {/* Bottom strip */}
      <line x1={pad + 8} y1={h - pad - 28} x2={w - pad - 8} y2={h - pad - 28} stroke={c.accent} strokeWidth="0.8" opacity="0.4" />
      <Mono x={pad + 8} y={h - pad - 12} size={9} ls={1.8} color={c.text} weight={500}>
        STOP GUESSING · START MEASURING
      </Mono>
      <Mono x={w - pad - 8} y={h - pad - 12} anchor="end" size={9} ls={1.5} color={c.accent} weight={500}>
        GRAYVOLT.AI
      </Mono>
    </>
  );
}

// ── BOTTOM FACE (tray) — connect steps + regulatory ──
function BotFace({ w, h, product }) {
  const pad = 22;
  const steps = product.connect || [];

  return (
    <>
      {/* Header */}
      <Mono x={pad} y={pad + 4} size={10} ls={2} color={c.accent} weight={500}>
        HOW TO CONNECT
      </Mono>
      <Display x={pad} y={pad + 34} size={22} weight={700} ls={-0.5}>
        Up and running in under 5 minutes.
      </Display>
      <line x1={pad} y1={pad + 48} x2={w - pad} y2={pad + 48} stroke={c.accent} strokeWidth="1" opacity="0.4" />

      {/* Connect steps — 4-column numbered */}
      <g transform={`translate(${pad}, ${pad + 68})`}>
        {steps.slice(0, 4).map((s, i) => {
          const col = (w - pad * 2) / 4;
          const x = i * col;
          return (
            <g key={i} transform={`translate(${x}, 0)`}>
              <text x={0} y={20} fill={c.accent} fontFamily={FONT_DISPLAY} fontSize="30" fontWeight="800" letterSpacing="-1.5">
                {s.n}
              </text>
              <line x1={0} y1={32} x2={36} y2={32} stroke={c.accent} strokeWidth="1.5" />
              <text x={0} y={54} fill={c.text} fontFamily={FONT_DISPLAY} fontSize="13" fontWeight="700" letterSpacing="-0.3">
                {s.title}
              </text>
              {(() => {
                const words = s.body.split(' ');
                const maxChars = Math.floor((col - 10) / 5.2);
                const lines = [];
                let line = '';
                for (const w of words) {
                  if ((line + ' ' + w).trim().length > maxChars) { lines.push(line); line = w; }
                  else line = (line + ' ' + w).trim();
                }
                if (line) lines.push(line);
                return lines.slice(0, 5).map((ln, j) => (
                  <text key={j} x="0" y={72 + j * 12} fill={c.textDim}
                        fontFamily={FONT_BODY} fontSize="9.5">{ln}</text>
                ));
              })()}
            </g>
          );
        })}
      </g>

      {/* Footer — three rows, each on its own line so nothing can collide */}
      <g transform={`translate(0, ${h - pad - 62})`}>
        <line x1={pad} y1={0} x2={w - pad} y2={0} stroke={c.border} strokeWidth="1" opacity="0.5" />

        {/* Row 1: specs — model / FCC / input, spaced generously */}
        <Mono x={pad} y={14} size={7} ls={1.2} color={c.textMuted}>MODEL</Mono>
        <Body x={pad} y={27} size={9.5} color={c.text} weight={500}>{product.sku}</Body>

        <Mono x={pad + 100} y={14} size={7} ls={1.2} color={c.textMuted}>FCC ID</Mono>
        <Body x={pad + 100} y={27} size={9.5} color={c.text} weight={500}>{product.fcc || '________'}</Body>

        <Mono x={w - pad} y={14} anchor="end" size={7} ls={1.2} color={c.textMuted}>INPUT</Mono>
        <text x={w - pad} y={27} fill={c.text} fontFamily={FONT_BODY} fontSize="9.5" fontWeight="500" textAnchor="end">
          USB-C · 5V⎓500mA
        </text>

        {/* Row 2: origin — own line, centered */}
        <Mono x={w / 2} y={46} anchor="middle" size={7.5} ls={1.5} color={c.accent} weight={500}>
          ASSEMBLED & DESIGNED IN USA
        </Mono>

        {/* Row 3: wordmark — own line, centered */}
        <text x={w / 2} y={60} fill={c.textMuted} fontFamily={FONT_MONO} fontSize="7" letterSpacing="0.8" textAnchor="middle">
          GRAYVOLT.AI · © GRAYVOLT LLC
        </text>
      </g>
    </>
  );
}

// ── Long wall (4×1) — brand strip with tagline variant ──
function LongWall({ w, h, product, flip, variant = 'brand' }) {
  const pad = 12;
  const inner = variant === 'tagline' ? (
    <>
      <Mono x={pad} y={h / 2 - 6} size={7} ls={1.5} color={c.textMuted} weight={500}>
        INDUSTRIAL SENSORS
      </Mono>
      <text x={pad} y={h / 2 + 16} fill={c.text} fontFamily={FONT_DISPLAY}
            fontSize="18" fontWeight="800" letterSpacing="-0.8">
        Stop guessing.
        <tspan fill={c.accent}> Start measuring.</tspan>
      </text>
      <Mono x={w - pad} y={h / 2 + 14} anchor="end" size={8} ls={1.5} color={c.accent} weight={500}>
        GRAYVOLT.AI
      </Mono>
    </>
  ) : (
    <>
      <g transform={`translate(${pad}, ${h / 2 + 5})`}>
        <Wordmark x={0} y={0} size={15} />
      </g>
      <g transform={`translate(${w / 2}, ${h / 2})`}>
        <circle cx="-70" cy="-1" r="2" fill={c.accent} />
        <text x="0" y="4" fill={c.textDim} fontFamily={FONT_MONO} fontSize="9" fontWeight="500"
              letterSpacing="1.5" textAnchor="middle" style={{textTransform:'uppercase'}}>
          {product.name}
        </text>
        <circle cx="70" cy="-1" r="2" fill={c.accent} />
      </g>
      <Mono x={w - pad} y={h / 2 + 4} anchor="end" size={8.5} ls={1.5} color={c.accent} weight={500}>
        {product.sku}
      </Mono>
    </>
  );
  return flip ? <g transform={`translate(${w}, ${h}) rotate(180)`}>{inner}</g> : inner;
}

// ── Short wall (1×4) — slot zones avoid text ──
function ShortWall({ w, h, product, rotateDir = -90 }) {
  const pad = 10;
  return (
    <g transform={`translate(${w / 2}, ${h / 2}) rotate(${rotateDir}) translate(${-h / 2}, ${-w / 2})`}>
      <Mono x={pad} y={w / 2 + 3} size={7.5} ls={1.4} color={c.accent} weight={500}>
        {product.name.toUpperCase()}
      </Mono>
      <Mono x={h - pad} y={w / 2 + 3} anchor="end" size={7.5} ls={1.4} color={c.textDim}>
        {product.sku}
      </Mono>
    </g>
  );
}

// ── Top side wall (1×4) — on lid ──
function TopSideWall({ w, h }) {
  const pad = 10;
  return (
    <g transform={`translate(${w / 2}, ${h / 2}) rotate(-90) translate(${-h / 2}, ${-w / 2})`}>
      <Mono x={pad} y={w / 2 + 3} size={7.5} ls={1.4} color={c.textDim} weight={500}>
        STOP GUESSING · START MEASURING
      </Mono>
      <Mono x={h - pad} y={w / 2 + 3} anchor="end" size={7.5} ls={1.4} color={c.accent} weight={500}>
        GRAYVOLT.AI
      </Mono>
    </g>
  );
}

// ── Top front wall (4×1) ──
function TopFrontWall({ w, h, product }) {
  const pad = 10;
  return (
    <>
      <g transform={`translate(${pad}, ${h / 2 + 5})`}>
        <Wordmark x={0} y={0} size={14} />
      </g>
      <Mono x={w - pad} y={h / 2 + 4} anchor="end" size={8.5} ls={1.5} color={c.accent} weight={500}>
        MODEL {product.sku}
      </Mono>
    </>
  );
}

// ── Single-panel renderer ──
function SinglePanel({ panel, product, accentStyle, productImage, bgColor }) {
  const W = panel.w, H = panel.h;
  const content = () => {
    switch (panel.key) {
      case 'topFace':    return <TopFace w={W} h={H} product={product} accentStyle={accentStyle} productImage={productImage} />;
      case 'bot':        return <BotFace w={W} h={H} product={product} />;
      case 'botLongTop': return <LongWall w={W} h={H} product={product} variant="brand" />;
      case 'botLongBot': return <LongWall w={W} h={H} product={product} variant="tagline" flip />;
      case 'botShortL':  return <ShortWall w={W} h={H} product={product} rotateDir={-90} />;
      case 'botShortR':  return <ShortWall w={W} h={H} product={product} rotateDir={90} />;
      case 'topSideL':   return <TopSideWall w={W} h={H} />;
      case 'topSideR':   return <TopSideWall w={W} h={H} />;
      case 'topFront':   return <TopFrontWall w={W} h={H} product={product} />;
      default:           return null;
    }
  };
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={W} height={H} fill={bgColor} />
      {content()}
    </svg>
  );
}

// ── MAIN DIELINE ──
function Dieline({ product, accentStyle = 'spectrum', productImage, bgColor = c.bg,
                   showAnnotations = true, showReferenceOverlay = false, panelId = null }) {
  if (panelId && PANELS[panelId]) {
    return <SinglePanel panel={PANELS[panelId]} product={product} accentStyle={accentStyle} productImage={productImage} bgColor={bgColor} />;
  }

  const printed = ['botLongTop','botShortL','bot','botShortR','botLongBot',
                   'topSideL','topFace','topSideR','topFront'];

  return (
    <svg width={TOTAL_W} height={TOTAL_H} viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        {Object.values(PANELS).map(p => (
          <clipPath key={`clip-${p.key}`} id={`clip-${p.key}`}>
            {p.tapered
              ? <path d={taperedFlapPath(p.x, p.y, p.w, p.h, p.tapered)} />
              : <rect x={p.x} y={p.y} width={p.w} height={p.h} />}
          </clipPath>
        ))}
        <radialGradient id="glow-top" cx="15%" cy="15%" r="70%">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.10" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Reference image overlay for fit-checking */}
      {showReferenceOverlay && (
        <image href="assets/die-reference.png" x="0" y="0" width={TOTAL_W} height={TOTAL_H}
               preserveAspectRatio="xMidYMid meet" opacity="0.5" />
      )}

      {/* Unprinted flaps — kraft */}
      {Object.values(PANELS).filter(p => p.noprint).map(p => (
        <path key={p.key} d={taperedFlapPath(p.x, p.y, p.w, p.h, p.tapered)} fill={c.kraft} stroke={c.kraftEdge} strokeWidth="0.5" />
      ))}

      {/* Printed panels */}
      {printed.map(key => {
        const p = PANELS[key];
        return (
          <g key={key} clipPath={`url(#clip-${key})`}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={bgColor} />
            {key === 'topFace' && <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="url(#glow-top)" />}
            <g transform={`translate(${p.x}, ${p.y})`}>
              {key === 'topFace'    && <TopFace w={p.w} h={p.h} product={product} accentStyle={accentStyle} productImage={productImage} />}
              {key === 'bot'        && <BotFace w={p.w} h={p.h} product={product} />}
              {key === 'botLongTop' && <LongWall w={p.w} h={p.h} product={product} variant="brand" />}
              {key === 'botLongBot' && <LongWall w={p.w} h={p.h} product={product} variant="tagline" flip />}
              {key === 'botShortL'  && <ShortWall w={p.w} h={p.h} product={product} rotateDir={-90} />}
              {key === 'botShortR'  && <ShortWall w={p.w} h={p.h} product={product} rotateDir={90} />}
              {key === 'topSideL'   && <TopSideWall w={p.w} h={p.h} />}
              {key === 'topSideR'   && <TopSideWall w={p.w} h={p.h} />}
              {key === 'topFront'   && <TopFrontWall w={p.w} h={p.h} product={product} />}
            </g>
          </g>
        );
      })}

      {/* Slot cuts in BOT short walls */}
      <g stroke={c.cutLine} strokeWidth="1" fill="none">
        <rect x={X2 + 30} y={Y_BOT_FACE + FACE * 0.18} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
        <rect x={X2 + 30} y={Y_BOT_FACE + FACE * 0.64} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
        <rect x={X4 + DEPTH - 37} y={Y_BOT_FACE + FACE * 0.18} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
        <rect x={X4 + DEPTH - 37} y={Y_BOT_FACE + FACE * 0.64} width="7" height={FACE * 0.16} rx="3.5" fill="#0a0a0b" />
      </g>

      {/* Crease lines (dashed) */}
      <g stroke={c.cutLine} strokeWidth="0.7" strokeDasharray="3 2.5" opacity="0.55" fill="none">
        {/* BOT face box */}
        <line x1={X3} y1={Y_BOT_FACE}     x2={X4} y2={Y_BOT_FACE} />
        <line x1={X3} y1={Y_BOT_BOT_WALL} x2={X4} y2={Y_BOT_BOT_WALL} />
        <line x1={X3} y1={Y_BOT_FACE}     x2={X3} y2={Y_BOT_BOT_WALL} />
        <line x1={X4} y1={Y_BOT_FACE}     x2={X4} y2={Y_BOT_BOT_WALL} />
        {/* BOT long walls outer crease to ears */}
        <line x1={X3} y1={Y_BOT_TOP_WALL} x2={X4} y2={Y_BOT_TOP_WALL} />
        {/* BOT short wall dust flap creases */}
        <line x1={X2} y1={Y_BOT_FACE} x2={X2} y2={Y_BOT_BOT_WALL} />
        <line x1={X5} y1={Y_BOT_FACE} x2={X5} y2={Y_BOT_BOT_WALL} />
        {/* Hinge */}
        <line x1={X3} y1={Y_HINGE} x2={X4} y2={Y_HINGE} />
        {/* TOP face box */}
        <line x1={X_TOP_FACE_L} y1={Y_TOP_FRONT} x2={X_TOP_FACE_R} y2={Y_TOP_FRONT} />
        <line x1={X_TOP_FACE_L} y1={Y_TOP_FACE}  x2={X_TOP_FACE_L} y2={Y_TOP_FRONT} />
        <line x1={X_TOP_FACE_R} y1={Y_TOP_FACE}  x2={X_TOP_FACE_R} y2={Y_TOP_FRONT} />
        {/* Tuck flap crease */}
        <line x1={X_TOP_FACE_L} y1={Y_TOP_TUCK} x2={X_TOP_FACE_R} y2={Y_TOP_TUCK} />
      </g>

      {/* Annotations */}
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

const EXPORTABLE_PANELS = [
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

window.Dieline = Dieline;
window.EXPORTABLE_PANELS = EXPORTABLE_PANELS;
window.PANELS = PANELS;
window.DIELINE_W = TOTAL_W;
window.DIELINE_H = TOTAL_H;
