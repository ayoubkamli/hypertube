<template>
  <v-footer 
    padless
  >
    <main>
          <div class="card col-md-12 text-center mt-5" style='position: absolute; bottom: 10px;'>
            <p class="mt-2">
              <strong>2020 &copy; Hypertube - 1337</strong>
            </p>
          </div>
    </main>
  </v-footer>
</template>

<script>
import i18n from '../i18n'
import axios from 'axios'

export default {
    data: () => ({
      links: [
                { icon: 'person', text: 'Profile', route: `/profile` },
                { icon: 'home', text: 'Home', route: `/home` },
                { icon: 'settings', text: 'Settings', route: `/settings` },
        ],
    }),
    methods: {
      
        ToEN(){
          if (i18n.locale == 'fr')
          {
            const token = window.localStorage.getItem('token')
            if (token) axios.defaults.headers.common['x-auth-token'] = token
            else delete axios.defaults.headers.common['x-auth-token']

            axios.post("http://localhost:3001/profile/switchLang", {lang: 'en'})
            .then(res => {
              i18n.locale = 'en'
              this.$store.state.userData.lang = 'fr'
              //location.reload()
            })
            .catch(err => {
              this.$router.push({ name: "home" });
            })
          }
        },
        ToFR() {
          if (i18n.locale == 'en')
          {
            const token = window.localStorage.getItem('token')
            if (token) axios.defaults.headers.common['x-auth-token'] = token
            else delete axios.defaults.headers.common['x-auth-token']

            axios.post("http://localhost:3001/profile/switchLang", {lang: 'fr'})
            .then(res => {
              i18n.locale = 'fr'
              this.$store.state.userData.lang = 'fr'
              //location.reload()
            })
            .catch(err => {
              this.$router.push({ name: "home" });
            })
            
          }
        },
    },
  }
</script>
<style>
.v-footer{
  margin-bottom: -30px;
    padding: 6px;
      position: absolute;
    bottom: 0;
    width: 100%;
}
</style>