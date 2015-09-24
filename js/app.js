
$(document).ready(function(){
	document.addEventListener('deviceready',onDeviceReady, false);
});

function onDeviceReady(){
	//check localstorage for channel 
	if(localStorage.channel==null || localStorage.channel==''){
		$('#popupDialog').popup();
		$('#popupDialog').popup("open");
	} else {
		var channel = localStorage.getItem('channel');
	}

	getPlayList(channel);

	$('#channelBtnOk').click( function(){
		var channel = $('#channelName').val();
		setChannel(channel);
		getPlayList(channel);
	});

	$('#saveOptions').click(function(){
		saveOptions();
	});

	$('#clearChannel').click(function(){
		clearChannel();
	});

	$(document).on('click','#vidlist li',function(){
		showVideo($(this).attr('videoId'));
	});

	$(document).on('pageinit','#options',function(e){
		var channel = localStorage.getItem('channel');
		var maxresults = localStorage.getItem('maxResults');
		$('#channelNameOptions').attr('value',channel);
		$('#maxResultsOptions').attr('value',maxresults);
	});

}

function getPlayList(channel){
	$('#vidlist').html('');

	var maxResults = localStorage.getItem('maxResults');

	$.get(
			"https://www.googleapis.com/youtube/v3/channels",
			{
				part:'contentDetails',
				forUsername: channel,
				key: 'AIzaSyCweMRwCkpGfQGrjTJeSIMPjbaMFPe-4zg'
			},
			function (data){

				$.each(data.items , function(i, item){
					//console.log(item);
					playlistId = item.contentDetails.relatedPlaylists.uploads;
					getVideos(playlistId, maxResults);
				});
			}
		)
}

 function getVideos(playlistId, maxResults){
		//console.log("In getvideos ....");	

		$.get(
				"https://www.googleapis.com/youtube/v3/playlistItems",
				{
					part:'snippet',
					maxResults: maxResults,
					playlistId: playlistId,
					key: 'AIzaSyCweMRwCkpGfQGrjTJeSIMPjbaMFPe-4zg'
				},
				function(data){
					//console.log(data);

					$.each(data.items,function(i,item){
						var output;

						id=item.snippet.resourceId.videoId;
						title=item.snippet.title;
						thumb=item.snippet.thumbnails.default.url;
						$('#vidlist').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>')
						$('#vidlist').listview('refresh');
					});
				}
			)
 }

 function showVideo(id){

 	console.log('Showing video -- '+id);
 	$('#logo').hide();
 	var output ='<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';

	$('#showVideo').html(output); 	
 }

 function setChannel(channel){
 	localStorage.setItem('channel',channel);
 	console.log('Channel set to localStorage'+channel);
 }

 function saveOptions(){
 	var channel = $('#channelNameOptions').val();
 	setChannel(channel);
 	var maxResults = $('#maxResultsOptions').val();
 	setMaxResults(maxResults);
 	$('body').pagecontainer('change','#main',{options});
 	getPlayList(channel);
 }

function setMaxResults(maxResults){
	localStorage.setItem('maxResults',maxResults);
	console.log('MaxResults Count :'+maxResults);
}

function clearChannel(){
	localStorage.removeItem('channel');
	$('body').pagecontainer('change','#main',{options});
	$('#vidlist').html('');
	$('#popupDialog').popup();
	$('#popupDialog').popup("open");
}