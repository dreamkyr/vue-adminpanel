<template>
  <div class="modal fade" id="modalHerbologyGeneranCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add {{tabName}}</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit {{tabName}}</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" :placeholder="placeHolderText" v-model="herbology.name">
            </div>            
            <div class="modal-body" v-if = "this.modalType === 2">	  		
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{herbology.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{herbology.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{herbology.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{herbology.created_time}}</p></div>	  		
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deleteHerbology()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
              <button type="button" class="btn btn-lg btn-default pull-left" data-dismiss="modal" @click="close()" v-if = "this.showLinkButton() === true"><i class="fa fa-chain"></i> (3)linked</button>
              <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose" @click="close()">Cancel</button>
              <button type="button" class="btn btn-lg btn-success" @click="save()" v-if = "this.modalType === 1" :disabled="herbology.name === ''">Create</button>
              <button type="button" class="btn btn-lg btn-success" @click="update()" v-if = "this.modalType === 2">Update</button>
            </div>
            <hsy-dialog class="confirm" v-model="visible">
              <div slot="title">Delete {{herbology.name}}?</div>
              <div slot="body">
                <div>Are you sure you want to delete this item?</div>
                <div class='btns'>
                  <button class='delete' @click="confirmDelete">Delete</button>
                  <button class='cancel' @click="cancelDelete">Cancel</button>
                </div>
              </div>
            </hsy-dialog>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .pull-left{
    margin-top: 0px !important;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CreateHerbology',
    data () {
      return {
        visible: false,
        herbology: {
          id: 0,
          name: '',
          type: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        result: '',
        placeHolderText: ''
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedHerbology: 'getHerbology',
        tabName: 'getActiveTabName'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.herbology = Object.assign({}, this.selectedHerbology)
          this.result = ''
          this.placeHolderText = 'Enter ' + this.tabName + ' Name'
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating ' + this.tabName + '...')
        this.$store.dispatch('createHerbology', this.herbology)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating' + this.tabName + '...')
        this.$store.dispatch('updateHerbology', this.herbology)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 0)
        } else {
          this.$store.dispatch('setModalType', 3)
        }
        this.result = ''
      },
      deleteHerbology: function () {
        this.visible = true
        this.$store.dispatch('setModalType', 3)
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteHerbology', {id: this.herbology.id, type: this.herbology.type})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$store.dispatch('setModalType', 0)
            this.result = 'success'
          })
          .catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$swal(
              'Error!',
              error.message,
              'error'
            )
          })
      },
      cancelDelete () {
        this.visible = false
      },
      showLinkButton () {
        if (this.tabName === 'English' || this.tabName === 'Latin') {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
