import api from "../../api";

// initial state
const state = {
  userSearchList: [],
  user: {},
  followings: [],
  ratings: [],
  isLogin: false,
  username: "",
  userFollowings: [],
  recommendedMovies: [],
  register: "register",
  regErrors: {},
  logErrors: {},
  checkStaff: false,
  token: "",
  subscribe: false,
  edit: false,
  editCom: "",
  rating: [0, 0]
};

// getters
const getters = {
  userSearchList: state => state.userSearchList,
  user: state => state.user,
  ratings: state => state.ratings,
  username: state => state.username,
  isLogin: state => state.isLogin,
  register: state => state.register,
  logErrors: state => state.logErrors,
  token: state => state.token,
  followings: state => state.followings,
  recommendedMovies: state => state.recommendedMovies,
};

// actions
const actions = {
  // Login, Register
  async setLogin({ commit }, params) {
    const res = await api.login(params);
    if (res.status === 202) {
      commit("setIsLogin", true);
      commit("setUsername", res.data.username);
      commit("setStaff", res.data.is_staff);
      commit("setToken", res.data.token);
      commit("setSubscribe", res.data.subscribe);
      sessionStorage.setItem("username", res.data.username);
      sessionStorage.setItem("isStaff", res.data.is_staff);
      sessionStorage.setItem("jwt", res.data.token);
      sessionStorage.setItem("isLogin", true);
      sessionStorage.setItem("subscribe", res.data.subscribe);
      const res2 = await api.getFollowings(state.username);
      commit("setUserFollowings", res2.data);
    } else {
      commit("setIsLogin", false);
      commit("setLogError", res.data);
    }
  },
  async logout({ commit }, params) {
    commit("setIsLogin", false);
    commit("setUsername", "");
    commit("setStaff", false);
    commit("setToken", "");
    commit("setSubscribe", false);
    sessionStorage.clear();
    await api.logout(params);
  },
  async setRegister({ commit }, params) {
    const res = await api.register(params);
    if (res.status === 201) {
      commit("setRegister", "sign");
    } else if (res.status === 200) {
      commit("setRegError", res.data);
    }
  },

  // User
  async searchUsers({ commit }, params) {
    const resp = await api.searchUsers(params);
    const users = resp.data;
    commit("setUserSearchList", users);
  },
  async getUserByUsername({ commit }, username) {
    const res1 = await api.getUser(username);
    const user = res1.data;
    commit("setUser", user);
    const res2 = await api.getRatings(username);
    commit("setRatings", res2.data);
    const res3 = await api.getFollowings(username);
    commit("setFollowings", res3.data);
  },
  async setUserProfileByUsername({ commit }, payload) {
    const res = await api.setProfile(payload.username, payload.data);
    if (res.status === 200) {
      commit("setUserImage", res.data.image);
    }
  },
  setEmptyUserList({ commit }) {
    commit("setUserSearchList", []);
  },
  async editUserInfo({ commit }, params) {
    const username = params.username;
    const res = await api.editUserInfo(username, params);
    if (res.status === 202) {
      commit("edited", true);
    } else if (res.status === 203) {
      commit("setIsLogin", false);
      commit("setUsername", "");
      commit("setStaff", false);
      commit("setToken", "");
      commit("setSubscribe", false);
      sessionStorage.clear();
      const req = {
        "username": username
      };
      await api.logout(req);
    } else {
      commit("editComment", "정보 수정을 실패했습니다.");
    }
  },
  async setUserRating({ commit }, params) {
    const username = params.username;
    const id = params.movieId;
    const res = await api.getRating(username, id);
    if (res.status === 202 && res.data.length > 0) {
      commit("userRating", [res.data[0].rating, id])
    } else {
      commit("userRating", [0, id])
    }
  },
  async setRating({ commit }, params) {
    const username = params.username;
    const id = params.movieId;
    const res = await api.setRating(username, id, params);
    if (res.status === 202) {
      commit("userRating", [params.rating, id]);
    } else {
      commit("setIsLogin", false);
      commit("setUsername", "");
      commit("setStaff", false);
      commit("setToken", "");
      commit("setSubscribe", false);
      sessionStorage.clear();
      const req = {
        "username": username
      };
      await api.logout(req);
    }
  },

  // Follow
  async follow({ commit }, id) {
    if (state.isLogin) {
      await api.follow(id, { username: state.username, token: state.token });
      
      const res = await api.getFollowings(state.username);
      commit("setUserFollowings", res.data);
    }
  },

  // RecommendedMovies for User
  async getRecommendedMovies({ commit }, username) {
    try {
      const res = await api.getRecommendedMovies(username);
      commit("setRecommendedMovies", res.data);
      console.log(res.data);
    } catch(error) {
      console.log(error);
    }
  },

  // subscribe
  async subscribe({ commit }, params) {
    const res = await api.subscribe(params);
    if (res.status === 202) {
      commit("setSubscribe", true);
      sessionStorage.setItem("subscribe", true);
    } else if (res.status === 400) {
      commit("setIsLogin", false);
      commit("setUsername", "");
      commit("setStaff", false);
      commit("setToken", "");
      commit("setSubscribe", false);
      sessionStorage.clear();
      const req = {
        username: params.username
      };
      await api.logout(req);
    }
  }
};

// mutations
const mutations = {
  setUserSearchList: (state, payload) => (state.userSearchList = payload),
  setUser: (state, payload) => (state.user = payload),
  setRatings: (state, payload) => (state.ratings = payload),
  setUserImage: (state, payload) => (state.user.image = payload),
  setFollowings: (state, payload) => (state.followings = payload),
  setUserFollowings: (state, payload) => (state.userFollowings = payload),
  setRecommendedMovies: (state, payload) => (state.recommendedMovies = payload),
  setIsLogin: (state, payload) => (state.isLogin = payload),
  setUsername: (state, payload) => (state.username = payload),
  setStaff: (state, payload) => (state.checkStaff = payload),
  setToken: (state, payload) => (state.token = payload),
  setSubscribe: (state, payload) => (state.subscribe = payload),
  setRegister: (state, payload) => (state.register = payload),
  setRegError: (state, payload) => (state.regErrors = payload),
  setLogError: (state, payload) => (state.logErrors = payload),
  editComment: (state, payload) => (state.editCom = payload),
  edited: (state, payload) => (state.edit = payload),
  userRating: (state, payload) => (state.rating = payload)
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
