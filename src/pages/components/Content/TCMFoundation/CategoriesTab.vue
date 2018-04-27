<template>
  <div class="">
    <div class="box-body">
      <h3>{{tabName}}&nbsp;
        <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{allCategories.total}}</span> 
        <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalCategoryCreate" @click="addCategory()"><i class="fa fa-plus"></i> Add New</button>
        <select v-model="selected" v-on:change="onChangeSort" class="form-control sort">
          <option v-for="value in sorts" :value="value" :key="value">
            {{value}}
          </option>
        </select>
      </h3>
    </div>
    <FBDataTable ref="categoryTable" :css="css.table" :fields="fields" dataPath="items" :data="categories"
                 :muti-sort="true" multi-sort-key="ctrl"
                 :methodName="'fetchCategories'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">  
      <template slot="name" slot-scope="props">
        <span class="badge" style="font-size: 12pt; font-weight:400" v-bind:style="{background: props.rowData.color}">{{props.rowData.name}}</span>
      </template>
      <template slot="linked" slot-scope="props" v-if="type === 1">
        3
      </template>  
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template> 
      <template slot="date" slot-scope="props">
        {{props.rowData.created_time | moment("D MMMM YYYY [at] hh:mmA")}}
      </template> 
      <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalCategoryCreate" @click="editCategory(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click="deleteCategory(props.rowData)"><i class="fa fa-trash"></i></button>
        </div>
      </template>    
      <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <!-- /.table-responsive -->
    <!-- /.post -->
    <CreateCategoryModal></CreateCategoryModal>
    <hsy-dialog class="confirm" v-model="visible">
      <div slot="title">Delete {{selectedCategory}}?</div>
      <div slot="body">
        <div>Are you sure you want to delete this item?</div>
        <div class='btns'>
          <button class='delete' @click="confirmDelete">Delete</button>
          <button class='cancel' @click="cancelDelete">Cancel</button>
        </div>
      </div>
    </hsy-dialog>
  </div>
</template>
<script>
  const CreateCategoryModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateCategory.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  export default {
    name: 'CategoriesTab',
    components: {
      CreateCategoryModal,
      FBDataTable,
      FBPagination
    },
    data () {
      return {
        visible: false,
        css: datatableConfig,
        selected: 'All',
        sorts: [
          'All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
          'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ],
        fields: [
          {
            title: 'Name',
            name: '__slot:name'
          },
          {
            title: 'Created',
            name: '__slot:created'
          },
          {
            title: 'Date',
            name: '__slot:date'
          },
          {
            title: '',
            name: '__slot:control'
          }
        ],
        pagination: {
          page: 1
        },
        category: {
          id: '',
          name: '',
          type: '',
          color: '#498a40',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        selectedCategory: '',
        selectedId: '',
        categories: {
          items: {}
        }
      }
    },
    created () {
      // this.$store.dispatch('fetchCategories', { type: 'formula', page: this.pagination.page })
      // this.getCategories()
    },
    watch: {
      activeTab: {
        handler () {
          this.selected = 'All'
          this.$store.dispatch('setAlabetSort', this.selected)
          if (this.type !== 2) this.$refs.categoryTable.reload()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type !== 2) {
            this.$refs.categoryTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        tabName: 'getActiveTabName',
        type: 'getTcmTabType',
        modalType: 'getModalType',
        activeTab: 'getActiveTab',
        allCategories: 'getCategories',
        loading: 'getLoadingBar'
      })
    },
    methods: {
      onChangeSort () {
        this.$store.dispatch('setAlabetSort', this.selected)
        this.getCategories()
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.categoryTable.changePage(page)
        this.pagination.page = page
      },
      nextPage: function (p) {
        this.pagination.page = this.pagination.page + p
      },
      prevPage: function (p) {
        this.pagination.page = this.pagination.page - p
      },
      addCategory: function () {
        this.category.name = ''
        let type = this.activeTab
        if (type === 'prep') type = 'preparation'
        this.category.type = type
        this.category.color = '#498a40'
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setCategoryValue', this.category)
      },
      editCategory: function (item) {
        this.category.name = item.name
        let type = this.activeTab
        if (type === 'prep') type = 'preparation'
        this.category.type = type
        this.category.color = item.color
        this.category.modified_time = item.modified_time
        this.category.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.category.created_time = item.created_time
        this.category.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.category.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setCategoryValue', this.category)
      },
      getCategories () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        let type = this.activeTab
        if (type === 'prep') type = 'preparation'
        this.$store.dispatch('fetchCategories', { type: type, page: this.pagination.page })
          .then((response) => {
            this.categories = response
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.categoryTable.reload()
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
      deleteCategory (item) {
        this.visible = true
        this.selectedCategory = item.name
        this.selectedId = item.id
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteCategory', this.selectedId)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.getCategories()
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
