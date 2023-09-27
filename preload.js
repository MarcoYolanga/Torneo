const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('localAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  choseSaveAs: (defaultPath) => ipcRenderer.invoke('dialog:saveAs', defaultPath),
  saveFile: (path, content) => ipcRenderer.invoke('dialog:saveFile', path, content),
})