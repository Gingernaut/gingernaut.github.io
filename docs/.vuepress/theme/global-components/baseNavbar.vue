<template>
  <nav id="primary-navbar">
    <div id="navcontent">
    <router-link id="site-anchor" to="/">Tyler Peterson</router-link>
    <router-link to="/about">About</router-link>
    <SearchBox id="searchBox" />
    </div>
  </nav>
</template>

<script>
import SearchBox from "@SearchBox";
export default {
  name: "baseNavbar",
  components: {
    SearchBox
  },
  mixins: [],
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
};
</script>

<style lang="scss">
#primary-navbar {
  height: 60px;
  border-bottom: 1px solid #3eaf7c;
  padding:5px;

  #navcontent {
    display: flex;
    flex-direction: row;
    align-items:center;
    width:100%;
    height:100%;


    #site-anchor {
      font-size:1.75em;
    }

    #searchBox {
      display: block;
      margin-left:auto;
      margin-right:10px;
    }
  }
}
</style>
