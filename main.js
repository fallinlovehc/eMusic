const electron = require('electron');
const express = require('express');
const http = require('http');
const url = express();
const {globalShortcut} = electron;

const {app} = electron;

const {BrowserWindow} = electron;

const {ipcMain} = electron;

const {dialog} = electron;

let win;

function init(){
	win = new BrowserWindow({
        frame: false,
        height: 690,
        resizable: false,
        width: 690,
	});
	win.loadURL('file://' + __dirname + '/app/music.html');

	// win.webContents.openDevTools();
	win.on('close',function(){
		win = null;
	});

    globalShortcut.register('Ctrl+Shift+C', function () {
        win.webContents.send('global-shortcut',0);
    });
    globalShortcut.register('Ctrl+Shift+A', function () {
        win.webContents.send('global-shortcut',1);
    });
    globalShortcut.register('Ctrl+Shift+D', function () {
        win.webContents.send('global-shortcut',2);
    });
    globalShortcut.register('Ctrl+Shift+W', function () {
        win.webContents.send('global-shortcut',3);
    });
    globalShortcut.register('Ctrl+Shift+S', function () {
        win.webContents.send('global-shortcut',4);
    });
    globalShortcut.register('Ctrl+Shift+I', function () {
        win.webContents.toggleDevTools();
    });
}


app.on('ready',init);

app.on('window-all-closed',function(){
	if(process.platform != 'darwin'){
		app.quit();
	}
});

app.on('active',function(){
	if(win == null){
		init();
	}
});

ipcMain.on('close-main-window',function(event,arg){
	app.quit();
});

const port = process.env.PORT || 4000

url.listen(port, () => {
  console.log(`server running @${port}`)
})


module.exports = url;

   