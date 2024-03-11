console.log("let stART JAVAsCRIPT");

let currentSong = new Audio();

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

const playMusic = (track) => {
  currentSong.src = "/Songs/" + track + ".mp3";
  currentSong.play();
};

async function main() {
  //get list of songs
  let songs = await getSongs();
  console.log(songs);

  //show all the songs in playlist

  let songUL = document
    .querySelector(".songPlaylist")
    .getElementsByTagName("ul")[0];

  for (var song of songs) {
    song = song.split("/Songs/")[1].split(".mp3")[0];

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
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
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
}

main();
