<template>
  <div>
    <section class="content-header">
      <button type="button" class="btn btn-sm btn-default" @click="back()"><i class="fa fa-arrow-left"></i> Back</button>
      <h1>{{$store.getters.getUserProfile | fullUserName}}</h1>
    </section>

    <section class="content">
      <div class="row">
        <UserInfo></UserInfo>
        <TabController></TabController>
      </div>
    </section>
  </div>
</template>

<script>
  const TabController = () => import(/* webpackChunkName: "Profile" */ './components/Profile/TabController.vue')
  const UserInfo = () => import(/* webpackChunkName: "Profile" */ './components/Profile/UserInfo.vue')
  export default {
    name: 'Profile',
    components: {
      TabController,
      UserInfo
    },
    methods: {
      back: function () {
        this.$router.go(-1)
      }
    }
  }
</script>
