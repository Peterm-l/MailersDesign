import { useEffect, useMemo, useRef, useState } from 'react';
import { Dieline, EXPORTABLE_PANELS, type AccentStyle } from './Dieline';
import { DEFAULT_PRODUCTS, type Product } from './products';
import { rasterizeSvgToPng } from './export';
import { exportPanel } from './offscreenExport';
import { ProductEditor } from './ProductEditor';

const STORAGE_KEY = 'mailer-designs-state-v1';

type Settings = {
  bg: string;
  accent: Record<string, AccentStyle>;
};

type PersistState = {
  products: Product[];
  settings: Settings;
};

const DEFAULT_SETTINGS: Settings = {
  bg: '#0a0a0b',
  accent: { analyzer: 'spectrum', balancer: 'spectrum' },
};

function loadState(): PersistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('no state');
    const parsed = JSON.parse(raw) as PersistState;
    if (!parsed.products || !parsed.settings) throw new Error('malformed');
    return parsed;
  } catch {
    return { products: DEFAULT_PRODUCTS, settings: DEFAULT_SETTINGS };
  }
}

function saveState(state: PersistState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

type MailerCardProps = {
  product: Product;
  accentStyle: AccentStyle;
  bgColor: string;
  onProductChange: (next: Product) => void;
  onAccentChange: (style: AccentStyle) => void;
  onResetProduct: () => void;
};

function MailerCard({ product, accentStyle, bgColor, onProductChange, onAccentChange, onResetProduct }: MailerCardProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const handleExportFull = async () => {
    const svg = svgContainerRef.current?.querySelector('svg');
    if (svg) {
      await rasterizeSvgToPng(svg as SVGSVGElement, `grayvolt-mailer-${product.key}-full.png`, 300);
    }
  };

  const handleExportPanel = (panelKey: string, label: string) => {
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    exportPanel({
      panelKey,
      product,
      accentStyle,
      productImage: product.image,
      bgColor,
      filename: `grayvolt-${product.key}-${slug}.png`,
    });
  };

  return (
    <div className="mailer-card">
      <div className="mailer-head">
        <div className="mailer-title">
          <span>{product.name}</span>
          <span className="sku">{product.sku}</span>
        </div>
        <div className="mailer-actions">
          <select
            className="btn"
            value={accentStyle}
            onChange={(e) => onAccentChange(e.target.value as AccentStyle)}
            aria-label="Accent style"
          >
            <option value="spectrum">Spectrum accent</option>
            <option value="waveform">Waveform accent</option>
          </select>
          <button className="btn primary" onClick={handleExportFull}>
            Export full dieline →
          </button>
        </div>
      </div>
      <div className="dieline-wrap" ref={svgContainerRef}>
        <Dieline
          product={product}
          accentStyle={accentStyle}
          productImage={product.image}
          bgColor={bgColor}
          showAnnotations={true}
        />
      </div>
      <div className="legend">
        <span className="key crease">Crease</span>
        <span className="key cut">Cut line</span>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
          Print area · 10 × 9.75 in
        </span>
      </div>
      <ProductEditor product={product} onChange={onProductChange} onReset={onResetProduct} />
      <div className="panel-exports">
        <h4>Export individual panels</h4>
        <div className="panel-grid">
          {EXPORTABLE_PANELS.map((p) => (
            <button key={p.key} className="panel-btn" onClick={() => handleExportPanel(p.key, p.label)}>
              <span className="label">{p.label}</span>
              <span className="size">{p.size}</span>
              <span className="action">Download PNG →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function App() {
  const initial = useMemo(loadState, []);
  const [products, setProducts] = useState<Product[]>(initial.products);
  const [settings, setSettings] = useState<Settings>(initial.settings);

  useEffect(() => {
    saveState({ products, settings });
  }, [products, settings]);

  const updateProduct = (key: string, next: Product) => {
    setProducts((prev) => prev.map((p) => (p.key === key ? next : p)));
  };

  const resetProduct = (key: string) => {
    const defaults = DEFAULT_PRODUCTS.find((p) => p.key === key);
    if (defaults) updateProduct(key, defaults);
  };

  const resetAll = () => {
    if (confirm('Reset all products and settings to defaults? This clears your saved state.')) {
      setProducts(DEFAULT_PRODUCTS);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const exportState = () => {
    const blob = new Blob([JSON.stringify({ products, settings }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mailer-designs.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const importState = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as PersistState;
      if (!parsed.products || !parsed.settings) throw new Error('malformed');
      setProducts(parsed.products);
      setSettings(parsed.settings);
    } catch (e) {
      alert('Could not import file: ' + (e as Error).message);
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">GRAYVOLT · PACKAGING</div>
          <h1>
            4×4×1 mailer <span className="accent">dielines.</span>
          </h1>
          <p style={{ marginTop: 10 }}>
            Flat print-ready artwork for both SKUs, matching the supplied die (back strip + top face + depth
            sides + front hero + tuck flap). Edit any field or image inline — changes save automatically.
            Export the full dieline or any individual panel as a 300 DPI PNG.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="eyebrow">DIE</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
            10 × 9.75 in · 1:1 @ 100 px/in
            <br />
            Tapered dust flaps · insert slots
          </div>
        </div>
      </header>

      <div className="mailer-stack">
        {products.map((p) => (
          <MailerCard
            key={p.key}
            product={p}
            accentStyle={settings.accent[p.key] ?? 'spectrum'}
            bgColor={settings.bg}
            onProductChange={(next) => updateProduct(p.key, next)}
            onAccentChange={(style) =>
              setSettings((s) => ({ ...s, accent: { ...s.accent, [p.key]: style } }))
            }
            onResetProduct={() => resetProduct(p.key)}
          />
        ))}
      </div>

      <div id="tweaks-panel">
        <h3>Global tweaks</h3>
        <div className="tweak-row">
          <label>Background</label>
          <select value={settings.bg} onChange={(e) => setSettings((s) => ({ ...s, bg: e.target.value }))}>
            <option value="#0a0a0b">Near-black (brand)</option>
            <option value="#131316">Elevated</option>
            <option value="#1a1a1f">Charcoal</option>
          </select>
        </div>
        <div className="tweak-row">
          <label>Project data</label>
          <div className="row-btns">
            <button className="btn" onClick={exportState}>Export JSON</button>
            <label className="btn" style={{ textAlign: 'center' }}>
              Import
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) importState(file);
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
        <div className="tweak-row">
          <button className="btn danger" onClick={resetAll} style={{ width: '100%' }}>
            Reset everything
          </button>
        </div>
      </div>
    </>
  );
}
