// Global variables
let array = [];
let isAnimating = false;
let animationId;
let soundEnabled = true;
let startTime, endTime;

// Canvas contexts
let ctx, graphCtx, treeCtx;

// Statistics
let comparisons = 0;
let swaps = 0;

// Pathfinding grid
let grid = [];
let startNode = {x: 5, y: 5};
let endNode = {x: 25, y: 20};

// Graph variables
let nodes = [];
let edges = [];
let visitedNodes = [];

// Tree variables
let treeRoot = null;
let treeNodes = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup canvas contexts
    const canvas = document.getElementById('canvas');
    const graphCanvas = document.getElementById('graphCanvas');
    const treeCanvas = document.getElementById('treeCanvas');

    ctx = canvas.getContext('2d');
    graphCtx = graphCanvas.getContext('2d');
    treeCtx = treeCanvas.getContext('2d');

    // Resize canvases for mobile
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // Initialize components
    generateArray();
    setupSliders();
    initializeGrid();
    generateGraph();
    updateSortingInfo();
});

// Resize canvases for mobile responsiveness
function resizeCanvases() {
    const isMobile = window.innerWidth <= 768;

    const canvas = document.getElementById('canvas');
    const graphCanvas = document.getElementById('graphCanvas');
    const treeCanvas = document.getElementById('treeCanvas');

    // Set canvas dimensions based on screen size
    const width = Math.min(window.innerWidth - 60, 1200);

    canvas.width = width;
    canvas.height = isMobile ? 300 : 450;

    graphCanvas.width = width;
    graphCanvas.height = isMobile ? 400 : 550;

    treeCanvas.width = width;
    treeCanvas.height = isMobile ? 350 : 500;

    // Redraw if content exists
    if (array.length > 0) drawArray();
    if (nodes.length > 0) drawGraph();
    if (treeRoot) drawTree();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.querySelector('.sound-toggle');
    btn.textContent = soundEnabled ? '🔊' : '🔇';
}

function playSound(frequency, duration = 100) {
    if (!soundEnabled) return;

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        // Audio not supported
    }
}

function showTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Stop any running animations
    stopSort();
    stopPathfinding();
    stopGraph();

    // Resize canvases for the active tab
    resizeCanvases();
}

function setupSliders() {
    const speedSlider = document.getElementById('speedSlider');
    const sizeSlider = document.getElementById('sizeSlider');
    const pathSpeedSlider = document.getElementById('pathSpeedSlider');
    const graphSpeedSlider = document.getElementById('graphSpeedSlider');
    const treeSpeedSlider = document.getElementById('treeSpeedSlider');

    speedSlider.addEventListener('input', () => {
        document.getElementById('speedValue').textContent = speedSlider.value + 'ms';
    });

    sizeSlider.addEventListener('input', () => {
        document.getElementById('sizeValue').textContent = sizeSlider.value;
        generateArray();
    });

    pathSpeedSlider.addEventListener('input', () => {
        document.getElementById('pathSpeedValue').textContent = pathSpeedSlider.value + 'ms';
    });

    graphSpeedSlider.addEventListener('input', () => {
        document.getElementById('graphSpeedValue').textContent = graphSpeedSlider.value + 'ms';
    });

    treeSpeedSlider.addEventListener('input', () => {
        document.getElementById('treeSpeedValue').textContent = treeSpeedSlider.value + 'ms';
    });
}

function updateSortingInfo() {
    const algorithm = document.getElementById('sortAlgorithm').value;
    const info = sortingAlgorithms[algorithm];

    document.getElementById('sortingTitle').textContent = info.title;
    document.getElementById('sortingDescription').textContent = info.description;
    document.getElementById('timeComplexity').textContent = info.timeComplexity;
    document.getElementById('spaceComplexity').textContent = info.spaceComplexity;
    document.getElementById('stability').textContent = info.stability;
}

function updatePathInfo() {
    const algorithm = document.getElementById('pathAlgorithm').value;
    const info = pathfindingAlgorithms[algorithm];

    document.getElementById('pathTitle').textContent = info.title;
    document.getElementById('pathDescription').textContent = info.description;
}

function updateGraphInfo() {
    const algorithm = document.getElementById('graphAlgorithm').value;
    const titles = {
        bfs: "BFS Traversal",
        dfs: "DFS Traversal",
        topological: "Topological Sort",
        dijkstraGraph: "Dijkstra's Shortest Path",
        mst: "Minimum Spanning Tree (Kruskal's)"
    };

    const descriptions = {
        bfs: "Breadth-First Search explores graph nodes level by level, visiting all neighbors before moving to the next depth level.",
        dfs: "Depth-First Search explores as far as possible along each branch before backtracking to explore other branches.",
        topological: "Orders vertices in a directed acyclic graph such that for every directed edge (u,v), vertex u comes before v.",
        dijkstraGraph: "Finds shortest paths from a source vertex to all other vertices in a weighted graph with non-negative edge weights.",
        mst: "Finds the minimum spanning tree that connects all vertices with the minimum total edge weight."
    };

    document.getElementById('graphTitle').textContent = titles[algorithm];
    document.getElementById('graphDescription').textContent = descriptions[algorithm];
}

function updateTreeInfo() {
    const operation = document.getElementById('treeAlgorithm').value;
    const titles = {
        insert: "Insert Node",
        search: "Search Node",
        delete: "Delete Node",
        inorder: "In-order Traversal",
        preorder: "Pre-order Traversal",
        postorder: "Post-order Traversal",
        levelorder: "Level-order Traversal"
    };

    const descriptions = {
        insert: "Adds a new node to the binary search tree while maintaining the BST property.",
        search: "Finds a specific value in the binary search tree using the BST property for efficient searching.",
        delete: "Removes a node from the BST while maintaining the tree structure and BST property.",
        inorder: "Visits nodes in ascending order: left subtree, root, right subtree (gives sorted sequence).",
        preorder: "Visits root first, then left subtree, then right subtree (useful for copying tree structure).",
        postorder: "Visits left subtree, right subtree, then root (useful for deleting or calculating tree size).",
        levelorder: "Visits nodes level by level from top to bottom, left to right (breadth-first approach)."
    };

    document.getElementById('treeTitle').textContent = titles[operation];
    document.getElementById('treeDescription').textContent = descriptions[operation];
}

// Utility functions
async function sleep(ms) {
    return new Promise(resolve => {
        animationId = setTimeout(resolve, ms);
    });
}

function stopSort() {
    isAnimating = false;
    document.getElementById('sortBtn').disabled = false;
    if (animationId) {
        clearTimeout(animationId);
    }
}

function stopPathfinding() {
    isAnimating = false;
    document.getElementById('pathBtn').disabled = false;
    if (animationId) {
        clearTimeout(animationId);
    }
}

function stopGraph() {
    isAnimating = false;
    if (animationId) {
        clearTimeout(animationId);
    }
}