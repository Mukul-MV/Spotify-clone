console.log("let stART JAVAsCRIPT");

let currentSong = new Audio();

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

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/Songs/");
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
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/Songs/" + track + ".mp3";
  if (!pause) {
    currentSong.play();
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
};

var splitSong = (songURL) => {
  return songURL.split("/Songs/")[1].split(".mp3")[0];
};

async function main() {
  //get list of songs
  let songs = await getSongs();

  playMusic(splitSong(songs[0]), true);

  //show all the songs in playlist

  let songUL = document
    .querySelector(".songPlaylist")
    .getElementsByTagName("ul")[0];

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

  //attach an event listner to each song

  Array.from(
    document.querySelector(".songPlaylist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      play.src = "./images/all/pause.svg";
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

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
}

main();
