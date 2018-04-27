<template>
  <div v-if="$route.name === 'Dashboard'">
    <!-- Main content -->
    <section class="content">

      <div class="row">
        <div class="col-md-4">

          <!-- small box -->
          <div class="small-box bg-green">
            <div class="inner">
              <h3>{{formulas.total}}<sup style="font-size: 20px"></sup></h3>

              <p>Formulas</p>
            </div>
            <div class="icon">
              <i class="fa fa-flask"></i>
            </div>
            <a href="#" class="small-box-footer">
              <i class="fa fa-plus-circle"></i> Add New
            </a>
          </div>

          <!-- small box -->
          <div class="small-box bg-green">
            <div class="inner">
              <h3>{{herbs.total}}<sup style="font-size: 20px"></sup></h3>

              <p>Herbs</p>
            </div>
            <div class="icon">
              <i class="fa fa-leaf"></i>
            </div>
            <a href="#" class="small-box-footer">
              <i class="fa fa-plus-circle"></i> Add New
            </a>
          </div>

          <!-- small box -->
          <div class="small-box bg-gray">
            <div class="inner">
              <h3>{{books.total}}<sup style="font-size: 20px"></sup></h3>

              <p>Texts</p>
            </div>
            <div class="icon">
              <i class="fa fa-book"></i>
            </div>
            <a href="#" class="small-box-footer">
              <i class="fa fa-plus-circle"></i> Add New
            </a>
          </div>

        </div>

        <div class="col-md-8">

          <div class="box">
            <div class="box-body">
              <!-- search form -->
              <form action="#" method="get" class="sidebar-form">
                <div class="input-group">
                  <input type="text" name="q" class="form-control" placeholder="Search...">
                  <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
                </div>
              </form>
              <!-- /.search form -->
              <!-- /input-group -->
            </div>
            <!-- /.box-body -->
          </div>

          <!-- TABLE: LATEST ORDERS -->
          <div class="box box-default">
            <div class="box-header with-border">
              <h3 class="box-title">Latest actions</h3>
              <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            </div>
            <!-- /.box-header -->
            <div class="box-body no-padding">
              <div class="table-responsive">
                <FBDataTable ref="lhtable" :css="css.table" :fields="fields" dataPath="items" :data="activity"
                             :methodParams="$route.params.id" :muti-sort="true" multi-sort-key="ctrl"
                             :methodName="'fetchUserActivity'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
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
                    <router-link :to="{path: '/users/profile/'+props.rowData.user.id}">{{ props.rowData.user | fullUserName }}</router-link>
                  </template>
                  <template slot="date" slot-scope="props">
                    {{ props.rowData.created_at | toDate }}
                  </template>
                  <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
                </FBDataTable>
              </div>
              <div class="box-footer clearfix">
                <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
              </div>

              </div>
              <!-- /.table-responsive -->
            </div>
            <!-- /.box-body -->
            <!-- /.box-footer -->
          </div>
          <!-- /.box -->
        </div>
        <!-- /.col -->

    </section>
    <!-- /.content -->
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import datatableConfig from '../config/datatable'

  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../components/FBPagination.vue')

  export default {
    name: 'Dashboard',
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
            title: 'User',
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
      this.$store.dispatch('fetchFormulas', {page: 1})
      this.$store.dispatch('fetchHerbs', {page: 1})
      this.$store.dispatch('fetchBooks', {page: 1})
    },
    mounted () {
      this.$store.dispatch('fetchAllActivity')
      this.$jQuery('body')
        .removeClass('hold-transition login-page')
        .addClass('skin-black-light sidebar-mini fixed')
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.lhtable.changePage(page)
      }
    },
    computed: {
      ...mapGetters({
        activity: 'getAllActivity',
        formulas: 'getFormulas',
        herbs: 'getHerbs',
        books: 'getBooks'
      })
    }
  }
</script>
