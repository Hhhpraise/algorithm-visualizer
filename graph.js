// ===== GRAPH TRAVERSAL ALGORITHMS =====

    function generateGraph() {
        nodes = [];
        edges = [];
        visitedNodes = [];

        // Create random nodes
        const nodeCount = Math.floor(Math.random() * 15) + 10; // 10-24 nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                id: i,
                x: Math.random() * graphCanvas.width,
                y: Math.random() * graphCanvas.height,
                visited: false,
                distance: Infinity,
                parent: null
            });
        }

        // Create random edges
        for (let i = 0; i < nodes.length; i++) {
            const edgeCount = Math.floor(Math.random() * 3) + 2; // 2-4 edges per node
            for (let j = 0; j < edgeCount; j++) {
                const target = Math.floor(Math.random() * nodes.length);
                if (target !== i) {
                    edges.push({
                        source: i,
                        target: target,
                        weight: Math.floor(Math.random() * 9) + 1 // 1-9 weight
                    });
                }
            }
        }

        drawGraph();
    }

    function generateWeightedGraph() {
        generateGraph();
        // Ensure some edges have higher weights
        for (const edge of edges) {
            if (Math.random() < 0.3) { // 30% chance of higher weight
                edge.weight = Math.floor(Math.random() * 20) + 10; // 10-29 weight
            }
        }
        drawGraph();
    }

    function resetGraph() {
        for (const node of nodes) {
            node.visited = false;
            node.distance = Infinity;
            node.parent = null;
        }
        visitedNodes = [];
        drawGraph();
    }

    function drawGraph() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);

        // Draw edges
        graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        graphCtx.lineWidth = 2;
        graphCtx.font = '12px Arial';
        graphCtx.fillStyle = 'white';

        for (const edge of edges) {
            const source = nodes[edge.source];
            const target = nodes[edge.target];

            graphCtx.beginPath();
            graphCtx.moveTo(source.x, source.y);
            graphCtx.lineTo(target.x, target.y);
            graphCtx.stroke();

            // Draw weight
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;
            graphCtx.fillText(edge.weight.toString(), midX + 5, midY + 5);
        }

        // Draw nodes
        for (const node of nodes) {
            graphCtx.beginPath();
            graphCtx.arc(node.x, node.y, 15, 0, Math.PI * 2);

            if (node.visited) {
                graphCtx.fillStyle = '#ffd93d';
            } else if (visitedNodes.includes(node.id)) {
                graphCtx.fillStyle = '#6bcf7f';
            } else {
                graphCtx.fillStyle = '#4ecdc4';
            }

            graphCtx.fill();
            graphCtx.strokeStyle = 'white';
            graphCtx.lineWidth = 2;
            graphCtx.stroke();

            // Draw node ID
            graphCtx.fillStyle = 'white';
            graphCtx.font = 'bold 14px Arial';
            graphCtx.textAlign = 'center';
            graphCtx.textBaseline = 'middle';
            graphCtx.fillText(node.id.toString(), node.x, node.y);
        }
    }

    async function startGraphTraversal() {
            if (isAnimating) return;

            isAnimating = true;
            resetGraph();

            const algorithm = document.getElementById('graphAlgorithm').value;
            const speed = 101 - parseInt(document.getElementById('graphSpeedSlider').value);

            switch (algorithm) {
                case 'bfs': await bfsTraversal(); break;
                case 'dfs': await dfsTraversal(); break;
                case 'topological': await topologicalSort(); break;
                case 'dijkstraGraph': await dijkstraGraph(); break;
                case 'mst': await mst(); break;
            }
        }

    function stopGraph() {
        isAnimating = false;
        if (animationId) {
            clearTimeout(animationId);
        }
    }
    async function topologicalSort() {
            resetGraph();
            const inDegree = new Array(nodes.length).fill(0);
            const queue = [];
            const result = [];
            const speed = 101 - parseInt(document.getElementById('graphSpeedSlider').value);

            // Calculate in-degrees
            for (const edge of edges) {
                inDegree[edge.target]++;
            }

            // Find nodes with zero in-degree
            for (let i = 0; i < nodes.length; i++) {
                if (inDegree[i] === 0) {
                    queue.push(nodes[i]);
                }
            }

            while (queue.length > 0 && isAnimating) {
                queue.sort((a, b) => a.id - b.id); // Process in order for consistent visualization
                const current = queue.shift();

                current.visited = true;
                visitedNodes.push(current.id);
                result.push(current.id);

                drawGraph();
                playSound(400, 50);
                await sleep(speed);

                // Reduce in-degree of neighbors
                for (const edge of edges) {
                    if (edge.source === current.id) {
                        inDegree[edge.target]--;
                        if (inDegree[edge.target] === 0) {
                            queue.push(nodes[edge.target]);
                        }
                    }
                }
            }

            if (result.length !== nodes.length) {
                // Graph has a cycle
                alert("Graph contains a cycle! Topological sort not possible.");
            }

            isAnimating = false;
        }

        async function dijkstraGraph() {
            resetGraph();
            const startNode = nodes[0]; // Start from first node
            startNode.distance = 0;

            const priorityQueue = new PriorityQueue();
            priorityQueue.enqueue(startNode, startNode.distance);

            const speed = 101 - parseInt(document.getElementById('graphSpeedSlider').value);

            while (!priorityQueue.isEmpty() && isAnimating) {
                const current = priorityQueue.dequeue().element;

                if (current.visited) continue;
                current.visited = true;
                visitedNodes.push(current.id);

                drawGraph();
                playSound(400, 50);
                await sleep(speed);

                // Update distances to neighbors
                for (const edge of edges) {
                    if (edge.source === current.id) {
                        const neighbor = nodes[edge.target];
                        const newDistance = current.distance + edge.weight;

                        if (newDistance < neighbor.distance) {
                            neighbor.distance = newDistance;
                            neighbor.parent = current;
                            priorityQueue.enqueue(neighbor, neighbor.distance);
                        }
                    } else if (edge.target === current.id) {
                        const neighbor = nodes[edge.source];
                        const newDistance = current.distance + edge.weight;

                        if (newDistance < neighbor.distance) {
                            neighbor.distance = newDistance;
                            neighbor.parent = current;
                            priorityQueue.enqueue(neighbor, neighbor.distance);
                        }
                    }
                }
            }

            // Highlight shortest paths
            for (const node of nodes) {
                if (node.parent !== null) {
                    node.highlighted = true;
                    drawGraph();
                    await sleep(speed / 2);
                }
            }

            isAnimating = false;
        }

        async function mst() {
            resetGraph();
            // Using Kruskal's algorithm for MST
            const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
            const parent = new Array(nodes.length);
            const rank = new Array(nodes.length).fill(0);
            const mstEdges = [];
            const speed = 101 - parseInt(document.getElementById('graphSpeedSlider').value);

            // Initialize union-find data structure
            for (let i = 0; i < nodes.length; i++) {
                parent[i] = i;
            }

            function find(x) {
                if (parent[x] !== x) {
                    parent[x] = find(parent[x]);
                }
                return parent[x];
            }

            function union(x, y) {
                const rootX = find(x);
                const rootY = find(y);

                if (rootX === rootY) return false;

                if (rank[rootX] < rank[rootY]) {
                    parent[rootX] = rootY;
                } else if (rank[rootX] > rank[rootY]) {
                    parent[rootY] = rootX;
                } else {
                    parent[rootY] = rootX;
                    rank[rootX]++;
                }

                return true;
            }

            for (const edge of sortedEdges) {
                if (!isAnimating) break;

                if (union(edge.source, edge.target)) {
                    mstEdges.push(edge);

                    // Visualize the added edge
                    nodes[edge.source].highlighted = true;
                    nodes[edge.target].highlighted = true;

                    drawGraph();
                    playSound(400, 50);
                    await sleep(speed);
                }
            }

            isAnimating = false;
        }

    async function bfsTraversal() {
        const queue = [];
        const startNode = nodes[0]; // Start from first node

        startNode.visited = true;
        queue.push(startNode);
        visitedNodes.push(startNode.id);

        const speed = 101 - parseInt(document.getElementById('graphSpeedSlider').value);

        while (queue.length > 0 && isAnimating) {
            const current = queue.shift();

            // Highlight current node
            current.visited = true;
            drawGraph();
            playSound(400, 50);
            await sleep(speed);

            // Get all neighbors
            const neighbors = [];
            for (const edge of edges) {
                if (edge.source === current.id && !nodes[edge.target].visited) {
                    neighbors.push(nodes[edge.target]);
                } else if (edge.target === current.id && !nodes[edge.source].visited) {
                    neighbors.push(nodes[edge.source]);
                }
            }

            // Add neighbors to queue
            for (const neighbor of neighbors) {
                neighbor.visited = true;
                queue.push(neighbor);
                visitedNodes.push(neighbor.id);
            }
        }

        isAnimating = false;
    }

    async function dfsTraversal() {
        const stack = [];
        const startNode = nodes[0]; // Start from first node

        startNode.visited = true;
        stack.push(startNode);
        visitedNodes.push(startNode.id);

        const speed = 101 - parseInt(document.getElementById('graphSpeedSlider').value);

        while (stack.length > 0 && isAnimating) {
            const current = stack.pop();

            // Highlight current node
            current.visited = true;
            drawGraph();
            playSound(400, 50);
            await sleep(speed);

            // Get all neighbors
            const neighbors = [];
            for (const edge of edges) {
                if (edge.source === current.id && !nodes[edge.target].visited) {
                    neighbors.push(nodes[edge.target]);
                } else if (edge.target === current.id && !nodes[edge.source].visited) {
                    neighbors.push(nodes[edge.source]);
                }
            }

            // Add neighbors to stack in reverse order for proper DFS
            for (let i = neighbors.length - 1; i >= 0; i--) {
                neighbors[i].visited = true;
                stack.push(neighbors[i]);
                visitedNodes.push(neighbors[i].id);
            }
        }

        isAnimating = false;
    }
