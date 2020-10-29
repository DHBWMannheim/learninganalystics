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
  delete(state, todo: Todo) {
    if (!todo.id) throw new Error("Missing id");
    state.todos.remove(todo.id, todo);
  },
});

export const actions = () => ({
  async upsert({ commit, rootGetters }, todo: Todo) {
    let firebaseAccess = this.$fireStore
      .collection(`${COLLECTION_NAME}`)
      .withConverter(getIdMapperConverter());

    let ref: DocumentRef;
    if (todo.id) {
      await firebaseAccess.doc(todo.id).set(todo);
      ref = todo.id;
    } else {
      ref = await firebaseAccess.add(todo);
    }

    //TODO: current user
    commit("upsert", {
      id: ref.id,
      ...todo,
    });
  },
  async delete({ commit }, todo: Todo) {
    await this.$fireStore
      .collection(`${COLLECTION_NAME}`)
      .doc(todo.id)
      .delete();
    commit("delete", todo);
  },
});
