<template>
  <div id="contact-wrapper">
    <div v-if="!hasSubmitted">
      <h1 class="friendlyMessage">Say Hello</h1>
      <form @submit.prevent="sendContact">
        <fieldset>
          <label for="nameField">Name</label>
          <input v-model="name" type="text" placeholder="" id="nameField" />

          <label for="emailField">Email Address</label>
          <input
            v-model="emailAddress"
            type="text"
            placeholder=""
            id="emailField"
          />

          <label for="commentField" id="commentLabel">Comment</label>
          <textarea
            v-model="bodyText"
            placeholder="Hi Tyler …"
            id="commentField"
          ></textarea>

          <br />
          <p v-for="err in errors" :key="err" class="error">{{ err }}</p>

          <button>Submit</button>
        </fieldset>
      </form>
    </div>
    <div v-else>
      <br />
      <h2 class="friendlyMessage">Thanks for reaching out!</h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const HTTP = () => {
  return axios.create();
};

/* eslint-disable */
export default {
  name: "contactPage",
  components: {},
  mixins: [],
  data() {
    return {
      hasSubmitted: false,
      errors: [],

      name: null,
      emailAddress: null,
      bodyText: null,
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
  },
  computed: {},
  methods: {
    sendContact() {
      this.errors = [];
      if (!this.emailAddress) {
        this.errors = ["Email Address is required"];
        return;
      }

      if (!this.name) {
        this.errors = ["name"];
        return;
      }

      if (!this.bodyText) {
        this.errors = ["You need to type a message!"];
        return;
      }
      HTTP()
        .post("https://hook.integromat.com/j2sh4hut8gjuq3bw4nntu6ka0lhizxdi", {
          emailAddress: this.emailAddress,
          name: this.name,
          bodyText: this.bodyText,
        })
        .then((res) => {
          console.log("subitted response");
          this.hasSubmitted = true;
          this.name = null;
          this.emailAddress = null;
          this.bodyText = null;
        })
        .catch((err) => {
          console.log("err");
          console.log(err);
        });
    },
  },
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
#contact-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  #friendlyMessage {
    margin-left: auto;
    margin-right: auto;
    margin-top: 40px;
  }

  form {
    width: 50vw;
    min-width: 400px;
    max-width:1000px;
    margin-top: 30px;

    * {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    }
  }

  fieldset {
    border: none;
  }

  label {
    display: block;
    margin: 0;
    padding: 0;
  }

  input {
    min-width: 300px;
    margin-top: 10px;
    display: inline-block;
    height: 30px;
  }

  input,
  #commentField {
    min-width: 300px;
    width: 100%;

    padding: 5px;
    padding-left: 8px;
    border-radius: 4px;
    box-shadow: 0px;
    border: 1px solid #3eaf7c;
  }

  #commentField {
    margin-top: 10px;
    min-height: 150px;
  }

  #message-sent {
    padding: 30px;
  }
}

button {
  background-color: #3eaf7c;
  width: 100%;
  border: 0;
  border-radius: 4px;
  padding: 10px 0;
  margin: 10px 0;
  text-align: center;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}



@media only screen and (max-width: 800px) {
  #contact-wrapper {
  form {
    width:100%;
    max-width:100vw;
    min-width:none;
  }
}
}
</style>
