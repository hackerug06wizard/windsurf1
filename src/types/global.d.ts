declare global {
  interface Window {
    fbq: (command: string, eventName: string, parameters?: object) => void;
    gtag: (command: string, targetId: string, parameters?: object) => void;
  }
}

export {};
