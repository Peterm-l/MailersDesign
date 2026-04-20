import { useEffect, useState } from 'react';
import bwipjs from 'bwip-js/browser';
import type { Barcode } from './products';

const BCID: Record<Barcode['type'], string> = {
  fnsku: 'code128',
  'upc-a': 'upca',
  'ean-13': 'ean13',
};

function useBarcodeDataUrl(barcode: Barcode): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!barcode.enabled || !barcode.data.trim()) {
      setUrl(null);
      return;
    }
    const canvas = document.createElement('canvas');
    try {
      bwipjs.toCanvas(canvas, {
        bcid: BCID[barcode.type],
        text: barcode.data.trim(),
        scale: 4,
        height: 10,
        includetext: true,
        textxalign: 'center',
        textsize: 9,
        paddingwidth: 6,
        paddingheight: 4,
        backgroundcolor: 'FFFFFF',
      });
      setUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.warn('barcode render failed', err);
      setUrl(null);
    }
  }, [barcode.enabled, barcode.type, barcode.data]);

  return url;
}

type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
  barcode: Barcode;
  fallbackTitle: string;
};

/**
 * Amazon-FBA-style FNSKU label: white block with title on top, barcode in the
 * middle, and condition line on bottom. Works for UPC/EAN too (just shows those
 * digits in place of the FNSKU).
 */
export function FnskuLabel({ x, y, w, h, barcode, fallbackTitle }: Props) {
  const url = useBarcodeDataUrl(barcode);
  if (!barcode.enabled) return null;

  const title = (barcode.title || fallbackTitle || '').trim();
  const showCondition = barcode.type === 'fnsku';
  const pad = 6;

  const titleH = title ? 14 : 0;
  const conditionH = showCondition ? 11 : 0;
  const barcodeY = y + pad + titleH;
  const barcodeH = h - pad * 2 - titleH - conditionH;

  const titleLines = wrapText(title, Math.floor((w - pad * 2) / 4.8), 2);

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke="#d8d8dc" strokeWidth="0.5" rx="2" />
      {titleLines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + pad + 8 + i * 7}
          fill="#0a0a0b"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontSize="7"
          fontWeight={600}
          textAnchor="middle"
        >
          {line}
        </text>
      ))}
      {url ? (
        <image href={url} x={x + pad} y={barcodeY} width={w - pad * 2} height={barcodeH} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text
          x={x + w / 2}
          y={y + h / 2}
          fill="#999"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="7"
          textAnchor="middle"
        >
          {barcode.data ? 'invalid data' : 'enter barcode data'}
        </text>
      )}
      {showCondition && (
        <text
          x={x + w / 2}
          y={y + h - pad}
          fill="#0a0a0b"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="6.5"
          fontWeight={500}
          letterSpacing="1"
          textAnchor="middle"
          style={{ textTransform: 'uppercase' }}
        >
          Condition: {barcode.condition || 'New'}
        </text>
      )}
    </g>
  );
}

function wrapText(s: string, maxChars: number, maxLines: number): string[] {
  if (!s) return [];
  const words = s.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
      if (lines.length === maxLines - 1) break;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > 1 ? last.slice(0, Math.max(1, maxChars - 1)) + '…' : last;
  }
  return lines;
}
