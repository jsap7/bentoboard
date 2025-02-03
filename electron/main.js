import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 360,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'dark',
    visualEffectState: 'active',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // Load the index.html from a url in development
  // or the local file in production.
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // Open the DevTools in development.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 