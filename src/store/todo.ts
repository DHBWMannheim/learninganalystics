import { Todo } from "../models/todo.model";
import { getIdMapperConverter } from "../converters/id-mapper.converter";
import { stringify } from "querystring";

const COLLECTION_NAME = "todos";

export const state = () => ({
  todos: new Map<string, Todo>(),
});

export const getters = () => ({});

export const mutations = () => ({
  upsert(state, todo: Todo) {
    if (!todo.id) throw new Error("Missing id");
    state.todos.set(todo.id, todo);
  },
});

export const actions = () => ({
  async add({ commit, rootGetters }, todo: Todo) {
    let firebaseAccess = this.$fireStore
      .collection(`${COLLECTION_NAME}`)
      .withConverter(getIdMapperConverter());

    const firebaseResponse = await firebaseAccess.add(todo);
    //TODO: current user
    commit("upsert", {
      id: firebaseResponse.id,
      ...todo,
    });
  },
  delete({ commit }, todo: Todo) {
    this.$firebase.doc();
  },
});
