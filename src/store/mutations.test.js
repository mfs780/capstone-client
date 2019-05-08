import mutations from './mutations'

test('setItems updates state with items in payload', () => {
  const state = {
    tasks: []
  }
  const taskId = "123";
  const query = "parkinsons";
  mutations.setTask(state, { taskId, query });
  expect(state.tasks.length).toBe(1);
  expect(state.tasks[0]).toBe({ taskId, query });
})
