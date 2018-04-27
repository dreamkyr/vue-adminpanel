<template>
  <div class="modal fade" id="modalBookCreate" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  style="z-index:1100">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 1">Add Book</h4>
          <h4 class="modal-title" id="myModalLabel" v-if = "this.modalType === 2">Edit Book</h4>
        </div>
        <div class="modal-body">
          <form role="form">
            <div class="form-group">
              <label>English</label>
              <input type="text" class="form-control" placeholder="Enter English name" v-model="book.english_name">
            </div>
            <div class="form-group">
              <label>Chinese</label>
              <input type="text" class="form-control" placeholder="Enter Chinese name" v-model="book.chinese_name">
            </div>
            <div class="form-group">
              <label>Year</label>
              <input type="text" class="form-control" placeholder="Enter author name" v-model="book.year">
              <!--
              <select class="form-control select2"  data-placeholder="Select Categories" style="width: 100%;" v-model = "book.year">
						    <option v-for="year in 30" :value='year + 1990'>{{year + 1990}}</option>
					    </select> -->
            </div>
            <div class="form-group">
              <label>Author</label>
              <input type="text" class="form-control" placeholder="Enter author name" v-model="book.author">
            </div>
            <div class="form-group">
              <label>Chinese Author</label>
              <input type="text" class="form-control" placeholder="Enter Chinese author name" v-model="book.chinese_author">
            </div>
            <div class="modal-body" v-if = "this.modalType === 2">	  		
              <div class="description"><b>Modified by</b> <a class="pull-right"><span class="badge bg-blue">{{book.modified_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="Server Time 1:00PM (GMT +7)">{{book.modified_time}}</p></div>
              <div class="description"><b>Created by</b> <a class="pull-right"><span class="badge bg-blue">{{book.created_by_name}}</span></a><p class="text-muted" data-toggle="tooltip" title="" data-original-title="123">{{book.created_time}}</p></div>	  		
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-lg btn-danger pull-left" data-dismiss="modal" @click="deleteBook()" v-if = "this.modalType === 2"><i class="fa fa-trash"></i> Delete</button>
              <button type="button" class="btn btn-lg btn-default" data-dismiss="modal" ref="dialogClose" @click="close()">Cancel</button>
              <button type="button" class="btn btn-lg btn-success" @click="save()" v-if = "this.modalType === 1">Create</button>
              <button type="button" class="btn btn-lg btn-success" @click="update()" v-if = "this.modalType === 2">Update</button>
            </div>
            <hsy-dialog class="confirm" v-model="visible">
              <div slot="title">Delete {{book.english_name}}?</div>
              <div slot="body">
                <div>Are you sure you want to delete this item?</div>
                <div class='btns'>
                  <button class='delete' @click="confirmDelete">Delete</button>
                  <button class='cancel' @click="cancelDelete">Cancel</button>
                </div>
              </div>
            </hsy-dialog>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'CreateBook',
    data () {
      return {
        visible: false,
        book: {
          id: 0,
          english_name: '',
          chinese_name: '',
          year: 2013,
          author: '',
          chinese_author: '',
          modified_by_name: '',
          modified_time: '',
          created_by_name: '',
          created_time: ''
        },
        result: ''
      }
    },
    computed: {
      ...mapGetters({
        modalType: 'getModalType',
        selectedBook: 'getBook'
      })
    },
    watch: {
      modalType: {
        handler () {
          this.book.id = this.selectedBook.id
          this.book.english_name = this.selectedBook.english_name
          this.book.chinese_name = this.selectedBook.chinese_name
          this.book.year = this.selectedBook.year
          this.book.author = this.selectedBook.author
          this.book.chinese_author = this.selectedBook.chinese_author
          this.book.modified_by_name = this.selectedBook.modified_by_name
          this.book.modified_time = this.selectedBook.modified_time
          this.book.created_by_name = this.selectedBook.created_by_name
          this.book.created_time = this.selectedBook.created_time
          this.result = ''
        }
      }
    },
    methods: {
      save: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Creating book...')
        this.$store.dispatch('createBook', this.book)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      },
      update: function () {
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Updating book...')
        this.$store.dispatch('updateBook', this.book)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            if (response.id) {
              const btn = this.$refs.dialogClose
              this.$store.dispatch('setModalType', 0)
              this.result = 'success'
              btn.click()
            }
          }).catch((error) => {
            console.log(error)
          })
      },
      deleteBook: function () {
        this.visible = true
        this.$store.dispatch('setModalType', 3)
      },
      confirmDelete () {
        this.visible = false
        this.$store.dispatch('setLoadingBar', 'block')
        this.$store.dispatch('setLoadingBarText', 'Deleting...')
        this.$store.dispatch('deleteBook', this.book.id)
          .then((response) => {
            this.$store.dispatch('setLoadingBar', 'none')
            this.$store.dispatch('setModalType', 0)
            this.result = 'success'
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
      close: function () {
        if (this.result === 'success') {
          this.$store.dispatch('setModalType', 0)
        } else {
          this.$store.dispatch('setModalType', 3)
        }
        this.result = ''
      }
    }
  }
</script>
