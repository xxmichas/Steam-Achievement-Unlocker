const electron = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
//require('electron-reload')(__dirname)


let win
let steamwin
let steamidwin

app.allowRendererProcessReuse = false

function CreateWindow() {
    win = new BrowserWindow({width: 1200, height: 750, webPreferences: {
        nodeIntegration: true
    }})
    win.loadURL(url.format({
        pathname:path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    win.on('closed', () => {
        win = null
    })

    win.setMenuBarVisibility(false)

    win.webContents.openDevTools()
}

function SteamWindow() {
    steamwin = new BrowserWindow({width: 800, height: 550, webPreferences: {
        nodeIntegration: true
    }})
    steamwin.loadURL(url.format({
        pathname:path.join(__dirname, 'app.html'),
        protocol: 'file',
        slashes: true
    }))

    steamwin.on('closed', () => {
        steamwin = null
    })

    steamwin.setMenuBarVisibility(false)

    //steamwin.webContents.openDevTools()
}

function SteamIDWindow() {
    steamidwin = new BrowserWindow({width: 500, height: 325, webPreferences: {
        nodeIntegration: true
    }})
    steamidwin.loadURL(url.format({
        pathname:path.join(__dirname, 'SteamID.html'),
        protocol: 'file',
        slashes: true
    }))

    steamidwin.on('closed', () => {
        steamidwin = null
    })

    steamidwin.setMenuBarVisibility(false)
}

ipc.on('get-steamid', SteamIDWindow)

ipc.on('start-steam', SteamWindow)
ipc.on('steamid-close', () => {steamidwin.close()})

app.on('ready', CreateWindow)

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    if(win == null) {
        CreateWindow()
    }
})