<template>
  <div class="modal fade" id="modalCategoryCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add {{pageTitle}} Category</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit {{pageTitle}} Category</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class = "row">
              <div class="col-sm-6">
                <div class="form-group">
                  <label>Category Title</label>
                  <input type="text" class="form-control category-name" placeholder="Enter Category Name" v-model="category.name" v-bind:style="{background:category.color}">
                </div>
              </div>
              <div class="col-sm-6">
                <div>
                  <label>Color</label>
                </div>
                <div class = "row" v-for = "index_row in rowLength" :key='index_row'>
                <!--
                  <div class = "col-sm-4" v-for = "index_col in 3">
                    <div class = "row">
                      <div class = "col-sm-4" v-bind:style="{background:colorList[(index_row -1) * 9 + (index_col - 1) * 3]}">{{index_row}}</div>
                      <div class = "col-sm-4" v-bind:style="{background:colorList[(index_row -1) * 9 + (index_col - 1) * 3 + 1]}">{{index_row}}</div>
                      <div class = "col-sm-4" v-bind:style="{background:colorList[(index_row -1) * 9 + (index_col - 1) * 3 + 2]}">{{index_row}}</div>
                    </div>
                  </div> -->
                  <div class = "color-picker" v-for = "index_col in 9" :key='index_col' v-bind:style="{background:colorList[(index_row - 1) * 9 + index_col - 1]}" @click="setColor(index_row - 1, index_col)"></div>
                </div>
                <div class = "row">
                  <div class = "color-picker" v-for = "index_col in remainder" :key='index_col' v-bind:style="{background:colorList[rowLength * 9 + index_col - 1]}" @click="setColor(rowLength, index_col)"></div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-body" v-if = "this.modalType === 2">
          <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{category.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{category.modified_time}}</p></div>
          <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{category.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{category.created_time}}</p></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deleteCategory()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
          <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose" @click="close()">Cancel</button>
          <button type="button" class="btn btn-lg btn-success" @click="save()" v-if = "this.modalType === 1" :disabled="category.name === ''">Create</button>
          <button type="button" class="btn btn-lg btn-success" @click="update()" v-if = "this.modalType === 2" :disabled="category.name === ''">Update</button>
        </div>
        <hsy-dialog class="confirm" v-model="visible">
          <div slot="title">Delete {{category.name}}?</div>
          <div slot="body">
            <div>Are you sure you want to delete this item?</div>
            <div class='btns'>
              <button class='delete' @click="confirmDelete">Delete</button>
              <button class='cancel' @click="cancelDelete">Cancel</button>
            </div>
          </div>
        </hsy-dialog>
      </div>
    </div>
  </div>
</template>
<style>
  .color-picker{
    width: 27px;
    height: 27px;
    float: left;
    margin-right: 5px;
    margin-top: 5px;
    border-radius: 7px;
  }
  .category-name {
    color: #FFF;
    font-size:12pt;
  }
</style>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CreateCategory',
    created () {
      this.rowLength = Math.floor(this.colorList.length / 9)
      this.remainder = this.colorList.length % 9
    },
    data () {
      return {
        visible: false,
        category: {
          id: 0,
          name: '',
          type: 'formula',
          color: '#498a40',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        // colorList: [{color: '#F00'}, {color: '#0F0'}, {color: '#00F'}],
        colorList: ['#498a40', '#6baa4d', '#45a168', '#6ec496', '#88cca8', '#1a4f63', '#265a97', '#508bc8', '#9bc0e4',
          '#efe36e', '#ffd144', '#eeb41e', '#d77b00', '#d45c00', '#E12A0B', '#545ba8', '#939BF4', '#B3B9FF', '#575757',
          '#99999a', '#75a460', '#8fbd65', '#74b683', '#93d2a9', '#a6d7b9', '#507587', '#587db1', '#79a3d8', '#b3cdec',
          '#f2ea7a', '#fedd38', '#f0c638', '#dd9a38', '#da8138', '#e45d38', '#bd5338', '#825a51', '#523b6e', '#7a7dc0',
          '#abaffc', '#c4c8ff', '#fdcff8', '#fb91ed', '#996493', '#7c7c7c', '#afafb0'],
        rowLength: 0,
        remainder: 0,
        result: ''
      }
    },
    computed: {
      ...mapGetters({
        activeTab: 'getActiveTab',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        selectedCategory: 'getCategoryValue',
        categoryName: 'getCategoryName'
      }),
      pageTitle: function () {
        if (this.category.type) {
          return this.category.type.replace(/^./, this.category.type[0].toUpperCase())
        } else {
          return this.tabName
        }
      }
    },
    watch: {
      modalType: {
        handler () {
          this.category = Object.assign({}, this.selectedCategory)
          this.result = ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating category...')
        this.$store.dispatch('createCategory', this.category)
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
            const btn = this.$refs.dialogClose
            btn.click()
            this.$swal({
              title: 'Error',
              text: error.response.data.message.name[0],
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
              cancelButtonText: 'No, keep it!'
            }).then(function () {
            })
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating category...')
        this.category.tabName = this.tabName
        this.$store.dispatch('updateCategory', this.category)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      },
      setColor: function (row, col) {
        this.category.color = this.colorList[row * 9 + col - 1]
      },
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 0)
        } else {
          this.$store.dispatch('setModalType', 3)
        }
        this.result = ''
      },
      deleteCategory: function () {
        this.visible = true
        this.$store.dispatch('setModalType', 3)
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteCategory', this.category.id)
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
      }
    }
  }
</script>
