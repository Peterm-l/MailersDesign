export type ConnectStep = {
  n: string;
  title: string;
  body: string;
};

export type BarcodeType = 'fnsku' | 'upc-a' | 'ean-13' | 'gs1-128' | 'gs1-datamatrix';

export type Barcode = {
  enabled: boolean;
  type: BarcodeType;
  data: string;
  title: string;
  condition: string;
};

export type QrPlacement = 'topSideL' | 'topSideR' | 'botShortL' | 'botShortR';

export type QrCode = {
  enabled: boolean;
  data: string;
  panels: Record<QrPlacement, boolean>;
};

export type SidePanelText = {
  topSideStart: string;
  topSideEnd: string;
};

export type Product = {
  key: string;
  name: string;
  sku: string;
  tagline: string;
  fcc: string;
  connect: ConnectStep[];
  image: string;
  showProductImage: boolean;
  barcode: Barcode;
  qrCode: QrCode;
  sidePanelText: SidePanelText;
};

const BARCODE_DEFAULT: Barcode = {
  enabled: false,
  type: 'gs1-128',
  data: '',
  title: '',
  condition: 'New',
};

const QR_DEFAULT: QrCode = {
  enabled: false,
  data: 'https://grayvolt.ai',
  panels: { topSideL: true, topSideR: true, botShortL: false, botShortR: false },
};

const SIDE_PANEL_TEXT_DEFAULT: SidePanelText = {
  topSideStart: 'STOP GUESSING · START MEASURING',
  topSideEnd: 'GRAYVOLT.AI',
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    key: 'analyzer',
    name: 'Vibration Analyzer',
    sku: 'GV-VA-01',
    tagline: 'REAL-TIME FFT SPECTRUM · NO LAPTOP REQUIRED',
    fcc: '',
    connect: [
      { n: '01', title: 'Mount',   body: 'Magnet sensor to machine housing near bearing.' },
      { n: '02', title: 'Power',   body: 'Plug USB-C. LED pulses amber.' },
      { n: '03', title: 'Pair',    body: 'Join "GV-XXXX" WiFi. Open GV-XXXX.local.' },
      { n: '04', title: 'Measure', body: 'Live FFT in-browser. No laptop needed.' },
    ],
    image: '/assets/product-iso.png',
    showProductImage: true,
    barcode: { ...BARCODE_DEFAULT },
    qrCode: { ...QR_DEFAULT, panels: { ...QR_DEFAULT.panels } },
    sidePanelText: { ...SIDE_PANEL_TEXT_DEFAULT },
  },
  {
    key: 'balancer',
    name: 'Spindle Balancer',
    sku: 'GV-SB-01',
    tagline: 'AUTO-BALANCING · UP TO 60,000 RPM',
    fcc: '',
    connect: [
      { n: '01', title: 'Mount',   body: 'Magnet to spindle housing. Apply tape to shaft.' },
      { n: '02', title: 'Power',   body: 'Plug USB-C. LED pulses amber.' },
      { n: '03', title: 'Pair',    body: 'Join "GV-XXXX" WiFi. Open GV-XXXX.local.' },
      { n: '04', title: 'Balance', body: 'Run auto-balance. < 5 min per plane.' },
    ],
    image: '/assets/product-iso-clear.png',
    showProductImage: true,
    barcode: { ...BARCODE_DEFAULT },
    qrCode: { ...QR_DEFAULT, panels: { ...QR_DEFAULT.panels } },
    sidePanelText: { ...SIDE_PANEL_TEXT_DEFAULT },
  },
];
