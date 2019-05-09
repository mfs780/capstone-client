import mutations from '../../src/store/mutations';

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

test('initState sets initial state', () => {
    mutations.initState(initState, { newState: state });
    expect(initState).toEqual(state);
})

test('removeNodes removes nodes and links related to a particular search term', () => {
    const search = "parkinsons";
    mutations.removeNodes(state, { search });
    expect(state.links.length).toBe(1);
    expect(state.nodes.length).toBe(3);
})

test('removeSearch removes a particular search term', () => {
    const search = "parkinsons";
    mutations.removeSearch(state, { search });
    expect(Object.keys(state.searches).length).toBe(1);
})

test('setMetaData sets appropriate message on no data', () => {
    let data;
    mutations.setMetaData(state, { data });
    expect(state.nodeMetaData).toEqual({ msg: "No Metadata Available" });
})

test('setMetaData sets metadata to article', () => {
    let data = {
        article: [{
            title: 'hey'
        }]
    };
    mutations.setMetaData(state, { data });
    expect(state.nodeMetaData).toEqual(data.article[0]);
})

test('setNodes merges graph', () => {
    const query = {
        title: 'vitamin',
        keywords: ''
    }

    const data = {
        graph: {
            links: [{ source: "1", targert: "4" }, { source: "1", target: "5" }, { source: "4", target: "5" }],
            nodes: [
                { id: "1" },
                { id: "4" },
                { id: "5" }
            ]
        }
    }
    mutations.setNodes(state, { data, query });

    expect(state.links.length).toBe(5);
    expect(state.nodes.length).toBe(5);

    let nodesWithVitamin = state.nodes.filter((node) => {
        return Object.keys(node.searches).indexOf('vitamin') !== -1;
    }).length;

    expect(nodesWithVitamin).toBe(3);
})

test('setSearch sets search based on query', () => {
    expect(state.searches['vitamin']).toBeUndefined();
    expect(state.searches['vitamin | [d]']).toBeUndefined();
    expect(state.searches['[d]']).toBeUndefined();

    mutations.setSearch(state, {
        query: {
            title: 'vitamin',
            keywords: ''
        }
    });
    expect(state.searches['vitamin']).not.toBeUndefined();

    mutations.setSearch(state, {
        query: {
            title: 'vitamin',
            keywords: 'd'
        }
    });
    state.searches
    expect(state.searches['vitamin | [d]']).not.toBeUndefined();

    mutations.setSearch(state, {
        query: {
            title: '',
            keywords: 'd'
        }
    });
    state.searches
    expect(state.searches['[d]']).not.toBeUndefined();
})

test('setSelectedNode sets selectedNode to selected Node id', () => {
    let node = { id: 6 }
    mutations.setSelectedNode(state, { node });
    expect(state.selectedNode).toBe(node.id);
})

test('setSelectedSearch sets selectedSearch to search unless already selected', () => {
    let search = "parkinsons";
    mutations.setSelectedSearch(state, { search });
    expect(state.selectedSearch).toBe(search);

    mutations.setSelectedSearch(state, { search });
    expect(state.selectedSearch).toBe("");
})

test('setTask updates state with tasks in payload', () => {
    const taskId = "123";
    const query = "parkinsons";
    mutations.setTask(state, { taskId, query });
    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0]).toEqual({ taskId, query });
})

test('setVisited updates node with isVisited set to true', () => {
    let node = { id: "1", searches: { "parkinsons": true } }
    mutations.setVisited(state, { node });

    let stateNode = state.nodes.find(n => {
        return n.id == node.id;
    })

    expect(stateNode.isVisited).toBeTruthy();

    mutations.setVisited(state, { node });
    expect(stateNode.isVisited).toBeTruthy();
})

test('startQuerying sets isQuerying to true', () => {
    const state = {
        isQuerying: false
    }
    mutations.startQuerying(state);
    expect(state.isQuerying).toBeTruthy();
})

test('stopQuerying sets isQuerying to true', () => {
    const state = {
        isQuerying: true
    }
    mutations.stopQuerying(state);
    expect(state.isQuerying).toBeFalsy();
})

test('toggleFavorited updates node with isFavorite set to true then false', () => {
    let node = { id: "1", searches: { "parkinsons": true } }

    let stateNode = state.nodes.find(n => {
        return n.id == node.id;
    })
    expect(stateNode.isFavorite).toBeFalsy();
    
    mutations.toggleFavorited(state, { node });

    stateNode = state.nodes.find(n => {
        return n.id == node.id;
    })

    expect(stateNode.isFavorite).toBeTruthy();

    mutations.toggleFavorited(state, { node });
    expect(stateNode.isFavorite).toBeFalsy();
})
