<template>
  <div class="tab-pane" id="activity">
    <div class="table-responsive">
      <FBDataTable ref="lhtable" :css="css.table" :fields="fields" dataPath="" :data="activity"
                   :methodParams="this.$route.params.id" :muti-sort="true" multi-sort-key="ctrl"
                   :methodName="'fetchHerbActivity'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
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
      </FBDataTable>
      <div class="box-footer clearfix">
        <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import datatableConfig from '../../../../config/datatable'

  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'HerbTabActivity',
    components: {
      FBDataTable,
      FBPagination
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
    created () {
      this.$store.dispatch('fetchHerbActivity', { id: this.$route.params.id, page: this.$route.query.page || 1 })
    },
    methods: {
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
    computed: {
      ...mapGetters({
        herb: 'getHerb',
        activity: 'getHerbActivity'
      })
    }
  }
</script>
