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
  position: number;
};

export type SidePanelText = {
  topSideStart: string;
  topSideEnd: string;
};

export type TextSlotId =
  | 'topFaceEyebrow'
  | 'topFaceBottomLeft'
  | 'topFaceBottomRight'
  | 'botFaceHeader'
  | 'botFaceTitle'
  | 'botFaceModelLabel'
  | 'botFaceFccLabel'
  | 'botFaceInputLabel'
  | 'botFaceInputValue'
  | 'botFaceOrigin'
  | 'botFaceCopyright'
  | 'topFrontPrefix'
  | 'longWallEyebrow'
  | 'longWallTaglinePart1'
  | 'longWallTaglinePart2'
  | 'longWallBrand'
  | 'topSideStart'
  | 'topSideEnd';

export type TextOverride = {
  text?: string;
  dx?: number;
  dy?: number;
};

export type TextOverrides = Partial<Record<TextSlotId, TextOverride>>;

export const TEXT_SLOT_DEFAULTS: Record<TextSlotId, string> = {
  topFaceEyebrow: 'INDUSTRIAL · EDGE · WIRELESS',
  topFaceBottomLeft: 'STOP GUESSING · START MEASURING',
  topFaceBottomRight: 'GRAYVOLT.AI',
  botFaceHeader: 'HOW TO CONNECT',
  botFaceTitle: 'Up and running in under 5 minutes.',
  botFaceModelLabel: 'MODEL',
  botFaceFccLabel: 'FCC ID CONTAINS',
  botFaceInputLabel: 'INPUT',
  botFaceInputValue: 'USB-C · 5V⎓500mA',
  botFaceOrigin: 'ASSEMBLED & DESIGNED IN USA',
  botFaceCopyright: 'GRAYVOLT.AI · © GRAYVOLT LLC',
  topFrontPrefix: 'MODEL',
  longWallEyebrow: 'INDUSTRIAL SENSORS',
  longWallTaglinePart1: 'Stop guessing.',
  longWallTaglinePart2: 'Start measuring.',
  longWallBrand: 'GRAYVOLT.AI',
  topSideStart: 'STOP GUESSING · START MEASURING',
  topSideEnd: 'GRAYVOLT.AI',
};

export const TEXT_SLOT_LABELS: Record<TextSlotId, string> = {
  topFaceEyebrow: 'Top face — eyebrow',
  topFaceBottomLeft: 'Top face — bottom left',
  topFaceBottomRight: 'Top face — bottom right',
  botFaceHeader: 'Bot face — header',
  botFaceTitle: 'Bot face — title',
  botFaceModelLabel: 'Bot face — MODEL label',
  botFaceFccLabel: 'Bot face — FCC ID label',
  botFaceInputLabel: 'Bot face — INPUT label',
  botFaceInputValue: 'Bot face — input value',
  botFaceOrigin: 'Bot face — origin',
  botFaceCopyright: 'Bot face — copyright',
  topFrontPrefix: 'Top front — prefix',
  longWallEyebrow: 'Long wall — eyebrow',
  longWallTaglinePart1: 'Long wall — tagline part 1',
  longWallTaglinePart2: 'Long wall — tagline part 2',
  longWallBrand: 'Long wall — brand URL',
  topSideStart: 'Top side wall — start text',
  topSideEnd: 'Top side wall — end text',
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
  textOverrides: TextOverrides;
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
  position: 50,
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
    tagline: 'real-time fft spectrum · no laptop required',
    fcc: '',
    connect: [
      { n: '01', title: 'Mount',   body: 'Magnet sensor to machine housing near bearing.' },
      { n: '02', title: 'Power',   body: 'Plug USB-C. LED pulses amber.' },
      { n: '03', title: 'Pair',    body: 'Join "GV-XXXX" WiFi. Open GV-XXXX.local.' },
      { n: '04', title: 'Measure', body: 'Live FFT in-browser. No laptop needed.' },
    ],
    image: '/assets/product-iso.png',
    showProductImage: true,
    barcode: { ...BARCODE_DEFAULT, type: 'upc-a', data: '199874443270' },
    qrCode: { ...QR_DEFAULT, panels: { ...QR_DEFAULT.panels } },
    sidePanelText: { ...SIDE_PANEL_TEXT_DEFAULT },
    textOverrides: {},
  },
  {
    key: 'balancer',
    name: 'Spindle Balancer',
    sku: 'GV-SB-01',
    tagline: 'auto-balancing · up to 60,000 rpm',
    fcc: '',
    connect: [
      { n: '01', title: 'Mount',   body: 'Magnet to spindle housing. Apply tape to shaft.' },
      { n: '02', title: 'Power',   body: 'Plug USB-C. LED pulses amber.' },
      { n: '03', title: 'Pair',    body: 'Join "GV-XXXX" WiFi. Open GV-XXXX.local.' },
      { n: '04', title: 'Balance', body: 'Run auto-balance. < 5 min per plane.' },
    ],
    image: '/assets/product-iso-clear.png',
    showProductImage: true,
    barcode: { ...BARCODE_DEFAULT, type: 'upc-a', data: '199874370590' },
    qrCode: { ...QR_DEFAULT, panels: { ...QR_DEFAULT.panels } },
    sidePanelText: { ...SIDE_PANEL_TEXT_DEFAULT },
    textOverrides: {},
  },
];
