import { useRef, useState } from 'react';
import type { Product, ConnectStep, BarcodeType, Barcode, QrPlacement } from './products';
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
        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={product.showProductImage !== false}
              onChange={(e) => update({ showProductImage: e.target.checked })}
            />
            Show product image on top lid
          </label>
        </div>
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
        <h4>Side-panel text (top side walls)</h4>
        <div className="field">
          <label>Start text (near hinge)</label>
          <input
            type="text"
            value={product.sidePanelText?.topSideStart ?? ''}
            onChange={(e) =>
              update({ sidePanelText: { ...product.sidePanelText, topSideStart: e.target.value } })
            }
          />
        </div>
        <div className="field">
          <label>End text (near tuck flap)</label>
          <input
            type="text"
            value={product.sidePanelText?.topSideEnd ?? ''}
            onChange={(e) =>
              update({ sidePanelText: { ...product.sidePanelText, topSideEnd: e.target.value } })
            }
          />
        </div>
      </section>

      <section>
        <h4>QR code (side panels)</h4>
        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={product.qrCode?.enabled ?? false}
              onChange={(e) =>
                update({ qrCode: { ...product.qrCode, enabled: e.target.checked } })
              }
            />
            Print QR code on selected panels
          </label>
        </div>
        <div className="field">
          <label>URL or text to encode</label>
          <input
            type="text"
            value={product.qrCode?.data ?? ''}
            placeholder="https://grayvolt.ai/setup"
            onChange={(e) => update({ qrCode: { ...product.qrCode, data: e.target.value } })}
            disabled={!product.qrCode?.enabled}
          />
        </div>
        <div className="field">
          <label>
            Position along panel <span style={{ color: 'var(--accent)' }}>{product.qrCode?.position ?? 50}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={product.qrCode?.position ?? 50}
            disabled={!product.qrCode?.enabled}
            onChange={(e) =>
              update({ qrCode: { ...product.qrCode, position: Number(e.target.value) } })
            }
            style={{ width: '100%' }}
          />
        </div>
        <div className="field">
          <label>Placement</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {(
              [
                ['topSideL', 'Top side — left'],
                ['topSideR', 'Top side — right'],
                ['botShortL', 'Bottom short — left'],
                ['botShortR', 'Bottom short — right'],
              ] as Array<[QrPlacement, string]>
            ).map(([key, label]) => (
              <label
                key={key}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, textTransform: 'none', letterSpacing: 0, color: 'var(--text-dim)' }}
              >
                <input
                  type="checkbox"
                  checked={product.qrCode?.panels?.[key] ?? false}
                  disabled={!product.qrCode?.enabled}
                  onChange={(e) =>
                    update({
                      qrCode: {
                        ...product.qrCode,
                        panels: { ...product.qrCode.panels, [key]: e.target.checked },
                      },
                    })
                  }
                />
                {label}
              </label>
            ))}
          </div>
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
            <option value="fnsku">FNSKU · Code 128 (Amazon FBA unit label)</option>
            <option value="ean-13">GTIN-13 / EAN-13 · GS1 retail (Amazon listing)</option>
            <option value="upc-a">UPC-A · GS1 retail (US)</option>
            <option value="gs1-128">GS1-128 · shipping/logistics</option>
            <option value="gs1-datamatrix">GS1 DataMatrix · Amazon Transparency</option>
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
    label: 'GTIN-13 / EAN-13',
    placeholder: '0012345678905',
    help: '13 digits (GS1-issued). The 13th digit is a check digit.',
  },
  'gs1-128': {
    label: 'GS1-128 element string',
    placeholder: '(01)00012345678905(17)260101',
    help: 'GS1 application identifiers in parens, e.g. (01) GTIN, (17) expiry YYMMDD, (10) lot.',
  },
  'gs1-datamatrix': {
    label: 'GS1 DataMatrix element string',
    placeholder: '(01)00012345678905(21)SN123456',
    help: 'GS1 application identifiers in parens, e.g. (01) GTIN, (21) serial.',
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
    if (!/^\d{13}$/.test(s)) return 'GTIN-13 / EAN-13 must be exactly 13 digits.';
    return null;
  }
  if (type === 'gs1-128' || type === 'gs1-datamatrix') {
    if (!/^\(\d{2,4}\)/.test(s)) return 'Must start with a GS1 AI in parens, e.g. (01)...';
    return null;
  }
  return null;
}
