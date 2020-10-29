const COLLECTION_NAME = "users";

export const state = () => ({
  currentUser: null,
});

export const getters = () => ({});

export const mutations = () => ({
  setCurrentUser(state, user) {
    //TODO ist user richtig?
    state.currentUser = user;
  },
});

export const actions = () => ({
  async login({ commit }, user) {
    //TODO type
    const userRef = this.data.doc(`${COLLECTION_NAME}/${user.uid}`);

    const data = {
      email: user.email,
    };
    const currentUser = await userRef.set(data, { merge: true });
    commit("setCurrentUser", currentUser);
  },
});
