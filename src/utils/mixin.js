import { mapActions, mapGetters } from 'vuex'

export const ebookMixin = {
  computed: {
    ...mapGetters(['fileName', 'menuVisible', 'settingVisible', 'defaultFontSize'])
  },
  methods: {
    ...mapActions(['setFileName', 'setMenuVisible', 'setSettingVisible', 'setDefaultFontSize'])
  }
}
