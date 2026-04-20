export type ConnectStep = {
  n: string;
  title: string;
  body: string;
};

export type Product = {
  key: string;
  name: string;
  sku: string;
  tagline: string;
  fcc: string;
  connect: ConnectStep[];
  image: string;
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
  },
];
