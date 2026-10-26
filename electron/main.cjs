const { app, BrowserWindow, dialog, ipcMain, screen, session } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const execFileAsync = promisify(execFile);

const CONFIG_FILE = 'hero_grid_config.json';
const TARGET_SETTINGS = 'dota-install-target.json';

async function readSteamInstallPath() {
  if (process.platform !== 'win32') return null;
  for (const key of ['HKCU\\Software\\Valve\\Steam', 'HKLM\\Software\\WOW6432Node\\Valve\\Steam']) {
    try {
      const { stdout } = await execFileAsync('reg.exe', ['query', key, '/v', 'SteamPath'], { encoding: 'utf8', windowsHide: true, timeout: 2500 });
      const match = stdout.match(/SteamPath\s+REG_\w+\s+(.+)/i);
      if (match) return match[1].trim().replaceAll('/', path.sep);
    } catch { /* Steam may be installed elsewhere or unavailable. */ }
  }
  return null;
}

async function getSteamRoots() {
  const registeredPath = await readSteamInstallPath();
  const roots = [registeredPath,
    process.env['ProgramFiles(x86)'] && path.join(process.env['ProgramFiles(x86)'], 'Steam'),
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Steam'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Steam'),
    'C:\\Steam', 'D:\\Steam', 'E:\\Steam'
  ].filter(Boolean);
  return [...new Set(roots.map((root) => path.resolve(root)))];
}

async function getInstallTargets() {
  const roots = await getSteamRoots();
  const scans = await Promise.all(roots.map(async (steamRoot) => {
    const userData = path.join(steamRoot, 'userdata');
    try {
      const accounts = await fs.promises.readdir(userData, { withFileTypes: true });
      return (await Promise.all(accounts.filter((account) => account.isDirectory() && /^\d+$/.test(account.name)).map(async (account) => {
        const folder = path.join(userData, account.name, '570', 'remote', 'cfg');
        try {
          const stat = await fs.promises.stat(folder);
          if (!stat.isDirectory()) return null;
          let hasConfig = false;
          try { await fs.promises.access(path.join(folder, CONFIG_FILE)); hasConfig = true; } catch { /* No grid saved yet. */ }
          return { folder, accountId: account.name, hasConfig };
        } catch { return null; }
      }))).filter(Boolean);
    } catch { return []; }
  }));
  return scans.flat();
}

async function scanGridFolder(folder, accountId = null) {
  const configPath = path.join(folder, CONFIG_FILE);
  try {
    const config = JSON.parse(await fs.promises.readFile(configPath, 'utf8'));
    if (!config || !Array.isArray(config.configs)) return null;
    const categories = config.configs.flatMap((profile) => Array.isArray(profile.categories)
      ? profile.categories.filter((category) => category && typeof category === 'object') : []);
    const numeric = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
    const right = categories.map((category) => numeric(category.x_position) + numeric(category.width));
    const bottom = categories.map((category) => numeric(category.y_position) + numeric(category.height));
    return {
      folder, accountId, profileCount: config.configs.length,
      categoryCount: categories.length,
      heroCount: categories.reduce((sum, category) => sum + (Array.isArray(category.hero_ids) ? category.hero_ids.length : 0), 0),
      bounds: { x: Math.min(0, ...categories.map((category) => numeric(category.x_position))), y: Math.min(0, ...categories.map((category) => numeric(category.y_position))), width: Math.max(0, ...right), height: Math.max(0, ...bottom) },
      categories: categories.map((category) => ({ name: typeof category.category_name === 'string' ? category.category_name : 'Без названия', x: numeric(category.x_position), y: numeric(category.y_position), width: numeric(category.width), height: numeric(category.height), heroes: Array.isArray(category.hero_ids) ? category.hero_ids.length : 0 }))
    };
  } catch { return { folder, accountId, error: 'Не удалось прочитать файл сетки.' }; }
}

async function getAutomaticScan() {
  const [detected, saved] = await Promise.all([getInstallTargets(), Promise.resolve(getSavedTarget())]);
  const targets = [...detected];
  if (saved && !targets.some((target) => path.resolve(target.folder) === path.resolve(saved))) {
    const parts = saved.split(path.sep);
    const index = parts.findIndex((part) => part.toLowerCase() === 'userdata');
    let hasConfig = false;
    try { await fs.promises.access(path.join(saved, CONFIG_FILE)); hasConfig = true; } catch { /* No saved config yet. */ }
    targets.push({ folder: saved, accountId: index >= 0 ? parts[index + 1] : null, hasConfig });
  }
  const display = screen.getPrimaryDisplay();
  const scans = (await Promise.all(targets.filter((target) => target.hasConfig).map((target) => scanGridFolder(target.folder, target.accountId)))).filter(Boolean);
  return { saved, detected, scans, monitor: { width: display.size.width, height: display.size.height, scaleFactor: display.scaleFactor, workAreaWidth: display.workAreaSize.width, workAreaHeight: display.workAreaSize.height } };
}
function resolveChosenFolder(folder) {
  if (typeof folder !== 'string' || !folder.trim()) throw new Error('Выберите папку Dota 2.');
  const selected = path.resolve(folder);
  const parts = selected.split(path.sep).filter(Boolean);
  const lowerParts = parts.map((part) => part.toLowerCase());
  const accountIndex = lowerParts.lastIndexOf('userdata');
  if (accountIndex < 0 || !/^\d+$/.test(parts[accountIndex + 1] || '')) {
    throw new Error('Выберите папку аккаунта Steam в userdata или папку cfg внутри 570\\remote.');
  }

  const accountRoot = path.join(...parts.slice(0, accountIndex + 2));
  const suffix = lowerParts.slice(accountIndex + 2).join(path.sep);
  if (suffix === ['570', 'remote', 'cfg'].join(path.sep)) return selected;
  if (suffix === ['570', 'remote'].join(path.sep)) return path.join(selected, 'cfg');
  if (suffix === '570') return path.join(selected, 'remote', 'cfg');
  if (!suffix) return path.join(accountRoot, '570', 'remote', 'cfg');
  throw new Error('Папка должна быть userdata\\<ID> или частью пути 570\\remote\\cfg.');
}

function getSavedTarget() {
  try {
    const settings = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), TARGET_SETTINGS), 'utf8'));
    const folder = resolveChosenFolder(settings.folder);
    if (fs.existsSync(folder)) return folder;
  } catch {
    // Fall back to automatic discovery when the saved location is no longer available.
  }
  return null;
}

function saveTarget(folder) {
  fs.mkdirSync(app.getPath('userData'), { recursive: true });
  fs.writeFileSync(path.join(app.getPath('userData'), TARGET_SETTINGS), JSON.stringify({ folder }, null, 2), 'utf8');
}

function validateConfig(jsonText) {
  let config;
  try {
    config = JSON.parse(jsonText);
  } catch {
    throw new Error('Сетка не является корректным JSON-файлом.');
  }
  if (!config || config.version !== 3 || !Array.isArray(config.configs) || config.configs.some((entry) => !entry || typeof entry.config_name !== 'string' || !Array.isArray(entry.categories))) {
    throw new Error('Формат файла не похож на конфигурацию сетки Dota 2.');
  }
  return config;
}
function createWindow() {
  const window = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 960,
    minHeight: 640,
    title: 'Dota Grid Studio',
    backgroundColor: '#171a21',
    frame: false,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.once('ready-to-show', () => window.show());
  const sendWindowState = () => window.webContents.send('desktop:window-state', window.isMaximized());
  window.on('maximize', sendWindowState);
  window.on('unmaximize', sendWindowState);
  window.webContents.once('did-finish-load', sendWindowState);

  if (app.isPackaged) {
    window.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    window.loadURL(process.env.DOTA_GRID_DEV_URL || 'http://127.0.0.1:3001');
  }
}

ipcMain.handle('desktop:window-control', (event, action) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) return false;
  if (action === 'minimize') window.minimize();
  else if (action === 'toggle-maximize') window.isMaximized() ? window.unmaximize() : window.maximize();
  else if (action === 'close') window.close();
  return window.isMaximized();
});
ipcMain.handle('dota:get-targets', async () => getAutomaticScan());
ipcMain.handle('dota:choose-target', async () => {
  const defaultPath = getSavedTarget() || getSteamRoots().find((root) => fs.existsSync(path.join(root, 'userdata')));
  const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    title: 'Выберите папку аккаунта Steam или cfg Dota 2',
    defaultPath,
    properties: ['openDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const folder = resolveChosenFolder(result.filePaths[0]);
  saveTarget(folder);
  return folder;
});
ipcMain.handle('dota:install-config', async (_event, folder, jsonText) => {
  const targetFolder = resolveChosenFolder(folder);
  const incoming = validateConfig(jsonText);
  fs.mkdirSync(targetFolder, { recursive: true });
  const targetPath = path.join(targetFolder, CONFIG_FILE);
  let outputText = JSON.stringify(incoming, null, 2);
  let backupPath = null;
  if (fs.existsSync(targetPath)) {
    try {
      const current = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      if (current?.version === 3 && Array.isArray(current.configs)) {
        const incomingNames = new Set(incoming.configs.map((entry) => entry.config_name));
        outputText = JSON.stringify({
          ...current,
          configs: [...current.configs.filter((entry) => !incomingNames.has(entry.config_name)), ...incoming.configs]
        }, null, 2);
      }
    } catch {
      // The previous file is backed up below; install the new valid grid if its contents cannot be read.
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    backupPath = path.join(targetFolder, `hero_grid_config.backup-${timestamp}.json`);
    fs.copyFileSync(targetPath, backupPath, fs.constants.COPYFILE_EXCL);
  }

  const tempPath = path.join(targetFolder, `.hero_grid_config-${process.pid}-${Date.now()}.tmp`);
  try {
    fs.writeFileSync(tempPath, outputText, { encoding: 'utf8', flag: 'wx' });
    fs.renameSync(tempPath, targetPath);
  } catch (error) {
    try { fs.rmSync(tempPath, { force: true }); } catch { /* Keep the original error. */ }
    throw error;
  }

  saveTarget(targetFolder);
  return { path: targetPath, backupPath };
});
app.whenReady().then(() => {
  const openMainWindow = () => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  };

  // Packaged builds load local files, so skip proxy setup entirely. In dev, set the localhost bypass before Vite loads.
  if (app.isPackaged) {
    openMainWindow();
  } else {
    session.defaultSession.setProxy({ proxyBypassRules: 'localhost;127.0.0.1;<local>' }).then(openMainWindow, openMainWindow);
  }
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});






