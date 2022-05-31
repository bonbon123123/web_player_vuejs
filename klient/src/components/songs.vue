<template>
  <div class="song">
    <p>{{ name.name.slice(0, -4) }}</p>
    <div id="playSong" @click="addToPlaylist(name)">+</div>
    <div id="addToPlaylist" @click="$emit('playButtonHit')">></div>
  </div>
</template>

<script>
export default {
  name: "song",
  props: {
    path: String,
    name: String,
  },
  methods: {
    async addToPlaylist(x) {
      await fetch("http://localhost:3000/addSong", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(x),
        headers: {
          "Content-type": "application/json; charset=UTD-8",
        },
      }).catch((err) => console.log(err));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.song {
  position: relative;
  margin-top: 2px;

  width: 100%;
  height: 2vh;
  font-size: 2vh;
  /*margin: 0 0 0 0;*/
  background-color: #E91E63;
}
.song:hover {
  background-color: #009688;
}
#addToPlaylist {
  position: absolute;
  top: 0;
  right: 1vh;
  height: 100%;
  width: 2vh;
  background-color: #212121;
  color:white;
}
#addToPlaylist:hover {
  background-color: #FFFFFF;
}
#playSong {
  position: absolute;
  top: 0;
  right: 4vh;
  height: 100%;
  width: 2vh;
  background-color: rgb(149, 129, 168);
}
#playSong:hover {
  background-color: rgb(216, 203, 228);
}
p {
  text-align: start;
  margin: 0 0 0 0;
  /* font-size: 2vh; */
}
a {
  color: #42b983;
}
</style>
