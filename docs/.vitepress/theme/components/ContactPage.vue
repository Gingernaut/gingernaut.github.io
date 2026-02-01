<template>
  <div id="contact-wrapper">
    <div
      class="typeform-widget"
      data-url="https://tyler65.typeform.com/to/mwxPWT"
      data-transparency="50"
      data-hide-headers="true"
      data-hide-footer="true"
    />
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'ContactPage',
  mounted () {
    (function () {
      let js
      let q
      const d = document
      const gi = d.getElementById
      const ce = d.createElement
      const gt = d.getElementsByTagName
      const id = 'typef_orm'
      const b = 'https://embed.typeform.com/'
      if (!gi.call(d, id)) {
        js = ce.call(d, 'script')
        js.id = id
        js.src = b + 'embed.js'
        q = gt.call(d, 'script')[0]
        q.parentNode.insertBefore(js, q)
      }
    })()
  }
}
</script>

<style scoped>
#contact-wrapper {
  display: flex;
  flex-direction: row;
}
.typeform-widget {
  width: 100vw;
  height: 80vh;
}
</style>
