<template>
  <div class="">
    <div class="box-body">
      <h3>{{tabName}}&nbsp;<span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{allHerbologies.total}}</span>
        <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="addHerbology()"><i class="fa fa-plus"></i> Add New</button>
        <select v-model="selected" v-on:change="onChangeSort" class="form-control sort">
          <option v-for="value in sorts" :value="value" :key="value">
            {{value}}
          </option>
        </select>
      </h3>
    </div>    
    <FBDataTable ref="herbologyTable" :css="css.table" :fields="filtered_fields" dataPath="items" :data="herbologies"
                 :muti-sort="true" multi-sort-key="ctrl"
                 :methodName="'searchHerbologies'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">  
      <template slot="name" slot-scope="props">
        {{props.rowData.name}}
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
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalHerbologyGeneranCreate" @click="editHerbology(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click="deleteHerbology(props.rowData)"><i class="fa fa-trash"></i></button>
        </div>
      </template>    
      <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <!-- Post -->   
    <!-- /.table-responsive -->
    <!-- /.post -->
    <CreateHerbologyModal></CreateHerbologyModal>
    <hsy-dialog class="confirm" v-model="visible">
      <div slot="title">Delete {{selectedHerbName}}?</div>
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

  const CreateHerbologyModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateHerbologyModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'HerbologyGeneralTab',
    components: {
      CreateHerbologyModal,
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
            title: 'Linked',
            name: '__slot:linked'
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
        herbology: {
          id: '',
          name: '',
          type: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        selectedHerbName: '',
        selectedId: '',
        herbologies: {
          items: {}
        }
      }
    },
    created () {
      // if (this.type === 0) this.getHerbologies()
      this.generateFilteredTableHeader()
    },
    watch: {
      activeTab: {
        handler () {
          this.generateFilteredTableHeader()
          if (this.type !== 2) this.$refs.herbologyTable.reload()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type !== 2) {
            this.$refs.herbologyTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        activeTab: 'getActiveTab',
        allHerbologies: 'getHerbologies',
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
          this.getHerbologies()
          return
        }
        this.$store.dispatch('searchHerbologies', { type: this.activeTab, sort: this.selected, page: this.pagination.page })
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.herbologyTable.reload()
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
        this.$refs.herbologyTable.changePage(page)
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
      getHerbologies () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('searchHerbologies', { type: this.activeTab, sort: '', page: this.pagination.page })
          .then((response) => {
            this.herbologies = response
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.herbologyTable.reload()
          })
          .catch((error) => {
            this.$swal(
              'Error!',
              error.message,
              'error'
            )
          })
      },
      addHerbology: function () {
        this.herbology.name = ''
        this.herbology.type = this.activeTab
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setHerbologyValue', this.herbology)
      },
      deleteHerbology (item) {
        this.visible = true
        this.selectedHerbName = item.name
        this.selectedId = item.id
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteHerbology', {id: this.selectedId, type: this.activeTab})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.getHerbologies()
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
      editHerbology: function (item) {
        this.herbology.name = item.name
        this.herbology.type = this.activeTab
        this.herbology.modified_time = item.modified_time
        if (item.modifiedBy === null || typeof item.modifiedBy === 'undefined') this.herbology.modified_by_name = ''
        else this.herbology.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.herbology.created_time = item.created_time
        if (item.createdBy === null || typeof item.createdBy === 'undefined') this.herbology.created_by_name = ''
        else this.herbology.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.herbology.id = item.id
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setHerbologyValue', this.herbology)
      },
      generateFilteredTableHeader: function () {
        if (this.type === 0) {
          var fieldsarray = this.fields.filter(function (el) {
            return el.title !== 'Linked'
          })
          this.filtered_fields = fieldsarray
        } else {
          this.filtered_fields = this.fields
        }
      }
    }
  }
</script>
