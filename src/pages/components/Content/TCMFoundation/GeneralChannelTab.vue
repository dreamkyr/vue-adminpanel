<template>
  <div class="">
    <div class="box-body">
      <h3>{{tabName}}&nbsp;
        <span data-toggle="tooltip" title="" class="badge bg-green" data-original-title="">{{allChannels.total}}</span> 
        <button type="button" class="btn btn-success pull-right" data-toggle="modal" data-target="#modalChannelCreate" @click="addChannel()"><i class="fa fa-plus"></i> Add New</button>
        <select v-model="selected" v-on:change="onChangeSort" class="form-control sort">
          <option v-for="value in sorts" :value="value" :key="value">
            {{value}}
          </option>
        </select>
      </h3>
    </div>
    <FBDataTable ref="channelTable" :css="css.table" :fields="fields" dataPath="items" :data="channels"
                 :muti-sort="true" multi-sort-key="ctrl"
                 :methodName="'fetchChannels'" pagination-path="pagination" @fbdatatable:pagination-data="onPaginationData" item-key="id">
      <template slot="name" slot-scope="props">
        <span style="width:25px; height:25px; display:block; float:left; margin-right:10px; padding-top:8px;text-align:center">
          <img :src="props.rowData.icon" v-if="props.rowData.icon" style="max-height: 25px; max-width: 25px"/>
        </span>
        {{props.rowData.english_name}}
        <br>
        <span class="text-muted">{{props.rowData.chinese_name}}</span>
      </template>
      <template slot="created" slot-scope="props">
        <router-link v-if="props.rowData.createdBy" :to="{ name: 'Profile', params: { id: props.rowData.created_by }}">{{props.rowData.createdBy.firstname}} {{props.rowData.createdBy.lastname}}</router-link>
      </template>
      <template slot="date" slot-scope="props">
        {{props.rowData.created_time | moment("D MMMM YYYY [at] hh:mmA")}}
      </template>
      <template slot="control" slot-scope="props">
        <div class="btn-group pull-right">
            <button type="button" class="btn btn-sm btn-default" data-toggle="modal" data-target="#modalChannelCreate" @click="editChannel(props.rowData)"><i class="fa fa-pencil"></i></button>
            <button type="button" class="btn btn-sm btn-default" @click.prevent="deleteChannel(props.rowData)"><i class="fa fa-trash"></i></button>
        </div>
      </template>
      <FBPagination slot="pagination" :css="css.pagination"></FBPagination>
    </FBDataTable>
    <div class="box-footer clearfix">
      <FBPagination @fbdatatable-pagination:change-page="onChangePage" ref="pagination" :css="css.pagination"></FBPagination>
    </div>
    <CreateChannelModal></CreateChannelModal>
    <hsy-dialog class="confirm" v-model="visible">
      <div slot="title">Delete {{selectedChannel}}?</div>
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

  const CreateChannelModal = () => import(/* webpackChunkName: "Modals" */ './../TCMModals/CreateChannelModal.vue')
  const FBDataTable = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBDataTable.vue')
  const FBPagination = () => import(/* webpackChunkName: "UI Elements" */ '../../../../components/FBPagination.vue')

  export default {
    name: 'GeneralChannelTab',
    components: {
      CreateChannelModal,
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
        channel: {
          id: '',
          english_name: '',
          chinese_name: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: '',
          icon: ''
        },
        selectedChannel: '',
        channels: {
          items: {}
        }
      }
    },
    created () {
      // this.getChannels()
    },
    watch: {
      pagination: {
        handler () {
          this.$store.dispatch('fetchChannels', { page: this.pagination.page })
        },
        deep: true
      },
      modalType: {
        handler () {
          if (this.modalType === 0 && this.type === 0) {
            this.$refs.channelTable.reload()
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        tabName: 'getActiveTabName',
        modalType: 'getModalType',
        allChannels: 'getChannels',
        type: 'getTcmTabType'
      })
    },
    methods: {
      onChangeSort () {
        this.$store.dispatch('setAlabetSort', this.selected)
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchChannels', {page: this.pagination.page, type: 'channels'})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.channelTable.reload()
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
        this.$refs.categoryTable.changePage(page)
        this.pagination.page = page
      },
      nextPage: function (p) {
        this.pagination.page = this.pagination.page + p
      },
      prevPage: function (p) {
        this.pagination.page = this.pagination.page - p
      },
      formatDate (value, fmt = 'D MMMM Y') {
        return (value === null)
          ? ''
          : this.$moment(value, 'YYYY-MM-DD').format(fmt)
      },
      getChannels () {
        if (this.type !== 0) return
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Loading...')
        this.$store.dispatch('fetchChannels', { type: this.activeTab, page: this.pagination.page })
          .then((response) => {
            this.channels = response
            this.$store.dispatch('setLoadingBar', 'none')
            this.$refs.channelTable.reload()
          })
          .catch((error) => {
            this.$swal(
              'Error!',
              error.message,
              'error'
            )
          })
      },
      addChannel: function () {
        this.channel.english_name = ''
        this.channel.chinese_name = ''
        this.$store.dispatch('setModalType', 1)
        this.$store.dispatch('setChannelValue', this.channel)
      },
      editChannel: function (item) {
        this.channel.english_name = item.english_name
        this.channel.chinese_name = item.chinese_name
        this.channel.modified_time = item.modified_time
        if (item.modifiedBy === null || item.modifiedBy === undefined) this.channel.modified_by_name = ''
        else this.channel.modified_by_name = item.modifiedBy.firstname + ' ' + item.modifiedBy.lastname
        this.channel.created_time = item.created_time
        if (item.createdBy === null || item.createdBy === undefined) this.channel.created_by_name = ''
        else this.channel.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.channel.id = item.id
        this.channel.icon = item.icon
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setChannelValue', this.channel)
      },
      deleteChannel: function (item) {
        this.visible = true
        this.selectedChannel = item.english_name
        this.selectedId = item.id
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteChannel', {id: this.selectedId, type: this.type})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.getChannels()
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
