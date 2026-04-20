import { useRef, useState } from 'react';
import type { Product, ConnectStep } from './products';
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
