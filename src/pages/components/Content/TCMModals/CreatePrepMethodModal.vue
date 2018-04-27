<template>
  <div class="modal fade" id="modalPrepMethodCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add Prep Method</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit Prep Method</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" placeholder="Enter Method Name" v-model="prepMethod.name">
            </div>
            <div class="form-group">
              <label>Prep Method</label>
              <input type="text" class="form-control" placeholder="Enter Method Description" v-model="prepMethod.description">
            </div>
            <div class="form-group">
              <FBSelect
                @select2="category_item = $event"
                :selectVal="prepMethod.categories && prepMethod.categories.length > 0 ? prepMethod.categories[0].id : category_item"
                :selectId="'categorySelect'"
                :defaultClass = "'select-full-width'"
                :options="categories.items">
                <label for="categorySelect" class="control-label" slot="before">Category</label>
              </FBSelect>
            </div>
            <div class="modal-body" v-if = "this.modalType === 2">
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{prepMethod.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{prepMethod.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{prepMethod.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{prepMethod.created_time}}</p></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deletePrepMethod()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
              <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose" @click="close()">Cancel</button>
              <button type="button" class="btn btn-lg btn-success" @click="save()" v-if = "this.modalType === 1" :disabled="prepMethod.name === '' || prepMethod.method === '' || category_item === ''">Create</button>
              <button type="button" class="btn btn-lg btn-success" @click="update()" v-if = "this.modalType === 2">Update</button>
            </div>
            <hsy-dialog class="confirm" v-model="visible">
              <div slot="title">Delete {{prepMethod.name}}?</div>
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
  .select2-container {
    width: 100% !important;
  }
  .select2-dropdown {
    z-index: 9999 !important;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  const FBSelect = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBSelect.vue')
  export default {
    name: 'CreatePrepMethod',
    components: {
      FBSelect
    },
    data () {
      return {
        visible: false,
        prepMethod: {
          id: '',
          name: '',
          description: '',
          category: 0,
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: '',
          categories: []
        },
        prepMethodCategory: {
          prep_id: 0,
          category_id: 0
        },
        result: '',
        category_item: 0
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedPrepMethod: 'getPrepMethod',
        tabName: 'getActiveTabName',
        categories: 'getCategories'
      })
    },
    created () {
      this.$store.dispatch('fetchCategories', {type: 'preparation', 'per-page': 0})
    },
    watch: {
      modalType: {
        handler () {
          this.prepMethod = Object.assign({}, this.selectedPrepMethod)
          this.result = ''
          this.category_item = this.selectedPrepMethod.category
        }
      }
    },
    methods: {
      save: function () {
        this.prepMethod.categories = [{id: this.category_item}]
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating prep method...')
        this.$store.dispatch('createPrepMethod', this.prepMethod)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            const btn = this.$refs.dialogClose
            this.result = 'success'
            btn.click()
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      update: function () {
        this.prepMethod.categories = [{id: this.category_item}]
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating prep method...')
        this.$store.dispatch('updatePrepMethod', this.prepMethod)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            this.$store.dispatch('setLoadingBar', 'none')
            console.log(error)
          })
      },
      deletePrepMethod: function () {
        this.visible = true
        this.$store.dispatch('setModalType', 3)
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deletePrepMethod', {id: this.prepMethod.id, type: this.prepMethod.type})
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
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 0)
        } else {
          this.$store.dispatch('setModalType', 3)
        }
        this.result = ''
      }
    }
  }
</script>
