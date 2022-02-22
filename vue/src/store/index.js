import { createStore } from "vuex"
import axiosClient from "../axios"

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
    },
    surveys: {
      data: [],
      links: [],
    },
    currentSurvey: {
      data: {},
    },
    notification: {
      show: false,
      type: 'success',
      message: ''
    }
  },
  getters: {},
  actions: {
    register({ commit }, user) {
      return axiosClient.post("/register", user).then(({ data }) => {
        commit("setUser", data.user)
        commit("setToken", data.token)
        return data
      })
    },
    login({ commit }, user) {
      return axiosClient.post("/login", user).then(({ data }) => {
        commit("setUser", data.user)
        commit("setToken", data.token)
        return data
      })
    },
    logout({ commit }) {
      return axiosClient.post("/logout").then((response) => {
        commit("logout")
        return response
      })
    },
    saveSurvey({ commit }, survey) {
      delete survey.image_url
      let response
      if (survey.id) {
        response = axiosClient.put(`/survey/${survey.id}`, survey).then((res) => {
          return res
        })
      } else {
        response = axiosClient.post("/survey", survey).then((res) => {
          return res
        })
      }

      return response
    },
    getSurveys({ commit }, { url = null } = {}) {
      url = url || "/survey"
      return axiosClient.get(url).then((res) => {
        commit("setSurveys", res.data)
        return res
      })
    },
    getSurvey({ commit }, id) {
      return axiosClient
        .get(`/survey/${id}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data)
          return res
        })
        .catch((err) => {
          throw err
        })
    },
    deleteSurvey({ dispatch }, id) {
      return axiosClient.delete(`/survey/${id}`).then((res) => {
        dispatch('getSurveys')
        return res;
      });
    },
  },
  mutations: {
    logout: (state) => {
      state.user.token = null
      state.user.data = {}
      sessionStorage.removeItem("TOKEN")
    },
    setUser: (state, user) => {
      state.user.data = user
    },
    setToken: (state, token) => {
      state.user.token = token
      sessionStorage.setItem("TOKEN", token)
    },
    setSurveys: (state, surveys) => {
      state.surveys.links = surveys.meta.links;
      state.surveys.data = surveys.data
    },
    setCurrentSurvey: (state, survey) => {
      state.currentSurvey.data = survey.data
    },
    notify: (state, {message, type}) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000)
    },
  },
  modules: {},
})

export default store
