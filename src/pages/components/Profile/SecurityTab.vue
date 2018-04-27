<template>
  <div class="tab-pane" id="security">
    <div class="box-body">
      <ClipLoader :loading="loading"></ClipLoader>
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label"></label>
          <div class="col-sm-10">
            <h4>Change password</h4>
          </div>
        </div>
        <FBInput type="password" name="currentPassword" v-if="!this.$route.params.hasOwnProperty('id')"
                 validateRules="required"
                 @inputChanged="setCurrentPassword($event)"
                 inputId="currentPassword"
                 :isRequired="true" placeholder="Enter current password">
          <label slot="before" for="currentPassword" class="col-sm-2 control-label">Current password</label>
        </FBInput>
        <FBInput type="password" name="newPassword"
                 validateRules="min:8|max:32" @inputChanged="setNewPassword($event)"
                 inputId="newPassword"
                 :isRequired="true" placeholder="Enter New password">
          <label slot="before" for="newPassword" class="col-sm-2 control-label">New password</label>
        </FBInput>
        <FBInput type="password" name="retype" @inputChanged="setRetypePassword($event)"
                 validateRules="min:8|max:32" inputId="retype"
                 :isRequired="true" placeholder="Retype password">
          <label slot="before" for="retype" class="col-sm-2 control-label">Retype</label>
        </FBInput>

        <div class="form-group">

          <div class="col-sm-offset-2 col-sm-10">
            <FBButton :disabled="errors.any() || isEmpty" :onClick="savePassword" ref="saveButton"
                      buttonClass="btn btn-primary" buttonText="Save">
            </FBButton>
          </div>
        </div>

        <div class="form-group ">
          <label class="col-sm-2 control-label"></label>

          <div class="col-sm-10">
            <h4>2-Step Verification</h4>
          </div>
        </div>
        <div class="form-group">
          <label for="inputName" class="col-sm-2 control-label"></label>

          <div class="col-sm-10">
            <button type="button" class="btn btn-default" data-toggle="modal"
                    data-target="#modalVerifyPhone">+ Verify a Phone
            </button>
          </div>
        </div>


        <div class="form-group">
          <label class="col-sm-2 control-label"></label>

          <div class="col-sm-10">
            <h4>Session Settings</h4>
          </div>
        </div>
        <div class="form-group">
          <label for="inputPassword3" class="col-sm-2 control-label"></label>

          <div class="col-sm-10">
            <button type="submit" class="btn btn-default">+ Set Session Timeout</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  import validateInit from '../../../mixins/validateInitial'
  import { mapGetters } from 'vuex'
  const FBInput = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBInput.vue')
  const FBButton = () => import(/* webpackChunkName: "UI Elements" */ '../../../components/FBButton.vue')
  export default {
    name: 'SecurityTab',
    inject: ['$validator'],
    mixins: [validateInit],
    data () {
      return {
        updatePassword: {},
        isEmpty: true
      }
    },
    computed: {
      ...mapGetters({
        loading: 'getLoadingStatus'
      })
    },
    methods: {
      setCurrentPassword ($event) {
        this.updatePassword.currentPassword = $event
        this.isEmpty = false
      },
      setNewPassword ($event) {
        this.updatePassword.newPassword = $event
        this.isEmpty = false
      },
      setRetypePassword ($event) {
        this.updatePassword.retype = $event
        this.isEmpty = false
      },
      savePassword () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating password...')
        this.$store.dispatch('updateUserPassword', {
          'new_password': this.updatePassword.newPassword,
          'new_password2': this.updatePassword.retype,
          'id': this.$route.params.hasOwnProperty('id') ? this.$route.params.id : null
        })
          .then(() => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (!this.$route.params.hasOwnProperty('id')) {
              this.$store.dispatch('signOut')
                .then((response) => {
                  this.$router.push({name: 'Sign In'})
                })
                .catch((error) => {
                  this.$store.dispatch('setLoadingBar', 'none')
                  console.log(error)
                })
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      }
    },
    components: {
      FBInput,
      FBButton
    }
  }
</script>
