

<template>
   <div id="contact-wrapper">
    <div class="typeform-widget" data-url="https://tyler65.typeform.com/to/mwxPWT" data-transparency="50" data-hide-headers=true data-hide-footer=true></div>
   </div>
</template>

<script>
export default {
  name: "contact",
  components: {},
  mixins: [],
  head() {
    return {
      title: "Contact",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Crimson+Text|Muli"
        }
      ]
    }
  },
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    (function() {
      let qs,
        js,
        q,
        s,
        d = document,
        gi = d.getElementById,
        ce = d.createElement,
        gt = d.getElementsByTagName,
        id = "typef_orm",
        b = "https://embed.typeform.com/"
      if (!gi.call(d, id)) {
        js = ce.call(d, "script")
        js.id = id;
        js.src = b + "embed.js"
        q = gt.call(d, "script")[0]
        q.parentNode.insertBefore(js, q)
      }
    })();
  },
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
.contact-wrapper {
  display: flex;
  flex-direction: row;
}

.typeform-widget {
  height: 99vh;
  width: 100vw;
}
</style>
