const { app, BrowserWindow, ipcMain, dialog, } = require('electron')
const path = require('path')
const fs = require('fs');

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Seleziona il glb non compresso',
      filters: [
        {
          name: "json",
          extensions: ["json"]
        },
        {
          name: "Tutto",
          extensions: ["*"]
        }
      ]
    });
    if (!canceled) {
      const filePath = filePaths[0];
      const fileStat = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        filePath: filePath,
        fileSize: fileStat.size,
        fileContent: content
      }
    }
  }
  
  async function handleSaveAs(event, defaultPath) {

    //console.log('handleSaveAs', defaultPath);
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Scegli dove salvare il glb compresso',
      defaultPath: defaultPath,
      filters: [
        {
          name: "json",
          extensions: ["json"]
        },
        {
          name: "Tutto",
          extensions: ["*"]
        }
      ]
    });
    if (!canceled) {
      return {
        filePath: filePath
      }
    }
  }

  async function handleSaveFile(event, path, content) {
    fs.writeFileSync(path, content);
  }
  


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      })
  
    win.loadFile('renderer/index.html')
    mainWindow = win;
  }

  app.whenReady().then(() => {

    ipcMain.handle('dialog:openFile', handleFileOpen);
    ipcMain.handle('dialog:saveAs', handleSaveAs);
    ipcMain.handle('dialog:saveFile', handleSaveFile);


    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

