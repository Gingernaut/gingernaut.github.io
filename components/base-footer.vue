<template>
  <div>
    <footer id="primary-footer" />
  </div>
</template>

<script>
export default {
  name: 'BaseFooter',
  components: {
  },
  mixins: [],
  data () {
    return {
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  filters: {
  },
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="scss" scoped>

#primary-footer {
  display: flex;
  flex-direction: row;
  // justify-content: flex-end;
  padding-bottom: 2vh;
  height:140px;
  background-color: $grey;
  color: $off-white;
}

</style>
