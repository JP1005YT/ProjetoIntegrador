// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');
// const sqlite = require('sqlite3').verbose();

// console.log(Aprende)

var API = {
    create : (name,blob,tags,tipo) => {
        const jsonObj = {
            name : name,
            blob : blob,
            tags : tags,
            tipo : tipo,
        }
        return new Promise((resolve,reject) => {
            ipcRenderer.once('create-response',(event,response) => {
                resolve(response)
            })
            ipcRenderer.send('sqliteApi','create',jsonObj)
        })
    },
    read : () => {
        return new Promise((resolve,reject) => {
            ipcRenderer.once('read-response',(event,response) => {
                resolve(response)
            })
            ipcRenderer.send('sqliteApi','read')
        })
    },
    update : (id,obj) => {
        const jsonObject = {
            id : id,
            objeto : obj,
        }
        return new Promise((resolve,reject) => {
            ipcRenderer.once('update-response',(event,response) => {
                resolve(response)
            })
            ipcRenderer.send('sqliteApi','update',jsonObject)
        })
    },
    delete : (id)=>{
        const jsonObj = {
            id : id
        }
        return new Promise((resolve,reject) => {
            ipcRenderer.once('delete-response',(event,response) => {
                resolve(response)
            })
            ipcRenderer.send('sqliteApi','delete',jsonObj)
        })
    }
}

contextBridge.exposeInMainWorld('preloadObject', API);