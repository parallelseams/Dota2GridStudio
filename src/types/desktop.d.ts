export interface DotaInstallTarget {
  folder: string;
  accountId: string;
  hasConfig: boolean;
}

export interface DotaInstallResult {
  path: string;
  backupPath: string | null;
}

export interface DotaGridScan {
  folder: string;
  accountId: string | null;
  profileCount?: number;
  categoryCount?: number;
  heroCount?: number;
  bounds?: { x: number; y: number; width: number; height: number };
  categories?: Array<{ name: string; x: number; y: number; width: number; height: number; heroes: number }>;
  error?: string;
}

export interface DotaMonitorInfo {
  width: number;
  height: number;
  scaleFactor: number;
  workAreaWidth: number;
  workAreaHeight: number;
}
declare global {
  interface Window {
    dotaDesktop?: {
      controlWindow: (action: 'minimize' | 'toggle-maximize' | 'close') => Promise<boolean>;
      onWindowState: (callback: (maximized: boolean) => void) => () => void;
      controlWindow: (action: 'minimize' | 'toggle-maximize' | 'close') => Promise<boolean>;
      onWindowState: (callback: (maximized: boolean) => void) => () => void;
      getTargets: () => Promise<{ saved: string | null; detected: DotaInstallTarget[]; scans: DotaGridScan[]; monitor: DotaMonitorInfo }>;
      chooseTarget: () => Promise<string | null>;
      installConfig: (folder: string, jsonText: string) => Promise<DotaInstallResult>;
    };
  }
}

export {};


