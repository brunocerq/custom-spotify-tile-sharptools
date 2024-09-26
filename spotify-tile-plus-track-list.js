<!-- README
    This is a variation of the spotify tile for sharptools based on James's Spotify app to Auth. 
    - Auth page https://spotify-demo-auth.glitch.me/
    - Only need accessToken and refreshToken keys in Custom Tile.     
		- ADDED: When playing from a playlist the tracks are displayed, stoping resumes list by playlist.
		- Fullscreen album cover with controls above it.
		Code changed by Bruno Cerqueira.

		Feel free to change transparency levels and colors in code.
-->
<!-- Do not edit below -->
<script type="application/json" id="tile-settings">
{
  "schema": "0.2.0",
  "settings": [
    {"name": "refreshToken", "label": "Refresh Token", "type": "STRING"}
  ],
  "name": "Spotify quick demo (use James Spotify app)",
  "dimensions": {"width": 3, "height": 3}
}
</script>
<!-- Do not edit above -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
<!--
<link rel="stylesheet" href="//use.fontawesome.com/releases/v5.0.7/css/all.css">
-->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.sharptools.io/js/custom-tiles.js"></script>
<style>
html, body {
  background-color: transparent;
}
#playback #temp-album-art {width:100%; height: 100%; padding:1rem;}
#playback #album-art {width:100%; height:100%;}
#player {width:100%;}
#player .controls {cursor:pointer;}
#player .controls svg {width:100%; height: 100%;}
#playback-info {
  position: relative;
  z-index: 10;
  padding-left: 1rem;
}
#playback-info #title, #playback-info #artist {font-size:5vw; color:white!important;}
#player {
  position: relative;
  bottom: 5px;
  left: 0px;
  margin-left: auto;
  margin-right: auto;
  z-index: 20;
}
#lists .list-group-item {cursor: pointer;}
#lists .active {background-color:#CC4A17!important; color:##D0D0D6!important; border:unset;}
#player .controls.active {color: #D0D0D6;}

/*content(list) Scroll bar style*/
#content{
    scrollbar-shadow-color: #141414;
    scrollbar-highlight-color: #141414;
    scrollbar-3dlight-color: #141414;
    scrollbar-darkshadow-color: #141414;
    scrollbar-track-color: #141414;
    scrollbar-arrow-color: #141414;
}
#content::-webkit-scrollbar {width: 12px;} 
#content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    -webkit-border-radius: 10px;
    border-radius: 10px;
}
#content::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(20,20,20,0.8); 
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
}

#spotify-main {
  class="text-light" align="center";
  background-color: transparent;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  
}  

#spotify-main::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--bg-url); /* Use the custom property for the background-image */
  background-color: rgba(0, 0, 0, 0.5); /* Adjust the last value (0.5) to control the darkness*/
  backdrop-filter: blur(2px); /* Add this line to apply a slight blur*/
  z-index: 1;
  opacity: 0.5; /* Change this value to adjust transparency */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}  


  
.bg-dark {
    background-color: transparent !important;
}  
#spotify-main #list .track .title, 
#spotify-main #list .track .artist, 
#spotify-main #list .track .album {
    color: #D0D0D6 !important;
}
#title, #artist, #album {color: #D0D0D6 !important;}

#spotify-main #list .track .mdi, 
#spotify-main #controls .mdi {
    stroke: #D0D0D6 !important;
}
 .custom-text-color {
  color: #D0D0D6;
} 
.list-group {font-size:5vw!important;}  
#spotify-content {
  position: relative;
  z-index: 2;
}
#temp-album-art, #album-art {
  display: none;
}  

.controls:hover svg {
  fill: white; /* Replace this with the desired color */
}

.list-group li:hover {
  color: white; /* Replace this with the desired color */
  background-color:#A1300D!important;
  opacity: 0.5; /* Change this value to adjust transparency */
}
 
</style>
<div id="spotify-main" class="spotify-main" align="center">  
  <div id="spotify-content">
     <div id="playback" class="row g-0" align="left">
    <div class="col-auto g-0">
      <svg id="temp-album-art" xmlns="http://www.w3.org/2000/svg" width="100vw" height="100vh" fill="#D0D0D6" class="bi bi-music-note-beamed" viewBox="0 0 100vw 100vh">
        <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"></path>
        <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"></path>
        <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"></path>
      </svg>      
      <img class="img-responsive" id="album-art" style="display:none;">
    </div>
    <div id="playback-info" class="col gx-2">
      <div id="title"></div>
      <div id="artist"></div>
      <div id="player" class="container">
        <div class="row row row-cols-6">
          <span class="controls col text-center" onclick="controlPlayer('previous')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D0D0D6" class="bi bi-skip-backward-fill" viewBox="0 0 16 16">
  <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5z"></path>
</svg>
          </span>
          <span id="ctrl-pause" class="controls col text-center" style="display:none;" onclick="controlPlayer('pause')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D0D0D6" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"></path>
</svg>
          </span>
          <span id="ctrl-play" class="controls col text-center" onclick="controlPlayer('play')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D0D0D6" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"></path>
</svg>
          </span>
          <span class="controls col text-center" onclick="controlPlayer('next')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D0D0D6" class="bi bi-skip-forward-fill" viewBox="0 0 16 16">
  <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5z"></path>
</svg>
          </span>
          <span class="controls col text-center" onclick="getDevices(true)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D0D0D6" class="bi bi-speaker-fill" viewBox="0 0 16 16">
  <path d="M9 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-2.5 6.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"></path>
  <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm6 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 7a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"></path>
</svg>
          </span>        
          <span class="controls col text-center" onclick="getPlaylists()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D0D0D6" class="bi bi-music-note-list" viewBox="0 0 16 16">
  <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z"></path>
  <path fill-rule="evenodd" d="M12 3v10h-1V3h1z"></path>
  <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z"></path>
  <path fill-rule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"></path>
</svg>
          </span>
          <span id="ctrl-shuffle" class="controls col text-center" onclick="shuffle()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D0D0D6" class="bi bi-shuffle" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"></path>
  <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"></path>
</svg>
          </span>
        </div>      
      </div>
    </div>  
  </div>
  <div id="content" class="overflow-auto" align="left">
    <ul id="lists" class="list-group">
    </ul>    
  </div>   
  </div>
</div>

<!-- Your existing HTML and CSS code remains unchanged -->

<script>
var apiUrl = "https://api.spotify.com/v1";
var authUrl = "https://accounts.spotify.com/authorize";
var token;
var refreshToken
var btnSignin = document.getElementById("btn-signin");
var divPlaybackInfo = document.getElementById("playback-info");
var ulLists = document.getElementById("lists");
var divTitle = document.getElementById("title");
var divArtist = document.getElementById("artist");
var divContent = document.getElementById("content");
var tempAlbumArt = document.getElementById("temp-album-art"); 
var imgAlbumArt = document.getElementById("album-art");
var ctrlPlay = document.getElementById("ctrl-play");
var ctrlPause = document.getElementById("ctrl-pause");
var ctrlShuffle = document.getElementById("ctrl-shuffle");

var spotifyRefreshTimer;
var spotifyData = {};
var userSettings;
var activeDeviceId;
var tileSize = {
  height: window.innerHeight,
  width: window.innerWidth
};
var contentHeight = tileSize.height - divPlaybackInfo.clientHeight;
divContent.style.height = `${contentHeight}px`;

// Define a variable to keep track of the current view ("playlists" or "tracks")
var currentView = "playlists";
var currentPlaylistUri = null; // Keep track of the current playlist URI

function updateSpotifyMainBackground(imageUrl) {
  var spotifyMain = document.getElementById("spotify-main");
  spotifyMain.style.setProperty('--bg-url', 'url(' + imageUrl + ')');
}  

//helper method for logging an error to console, showing a toast, and updating the tile to display 'Error'
function showError(message, replaceTileContent=false){
  console.error(message);
  stio.showToast(message, "red");
  if(replaceTileContent)
    document.getElementById("spotify-main").innerHTML = "Error";
}

stio.ready().then(function(data){
  console.log("stio is ready");
  userSettings= data && data.settings;
  if(userSettings.refreshToken == null || userSettings.refreshToken == ""){
    showError("Spotify Refresh Token is not set", true);
  }
  else{
    //Token expires every hour so it's likely is is expired when loaded.
    getNewToken().then(function(){
      //Get the playlists first before asking for the current playback
      return getPlaylists();
    }).then(function(){
      return getCurrPlayback();
    }).then(function(){
      getDevices(); 
    });  
  }
});

function getNewToken(){
  console.log("Refreshing token");
  return new Promise(function(resolve, reject){
    axios.post("https://spotify-demo-auth.glitch.me/token",  
      {refreshToken: userSettings.refreshToken}, {}      
      ).then(function(res){
        console.log(res);
        if(res && res.data && res.data.accessToken){
          console.log("Received new token");
          userSettings.token = res.data.accessToken;
          resolve(res.data.access_token);
        }      
      }).catch(function(err){        
        console.log(err);   
        //console.log(JSON.stringify(err.response));
        reject(err);
      });
  });
}

function removeAllChildNodes(parent) {
  //To remove the list items and their listeners
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function getPlaylists(){
  currentView = "playlists"; // Set the current view to playlists
  currentPlaylistUri = null; // Reset the current playlist URI
  return new Promise(function(resolve, reject){
    //TODO:add pagination
    axios.get(`${apiUrl}/me/playlists?limit=50`, {
      headers: {"Authorization": "Bearer " + userSettings.token}
      }).then(function(res){
        if(res.data && res.data.items){
          spotifyData.playlists = res.data.items;      
          removeAllChildNodes(ulLists);
          for(var i=0; i < res.data.items.length; i++){
            var playlist = res.data.items[i];
            var item = document.createElement("li");
            item.classList.add('list-group-item');
            item.classList.add('bg-dark');
            item.classList.add('custom-text-color'); // Add this line
            item.setAttribute("id", playlist.uri);
            item.onclick = function(){
              var uri = this.id;
              controlPlayer("play",{contextUri: uri});
              currentPlaylistUri = uri; // Store the current playlist URI
            };
            item.appendChild(document.createTextNode(playlist.name));
            ulLists.appendChild(item);
          }          
          resolve();
        }          
      }).catch(function(err){
        console.log(err);        
        if(err.response && isTokenExpiredError(err.response)){
          getNewToken().then(function(){
            getPlaylists();
          }); 
        }
        else{
          if (err.response.status === 401){
            showError("Unauthorized. Please review the token setting and try it again.");
          }
          reject(err);
        }
      });
  });
}

function setActiveDevice(deviceId, play=false, listToShow=null){
  var url = `${apiUrl}/me/player`;
  var data = {device_ids: [deviceId]};
  var method = "put";
  //Transfer user's playback (active device)
  axios({method, url, data,    
    headers: {"Authorization": "Bearer " + userSettings.token}
    }).then(function(res){
      console.log(`Active Device: ${deviceId}`);
      activeDeviceId = deviceId;
      //Update the list content if specified
      if(listToShow === "playlists"){
        getPlaylists();
      }
    }).catch(function(err){
      console.log(err);
      if(err.response && isTokenExpiredError(err.response)){
        console.log("refresh token");
        getNewToken().then(function(){
          setActiveDevice(deviceId, play, listToShow);
        }); 
      }      
      else if (err.response.status === 401){
        showError("Unauthorized. Please review the token setting and try it again.");
      }
      else if(isNoActiveDeviceError(err.response)){
        showError("No active device. Please select an available device first.");          
      }
      else if(err.response.status === 403){
        showError("Spotify premium account is required for this action.");                 
      }        
    });  
}

function getDevices(showDeviceList=false){
  return axios.get(`${apiUrl}/me/player/devices`, {
    headers: {"Authorization": "Bearer " + userSettings.token}
    }).then(function(res){
     if(res.data && res.data.devices){
        spotifyData.devices = res.data.devices;
        if(showDeviceList){
          removeAllChildNodes(ulLists);
          for(var i=0; i < spotifyData.devices.length; i++){
            var item = document.createElement("li");
            var device = spotifyData.devices[i];
            item.classList.add('list-group-item');
            item.classList.add('bg-dark'); 
            item.classList.add('custom-text-color'); // Add this line
            item.setAttribute("id", device.id);      
            item.onclick = function(){
              var deviceId = this.id;     
              setActiveDevice(deviceId, false, "playlists")
            };
            item.appendChild(document.createTextNode(device.name));
            ulLists.appendChild(item);
          }     
        }
      }
    }).catch(function(err){
      console.log(err);      
      if(err.response && isTokenExpiredError(err.response)){
        getNewToken().then(function(){
          getDevices(showDeviceList);
        }); 
      }
      else if (err.response.status === 401){
        showError("Unauthorized. Please review the token setting and try it again.");
      }
    });  
}

function getCurrPlayback(){
  //All the controls' status are updated based on the current playback data
  return axios.get(`${apiUrl}/me/player`, {
    headers: {"Authorization": "Bearer " + userSettings.token}
    }).then(function(res){
      if(res.status === 204) {
        // No active playback
        spotifyData.currPlayback = null;
        if (currentView === "tracks") {
            getPlaylists();
            currentView = "playlists";
        }
      } else if(res && res.data){
        spotifyData.currPlayback= res.data;
        // Update the album art image
        if (res.data.item && res.data.item.album && res.data.item.album.images && res.data.item.album.images.length > 0) {
          imgAlbumArt.src = res.data.item.album.images[0].url;
          updateSpotifyMainBackground(res.data.item.album.images[0].url); // Add this line
        }

        //Update the player status (play/pause)
        if(res.data.is_playing === true){
          spotifyData.status = "play";          
          ctrlPlay.style.display = "none";
          ctrlPause.style.display = "block";
          //Schedule the polling task
          if(spotifyRefreshTimer == null) 
            schedulePlaybackRefresh();
        }
        else{
          spotifyData.status = "pause";          
          ctrlPlay.style.display = "block";
          ctrlPause.style.display = "none";
          console.log("clear refresh schedule");
          //Stop the playback polling schedule since it is not playing now
          if(spotifyRefreshTimer != null) {
            console.log(`clear refresh schedule - ${spotifyRefreshTimer}`);
            clearTimeout(spotifyRefreshTimer);
            spotifyRefreshTimer = null;
          }
        }        
        //Update shuffle state
        if (res.data.shuffle_state)
          ctrlShuffle.classList.add("active");        
        else
          ctrlShuffle.classList.remove("active");        
        
        //Update the playback title    
        if (res.data.item && res.data.item.name)
          divTitle.innerHTML= res.data.item.name;
        else
          divTitle.innerHTML= "";
        
        //Update the playback artist
        var artistsText = "";
        if (res.data.item && res.data.item.artists){
          for (var i=0; i < res.data.item.artists.length; i++){
            if (!artistsText) artistsText = res.data.item.artists[i].name;
            else artistsText += `, ${res.data.item.artists[i].name}`;
          }       
        }
        divArtist.innerHTML = artistsText;
        
        if (currentView === "tracks") {
          // Remove the current active class
          for (var i = 0; i < ulLists.childNodes.length; i++) {
              var item = ulLists.childNodes[i];
              item.classList.remove("active");
          }
          // Add active class to the currently playing track
          if (spotifyData.currPlayback && spotifyData.currPlayback.item && spotifyData.currPlayback.item.uri) {
              var activeTrack = document.getElementById(spotifyData.currPlayback.item.uri);
              if (activeTrack) activeTrack.classList.add("active");
          }
        } else {
          // Update the current selected playlist
          if(spotifyData.currPlayback && spotifyData.currPlayback.context && spotifyData.currPlayback.context.uri){
            // Remove the current active class
            for (var i=0; i < ulLists.childNodes.length; i++){
              var item = ulLists.childNodes[i];
              item.classList.remove("active");            
            }
            // Add active class to the currently played playlist
            var activeList = document.getElementById(spotifyData.currPlayback.context.uri);
            if(activeList) activeList.classList.add("active");
          }
        }
      }
    }).catch(function(err){
      console.log(err);
      if (err.response && err.response.status === 204) {
        // No active playback
        spotifyData.currPlayback = null;
        if (currentView === "tracks") {
            getPlaylists();
            currentView = "playlists";
        }
      } else if(err.response && isTokenExpiredError(err.response)){
        getNewToken().then(function(){
          getCurrPlayback();
        }); 
      }
      else if (err.response.status === 401){
        showError("Unauthorized. Please review the token setting and try it again.");
      }      
    });
}

function controlPlayer(action, params = {}){
  var url = `${apiUrl}/me/player/${action}`;
  var data = {};
  var method = "put";
  if(action === "next" || action === "previous")
    method = "post";    
  //Specify which device to send the play command  
  if (activeDeviceId) url += `?device_id=${activeDeviceId}`;  
  //To play a specific album, song, or playlist
  if (action === "play") {
    if (params.contextUri) {
      data.context_uri = params.contextUri;
      if (params.offsetUri) {
        data.offset = { uri: params.offsetUri };
      }
    } else if (params.uris) {
      data.uris = params.uris;
    }
  }
  return axios({method, url, data,    
    headers: {"Authorization": "Bearer " + userSettings.token}
    }).then(function(res){
      //resync the player playback data after a tiny delay
      setTimeout(getCurrPlayback, 50);
      if (action === "play" && params.contextUri) {
        getPlaylistTracks(params.contextUri);
      }
    }).catch(function(err){
      console.log(err);
      if (err.response){
        if(isTokenExpiredError(err.response)){
          getNewToken().then(function(){
            controlPlayer(action, params);
          }); 
        }
        else if (err.response.status === 401){
          showError("Unauthorized. Please review the token setting and try it again.");
        }
        else if(isNoActiveDeviceError(err.response)){
          showError("No active device. Please select an available device first.");          
        }
        else if(err.response.status === 403){
          showError("Spotify premium account is required for this action.");                 
        }        
      }  
    });  
}

function getPlaylistTracks(playlistUri) {
  // Extract the playlist ID from the URI
  var playlistId = playlistUri.split(":")[2];
  return axios.get(`${apiUrl}/playlists/${playlistId}/tracks`, {
    headers: { "Authorization": "Bearer " + userSettings.token }
  }).then(function(res) {
    if (res.data && res.data.items) {
      spotifyData.tracks = res.data.items;
      removeAllChildNodes(ulLists);
      for (var i = 0; i < res.data.items.length; i++) {
        var trackItem = res.data.items[i].track;
        var item = document.createElement("li");
        item.classList.add('list-group-item');
        item.classList.add('bg-dark');
        item.classList.add('custom-text-color');
        item.setAttribute("id", trackItem.uri);
        item.onclick = (function(trackUri){
          return function() {
            controlPlayer("play", { contextUri: playlistUri, offsetUri: trackUri });
          };
        })(trackItem.uri); // Use an IIFE to capture trackUri
        item.appendChild(document.createTextNode(trackItem.name));
        ulLists.appendChild(item);
      }
      currentView = "tracks";
      currentPlaylistUri = playlistUri; // Store the current playlist URI
    }
  }).catch(function(err) {
    console.log(err);
    if (err.response && isTokenExpiredError(err.response)) {
      getNewToken().then(function() {
        getPlaylistTracks(playlistUri);
      });
    } else if (err.response.status === 401) {
      showError("Unauthorized. Please review the token setting and try it again.");
    }
  });
}

function shuffle(){
  var isShuffle = spotifyData && spotifyData.currPlayback && spotifyData.currPlayback.shuffle_state;
  isShuffle = !isShuffle ? true : false; //toggle shuffle state
  return axios.put(`${apiUrl}/me/player/shuffle?state=${isShuffle}`, {}, {
    headers: {"Authorization": "Bearer " + userSettings.token}
    }).then(function(res){
      //resync the player playback data after a tiny delay
      setTimeout(getCurrPlayback, 50);
    }).catch(function(err){
      console.log(err);
      if(err.response && isTokenExpiredError(err.response)){
        getNewToken().then(function(){
          shuffle();
        }); 
      }
      else if (err.response.status === 401){
        showError("Unauthorized. Please review the token setting and try it again.");
      }
      else if(isNoActiveDeviceError(err.response)){
        showError("No active device. Please select an available device first.");          
      }
      else if(err.response.status === 403){
        showError("Spotify premium account is required for this action.");
      }  
    });
}

/*Common known errors*/
function isTokenExpiredError(errorResponse){
  if(errorResponse && errorResponse.data && errorResponse.data.error && errorResponse.data.error.message){
    if(errorResponse.data.error.message.indexOf("token expired") >= 0){
      console.log("Token is expired");
      return true;
    }      
  }
  return false;
}

function isNoActiveDeviceError(errorResponse){
  if(errorResponse && errorResponse.data && errorResponse.data.error){
    return (errorResponse.data.error.reason === "NO_ACTIVE_DEVICE") || (errorResponse.data.error.message === "Device not found");
  }
  return false;
}
/*Current playback polling scheduler*/
function schedulePlaybackRefresh(){
  getCurrPlayback();
  console.log("refresh playback in 3 seconds");
  spotifyRefreshTimer = setTimeout(schedulePlaybackRefresh, 3000);
}
</script>

<!-- Your existing Bootstrap JS scripts remain unchanged -->


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>