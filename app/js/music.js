'use strict';

const electron = require('electron');
const express = require('express');
const {ipcRenderer} = electron;
const http = require('http');
const url = express();
const topList = require("../router/top_list");
const { createWebAPIRequest } = require("../util/util")

var bg = document.querySelector('.music'),
	top_bar = document.querySelector('.top_bar'),
	top_bar_info = document.getElementById('top_bar_info'),
	top_list = top_bar_info.getElementsByTagName('li'),
	time = document.querySelector('.time'),
	timeBar = document.querySelector('.timeBar'),
	timeBarNow = document.querySelector('.timeBarNow'),
	timeFlag = document.querySelector('.timeFlag'),
	pause = document.querySelector('.pause'),
	play = document.querySelector('.play'),
	volumeBar = document.querySelector('.voice'),
	volumeBarNow = document.querySelector('.volumeBarNow'),
	volumeCircle = document.querySelector('.volumeCircle'),
	next = document.querySelector('.next'),
	prev = document.querySelector('.prev'),
	songName = document.querySelector('.songName'),
	author = document.querySelector('.author'),
	lyricList = document.getElementById('lyricList'),
	lyricListLi = lyricList.getElementsByTagName('li'),
	minAllTime = document.querySelector('.minAllTime'),
	minCurrentTime = document.querySelector('.minCurrentTime'),
	secCurrentTime = document.querySelector('.secCurrentTime'),
	secAllTime = document.querySelector('.secAllTime'),

	operAll = document.querySelector('.operAll'),
	operOptions = document.getElementById("operOptions"),
	operOptionsLi = operOptions.children,
	operContent = document.getElementById("operContent"),
	operContentLi = operContent.children,
	operReturn = document.querySelectorAll('.return'),
	operPlay = document.querySelector('.allPlay'),
	searchSure = document.querySelector('.searchSure'),
	resultList = document.getElementById('resultList'),
	resultListLi = resultList.getElementsByTagName('li'),
	closeBtn = document.querySelector('.closeBtn');

var music = document.createElement('audio'),
	eLyric,
	eLyricIndex = 0,
	eLyricTotal,
	storage = window.localStorage,
	index = storage.getItem('index')||0,
	topIndex = storage.getItem('topIndex')||0,
	totalIndex,
	curTime,
	pauseMin,
	pauseSec,
	pauseDuration,
	duration,
	data,
	searchSongs,
	searchFlag = 0,
	toggleFlag = 1;

for(var key in topList){
	var str = '<li data="'+topList[key][1]+'"><img src="./resources/img/top_list/'+topList[key][2]+'"><span>'+topList[key][0]+'</span></li>'
	top_bar_info.innerHTML+=str;
}

// document.querySelector('.volumeCircle').onclick = null;


music.volume = 0.2;


initData(topIndex);
init();

ipcRenderer.on('global-shortcut', function (event,argv) {
	if(argv == 0){
		if(music.paused){
			playSong();
		}
		else{
			pauseSong();
		}
	}else if(argv == 1){
		toggleFlag = 0;
		toggleSong(1);
	}else if(argv == 2){
		toggleFlag = 1;
		toggleSong();
	}else if(argv == 3){
		if(music.volume<0.99){
			music.volume += 0.1;
			var moveLeft = music.volume * 100;
			if(music.volume >= 0.99){
				music.volume == 1;
				volumeBarNow.style.width = '100%';
				volumeCircle.style.left = '95%';
			}else{
				volumeCircle.style.left = moveLeft  + '%'
				volumeBarNow.style.width = moveLeft + 5 + '%'
			}
		}
	}else if(argv == 4){
		if(music.volume>0.1){
			music.volume -= 0.1;
			var moveLeft = music.volume * 100;
			if(music.volume <= 0.1){
				music.volume == 0;
				volumeBarNow.style.width = '0%';
				volumeCircle.style.left = '-5%';
			}else{
				volumeCircle.style.left = moveLeft  + '%'
				volumeBarNow.style.width = moveLeft  + '%'
			}
		}

	}else{

	}

});

closeBtn.addEventListener('click',function(){
	ipcRenderer.send('close-main-window');
});
music.addEventListener('error',errorSong);

function errorSong(){
	pauseSong();
	lyricList.innerHTML = '';
	lyricList.innerHTML = '暂无该资源，无法播放歌曲！';
	music.removeEventListener('error',errorSong);
	setTimeout(function(){
		if(toggleFlag == 1){
			toggleSong();	
		}else if(toggleFlag == 0){
			toggleSong(1);
		}else{
			toggleSong(1,index+1);		
		}
		music.addEventListener('error',errorSong);
	},3000);
}

searchSure.addEventListener('click',function(){
	var val = document.getElementById('keywords').value;
	if(val != ''){
		SearchData(val);
	}
});

document.onkeydown = function (e) {  
    if (!e) e = window.event;  
    if ((e.keyCode || e.which) == 13) {  
        searchSure.click();  
    }  
}  

music.addEventListener('timeupdate',function(){
	if(eLyric){
		if(eLyricIndex<=eLyricTotal-1){
		    if(music.currentTime >= eLyric[eLyricIndex][0]) {
		    	// lyricList.style.transition = 'top .45s ease-in-out';
		    	if(eLyricIndex>=3){
					lyricList.style.top = -(25*(eLyricIndex-3)) + 'px';
		    	}
				if(lyricListLi.length>2){
					lyricListLi[eLyricIndex + 1].setAttribute('class','');
					lyricListLi[eLyricIndex + 2].setAttribute('class','whiteLi');
				}
				eLyricIndex ++;
	 	    }
	 	 //    else{
	 	 //    	eLyricIndex --;
	 	 //    	// lyricList.style.transition = 'none';
				// lyricList.style.top = -(20*(eLyricIndex+1)) + 'px';
				// if(lyricListLi){
				// 	lyricListLi[eLyricIndex + 3].setAttribute('class','');
				// 	lyricListLi[eLyricIndex + 2].setAttribute('class','whiteLi');
				// }
	 	 //    }
		}else{
			// eLyricIndex = eLyricTotal - 1;
			// if(music.currentTime < eLyric[eLyricIndex][0]){
			// 	eLyricIndex --;
			// }else{
			// 	console.log('ending~');
			// }
			console.log('ending~');
		}
	}

});

next.addEventListener('click',function(){
	toggleFlag = 1;
	toggleSong();
});
prev.addEventListener('click',function(){
	toggleFlag = 0;
	toggleSong(1);
});

pause.addEventListener('click',function(){
	pauseSong();
});

play.addEventListener('click',function(){
	playSong(1);
});

operPlay.addEventListener('click',function(){
	searchFlag = 1;
	index = 0;
	totalIndex = searchSongs.length - 1;
	duration = searchSongs[index].duration / 1000;
	songInfo(index,searchSongs);
	curTimeFunction();
	music.play();
});


timeBar.addEventListener('click',function(event){
	var target = event.target.className;
	if(target == 'timeBar' ||target == 'timeBarNow'){
		var leftBar = event.offsetX - 5;
		leftBar = leftBar / window.innerWidth * 100;
		timeBarNow.style.width = leftBar  + '%';
		timeFlag.style.left = leftBar  + '%';

		var time = leftBar * duration / 100;
		toggleCurrentTime(time);
	}
});

volumeBar.addEventListener('click',function(event){
	var target = event.target.className;
	if(target == 'voice' ||target == 'volumeBarNow'){
		var leftBar = event.offsetX / 200.00;
		volumeBarNow.style.width = leftBar*100 + '%';
		volumeCircle.style.left = leftBar*100 - 5 + '%';
		music.volume = leftBar;
	}else if(target == 'minVoice'){
		volumeBarNow.style.width = '0%';
		volumeCircle.style.left = '-5%';
		music.volume = 0;
	}else if(target == 'maxVoice'){
		volumeBarNow.style.width = '100%';
		volumeCircle.style.left = '95%';
		music.volume = 1;
	}
});


timeFlag.addEventListener('mousedown',function(event){
 	downX= event.clientX;
 	left = event.target.offsetLeft;
	document.addEventListener('mousemove',moveTimeBar,false);
});


volumeCircle.addEventListener('mousedown',function(event){
 	downX= event.clientX;
 	left = event.target.offsetLeft;
	document.addEventListener('mousemove',moveVoiceBar,false);
});

document.addEventListener('mouseup',function(event){
	document.removeEventListener('mousemove',moveVoiceBar,false);
	document.removeEventListener('mousemove',moveTimeBar,false);
});


function initData(i){
	const action = 'http://music.163.com' + topList[i][1];
	console.log(action);
	createRequest(`${action}`, 'GET', null)
	.then(function(result){
		// res.setHeader("Content-Type", "application/json")
		data = JSON.parse(result).result.tracks;
		totalIndex = data.length - 1;
		var id = data[index].id
		getLyric(id);
		setTimeout(function(){
			duration = data[index].duration / 1000;
			songInfo(index,data);
			curTimeFunction();
			// music.play();
		},1000);
	
	});
}

function SearchData(val){
    const keywords = val;
    const type = 1;
    const limit = 30;
    const offset = 0;

    const searchData = 's=' + keywords + '&limit=' + limit + '&type=' + type + '&offset=' + offset;
	const action = 'http://music.163.com/api/search/pc/';
	createRequest(`${action}`, 'POST', searchData)
	.then(function(result){
		// res.setHeader("Content-Type", "application/json")
		searchSongs = JSON.parse(result).result.songs;
		// index = 0;
		// totalIndex = data.length - 1;
		// var id = data[index].id
		// getLyric(id);
		resultList.innerHTML = '';
		for(var key in searchSongs){
			var str = '<li><div>'+searchSongs[key].name+'</div><div>'+searchSongs[key].artists[0].name+'</div></li>'
			resultList.innerHTML+=str;
		}

	    for(let i = 0, len = resultListLi.length; i < len; i++){  
	        resultListLi[i].onclick = function(){
	        	toggleFlag = 2;
				duration = searchSongs[i].duration / 1000;
				songInfo(i,searchSongs);
				curTimeFunction();
				playSong();
	        }
	    }

		// setTimeout(function(){
		// 	duration = data[index].duration / 1000;
		// 	songInfo(index,data);
		// 	curTimeFunction();
		// 	music.volume = 0.2;
		// 	playSong();
		// },1000);
	
	});
}

function init(){ 'use strict'
    for(let i = 0, len = top_list.length; i < len; i++){  
        top_list[i].onclick = function(){
			setArgv(0,i);
        	initData(i);
        }
    }

    for(let i = 0, len = operOptionsLi.length; i < len; i++){  
        operOptionsLi[i].onclick = function(e){
			operAll.style.left = '-40px';
			setTimeout(function(){
				operOptions.style.display = 'none';
				operContent.style.display = 'block';
				for(let j = 0, lenJ = operContentLi.length;j < lenJ; j++){
					operContentLi[j].style.display = 'none';
				}		
				operContentLi[i].style.display = 'block';
				operAll.style.left = '200px';
			},300);
        }
    }

    for(let i = 0, len = operReturn.length; i < len; i++){  
        operReturn[i].onclick = function(){
			operAll.style.left = '-200px';
			setTimeout(function(){
				operOptions.style.display = 'block';
				operContent.style.display = 'none';
				operAll.style.left = '0px';
			},300);
        }
    }

}

function pauseSong(){
	clearInterval(curTime);
    music.pause(); 
    play.style.display = 'inline-block'; 
    pause.style.display = 'none';
    pauseMin = parseInt(minCurrentTime.innerHTML);
    pauseSec = parseInt(secCurrentTime.innerHTML);
}

function playSong(flag){
	var method = flag || 0;
    music.play(); 
    play.style.display = 'none'; 
    pause.style.display = 'inline-block';
    curTimeFunction(method);
}


function setArgv(argv1,argv2,flag){
	if(searchFlag == 1){
		if(flag == 0){
			argv2 -= 1;
		}
		if(flag == 1){
			argv2 += 1;
		}
	}
	storage.setItem("index",argv1);
	storage.setItem("topIndex",argv2);
	topIndex = argv2;
	index = argv1;
	searchFlag = 0;
}
function toggleSong(flag,nowIndex){
	index = nowIndex || index;
	var method = flag || 0;
	if(method != 1){
		if(index < totalIndex){
			++index;
		}else{
			var nextIndex = parseInt(topIndex) + 1;
			if(nextIndex <= 22){
				setArgv(0,nextIndex,0);
				initData(nextIndex);
			}else{
				setArgv(0,0,0);
				initData(0);
			}
			return;
		}
	}else{
		if(index != 0){
			--index;	
		}else{
			var prevIndex = parseInt(topIndex) - 1;
			if(prevIndex >= 0){
				setArgv(0,prevIndex,1);
				initData(prevIndex);
			}else{
				setArgv(0,22,1);
				initData(22);
			}
			return;
		}
	}
	if(searchFlag == 1){
		songInfo(index,searchSongs);
	}else{
		storage.setItem("index",index);
		songInfo(index,data);
	}
	curTimeFunction();
    music.play(); 
    play.style.display = 'none'; 
    pause.style.display = 'inline-block';
}

function getLyric(id){
	lyricList.innerHTML = '<li></li><li></li>';
	lyricList.style.display = 'none';
	lyricList.style.top = 0;
	createRequest('/api/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', 'GET', null)
	    .then(function(lyric){
	    	if(JSON.parse(lyric).lrc){
	    		eLyric = parseLyric(JSON.parse(lyric).lrc.lyric);
		    	for(var i = 0,len = eLyric.length;i<len;i++ ){
		    		lyricList.innerHTML += '<li>' + eLyric[i][1] + '</li>';
		    	}
		    	eLyricTotal = eLyric.length;
		    	lyricList.style.display = 'block';
	    	}
	    	else{
	    		eLyric = null;
	    	}
    		
	    })
}

function toggleLyric(time){
	for(var j = 0,lenList = lyricListLi.length;j<lenList;j++){
		var target = lyricListLi[j];
		if(target.className == 'whiteLi'){
			target.setAttribute('class','')
		}
	}
  	for(var i = 0,len = eLyric.length;i<len;i++ ){
		if(time<=eLyric[i][0]){
			eLyricIndex = i - 1;
			if(eLyricIndex < 0){
				eLyricIndex = 0;
			}
			return;
		}
	}
}

function toggleCurrentTime(time){
	music.currentTime = time;
	music.play();
	toggleLyric(time);
	setTime(time,1);
	pauseMin = parseInt(minCurrentTime.innerHTML);
	pauseSec = parseInt(secCurrentTime.innerHTML);
	curTimeFunction(1);
}

function songInfo(index,songDataInfo){
	bg.style.backgroundImage = 'url('+songDataInfo[index].album.blurPicUrl+')';
	duration = songDataInfo[index].duration / 1000;
	const id = songDataInfo[index].id;
	const br = parseInt(0 || 999000)
	const data = {
		"ids": [id],
		"br": br,
		"csrf_token": ""
	}
	const cookie = ''

	// music.src = songDataInfo[index].mp3Url;
	songName.innerHTML = songDataInfo[index].name;
	author.innerHTML = songDataInfo[index].artists[0].name;
	eLyricIndex = 0;
	getLyric(id);
	setTime(duration,0);
	createWebAPIRequest(
		'music.163.com',
		'/weapi/song/enhance/player/url',
		'POST',
		data,
		cookie,
		music_req => {
		  music.src = JSON.parse(music_req).data[0].url;
		  music.play();
		},
		err => {
		  res.status(502).send('fetch error')
		}
	)
	timeBarNow.style.width = 0;
	timeFlag.style.left = 0;
}

function setTime(time,flag){
	var min = parseInt(time / 60),
		sec = parseInt(time % 60);
	if(flag == 0){
		if(min<10){
			minAllTime.innerHTML = '0' + min;
		}else{
			minAllTime.innerHTML = min;
		}
		if(sec<10){
			secAllTime.innerHTML = '0' + sec;
		}else{
			secAllTime.innerHTML = sec;
		}
	}else{
		if(min<10){
			minCurrentTime.innerHTML = '0' + min;
		}else{
			minCurrentTime.innerHTML = min;
		}
		if(sec<10){
			secCurrentTime.innerHTML = '0' + sec;
		}else{
			secCurrentTime.innerHTML = sec;
		}
	}

}

function curTimeFunction(flag){
	var method = flag || 0;
	var sec = 0,
		min = 0;
	if(method == 1){
		sec = pauseSec;
		min = pauseMin;
	}
	minCurrentTime.innerHTML = '0' + min;
	clearInterval(curTime);
	curTime = setInterval(function(){
		sec++;
		var time = min*60+sec - 2;
		if(time < 0){
			time = 0;
		}
		timeBarNow.style.width = time / duration * 100 + '%';
		timeFlag.style.left = time / duration * 100 + '%';
		if(sec < 10){
			secCurrentTime.innerHTML = '0' + sec;
		}else if(sec <= 59){
			secCurrentTime.innerHTML = sec;
		}else{
			sec = 0;
			secCurrentTime.innerHTML = '00';
			min++;
			if(min < 10){
				minCurrentTime.innerHTML = '0' + min;
			}else{
				minCurrentTime.innerHTML = min;
			}
		}
		if(music.ended){
			toggleSong();
		}
	},1000);
}


var downX;
var left;
function moveVoiceBar(event){
	var moveX = event.clientX,
		moveLeft = (moveX - downX + left) / 2;
	if(moveLeft < -5){
		moveLeft = -5;
	}else if(moveLeft > 95){
		moveLeft = 95;
	}
	volumeCircle.style.left = moveLeft + '%';
	volumeBarNow.style.width = moveLeft + 5 + '%';
	music.volume = (moveLeft + 5) / 100;
}

function moveTimeBar(event){
	var moveX = event.clientX,
		maxX = window.innerWidth,
		moveLeft = (moveX - downX + left),
		value;
	if(moveLeft < 0){
		moveLeft = 0;
	}else if(moveLeft > maxX){
		moveLeft = maxX - 8;
	}
	value = moveLeft / window.innerWidth;
	timeFlag.style.left = value * 100 + '%';
	timeBarNow.style.width = value * 100 + '%';

	var time = value * duration;
	toggleCurrentTime(time);
}

function parseLyric(text) {
	var lyric = text.split('\n'); 
	var len = lyric.length; 
	var lrc = new Array(); 
	for(var i=0;i<len;i++) {
	    var d = lyric[i].match(/\[\d{2}:\d{2}((\.|\:)\d{2,3})\]/g);  //正则匹配播放时间
	    var t = lyric[i].split(d);
	    if(d != null) { 
	        var dt = String(d).split(':'); 
	        var _t = (parseInt(dt[0].split('[')[1])*60+parseFloat(dt[1].split(']')[0])); 
	        lrc.push([_t, t[1]]);
	    }
	}
	return lrc;
}

function createRequest(path, method, data, callback, errorcallback) {
  return new Promise((resolve, reject) => {
    let ne_req = ''
    const http_client = http.request({
      hostname: 'music.163.com',
      method: method,
      path: path,
      headers: {
        'Referer': 'http://music.163.com',
        'Cookie': 'appver=2.0.2',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }, res => {
      res.setEncoding('utf8')
      res.on('error', err => {
        reject(err)
      })
      res.on('data', chunk => {
        ne_req += chunk
      })
      res.on('end', () => {
        resolve(ne_req)
      })
    })
    if (method == 'POST') {
      http_client.write(data)
    }
    http_client.end()
  })
}


