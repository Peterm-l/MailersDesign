import { useEffect, useRef } from 'react';
import type { Product, TextSlotId, TextOverride } from './products';
import { TEXT_SLOT_DEFAULTS, TEXT_SLOT_LABELS } from './products';

type Props = {
  product: Product;
  slotId: TextSlotId;
  screenX: number;
  screenY: number;
  onChange: (next: Product) => void;
  onClose: () => void;
};

export function TextPopup({ product, slotId, screenX, screenY, onChange, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const ov: TextOverride = product.textOverrides?.[slotId] ?? {};
  const defaultText = TEXT_SLOT_DEFAULTS[slotId];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const id = window.setTimeout(() => document.addEventListener('mousedown', handler), 0);
    document.addEventListener('keydown', keyHandler);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [onClose]);

  const setOv = (patch: Partial<TextOverride>) => {
    const next: TextOverride = { ...ov, ...patch };
    const effective: TextOverride = {};
    if (next.text !== undefined && next.text !== defaultText) effective.text = next.text;
    if (next.dx) effective.dx = next.dx;
    if (next.dy) effective.dy = next.dy;
    const overrides: Record<string, TextOverride> = { ...(product.textOverrides ?? {}) };
    if (Object.keys(effective).length === 0) delete overrides[slotId];
    else overrides[slotId] = effective;
    onChange({ ...product, textOverrides: overrides });
  };

  // Clamp near the right/bottom viewport edges.
  const popupWidth = 280;
  const popupHeight = 160;
  const left = Math.min(screenX, window.innerWidth - popupWidth - 12);
  const top = Math.min(screenY, window.innerHeight - popupHeight - 12);

  return (
    <div
      ref={ref}
      className="text-popup"
      style={{ position: 'fixed', left, top, width: popupWidth, zIndex: 200 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-popup-title">{TEXT_SLOT_LABELS[slotId]}</div>
      <input
        type="text"
        value={ov.text ?? defaultText}
        autoFocus
        onChange={(e) => setOv({ text: e.target.value })}
      />
      <div className="text-popup-offsets">
        <label>
          dx
          <input
            type="number"
            value={ov.dx ?? 0}
            onChange={(e) => setOv({ dx: Number(e.target.value) || 0 })}
          />
        </label>
        <label>
          dy
          <input
            type="number"
            value={ov.dy ?? 0}
            onChange={(e) => setOv({ dy: Number(e.target.value) || 0 })}
          />
        </label>
      </div>
      <div className="text-popup-actions">
        <button
          className="btn-ghost"
          onClick={() => {
            const overrides: Record<string, TextOverride> = { ...(product.textOverrides ?? {}) };
            delete overrides[slotId];
            onChange({ ...product, textOverrides: overrides });
          }}
        >
          Reset
        </button>
        <button className="btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
