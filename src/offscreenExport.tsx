import { createRoot } from 'react-dom/client';
import { Dieline, type AccentStyle } from './Dieline';
import type { Product } from './products';
import { rasterizeSvgToPng } from './export';

export function exportPanel(opts: {
  panelKey: string;
  product: Product;
  accentStyle: AccentStyle;
  productImage: string;
  bgColor: string;
  filename: string;
}) {
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-9999px';
  host.style.top = '0';
  document.body.appendChild(host);

  const root = createRoot(host);
  root.render(
    <Dieline
      panelId={opts.panelKey}
      product={opts.product}
      accentStyle={opts.accentStyle}
      productImage={opts.productImage}
      bgColor={opts.bgColor}
    />,
  );

  setTimeout(async () => {
    const svg = host.querySelector('svg');
    if (svg) {
      await rasterizeSvgToPng(svg as SVGSVGElement, opts.filename, 300);
    }
    setTimeout(() => {
      root.unmount();
      host.remove();
    }, 500);
  }, 300);
}
