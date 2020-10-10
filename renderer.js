// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const ytdl = require('ytdl-core');
const fs = require('fs');
const $ = require('jquery');

const list = [];

function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

$('#add').on('click', 
	async () =>
	{
		/** @type {JQuery.<HTMLInputElement>} */
		const searchbox = $('#searchbox');
		const val = searchbox.val();
		
		if(!/((youtube\.com)|(youtu\.be))\//.test(val))
		{
			searchbox.val('');
			return;
		}
		
		console.log('a');
		
		const info = await ytdl.getInfo(val);
		
		console.log('b');
		
		list.push({name: info.videoDetails.title, id: info.videoDetails.video_url});
		
		$('.list').append(`<li>${info.videoDetails.title}</li>`);
		
		searchbox.val('');
	}
);

