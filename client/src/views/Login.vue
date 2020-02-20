<template>
  <div class="view">
    <div class="d-flex justify-content-center align-items-center">
      <div class="container">
        <v-layout v-if="dialog">
          <v-card flat class="ma-auto">
            <v-img
              :src="providerLogo"
              height="120px"
              width="120px"
              style="position:absolute;border-radius:50%"
            ></v-img>
            <v-progress-circular
              class="mx-auto"
              :size="120"
              :width="7"
              color="blue lighten-2"
              indeterminate
            ></v-progress-circular>
          </v-card>
        </v-layout>
        <v-layout justify-space-around wrap style="z-index:20" v-else>
          <v-flex xs12>
            <v-card
              max-width="450px"
              elevation="15"
              class="ma-auto"
              height="500px"
            >
              <v-toolbar flat height="50px">
                <v-icon color="black" class="mx-1">lock_open</v-icon>
                <v-toolbar-title>{{ $t('Login.login') }}</v-toolbar-title>
              </v-toolbar>
              <v-form v-model="valid" ref="form" lazy-validation class="mx-3 mt-4">
                <v-text-field
                  outlined
                  class="purple-input"
                  v-model="username"
                  :counter="20"
                  :rules="nameRules"
                  label="Username"
                  required
                  v-if="cardLang == 'en'"
                />
                <v-text-field
                  outlined
                  v-model="password"
                  :rules="passwordRules"
                  label="Password"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :counter="20"
                  required
                  v-if="cardLang == 'en'"
                />
                <v-text-field
                  outlined
                  class="purple-input"
                  v-model="username"
                  :counter="20"
                  :rules="nameRules"
                  label="Nom d'utilisateur"
                  required
                  v-if="cardLang == 'fr'"
                />
                <v-text-field
                  outlined
                  v-model="password"
                  :rules="passwordRules"
                  label="Mot de passe"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :counter="20"
                  required
                  v-if="cardLang == 'fr'"
                />
                <v-btn
                  block
                  :disabled="!valid || !isEmpty"
                  @click="LoginUser"
                  class="ma-1 font-weight-light"
                  color="blue lighteb-2"
                >
                  <span class="white--text">{{ $t('Login.login') }}</span>
                </v-btn>
                <span>{{ $t('Login.with') }}</span>
                <v-btn @click="githubLogin" icon fab>
                  <v-avatar size="30">
                    <v-img :src='github_white'></v-img>
                  </v-avatar>
                </v-btn>
                <v-btn @click="schoolLogin" icon fab>
                  <v-avatar size="30">
                    <v-img :src="white_42"></v-img>
                  </v-avatar>
                </v-btn>
                <v-btn class="ma-1" to="forgot" absolute bottom left text>
                  <span>{{ $t('Login.forgot') }}</span>
                </v-btn>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
        <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
          <v-icon color="white">error</v-icon>
          <span>{{ $t(`LoginError.err_${text}`) }}</span>
          <v-btn color="white" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbar2" :timeout="5000" color="success" right top class="mt-4">
          <v-icon color="white">done</v-icon>
          <span>{{ $t("Login.success") }}</span>
          <v-btn color="white" text @click="snackbar2 = false">Close</v-btn>
        </v-snackbar>
      </div>
    </div>
    <main>
          <div class="card col-md-12 text-center mt-5">
            <p class="mt-2">
              <strong>2020 &copy; Hypertube - 1337</strong>
            </p>
          </div>
    </main>
  </div>
</template>

<script>
import Axios from "axios";
import i18n from "../i18n";
import { setInterval } from "timers";
import github_white from '../../public/github_white.png'
import white_42 from '../../public/42_white.png'

export default {
  mounted() {
    if (this.$route.params.status == "success") {
      this.snackbar2 = true;
    }
    if ((this.$route.params.provider == "github") && !window.localStorage.token)
    {
      this.provider = this.$route.params.provider;
      this.dialog = true;
      let path = this.$route.fullPath;
      Axios.get(`http://localhost:3001${path}`)
        .then(res => {
          if (res.data.status == "success") {
            window.localStorage.setItem("token", res.data.msg);
            this.$router.push({ name: "home" });
          } else {
            this.snackbar = true;
            this.text = res.data.msg;
            setTimeout(() => {
              this.$router.push({ path: `/${i18n.locale}/login` });
            }, 2500);
          }
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    }
    if (this.$route.params.provider == "42") {
      this.provider = "42";
      this.dialog = true;
      let path = this.$route.query.code;
      var data = {
        grant_type: "authorization_code",
        client_id:
          "79d5d33627b0a8fa381930855ee0c5274eb5b3aa219ed0d85ee6d725969f12bd",
        client_secret:
          "4c49ed4ac54430dd980570953e2aa65af6569dfc68c08fd29b795177fa1ebfb6",
        code: path,
        redirect_uri: "http://localhost:8080/login/42"
      };
      Axios.post(`https://api.intra.42.fr/oauth/token`, data)
        .then(res => {
          this.GetSchoolData(res.data.access_token);
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    }
  },
  data() {
    return {
      github_white: github_white,
      white_42: white_42,
      provider: "hyper",
      dialog: false,
      valid: true,
      show1: false,
      snackbar2: false,
      snackbar: false,
      timeout: 5000,
      text: "1",
      username: "",
      nameRules: [
        v => !!v || "Username is required",
        v => (v && v.length <= 20) || "Userame must be less than 10 characters"
      ],
      password: "",
      passwordRules: [
        v => !!v || "Password is required",
        v => (v && v.length <= 20) || "Name must be less than 12 characters"
      ]
    };
  },

  methods: {
    GetSchoolData(token) {
      Axios.post("http://localhost:3001/login/42", { token: token })
        .then(res => {
          if (res.data.status == "success") {
            window.localStorage.setItem("token", res.data.msg);
            this.$router.push({ name: "home" });
          } else {
            this.snackbar = true;
            this.text = res.data.msg;
            setTimeout(() => {
              this.$router.push({ path: `/${i18n.locale}/login` });
            }, 2500);
          }
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    },
    githubLogin() {
      window.location =''},
    schoolLogin() {
      window.location = 'https://api.intra.42.fr/oauth/authorize?client_id=79d5d33627b0a8fa381930855ee0c5274eb5b3aa219ed0d85ee6d725969f12bd&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2F42&response_type=code'
    },
    LoginUser() {
      Axios.post("http://localhost:3001/login", {
        username: this.username,
        password: this.password
      })
        .then(response => {
          if (response.data.status == "failure") {
            this.snackbar = true;
            this.text = response.data.msg;
          } else if (response.data.status == "success") {
            window.localStorage.setItem("token", response.data.Token);
            this.$router.push({ name: "home" });
          }
        })
        .catch(error => {
          this.$router.push({ path: `/${i18n.locale}/login` });
        });
    },
    removeDiv() {
      this.status = 0;
    }
  },
  computed: {
    providerLogo() {
      return require("../../public/" + this.provider + "_white.png");
    },
    isEmpty() {
      return this.username && this.password;
    },
    title() {
      return this.$store.state.title;
    },
    cardLang() {
      return i18n.locale;
    }
  }
};
</script>

