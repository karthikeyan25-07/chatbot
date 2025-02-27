<template>
  <div class="home">
    <openAi/>
  </div>
</template>

<script>
// @ is an alias to /src
import openAi from '@/components/openAi.vue';

export default {
  name: 'HomeView',
  components: {
    openAi
  }
}
</script>
