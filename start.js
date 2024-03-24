let currentSong = new Audio();
let currfolder;
let songs;

function formatTime(seconds) {
  // Calculate minutes and seconds
  seconds = Math.round(seconds);
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  // Add leading zeros if necessary
  let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  let formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  // Return the formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  //why we creating element , why can not use response variable directly ?
  // becuase response is of string type and div is object type , so from object we can extract info easily

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = []; // songs will be stored here

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      //selecting songs link which ends with mp3
      songs.push(element.href);
    }
  }
  //show all the songs in playlist

  let songUL = document
    .querySelector(".songPlaylist")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";

  for (var song of songs) {
    song = splitSong(song);

    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
      <img class="invert icon-width" src="./images/all/music.svg" alt=""/>
    <div class="info">
      <div>${song.replace(/%20/g, " ")}</div>
      <div>Mukul</div>
    </div>
    <div class="playNow">
      <span>Play Now</span>
      <img class="roundPlay invert icon-width" src="./images/all/play2.svg" alt="" />
    </div>
  </li>`;
  }

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track + ".mp3";
  if (!pause) {
    currentSong.play();
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = `00:00 / 00:00`;
};

var splitSong = (songURL) => {
  return songURL.split(`/${currfolder}/`)[1].split(".mp3")[0];
};

async function displayAlbum() {
  let a = await fetch(`/Songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  let cardContainer = document.querySelector(".cards");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`/Songs/${folder}/info.json`);
      let response = await a.json();

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="box bder-rnd">
        <img class="bder-rnd" src="./Songs/${folder}/cover.jpg" alt="" />
        <h2>${response.title}</h2>
        <p>${response.description}</p>
        <div class="play-button">
          <img src="./SVGs/play.svg" alt="" />
        </div>
      </div>
      
      `;
    }
  }
}

function forward(play) {
  console.log("isme hi hu");
  let index = songs.indexOf(currentSong.src);
  if (index + 1 < songs.length) {
    play.src = "./images/all/pause.svg";
    playMusic(splitSong(songs[index + 1]));
  } else {
    alert("its last song");
  }
}

async function main() {
  //get list of songs
  songs = await getSongs("Songs/Adipurush");

  playMusic(splitSong(songs[0]), true);

  //display albums on the page

  await displayAlbum();

  const play = document.querySelector(".play > img");
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./images/all/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./images/all/play2.svg";
    }
  });
  // listen timeupdate event

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;

    if (currentSong.currentTime == currentSong.duration) {
      play.src = "./images/all/play2.svg";
      forward(play);
    }

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //change seek bar as per requirement

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
    //document.querySelector(".circle").style.left = percent + "%";
  });

  // add listner to hamburger
  document.querySelector(".hamburg").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0 + "%";
  });

  // add listner to close button
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = -150 + "%";
  });

  // update previous and forward button

  document.querySelector(".previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src);

    if (index - 1 >= 0) {
      play.src = "./images/all/pause.svg";
      playMusic(splitSong(songs[index - 1]));
    } else {
      alert("its first song");
    }
  });

  document.querySelector(".forward").addEventListener("click", () => {
    forward(play);
  });

  // log in click not working
  document.querySelector(".login").addEventListener("click", () => {
    var popupWindow = window.open("", "Popup", "width=400,height=200");

    // Write content to the popup window
    popupWindow.document.write("<h1>Popup Window</h1>");
    popupWindow.document.write("<p>Sorry, Bhai abhi ye kam ni kar raha</p>");
  });
  document.querySelector(".signup").addEventListener("click", () => {
    var popupWindow = window.open("", "Popup", "width=400,height=200");

    // Write content to the popup window
    popupWindow.document.write("<h1>Popup Window</h1>");
    popupWindow.document.write("<p>Sorry, Bhai abhi ye kam ni kar raha</p>");
  });

  //volume button working
  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      const volume = parseInt(e.target.value);

      if (volume === 0) {
        document.querySelector(".volume > img").src = document
          .querySelector(".volume > img")
          .src.replace("volume", "mute");
      } else {
        document.querySelector(".volume > img").src = document
          .querySelector(".volume > img")
          .src.replace("mute", "volume");
      }
      currentSong.volume = volume / 100;
    });
  //mute the volume
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume", "mute");
      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute", "volume");

      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 50;
    }
  });

  // click on box and songs will load accordingly
  Array.from(document.getElementsByClassName("box")).forEach((e) => {
    e.addEventListener("click", async () => {
      songs = await getSongs(`Songs/${e.dataset.folder}`);
      document.querySelector(".left").style.left = 0 + "%";
      //attach an event listner to each song
      Array.from(
        document.querySelector(".songPlaylist").getElementsByTagName("li")
      ).forEach((e) => {
        e.addEventListener("click", (element) => {
          play.src = "./images/all/pause.svg";
          playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
      });
    });
  });
}

main();
