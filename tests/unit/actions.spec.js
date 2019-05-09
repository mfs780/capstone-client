import actions from '../../src/store/actions';
import axios from "axios";

jest.mock("axios")

let state;
let initState;

beforeEach(() => {
    console.log = () => { };
    initState = {
        selectedSearch: "",
        selectedNode: {},
        nodeMetaData: {},
        searches: {},
        nodes: [],
        links: [],
        isQuerying: false,
        tasks: []
    }

    state = {
        selectedSearch: "",
        selectedNode: {},
        nodeMetaData: {},
        links: [{ source: "1", targert: "2" }, { source: "1", target: "4" }, { source: "2", target: "3" }],
        nodes: [
            { id: "1", searches: { "parkinsons": true } },
            { id: "2", searches: { "parkinsons": true, "disease": true } },
            { id: "3", searches: { "disease": true } },
            { id: "4", searches: { "parkinsons": true }, isFavorite: true }
        ],
        searches: { "parkinsons": true, "disease": true },
        isQuerying: false,
        tasks: []
    }
});

test('clearFirebase commits clearFirebase', async () => {
    const commit = jest.fn()
    await actions.clearFirebase({ commit })
    expect(commit).toHaveBeenCalledWith('clearFirebase')
})

test('initState commits initState', async () => {
    const commit = jest.fn()
    await actions.initState({ commit }, state)
    expect(commit).toHaveBeenCalledWith('initState', { newState: state })
})

test('favoriteNode commits toggleFavorited and setFirebase', async () => {
    let node = { id: 1 }
    const commit = jest.fn()
    await actions.favoriteNode({ commit }, node)
    expect(commit).toHaveBeenCalledWith('toggleFavorited', { node })
    expect(commit).toHaveBeenCalledWith('setFirebase')
})

test('selectNode commits setSelectedNode', async () => {
    let node = { id: 1 }
    const commit = jest.fn()
    await actions.selectNode({ commit }, node)
    expect(commit).toHaveBeenCalledWith('setSelectedNode', { node })
})

test('selectSearch commits setSelectedSearch', async () => {
    let search = "vitamin";
    const commit = jest.fn()
    await actions.selectSearch({ commit }, search)
    expect(commit).toHaveBeenCalledWith('setSelectedSearch', { search })
})

test('setFirebase commits setFirebase', async () => {
    const commit = jest.fn()
    await actions.setFirebase({ commit })
    expect(commit).toHaveBeenCalledWith('setFirebase')
})

test('removeSearch commits removeNodes, removeSearch, setFirebase', async () => {
    let search = "vitamin";
    const commit = jest.fn()
    await actions.removeSearch({ commit }, search)
    expect(commit).toHaveBeenCalledWith('removeNodes', { search })
    expect(commit).toHaveBeenCalledWith('removeSearch', { search })
    expect(commit).toHaveBeenCalledWith('setFirebase')
})

test('queryMetaData on success commits startQuerying, setMetaData, stopQuerying', async () => {
    let res = {
        data: {
            nodes: [{ id: "5" }]
        }
    }

    let id = "5";
    const commit = jest.fn()
    axios.get.mockResolvedValue(res)

    await actions.queryMetaData({ state, commit }, id)
    expect(commit).toHaveBeenCalledWith('startQuerying')
    expect(commit).toHaveBeenCalledWith('setMetaData', { data: res.data })
    expect(commit).toHaveBeenCalledWith('stopQuerying')
})
