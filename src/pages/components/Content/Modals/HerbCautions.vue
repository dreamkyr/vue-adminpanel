<template>
  <div class="modal fade" id="modalHerbCautions" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          <h4 class="modal-title" id="myModalLabel">Herb Cautions</h4>
        </div>
        <div class="modal-header no-padding">
          <form action="#" method="get" class="sidebar-form" @submit="search">
            <div class="input-group">
              <input type="text" name="q" class="form-control" placeholder="Search..." v-model="query">
              <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </form>
        </div>
        <div class="modal-body no-padding" style="overflow: auto; position:relative; height:460px;">
          <table class="table table-hover">
            <tbody v-if="cautions.items && cautions.items.length > 0">
            <tr v-for="(item, key) in cautions.items" :key="key">
              <td style="padding-top:12px;">
                <span>{{item.name}}</span>
              <td>
                <div class="btn-group pull-right">
                  <button type="button" class="btn btn-default" data-toggle="modal" data-target="#modalFormulaCreate" @click="editFormula(item)"><i class="fa fa-pencil"></i></button>
                  <button type="button" :class="selectedCautionIds.indexOf(item.id) > -1 ? 'btn btn-success' : 'btn btn-default'" @click="toggleCaution(item.id)"><i :class="selectedCautionIds.indexOf(item.id) > -1 ? 'fa fa-check' : 'fa fa-plus'"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
              <td colspan="2">
                No Cautions
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default pull-left" data-toggle="modal" data-target="#modalFormulaCreate" @click="addFormula()"><i class="fa fa-plus-circle"></i> Create new</button>
          <button type="button" class="btn btn-default" data-dismiss="modal" ref="dialogClose" @click="close">Close</button>
          <button type="button" class="btn btn-primary" @click="save">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'HerbCautions',
    computed: {
      ...mapGetters({
        currentCautionIds: 'getHerbCautionIds',
        modalType: 'getModalType',
        tabName: 'getActiveTabName',
        loading: 'getLoadingBar'
      })
    },
    data () {
      return {
        query: '',
        selectedCautionIds: [],
        selectedCautions: [],
        cautions: [],
        result: '',
        flag: false,
        caution: {
          id: '',
          name: ''
        }
      }
    },
    created () {
      this.fetchHerbCautions()
    },
    watch: {
      currentCautionIds: {
        handler () {
          this.selectedCautionIds = Object.assign([], this.currentCautionIds)
        }
      },
      flag: {
        handler () {
          if (this.flag === true) this.$store.dispatch('setLoadingBar', 'none')
        }
      },
      modalType: {
        handler () {
          this.result = ''
          if (this.modalType === 0 && this.tabName === 'Cautions') {
            this.flag = false
            this.result = 'success'
            this.$store.dispatch('setLoadingBar', 'block')
            this.$store.dispatch('setLoadingBarText', 'Loading...')
            this.fetchHerbCautions()
          } else if (this.modalType === 5 && this.tabName === 'Cautions') {
            if (this.flag === false) {
              this.$store.dispatch('setLoadingBar', 'block')
              this.$store.dispatch('setLoadingBarText', 'Loading...')
            }
            this.selectedCautionIds = Object.assign([], this.currentCautionIds)
          }
        }
      }
    },
    methods: {
      fetchHerbCautions: function () {
        this.$store.dispatch('fetchCautionsTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.flag = true
            this.cautions = response
          })
      },
      toggleCaution (id) {
        let index = this.selectedCautionIds.indexOf(id)
        if (index > -1) {
          this.selectedCautionIds.splice(index, 1)
        } else {
          this.selectedCautionIds.push(id)
        }
      },
      save: function () {
        this.selectedCautions = []
        this.cautions.items.map((item, ind) => {
          let index = this.selectedCautionIds.indexOf(item.id)
          if (index > -1) {
            this.selectedCautions.push(item)
          }
        })
        this.$store.dispatch('setHerbCautions', this.selectedCautions)
        this.result = 'success'
        const btn = this.$refs.dialogClose
        btn.click()
      },
      search: function (evt) {
        evt.preventDefault()
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Searching...')
        this.$store.dispatch('fetchCautionsTotal', {query: 'query=' + this.query})
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.cautions = response
          }).catch((error) => {
            console.log(error)
          })
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
        if (item.createdBy === null || item.createdBy === undefined) this.formula.created_by_name = ''
        else this.formula.created_by_name = item.createdBy.firstname + ' ' + item.createdBy.lastname
        this.formula.created_time = item.created_time
        this.$store.dispatch('setModalType', 2)
        this.$store.dispatch('setFormulaValue', this.formula)
      },
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 4)
        } else {
          this.$store.dispatch('setModalType', 6)
        }
      }
    }
  }
</script>
