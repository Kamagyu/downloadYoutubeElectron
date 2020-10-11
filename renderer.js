const ytdl = require('ytdl-core');
const fs = require('fs');
const homedir = require('os').homedir();

const $ = require('jquery');

/** @type {{name: string, url: string, output: string}[]} List of youtube url */
const list = [];

$('#add').on('click',
	async () =>
	{
		/** @type {JQuery.<HTMLInputElement>} */
		const searchBox = $('#searchbox');
		const outputName = $('#output');
		const url = searchBox.val();

		if(!/((youtube\.com)|(youtu\.be))\//.test(url))
		{
			searchBox.val('');
			outputName.val('');
			return;
		}

		const data = await ytdl.getInfo(url);
		
		list.push({ name: data.videoDetails.title, url: url, output: outputName.val() });
		
		$('#list').append(`<li><button id="remove">Remove</button>${data.videoDetails.title}</li>`);
		
		searchBox.val('');
		outputName.val('');
	}
);

$('#list').on('click', 'button',
	function () //Function required to use this
	{
		const name = $(this).parent().contents().filter(function () { return this.nodeType == 3; }).text();
		
		$(this).parent().remove();
		
		list.splice(list.findIndex(v => v.name === name), 1);
	}
);

$('#download').on('click',
	() =>
	{
		
		
		list.splice(0).forEach(
			v =>
			{
				let size = 0;
				let progress = 0;
				
				
				
				ytdl(v.url, {filter: 'audioonly'})
					.on('response',
						function(res)
						{
							size = parseInt(res.headers['content-length'], 10);
						}
					)
					.on('data',
						function(data)
						{
							progress += data.length;
							document.getElementById('loadingForeground').style.width = Math.round(progress/size*100) + '%';
						}
					)
					.pipe(fs.createWriteStream(`${homedir}/Music/${v.output}`))
					.on('finish',
						() =>
						{
							$('#list').children().eq(1);
							list.splice(0, 1);
						}
					)
			}
		);
		
		
		
	}
);