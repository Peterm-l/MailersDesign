async function inlineImagesInSvg(svgEl: SVGSVGElement) {
  const imgs = svgEl.querySelectorAll('image');
  await Promise.all(
    Array.from(imgs).map(async (img) => {
      const href = img.getAttribute('href') || img.getAttribute('xlink:href');
      if (!href || href.startsWith('data:')) return;
      try {
        const resp = await fetch(href);
        const blob = await resp.blob();
        const dataUrl = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(blob);
        });
        img.setAttribute('href', dataUrl);
        img.removeAttribute('xlink:href');
      } catch (e) {
        console.warn('inline failed', href, e);
      }
    }),
  );
}

export async function rasterizeSvgToPng(
  svgEl: SVGSVGElement,
  filename: string,
  dpi = 300,
  backgroundColor?: string,
) {
  const vb = svgEl.viewBox.baseVal;
  const w = vb.width || svgEl.width.baseVal.value;
  const h = vb.height || svgEl.height.baseVal.value;
  const scale = dpi / 100;

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(w));
  clone.setAttribute('height', String(h));
  await inlineImagesInSvg(clone);

  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = rej;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d')!;
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    const pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!pngBlob) throw new Error('toBlob returned null');
    const a = document.createElement('a');
    a.download = filename;
    a.href = URL.createObjectURL(pngBlob);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
