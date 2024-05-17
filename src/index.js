const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('node:path');
const sqltManager = require('./modules/sqliteManager');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on("sqliteApi",(event,method,args) => {
  switch (method) {
    case 'create':
      if(typeof(args.name) === undefined || typeof(args.blob) === undefined || typeof(args.tags) === undefined){
        event.reply('read-response',{err : "Invalid Value"})
      }else{
        sqltManager.insertItem(args.name, args.blob, args.tags, (err, lastID) => {
          if (err) {
            event.reply('create-response',{err : err})
          } 
          else {
            event.reply('create-response',{data : lastID})
          }
        })
         console.log(args)
      }
    break;
    case 'read':
      sqltManager.getItems((err, rows) => {
        if (err) {
            event.reply('read-response',{err : err.message})
        } else {
            event.reply('read-response',{data : rows});
        }
      })
    break;
    case 'update':
      
    break;
    case 'delete':
      sqltManager.deleteItem(args.id,(err,message) => {
        if(err){
          event.reply('delete-response',{err : err.message})
        } else{
          event.reply('delete-response',{msg : message})
        }
      })
    break;
    default:
      return {error : "method don't exists"}
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
