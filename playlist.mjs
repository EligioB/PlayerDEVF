function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }


var playListFromSpoty;
var playlistCustom = [];
// configuracion de api de Spoty
let codeVerifier = localStorage.getItem('code_verifier');
console.log(codeVerifier);

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
console.log(code);
let body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code,
  redirect_uri: 'http://127.0.0.1:5500/IntroWEB/reproductor/playlist.html',
  client_id: "a79c3d196916463d8d1ab07f4a693db9",
  code_verifier: codeVerifier
});

async function updateToken() {
const response = fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body
})
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('access_token', data.access_token);
    getProfile()
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

  async function getProfile() {
    let accessToken = localStorage.getItem('access_token');
  
    const response = await fetch('https://api.spotify.com/v1/playlists/5nRcIY7BnEqgzrTH3GehH2', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    playListFromSpoty = data
    showTable()
  } 

  updateToken()

  // F  I  N ----  D  E  configuracion de api de Spoty

  
function showTable() {

  document.getElementById('playListTitle').textContent = playListFromSpoty.name
  
  playListFromSpoty.tracks.items.forEach((cancion, index) => {
    const tr = document.createElement('tr')
    const tdImage = document.createElement('td')
    const image = document.createElement('img')
    const tdCancion = document.createElement('td')
    const tdArtis = document.createElement('td')
    const tdAlbum = document.createElement('td')
    const addButton = document.createElement('button')
    const player = document.createElement('audio')

    image.setAttribute('src', `${cancion.track.album.images[0].url}`)

    tdCancion.textContent = cancion.track.name
    cancion.track.artists.forEach(artista => {
      tdArtis.textContent = artista.name
    })

    tdAlbum.textContent = cancion.track.album.name

    addButton.setAttribute('id', `boton${index}` )
    addButton.setAttribute('onclick', `addSong(${index})`)
    addButton.innerHTML = '<i class="fa-solid fa-heart-circle-plus" fa-lg></i>'
  


    player.setAttribute('src', `${cancion.track.preview_url}`)
    player.setAttribute('controls','controls')


    tdImage.appendChild(image)

    tr.appendChild(tdImage)
    tr.appendChild(tdCancion)
    tr.appendChild(tdArtis)
    tr.appendChild(tdAlbum)
    tr.appendChild(addButton)
    tr.appendChild(player)
    

    document.getElementById('playlist-content').appendChild(tr)

  });

}


function addSong(indice) {
  const newSong = playListFromSpoty.tracks.items[indice]
  if (existSong(newSong)) {
    alert("la cancion "+ newSong.track.name + " ya existe")
  } else {
    playlistCustom.push(newSong)
    showPlaylistCustom()

    var buttonIndex = `boton${indice}`;
    var addButton = document.getElementById(buttonIndex);
    console.log(addButton);
    addButton.innerHTML = '<i class="fa-solid fa-heart" style="color: #ff1f1f;" fa-lg></i>'


  }
}

function showPlaylistCustom() {
  document.getElementById('playlist-content-custom').innerHTML = ''
  playlistCustom.forEach((cancion, index) => {

    const tr = document.createElement('tr')
    const tdImg = document.createElement('td')
    const imagen = document.createElement('img')

    const tdCancion = document.createElement('td')
    const tdAlbum = document.createElement('td')
    const tdArtis = document.createElement('td')
    const deleteButton = document.createElement('button')

    imagen.setAttribute('src', `${cancion.track.album.images[0].url}`)

    tdCancion.textContent = cancion.track.name
    cancion.track.artists.forEach(artista => {
      tdArtis.textContent = artista.name
    })
    tdAlbum.textContent = cancion.track.album.name

    deleteButton.setAttribute('onclick', `deleteSong(${index})`)
    deleteButton.innerHTML = '<i class="fa-solid fa-heart-circle-minus fa-lg"></i>'

    tdImg.appendChild(imagen)
    tr.appendChild(tdImg)
    tr.appendChild(tdCancion)
    tr.appendChild(tdArtis)
    tr.appendChild(tdAlbum)
    tr.appendChild(deleteButton)

    document.getElementById('playlist-content-custom').appendChild(tr)

  })
}

function deleteSong(index) {
 var [song] = playlistCustom.splice(index,1);
  showPlaylistCustom();
  var searchObject =playListFromSpoty.tracks.items;
  
  var searchObject2 = searchObject.map(Object.values);
  var aux2 = searchObject2.findIndex((item) => item[0] == song.added_at);
  
  var buttonIndex = `boton${aux2}`;
    var addButton = document.getElementById(buttonIndex);
    addButton.innerHTML = '<i class="fa-solid fa-heart-circle-plus" fa-lg></i>'

}


function existSong(song) {
return playlistCustom.includes(song)
}