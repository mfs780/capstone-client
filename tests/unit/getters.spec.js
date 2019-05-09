import getters from '../../src/store/getters';

let state;

beforeEach(() => {
    console.log = () => { };
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

test('returns graph with nodes and links', () => {
    const result = getters.graph(state)

    expect(result.nodes).toHaveLength(4)
    expect(result.links).toHaveLength(3)
    expect(result.nodes).toEqual(state.nodes);
    expect(result.links).toEqual(state.links);
})

test('returns node by id', () => {
    const result = getters.getNodeById(state)("1");

    expect(result.id).toBe("1")

    const noresult = getters.getNodeById(state)("6");

    expect(noresult).toBeUndefined();
})