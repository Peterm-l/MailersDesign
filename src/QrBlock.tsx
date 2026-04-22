import { useEffect, useState } from 'react';
import bwipjs from 'bwip-js/browser';

export function useQrDataUrl(enabled: boolean, data: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !data.trim()) {
      setUrl(null);
      return;
    }
    const canvas = document.createElement('canvas');
    try {
      bwipjs.toCanvas(canvas, {
        bcid: 'qrcode',
        text: data.trim(),
        scale: 4,
        backgroundcolor: 'FFFFFF',
      });
      setUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.warn('QR render failed', err);
      setUrl(null);
    }
  }, [enabled, data]);

  return url;
}

type Props = {
  x: number;
  y: number;
  size: number;
  enabled: boolean;
  data: string;
  caption?: string;
};

/** Square QR with a thin white quiet zone so it scans cleanly even on dark panels. */
export function QrBlock({ x, y, size, enabled, data, caption }: Props) {
  const url = useQrDataUrl(enabled, data);
  if (!enabled) return null;

  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill="#ffffff" rx="2" />
      {url && (
        <image
          href={url}
          x={x + 3}
          y={y + 3}
          width={size - 6}
          height={size - 6}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
      {!url && (
        <text
          x={x + size / 2}
          y={y + size / 2 + 3}
          textAnchor="middle"
          fill="#999"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="6"
        >
          {data ? 'rendering…' : 'no data'}
        </text>
      )}
      {caption && (
        <text
          x={x + size / 2}
          y={y + size + 9}
          textAnchor="middle"
          fill="#e8e8ec"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="6"
          letterSpacing="0.8"
          style={{ textTransform: 'uppercase' }}
        >
          {caption}
        </text>
      )}
    </g>
  );
}
