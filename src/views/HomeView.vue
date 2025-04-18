<template>
  <div class="home">
    <OpenAi/>
  </div>
</template>

<script>
// @ is an alias to /src
import OpenAi from '../components/OpenAi.vue';

export default {
  name: 'HomeView',
  components: {
    OpenAi
  }
}
</script>
