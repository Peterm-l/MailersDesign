import { useRef, useState } from 'react';
import type { Product, ConnectStep, BarcodeType, Barcode } from './products';
import { fileToDataUrl } from './export';

type Props = {
  product: Product;
  onChange: (next: Product) => void;
  onReset: () => void;
};

export function ProductEditor({ product, onChange, onReset }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragover, setDragover] = useState(false);

  const update = (patch: Partial<Product>) => onChange({ ...product, ...patch });

  const updateStep = (i: number, patch: Partial<ConnectStep>) => {
    const next = product.connect.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    update({ connect: next });
  };

  const addStep = () => {
    const nextNum = String(product.connect.length + 1).padStart(2, '0');
    update({
      connect: [...product.connect, { n: nextNum, title: 'New step', body: 'Describe this step.' }],
    });
  };

  const removeStep = (i: number) => {
    update({ connect: product.connect.filter((_, idx) => idx !== i) });
  };

  const handleImageFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    update({ image: dataUrl });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleImageFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const imageIsDataUrl = product.image.startsWith('data:');

  const updateBarcode = (patch: Partial<Barcode>) =>
    update({ barcode: { ...product.barcode, ...patch } });
  const dataHint = BARCODE_HINTS[product.barcode.type];
  const dataError = validateBarcode(product.barcode.type, product.barcode.data);

  return (
    <div className="editor">
      <section>
        <h4>Product</h4>
        <div className="field">
          <label>Name</label>
          <input type="text" value={product.name} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div className="field">
          <label>SKU</label>
          <input type="text" value={product.sku} onChange={(e) => update({ sku: e.target.value })} />
        </div>
        <div className="field">
          <label>Tagline</label>
          <input type="text" value={product.tagline} onChange={(e) => update({ tagline: e.target.value })} />
        </div>
        <div className="field">
          <label>FCC ID</label>
          <input type="text" value={product.fcc} placeholder="e.g. 2AXXXX-GV01" onChange={(e) => update({ fcc: e.target.value })} />
        </div>
        <button className="btn danger" onClick={onReset} style={{ marginTop: 4 }}>
          Reset this product
        </button>
      </section>

      <section>
        <h4>Product image (top face)</h4>
        <div
          className={`image-drop${dragover ? ' dragover' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
          onDragLeave={() => setDragover(false)}
          onDrop={onDrop}
        >
          Drop an image or click to pick a file
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} hidden />
        </div>
        <div className="image-preview">
          <img src={product.image} alt="" />
          <div className="meta">
            {imageIsDataUrl ? 'Custom upload (embedded)' : product.image}
          </div>
          {imageIsDataUrl && (
            <button
              className="btn-remove"
              onClick={() => update({ image: '/assets/product-iso.png' })}
            >
              Remove
            </button>
          )}
        </div>
      </section>

      <section>
        <h4>Amazon barcode (bottom face)</h4>
        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={product.barcode.enabled}
              onChange={(e) => updateBarcode({ enabled: e.target.checked })}
            />
            Print barcode label on bottom panel
          </label>
        </div>
        <div className="field">
          <label>Barcode type</label>
          <select
            value={product.barcode.type}
            onChange={(e) => updateBarcode({ type: e.target.value as BarcodeType })}
            disabled={!product.barcode.enabled}
          >
            <option value="fnsku">FNSKU · Code 128 (Amazon FBA)</option>
            <option value="upc-a">UPC-A · 12 digits</option>
            <option value="ean-13">EAN-13 · 13 digits</option>
          </select>
        </div>
        <div className="field">
          <label>{dataHint.label}</label>
          <input
            type="text"
            value={product.barcode.data}
            placeholder={dataHint.placeholder}
            onChange={(e) => updateBarcode({ data: e.target.value })}
            disabled={!product.barcode.enabled}
          />
          {product.barcode.enabled && product.barcode.data && dataError && (
            <div style={{ fontSize: 10, color: '#ff4d6a', marginTop: 4 }}>{dataError}</div>
          )}
          {product.barcode.enabled && !product.barcode.data && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{dataHint.help}</div>
          )}
        </div>
        <div className="field">
          <label>Title on label (blank = product name)</label>
          <input
            type="text"
            value={product.barcode.title}
            placeholder={product.name}
            onChange={(e) => updateBarcode({ title: e.target.value })}
            disabled={!product.barcode.enabled}
          />
        </div>
        {product.barcode.type === 'fnsku' && (
          <div className="field">
            <label>Condition</label>
            <select
              value={product.barcode.condition}
              onChange={(e) => updateBarcode({ condition: e.target.value })}
              disabled={!product.barcode.enabled}
            >
              <option>New</option>
              <option>Used - Like New</option>
              <option>Used - Very Good</option>
              <option>Used - Good</option>
              <option>Used - Acceptable</option>
              <option>Refurbished</option>
            </select>
          </div>
        )}
      </section>

      <section>
        <h4>Connect steps</h4>
        <div className="steps">
          {product.connect.map((s, i) => (
            <div className="step" key={i}>
              <input
                type="text"
                value={s.n}
                onChange={(e) => updateStep(i, { n: e.target.value })}
                aria-label="Step number"
              />
              <div className="body">
                <input
                  type="text"
                  value={s.title}
                  onChange={(e) => updateStep(i, { title: e.target.value })}
                  aria-label="Step title"
                />
                <textarea
                  value={s.body}
                  onChange={(e) => updateStep(i, { body: e.target.value })}
                  aria-label="Step body"
                />
              </div>
              <button className="btn-remove" onClick={() => removeStep(i)}>Remove</button>
            </div>
          ))}
        </div>
        {product.connect.length < 4 && (
          <button className="add-step" onClick={addStep}>+ Add step (up to 4)</button>
        )}
        {product.connect.length >= 4 && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
            The bottom face renders up to 4 steps.
          </div>
        )}
      </section>
    </div>
  );
}

const BARCODE_HINTS: Record<BarcodeType, { label: string; placeholder: string; help: string }> = {
  fnsku: {
    label: 'FNSKU',
    placeholder: 'X001ABC123',
    help: 'Amazon FNSKU: 10 chars, starts with "X" followed by 9 alphanumerics.',
  },
  'upc-a': {
    label: 'UPC-A',
    placeholder: '012345678905',
    help: '12 digits. The 12th digit is a check digit.',
  },
  'ean-13': {
    label: 'EAN-13',
    placeholder: '0012345678905',
    help: '13 digits. The 13th digit is a check digit.',
  },
};

function validateBarcode(type: BarcodeType, data: string): string | null {
  const s = data.trim();
  if (!s) return null;
  if (type === 'fnsku') {
    if (!/^X[A-Z0-9]{9}$/i.test(s)) return 'FNSKU must be "X" + 9 letters/digits (10 chars).';
    return null;
  }
  if (type === 'upc-a') {
    if (!/^\d{12}$/.test(s)) return 'UPC-A must be exactly 12 digits.';
    return null;
  }
  if (type === 'ean-13') {
    if (!/^\d{13}$/.test(s)) return 'EAN-13 must be exactly 13 digits.';
    return null;
  }
  return null;
}
