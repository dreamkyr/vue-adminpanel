<template>
  <div class="tab-pane" id="activity">
    <!-- Activity -->
    <div class="table-responsive">
      <FBDataTable ref="lhtable" :css="css.table" :fields="fields" dataPath="items" :data="activity"
                   :muti-sort="true" multi-sort-key="ctrl"
                   :methodName="'fetchFormulaActivity'" :methodParams="this.$route.params.id" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
        <template slot="icon" slot-scope="props">
          <i class="fa text-muted" v-if="props.rowData.action !== null"
             :class="{
                          'fa-pencil': (props.rowData.action === 'update'),
                          'fa-plus-circle': (props.rowData.action === 'create'),
                          'fa-trash': (props.rowData.action === 'delete')
                        }">
          </i>
        </template>
        <template slot="action" slot-scope="props">
          <span v-if="['create', 'update', 'delete'].includes(props.rowData.action)">
            {{ props.rowData.message }}
          </span>
          <span v-else>
            {{ props.rowData.action }}
          </span>
        </template>
        <template slot="user" slot-scope="props">
          <router-link v-if="props.rowData.user" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.user.firstname}} {{props.rowData.user.lastname}}</router-link>
        </template>
        <template slot="date" slot-scope="props">
          {{ props.rowData.created_at | toDate }}
        </template>
        <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
      </FBDataTable>
      <div class="box-footer clearfix">
        <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
      </div>
    </div>
    <!-- /.table-responsive -->
    <!-- /.post -->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'FormulaTabActivity',
    components: {
      FBDataTable,
      FBPagination
    },
    methods: {
      iconAction (value) {
        if (value === 'login') {
          return '<span class="label label-success">Log In</span>'
        } else if (value === 'logout') {
          return '<span class="label label-danger"">Sign Out</span>'
        }
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.lhtable.changePage(page)
      },
      formatDate (value, fmt = 'D MMMM Y') {
        return (value === null)
          ? ''
          : this.$moment(value, 'YYYY-MM-DD').format(fmt)
      }
    },
    created () {
      this.$store.dispatch('fetchFormulaActivity', { id: this.$route.params.id, page: this.$route.query.page || 1 })
    },
    data () {
      return {
        css: datatableConfig,
        fields: [
          {
            title: '',
            name: '__slot:icon'
          },
          {
            title: 'Action',
            name: '__slot:action'
          },
          {
            title: 'Author',
            name: '__slot:user'
          },
          {
            title: 'Date',
            name: '__slot:date'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        formula: 'getFormula',
        activity: 'getFormulaActivity'
      })
    }
  }
</script>
