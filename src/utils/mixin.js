import { mapActions, mapGetters } from 'vuex'

export const ebookMixin = {
  computed: {
    ...mapGetters(['fileName', 'menuVisible'])
  },
  methods: {
    ...mapActions(['setFileName', 'setMenuVisible'])
  }
}
