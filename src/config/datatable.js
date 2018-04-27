export default {
  table: {
    tableClass: 'table table-striped table-bordered',
    ascendingIcon: 'glyphicon glyphicon-chevron-up',
    descendingIcon: 'glyphicon glyphicon-chevron-down',
    handleIcon: 'glyphicon glyphicon-menu-hamburger',
    renderIcon: function (classes, options) {
      return `<span class='${classes.join(' ')}'></span>`
    }
  },
  pagination: {
    wrapperClass: 'pagination pull-right',
    activeClass: 'active',
    disabledClass: 'disabled',
    pageClass: 'btn btn-border',
    linkClass: 'btn btn-border',
    icons: {
      first: '',
      prev: '',
      next: '',
      last: ''
    }
  }
}
