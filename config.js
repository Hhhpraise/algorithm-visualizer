// Global configuration and constants
const GRID_SIZE = 30;
const MOBILE_GRID_SIZE = 20;

// Algorithm descriptions
const sortingAlgorithms = {
    bubble: {
        title: "Bubble Sort",
        description: "Compares adjacent elements and swaps them if they're in wrong order. Simple but inefficient for large datasets.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stability: "Stable"
    },
    selection: {
        title: "Selection Sort",
        description: "Finds the minimum element and places it at the beginning. Divides array into sorted and unsorted regions.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stability: "Unstable"
    },
    insertion: {
        title: "Insertion Sort",
        description: "Builds sorted array one element at a time by inserting each element into its correct position.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stability: "Stable"
    },
    merge: {
        title: "Merge Sort",
        description: "Divides array into halves, sorts them separately, then merges them back together. Divide-and-conquer approach.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        stability: "Stable"
    },
    quick: {
        title: "Quick Sort",
        description: "Selects a pivot element and partitions array around it. Efficient divide-and-conquer algorithm.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        stability: "Unstable"
    },
    heap: {
        title: "Heap Sort",
        description: "Uses a binary heap data structure. Builds max-heap then repeatedly extracts maximum element.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)",
        stability: "Unstable"
    },
    radix: {
        title: "Radix Sort",
        description: "Sorts by processing digits from least to most significant. Efficient for integers with fixed number of digits.",
        timeComplexity: "O(d × n)",
        spaceComplexity: "O(n + k)",
        stability: "Stable"
    },
    shell: {
        title: "Shell Sort",
        description: "Improved insertion sort that allows exchange of far apart elements. Uses gap sequence to reduce comparisons.",
        timeComplexity: "O(n³/²)",
        spaceComplexity: "O(1)",
        stability: "Unstable"
    }
};

const pathfindingAlgorithms = {
    astar: {
        title: "A* Search",
        description: "Informed search using heuristics (f = g + h). Finds optimal path efficiently by estimating remaining cost."
    },
    dijkstra: {
        title: "Dijkstra's Algorithm",
        description: "Finds shortest path from source to all vertices. Guarantees optimal solution using greedy approach."
    },
    bfs: {
        title: "Breadth-First Search",
        description: "Explores nodes level by level. Guarantees shortest path in unweighted graphs using queue."
    },
    dfs: {
        title: "Depth-First Search",
        description: "Explores as far as possible before backtracking. Uses stack (recursion) to traverse graph."
    },
    greedy: {
        title: "Greedy Best-First",
        description: "Uses only heuristic function (h) to guide search. Fast but doesn't guarantee optimal path."
    },
    bidirectional: {
        title: "Bidirectional Search",
        description: "Searches simultaneously from start and end points. Reduces search space significantly."
    }
};