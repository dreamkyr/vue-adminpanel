<template>
  <div class="tab-pane active" id="formulas">
    <div class="box-body">
      <h3>Formulas
        <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{formulas.total}}</span>
        <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalFormulaCreate" @click="addFormula()"><i class="fa fa-plus"></i> Add Formula</button>
        <select v-model="selected" v-on:change="onChangeSort" class="form-control sort">
          <option v-for="value in sorts" :value="value" :key="value">
            {{value}}
          </option>
        </select>
      </h3>
    </div>
    <FBDataTable ref="formulaTable" :css="css.table" :fields="fields" dataPath="items" :data="formulas"
                 :muti-sort="true" multi-sort-key="ctrl" :query="formulaFilterQuery"
                 :methodName="'searchFormulas'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
      <template slot="name" slot-scope="props">
        <router-link :to="{ name: 'Formula', params: { id: props.rowData.id }}">{{props.rowData.pinyin}}</router-link>
        <br />
        <span class="text-muted">
              {{props.rowData.simplified_chinese}} ({{props.rowData.traditional_chinese}})
            </span>
      </template>
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template>
      <template slot="date" slot-scope="props">
        {{ props.rowData.created_at | toDate }}
      </template>
      <template slot="categories" slot-scope="props">
        <span v-for="(category, index) in props.rowData.categories" :key="index">
          <strong>{{ category.name }}</strong><br />
        </span>
      </template>
      <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalFormulaCreate" @click="editFormula(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click="deleteFormula(props.rowData)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <FormulaModal></FormulaModal>
    <hsy-dialog class="confirm" v-model="visible">
      <div slot="title">Delete {{selectedFormula}}?</div>
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

  const FormulaModal = () => import(/* webpackChunkName: "Modals" */ './../Modals/CreateFormula.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'FormulaTab',
    components: {
      FBDataTable,
      FBPagination,
      FormulaModal
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
            name: '__slot:name',
            sortField: 'name'
          },
          {
            title: 'Category',
            name: '__slot:categories'
          },
          {
            title: 'Source Texts',
            name: '__slot:texts'
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
        loadDataFlag: false,
        selectedFormula: '',
        selectedId: '',
        formula: {
          id: '',
          pinyin: '',
          english_name: '',
          latin_name: '',
          traditional_chinese: '',
          simplified_chinese: '',
          pinyin_ton: '',
          modified_by_name: '',
          modified_time: '',
          modified_at: '',
          created_by_name: '',
          created_time: '',
          created_at: ''
        }
      }
    },
    methods: {
      onChangeSort () {
        this.$store.dispatch('setAlabetSort', this.selected)
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('searchFormulas', this.formulaFilterQuery)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.formulaTable.reload()
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
        this.$refs.formulaTable.changePage(page)
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
      filterFormulas: function () {
        this.pagination.page = 1
      },
      addFormula: function () {
        this.formula.pinyin = ''
        this.formula.english_name = ''
        this.formula.latin_name = ''
        this.formula.traditional_chinese = ''
        this.formula.simplified_chinese = ''
        this.formula.pinyin_ton = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setFormulaValue', this.formula)
      },
      editFormula: function (item) {
        this.formula.id = item.id
        this.formula.pinyin = item.pinyin
        this.formula.english_name = item.english_name
        this.formula.latin_name = item.latin_name
        this.formula.traditional_chinese = item.traditional_chinese
        this.formula.simplified_chinese = item.simplified_chinese
        this.formula.pinyin_ton = item.pinyin_ton
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.formula.modified_by_name = ''
        else this.formula.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.formula.modified_time = item.modified_time
        this.formula.modified_at = item.modified_at
        if (item.createdBy === null || item.createdBy === undefined) this.formula.created_by_name = ''
        else this.formula.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.formula.created_time = item.created_time
        this.formula.created_at = item.created_at
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setFormulaValue', this.formula)
      },
      deleteFormula (item) {
        this.visible = true
        this.selectedFormula = item.name
        this.selectedId = item.id
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteFormula', {id: this.selectedId})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.formulaTable.reload()
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
    },
    computed: {
      ...mapGetters({
        formulas: 'getFormulas',
        modalType: 'getModalType',
        filterFlag: 'getFilterFlag',
        formulaFilterQuery: 'getFormulaFilterQuery'
      })
    },
    beforeCreate () {
      this.$store.dispatch('setAlabetSort', '')
    },
    created () {
      // this.$store.dispatch('fetchFormulas', { page: this.pagination.page })
    },
    watch: {
      formulaFilterQuery: {
        handler () {
          this.filterFormulas()
        }
      },
      modalType: {
        handler () {
          if (this.modalType === 0) {
            this.$refs.formulaTable.reload()
          }
        }
      }
    }
  }
</script>
