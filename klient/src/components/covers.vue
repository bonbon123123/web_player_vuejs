<template>
  <div class="cover">
    <img :src="`${path}`" class="album-cover" alt="album cover" />
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "cover",
  props: {
    path: String,
    name: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 0px;
  margin: 0 0 0 0;
  background-color: #212121;
  color:#FFFFFF;
  width: 100%;
  text-align: center;
}
.cover:hover {
  background-color: #757575;
}

img {
  margin: 0 auto;
  width: 80%;
  height: 80%;
}
p {
  display: inline-block;
  margin: 0 0 0 0;
  font-size: 1.2vw;
}
a {
  color: #42b983;
}
</style>
