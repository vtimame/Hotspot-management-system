export const state = () => ({
  _instance: null,
})

export const getters = {
  instance: (state) => state._instance,
}

export const mutations = {
  setInstance: (state, instance) => (state._instance = instance),
}

export const actions = {
  async loadUserInstance({ commit }, payload) {
    commit('setInstance', payload)
  },
}
