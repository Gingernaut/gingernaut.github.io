<template>
  <div>
    <footer id="primary-footer">
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
#primary-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  /* justify-content: flex-end; */
  padding-bottom: 2vh;
  padding-right: 2vh;
  height:140px;
  background-color: #3a4556;
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23b5c2b7' fill-opacity='0.08' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
  color: #f9fbff;
}

#primary-footer a {
  color: #f9fbff;
  display:inline-flex;
  margin-left: 15px;
  margin-right:15px;
  padding:5px;
  padding-left:10px;
  padding-right:10px;
  text-decoration: none;
}
</style>
