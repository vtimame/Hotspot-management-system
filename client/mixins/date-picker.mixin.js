const datePickerMixin = {
  data() {
    return {
      datePickerLocale: {
        lang: {
          placeholder: 'Выберите дату',
          rangePlaceholder: ['Начиная от', 'Заканчивая до'],
          today: 'Сегодня',
          now: 'Сейчас',
          backToToday: 'Вернуться на сегодня',
          ok: 'Ок',
          clear: 'Очистить',
          month: 'Месяц',
          year: 'Год',
          timeSelect: 'Выбрать время',
          dateSelect: 'Выбрать дату',
          monthSelect: 'Choose a month',
          yearSelect: 'Choose a year',
          decadeSelect: 'Choose a decade',
          yearFormat: 'YYYY',
          dateFormat: 'DD.MM.YYYY',
          dayFormat: 'D',
          dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
          monthFormat: 'MMMM',
          monthBeforeYear: true,
          previousMonth: 'Previous month (PageUp)',
          nextMonth: 'Next month (PageDown)',
          previousYear: 'Last year (Control + left)',
          nextYear: 'Next year (Control + right)',
          previousDecade: 'Last decade',
          nextDecade: 'Next decade',
          previousCentury: 'Last century',
          nextCentury: 'Next century',
        },
        timePickerLocale: {
          placeholder: 'Выбрать время',
        },
        dateFormat: 'DD.MM.YYYY',
        dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
        weekFormat: 'YYYY-wo',
        monthFormat: 'YYYY-MM',
      },
    }
  },
}

export default datePickerMixin
