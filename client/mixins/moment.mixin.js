import moment from 'moment'

const momentMixin = {
  methods: {
    formatDate(date, format = 'DD.MM.YYYY HH:mm:ss') {
      return moment(date).format(format)
    },
  },
}

export default momentMixin
