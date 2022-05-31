<template>
  <div id="wholePage">
    <div id="titleBar">Video Player</div>
    <div id="coverBox">
      <cover
        v-for="(album, i) in covers"
        :key="album"
        :path="album.path"
        :name="albumList[i].albumName"
        @click="changeAlbum(albumList[i], i)"
      />
    </div>
    <div id="songList">
      <song
        v-for="(song, i) in currentAblumSongs"
        :key="song"
        :name="song"
        @playButtonHit="play(currentAblumSongs[i].path, i)"
      />
    </div>
    <div id="rightBar">
      <div id="playlistButton" @click="playlist">
        <img
          class="buttonImage"
          src="http://localhost:3000/static/icons/playlist.png"
          alt=""
        />
      </div>
    </div>
    <div id="player">
      <div id="progressBarContainer">
        <input
          id="progressBar"
          type="range"
          :min="0"
          :max="songDurationSeconds"
          :value="currentTimeSeconds"
          @input="progresBarChange"
          @mousedown="pause2"
          @mouseup="pause3"
        />
      </div>
      <div id="backButton" @click="back">
        <img
          class="buttonImage"
          src="http://localhost:3000/static/icons/back.png"
          alt=""
        />
      </div>
      <div id="playButton" @click="pause">
        <img class="buttonImage" :src="`${playButtonState}`" alt="" />
      </div>
      <div id="nextButton" @click="next">
        <img
          class="buttonImage"
          src="http://localhost:3000/static/icons/next.png"
          alt=""
        />
      </div>
      <div id="title">{{ title }}</div>
      <div id="timer">
        <p>{{ currentTime }}/{{ songDuration }}</p>
      </div>
      <audio
        id="audio"
        @timeupdate="audioUpdate"
        style="display: none"
        controls
      >
        <source src="" id="audio_src" type="audio/mp3" />
      </audio>
    </div>

    <button @click="first"></button>
  </div>
</template>

<script>
import cover from "./components/covers";
import song from "./components/songs";

export default {
  name: "App",
  data() {
    return {
      title: "",
      currentSong: 0,
      currentAlbum: 0,
      currentAblumSongs: [],
      albumList: [],
      songList: [],
      covers: [],
      songName: "",
      currentTime: "00:00",
      currentTimeSeconds: 0,
      songDuration: "00:00",
      songDurationSeconds: 0,
      songState: "yet to play",
      playButtonState: "http://localhost:3000/static/icons/play.png",
    };
  },
  async mounted() {
    await fetch("http://localhost:3000/first")
      .then((res) => res.json())
      .then((data) => {
        this.albumName = data.files[0].songs;

        this.albumList = [];
        for (let i = 0; i < data.files.length; i++) {
          this.albumList.push(data.files[i]);
          //console.log(data.files[i]);
        }
        this.songList = [];
        for (let i = 0; i < data.files.length; i++) {
          this.songList.push(data.files[i]);
        }
        for (let i = 0; i < this.songList.length; i++) {
          if (this.songList[i].cover.name == undefined) {
            let undefinedCover = {
              name: "undefinedCover.png",
              size: 329386,
              path: "http://localhost:3000/static/icons/missing.png",
            };
            this.covers.push(undefinedCover);
          } else {
            this.covers.push(this.songList[i].cover);
          }
        }

        for (let j = 0; j < this.songList[0].songs.length; j++) {
          this.currentAblumSongs.push(this.songList[0].songs[j]);
          //this.currentAblumSongsPaths.push(this.songList[0].songs[j].path);
        }
      });
  },
  components: {
    cover,
    song,
  },
  methods: {
    async playlist() {
      console.log("lol");
      await fetch("http://localhost:3000/getPlaylist")
        .then((res) => res.json())
        .then((data) => {
          this.currentAblumSongs = [];

          for (let j = 0; j < data.length; j++) {
            this.currentAblumSongs.push(data[j]);
          }
        });
    },
    async changeAlbum(x, y) {
      this.currentAblumSongs = [];
      //console.log(x);
      for (let j = 0; j < x.songs.length; j++) {
        this.currentAblumSongs.push(x.songs[j]);
      }
      this.currentAlbum = y;
    },
    play(x, y) {
      document.getElementById("audio_src").src = x;
      document.getElementById("audio").load();
      document.getElementById("audio").play();
      this.songState = "play";
      this.currentSong = y;
      this.title =
        this.albumList[this.currentAlbum].albumName +
        " - " +
        this.albumList[this.currentAlbum].songs[this.currentSong].name.slice(
          0,
          -4
        );
      document.getElementById("audio").play();
      this.playButtonState = "http://localhost:3000/static/icons/play.png";
      this.songState = "play";
    },
    next() {
      if (this.currentSong == this.currentAblumSongs.length - 1) {
        this.currentSong = 0;
      } else {
        this.currentSong++;
      }
      this.play(
        this.currentAblumSongs[this.currentSong].path,
        this.currentSong
      );
    },
    back() {
      if (this.currentSong == 0) {
        this.currentSong = this.currentAblumSongs.length - 1;
      } else {
        console.log(this.currentSong);
        this.currentSong--;
        console.log(this.currentSong);
      }
      this.play(
        this.currentAblumSongs[this.currentSong].path,
        this.currentSong
      );
    },
    pause(x) {
      if (this.songState == "play") {
        document.getElementById("audio").pause();
        this.playButtonState = "http://localhost:3000/static/icons/pause.png";
        this.songState = "pause";
      } else if (this.songState == "pause") {
        document.getElementById("audio").play();
        this.playButtonState = "http://localhost:3000/static/icons/play.png";
        this.songState = "play";
      }
    },
    pause2(x) {
      document.getElementById("audio").pause();
      this.playButtonState = "http://localhost:3000/static/icons/pause.png";
      this.songState = "pause";
    },
    pause3(x) {
      document.getElementById("audio").play();
      this.playButtonState = "http://localhost:3000/static/icons/play.png";
      this.songState = "play";
    },
    audioUpdate(e) {
      this.songDurationSeconds = Math.round(e.target.duration);
      this.currentTimeSeconds = Math.round(e.target.currentTime);
      // console.log(this.songDurationSeconds);
      // console.log(this.currentTimeSeconds);
      this.currentTime = this.sec2time(this.currentTimeSeconds);
      this.songDuration = this.sec2time(this.songDurationSeconds);

      //console.log((e.target.currentTime / e.target.duration) * 100);
    },
    progresBarChange(e) {
      if (this.songState == "play") {
        this.pause;
      }
      let isChrome =
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
      if (isChrome) {
        document.getElementById("audio").currentTime = String(e.target.value);
      } else {
        document.getElementById("audio").currentTime = e.target.value;
      }
    },
    sec2time(timeInSeconds) {
      var pad = function (num, size) {
          return ("000" + num).slice(size * -1);
        },
        time = parseFloat(timeInSeconds).toFixed(3),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);

      return pad(minutes, 2) + ":" + pad(seconds, 2);
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  overflow: hidden;
}
#titleBar {
  position: absolute;
  margin-left: 0;
  margin-top: 0;
  height: 10vh;
  width: 100vw;
  font-size: 9vh;
  background-color: #C2185B;
}
#coverBox {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  position: absolute;
  margin-left: 0;
  margin-top: 10vh;
  height: 80vh;
  width: 10vw;
  background-color: #009688;
}
#songList {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  position: absolute;
  margin-left: 10vw;
  margin-top: 10vh;
  height: 80vh;
  width: 80vw;
  background-color: #C2185B;
  display: flex;
  flex-direction: column;
}
#rightBar {
  position: absolute;
  margin-left: 90vw;
  margin-top: 10vh;
  height: 80vh;
  width: 10vw;
  background-color: #009688;
}
#player {
  position: absolute;
  margin-left: 0;
  bottom: 0;
  height: 10vh;
  width: 100vw;
  background-color: #F8BBD0;
}
#playButton {
  background-color: #F8BBD0;
  position: absolute;
  left: 5%;
  top: 0;
  width: 5%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#backButton {
  background-color: #F8BBD0;
  position: absolute;
  left: 0;
  top: 0;
  width: 5%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#nextButton {
  background-color: #F8BBD0;
  position: absolute;
  left: 10%;
  top: 0;
  width: 5%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#playlistButton {
  background-color: #F8BBD0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#playlistButton {
  background-color: #F8BBD0;
  position: absolute;
  left: 0;
  top: 0;
  width: 10vw;
  height: 10vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.buttonImage {
  width: 100%;
  height: 100%;
}
#timer {
  background-color: #F8BBD0;
  position: absolute;
  right: 0;
  top: 0;
  width: 10%;
  height: 50%;
  font-size: 1.5vw;
}
#progressBarContainer {
  background-color: #E91E63;
  position: absolute;
  left: 0%;
  bottom: 0;
  width: 100%;
  height: 50%;
}
#progressBar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #009688;
}
input[type="range"] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
}
#progressBar::-moz-range-thumb {
  width: 1%;
  height: 99%;
  background: rgb(0, 0, 0);
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}
#progressBar::-webkit-slider-thumb {
  width: 1vw;
  height: 5vh;
  background: rgb(0, 0, 0);
}
#title {
  font-size: 3vw;
}
#timer {
  font-size: 1.5vw;
}
</style>
