<template>
  <div class="">
    <div class="box-body">
      <h3>{{tabName}}&nbsp;
        <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{allPrepMethods.total}}</span>
        <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalPrepMethodCreate" @click="addPrepMethod()"><i class="fa fa-plus"></i> Add New</button>
        <select v-model="selected" v-on:change="onChangeSort" class="form-control sort">
          <option v-for="value in sorts" :value="value" :key="value">
            {{value}}
          </option>
        </select>
      </h3>
    </div>
    <FBDataTable ref="prepTable" :css="css.table" :fields="fields" dataPath="items" :data="prepMethods"
                 :muti-sort="true" multi-sort-key="ctrl"
                 :methodName="'searchPrepMethods'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">

      <template slot="name" slot-scope="props">
        {{props.rowData.name}}
      </template>
      <template slot="category" slot-scope="props">
          <span v-if="props.rowData.categories.length > 0">{{props.rowData.categories[0].name}}</span>
          <span v-else></span>
      </template>
      <template slot="description" slot-scope="props">
        {{props.rowData.description}}
      </template>
      <template slot="associated" slot-scope="props">
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
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalPrepMethodCreate" @click="editPrepMethod(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click.prevent="deletePrepMethod(props.rowData)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <CreatePrepMethodModal></CreatePrepMethodModal>
    <hsy-dialog class="confirm" v-model="visible">
      <div slot="title">Delete {{selectedPrepName}}?</div>
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
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const CreatePrepMethodModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreatePrepMethodModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'PrepMethodTab',
    components: {
      CreatePrepMethodModal,
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
            title: 'Category',
            name: '__slot:category'
          },
          {
            title: 'Method',
            name: '__slot:description'
          },
          {
            title: 'Associated',
            name: '__slot:associated'
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
        prepMethod: {
          id: '',
          name: '',
          description: '',
          category: 0,
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        selectedPrepName: '',
        selectedId: '',
        prepMethods: {
          items: {}
        }
      }
    },
    created () {
      // this.getPreparations()
    },
    watch: {
      pagination: {
        handler () {
          this.$store.dispatch('fetchFormulas', { page: this.pagination.page })
        },
        deep: true
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type === 2) {
            this.$refs.prepTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        allPrepMethods: 'getPrepMethods',
        type: 'getTcmTabType'
      })
    },
    methods: {
      onChangeSort () {
        this.$store.dispatch('setAlabetSort', this.selected)
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        if (this.selected === 'All') {
          this.$store.dispatch('setAlabetSort', '')
          this.getPreparations()
          return
        }
        this.$store.dispatch('searchPrepMethods', { type: this.activeTab, sort: this.selected, page: this.pagination.page })
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.prepTable.reload()
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
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.prepTable.changePage(page)
        this.pagination.page = page
      },
      formatDate (value, fmt = 'D MMMM Y') {
        return (value === null)
          ? ''
          : this.$moment(value, 'YYYY-MM-DD').format(fmt)
      },
      nextPage: function (p) {
        this.pagination.page = this.pagination.page + p
      },
      prevPage: function (p) {
        this.pagination.page = this.pagination.page - p
      },
      getPreparations () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('searchPrepMethods', { type: this.activeTab, sort: '', page: this.pagination.page })
          .then((response) => {
            this.prepMethods = response
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.prepTable.reload()
          })
          .catch((error) => {
            this.$swal(
              'Error!',
              error.message,
              'error'
            )
          })
      },
      addPrepMethod: function () {
        this.prepMethod.name = ''
        this.prepMethod.description = ''
        this.prepMethod.category = 0
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setPrepMethodValue', this.prepMethod)
      },
      deletePrepMethod: function (item) {
        this.visible = true
        this.selectedPrepName = item.name
        this.selectedId = item.id
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deletePrepMethod', {id: this.selectedId, type: this.prepMethod.type})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.getPreparations()
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
      editPrepMethod: function (item) {
        this.prepMethod.name = item.name
        this.prepMethod.description = item.description
        if (item.categories.length > 0) this.prepMethod.category = item.categories[0].id
        else this.prepMethod.category = 0
        this.prepMethod.modified_time = item.modified_time
        this.prepMethod.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.prepMethod.created_time = item.created_time
        this.prepMethod.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.prepMethod.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setPrepMethodValue', this.prepMethod)
      }
    }
  }
</script>
