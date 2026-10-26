const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dotaDesktop', {
  controlWindow: (action) => ipcRenderer.invoke('desktop:window-control', action),
  onWindowState: (callback) => {
    const listener = (_event, maximized) => callback(maximized);
    ipcRenderer.on('desktop:window-state', listener);
    return () => ipcRenderer.removeListener('desktop:window-state', listener);
  },
  getTargets: () => ipcRenderer.invoke('dota:get-targets'),
  chooseTarget: () => ipcRenderer.invoke('dota:choose-target'),
  installConfig: (folder, jsonText) => ipcRenderer.invoke('dota:install-config', folder, jsonText)
});

