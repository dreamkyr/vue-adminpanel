<template>
  <div class="">
    <div class="box-body">
      <h3>{{tabName}}&nbsp;
        <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{generals.total}}</span> 
        <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalGeneralCreate" @click="addGeneral()"><i class="fa fa-plus"></i> Add New</button>
        <select v-model="selected" v-on:change="onChangeSort" class="form-control sort">
          <option v-for="value in sorts" :value="value" :key="value">
            {{value}}
          </option>
        </select>
      </h3>
    </div>
    <FBDataTable ref="generalTable" :css="css.table" :fields="filtered_fields" dataPath="items"
                 :muti-sort="true" multi-sort-key="ctrl" :tcmType = "activeTab"
                 :methodName="'searchGenerals'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
      <template slot="name" slot-scope="props">
        <i class="fa fa-circle-o" v-bind:style="{color: props.rowData.color}" v-if="type === 2"></i>&nbsp;&nbsp;{{props.rowData.name}}
      </template>
      <template slot="traditional" slot-scope="props">
        {{props.rowData.traditional_chinese}}
      </template>
      <template slot="simplified" slot-scope="props">
        {{props.rowData.simplified_chinese}}
      </template>
      <template slot="category" slot-scope="props" v-if = "type > 0">
          <span v-if="props.rowData.categories.length > 0">{{props.rowData.categories[props.rowData.categories.length - 1].name}}</span>
          <span v-if="props.rowData.categories.length === 0 "></span>
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
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalGeneralCreate" @click="editGeneral(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click.prevent="deleteGeneral(props.rowData)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <CreateGeneralModal></CreateGeneralModal>
    <hsy-dialog class="confirm" v-model="visible">
      <div slot="title">Delete {{selectedName}}?</div>
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

  const CreateGeneralModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateGeneralModal.vue')
  const CreateCautionModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateCautionModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'GeneralTab',
    components: {
      CreateGeneralModal,
      CreateCautionModal,
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
            title: 'Traditional',
            name: '__slot:traditional'
          },
          {
            title: 'Simplified',
            name: '__slot:simplified'
          },
          {
            title: 'Category',
            name: '__slot:category'
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
        filtered_fields: [],
        pagination: {
          page: 1
        },
        general: {
          id: '',
          name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          type: '',
          color: '#498a40',
          category: '',
          associated: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        selectedGeneral: {
          id: 0,
          caution_id: 0,
          herb_id: 0,
          symptom_id: 0,
          action_id: 0,
          type: ''
        },
        selectedName: '',
        selectedId: ''
      }
    },
    created () {
      this.generateFilteredTableHeader()
      this.$store.dispatch('setAlabetSort', '')
    },
    watch: {
      activeTab: {
        handler () {
          this.generateFilteredTableHeader()
          this.selected = 'All'
          this.$store.dispatch('setAlabetSort', '')
          if (this.type !== 0) this.$refs.generalTable.reload()
          this.$store.dispatch('fetchCategories', {type: this.activeTab})
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type !== 0) {
            this.$refs.generalTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        activeTab: 'getActiveTab',
        generals: 'getGenerals',
        type: 'getTcmTabType'
      })
    },
    methods: {
      onChangeSort () {
        this.$store.dispatch('setAlabetSort', this.selected)
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('searchGenerals', {page: this.pagination.page, type: this.activeTab})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.generalTable.reload()
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
        this.$refs.generalTable.changePage(page)
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
      addGeneral: function () {
        this.general.id = ''
        this.general.name = ''
        this.general.type = this.activeTab
        this.general.traditional_chinese = ''
        this.general.simplified_chinese = ''
        this.general.color = '#498a40'
        this.general.category = 0
        this.general.categories = []
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setGeneralValue', this.general)
      },
      editGeneral: function (item) {
        this.general.id = item.id
        this.general.name = item.name
        this.general.type = this.activeTab
        this.general.traditional_chinese = item.traditional_chinese
        this.general.simplified_chinese = item.simplified_chinese
        this.general.color = item.color
        if (item.categories.length > 0) this.general.category = item.categories[item.categories.length - 1].id
        else this.general.category = 0

        if (item.modifiedBy !== null) {
          this.general.modified_time = item.modified_time
          this.general.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        } else {
          this.general.modified_time = ''
          this.general.modified_by_name = ''
        }

        if (item.createdBy !== null) {
          this.general.created_time = item.created_time
          this.general.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        } else {
          this.general.created_time = ''
          this.general.created_by_name = ''
        }

        this.selectedGeneral.id = item.id
        this.selectedGeneral.type = this.activeTab
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setGeneralValue', this.general)
      },
      deleteGeneral: function (item) {
        this.visible = true
        this.selectedName = item.name
        this.selectedId = item.id
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteGeneral', {id: this.selectedId, type: this.activeTab})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.generalTable.reload()
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
      generateFilteredTableHeader: function () {
        if (this.type === 1) {
          var fieldsarray = this.fields.filter(function (el) {
            return el.title !== 'Associated'
          })
          this.filtered_fields = fieldsarray
        } else {
          this.filtered_fields = this.fields
        }
      }
    }
  }
</script>
