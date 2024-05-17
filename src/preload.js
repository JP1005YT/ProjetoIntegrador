// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');
// const sqlite = require('sqlite3').verbose();

// console.log(Aprende)

var API = {
    create : (jsonObj) => {
        ipcRenderer.send('sqliteApi','create',jsonObj)
    },
    read : () => {
        ipcRenderer.send('sqliteApi','read')
    },
    update : (id,jsonObj) => {
        ipcRenderer.send('sqliteApi','update',id,jsonObj)
    },
    delete : (id)=>{
        ipcRenderer.send('sqliteApi','delete',id)
    }
}

ipcRenderer.on('read-response', (event, response) => {
    console.log(response)
});

contextBridge.exposeInMainWorld('preloadObject', API);