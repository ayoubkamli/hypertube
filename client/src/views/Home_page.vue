<template>

        <div class="view">
          <div class="mask rgba-container d-flex justify-content-center align-items-center">
            <div class="container">
              <div class="row">
                <div class="col-md-6 text-center text-md-left mt-xl-5 mb-5" data-wow-delay="0.3s">
                    <v-btn @click="ToSignup" large class="mr-2  ">{{ $t('Landing.signup') }}</v-btn>
                    <v-btn @click="ToLogin" large outlined >{{ $t('Landing.login') }}</v-btn>
                </div>
              </div>
            </div>
          </div>
      <main>
          <div class="card col-md-12 text-center mt-5" style='position: absolute; bottom: 10px;'>
            <p class="mt-2">
              <strong>2020 &copy; Hypertube - 1337</strong>
            </p>
          </div>
    </main>
        </div>        
</template>
<script>
import i18n from '../i18n'

export default {
    methods: {
      ToSignup() {
        this.$router.push({path: `/${i18n.locale}/signup`})
      },
      ToLogin() {
        this.$router.push({path: `/${i18n.locale}/login`})
      }
    }
}
</script>
  
