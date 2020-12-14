import { User } from "../models/user.model";

const COLLECTION_NAME = "users";

export const state = () => ({
  currentUser: null,
});

export const getters = {};

export const mutations = {
  setCurrentUser(state, user: User) {
    state.currentUser = user;
  },
};

export const actions = {
  async upsert({ commit }, user: User) {
    const { id, email, displayName } = user;
    await this.$fireStore
      .collection(COLLECTION_NAME)
      .doc(id)
      .set({ email, displayName });
    commit("setCurrentUser", user);
  },
};
