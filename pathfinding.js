// ===== PATHFINDING ALGORITHMS =====

        function initializeGrid() {
            const gridElement = document.getElementById('pathGrid');
            gridElement.innerHTML = '';
            gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 20px)`;

            grid = [];
            for (let y = 0; y < GRID_SIZE; y++) {
                grid[y] = [];
                for (let x = 0; x < GRID_SIZE; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.dataset.x = x;
                    cell.dataset.y = y;

                    if (x === startNode.x && y === startNode.y) {
                        cell.classList.add('start');
                    } else if (x === endNode.x && y === endNode.y) {
                        cell.classList.add('end');
                    }

                    cell.addEventListener('click', handleCellClick);
                    cell.addEventListener('contextmenu', handleRightClick);
                    cell.addEventListener('mousedown', handleMouseDown);
                    cell.addEventListener('mouseenter', handleMouseEnter);
                    gridElement.appendChild(cell);

                    grid[y][x] = {
                        x, y,
                        wall: false,
                        visited: false,
                        distance: Infinity,
                        heuristic: 0,
                        parent: null,
                        element: cell,
                        weight: 1
                    };
                }
            }
        }

        let isDragging = false;
        let dragType = '';

        function handleMouseDown(event) {
            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);

            if (x === startNode.x && y === startNode.y) {
                isDragging = true;
                dragType = 'start';
            } else if (x === endNode.x && y === endNode.y) {
                isDragging = true;
                dragType = 'end';
            }
        }

        function handleMouseEnter(event) {
            if (!isDragging) return;

            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);

            if (dragType === 'start') {
                // Remove old start
                grid[startNode.y][startNode.x].element.classList.remove('start');
                startNode = {x, y};
                event.target.classList.add('start');
                event.target.classList.remove('wall', 'end');
                grid[y][x].wall = false;
            } else if (dragType === 'end') {
                // Remove old end
                grid[endNode.y][endNode.x].element.classList.remove('end');
                endNode = {x, y};
                event.target.classList.add('end');
                event.target.classList.remove('wall', 'start');
                grid[y][x].wall = false;
            }
        }

        document.addEventListener('mouseup', () => {
            isDragging = false;
            dragType = '';
        });

        function handleCellClick(event) {
            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);

            if ((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y)) {
                return;
            }

            const cell = grid[y][x];
            cell.wall = !cell.wall;
            event.target.classList.toggle('wall');
        }

        function handleRightClick(event) {
            event.preventDefault();
            const x = parseInt(event.target.dataset.x);
            const y = parseInt(event.target.dataset.y);

            if ((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y)) {
                return;
            }

            const cell = grid[y][x];
            cell.weight = cell.weight === 1 ? 3 : 1;

            if (cell.weight === 3 && !cell.wall) {
                event.target.style.background = '#ffa500';
                event.target.style.opacity = '0.7';
            } else {
                event.target.style.background = '';
                event.target.style.opacity = '';
            }
        }

        function generateMaze() {
            clearGrid();

            // Simple recursive maze generation
            const stack = [];
            const visited = new Set();

            function getNeighbors(x, y) {
                const neighbors = [];
                const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];

                for (const [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !visited.has(`${nx},${ny}`)) {
                        neighbors.push({x: nx, y: ny, wallX: x + dx/2, wallY: y + dy/2});
                    }
                }
                return neighbors;
            }

            // Fill with walls
            for (let y = 0; y < GRID_SIZE; y++) {
                for (let x = 0; x < GRID_SIZE; x++) {
                    if ((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y)) {
                        continue;
                    }
                    grid[y][x].wall = true;
                    grid[y][x].element.classList.add('wall');
                }
            }

            // Start carving from a random odd position
            let currentX = 1;
            let currentY = 1;
            visited.add(`${currentX},${currentY}`);
            stack.push({x: currentX, y: currentY});

            grid[currentY][currentX].wall = false;
            grid[currentY][currentX].element.classList.remove('wall');

            while (stack.length > 0) {
                const neighbors = getNeighbors(currentX, currentY);

                if (neighbors.length > 0) {
                    const next = neighbors[Math.floor(Math.random() * neighbors.length)];

                    // Remove wall between current and next
                    grid[next.wallY][next.wallX].wall = false;
                    grid[next.wallY][next.wallX].element.classList.remove('wall');

                    grid[next.y][next.x].wall = false;
                    grid[next.y][next.x].element.classList.remove('wall');

                    visited.add(`${next.x},${next.y}`);
                    stack.push({x: next.x, y: next.y});
                    currentX = next.x;
                    currentY = next.y;
                } else {
                    const backtrack = stack.pop();
                    if (backtrack) {
                        currentX = backtrack.x;
                        currentY = backtrack.y;
                    }
                }
            }

            // Ensure start and end are clear
            grid[startNode.y][startNode.x].wall = false;
            grid[startNode.y][startNode.x].element.classList.remove('wall');
            grid[endNode.y][endNode.x].wall = false;
            grid[endNode.y][endNode.x].element.classList.remove('wall');
        }

        <!-- The existing HTML and CSS code remains the same until the script section -->


    function addRandomWalls() {
        clearPath();
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if ((x === startNode.x && y === startNode.y) || (x === endNode.x && y === endNode.y)) {
                    continue;
                }
                if (Math.random() < 0.3) { // 30% chance of wall
                    grid[y][x].wall = true;
                    grid[y][x].element.classList.add('wall');
                }
            }
        }
    }

    function clearPath() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                cell.visited = false;
                cell.distance = Infinity;
                cell.heuristic = 0;
                cell.parent = null;
                cell.element.classList.remove('visited', 'path');

                // Reset weight but keep walls
                cell.weight = 1;
                if (!cell.wall) {
                    cell.element.style.background = '';
                    cell.element.style.opacity = '';
                }
            }
        }
    }

    function clearGrid() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = grid[y][x];
                cell.wall = false;
                cell.visited = false;
                cell.distance = Infinity;
                cell.heuristic = 0;
                cell.parent = null;
                cell.weight = 1;
                cell.element.className = 'cell';
                cell.element.style.background = '';
                cell.element.style.opacity = '';

                if (x === startNode.x && y === startNode.y) {
                    cell.element.classList.add('start');
                } else if (x === endNode.x && y === endNode.y) {
                    cell.element.classList.add('end');
                }
            }
        }
    }

    async function startPathfinding() {
        if (isAnimating) return;

        isAnimating = true;
        clearPath();
        document.getElementById('pathBtn').disabled = true;

        const algorithm = document.getElementById('pathAlgorithm').value;
        const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

        switch (algorithm) {
            case 'astar': await aStarSearch(); break;
            case 'dijkstra': await dijkstra(); break;
            case 'bfs': await breadthFirstSearch(); break;
            case 'dfs': await depthFirstSearch(); break;
            case 'greedy': await greedyBestFirst(); break;
            case 'bidirectional': await bidirectionalSearch(); break;
        }

        isAnimating = false;
        document.getElementById('pathBtn').disabled = false;
    }

    function stopPathfinding() {
        isAnimating = false;
        document.getElementById('pathBtn').disabled = false;
        if (animationId) {
            clearTimeout(animationId);
        }
    }

    function heuristic(nodeA, nodeB) {
        // Manhattan distance
        return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
    }

     async function bidirectionalSearch() {
            // Implementation of bidirectional search algorithm
            const forwardQueue = [];
            const backwardQueue = [];
            const forwardVisited = new Set();
            const backwardVisited = new Set();
            const forwardParents = new Map();
            const backwardParents = new Map();

            const start = grid[startNode.y][startNode.x];
            const end = grid[endNode.y][endNode.x];

            forwardQueue.push(start);
            forwardVisited.add(start);
            forwardParents.set(start, null);

            backwardQueue.push(end);
            backwardVisited.add(end);
            backwardParents.set(end, null);

            let meetingNode = null;
            const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

            while ((forwardQueue.length > 0 || backwardQueue.length > 0) && isAnimating) {
                // Process forward search
                if (forwardQueue.length > 0) {
                    const currentForward = forwardQueue.shift();

                    if (backwardVisited.has(currentForward)) {
                        meetingNode = currentForward;
                        break;
                    }

                    currentForward.element.classList.add('visited');
                    playSound(300, 20);
                    await sleep(speed);

                    for (const neighbor of getNeighbors(currentForward)) {
                        if (!forwardVisited.has(neighbor)) {
                            forwardVisited.add(neighbor);
                            forwardParents.set(neighbor, currentForward);
                            forwardQueue.push(neighbor);
                        }
                    }
                }

                // Process backward search
                if (backwardQueue.length > 0) {
                    const currentBackward = backwardQueue.shift();

                    if (forwardVisited.has(currentBackward)) {
                        meetingNode = currentBackward;
                        break;
                    }

                    currentBackward.element.classList.add('visited');
                    playSound(300, 20);
                    await sleep(speed);

                    for (const neighbor of getNeighbors(currentBackward)) {
                        if (!backwardVisited.has(neighbor)) {
                            backwardVisited.add(neighbor);
                            backwardParents.set(neighbor, currentBackward);
                            backwardQueue.push(neighbor);
                        }
                    }
                }
            }

            if (meetingNode) {
                // Reconstruct path from start to meeting point
                let current = meetingNode;
                while (current && current !== start) {
                    current.element.classList.add('path');
                    current = forwardParents.get(current);
                    await sleep(speed / 2);
                }

                // Reconstruct path from meeting point to end
                current = meetingNode;
                while (current && current !== end) {
                    current.element.classList.add('path');
                    current = backwardParents.get(current);
                    await sleep(speed / 2);
                }

                playSound(600, 100);
            } else {
                // No path found
                playSound(100, 200);
            }

            isAnimating = false;
            document.getElementById('pathBtn').disabled = false;
        }

    async function aStarSearch() {
        const openSet = new PriorityQueue();
        const closedSet = new Set();
        const start = grid[startNode.y][startNode.x];
        const end = grid[endNode.y][endNode.x];

        start.distance = 0;
        start.heuristic = heuristic(start, end);
        openSet.enqueue(start, start.distance + start.heuristic);

        const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

        while (!openSet.isEmpty() && isAnimating) {
            const current = openSet.dequeue().element;

            if (current === end) {
                await reconstructPath(current);
                return;
            }

            closedSet.add(current);
            current.element.classList.add('visited');
            playSound(300, 20);
            await sleep(speed);

            for (const neighbor of getNeighbors(current)) {
                if (closedSet.has(neighbor)) continue;

                const tentativeDistance = current.distance + neighbor.weight;

                if (tentativeDistance < neighbor.distance) {
                    neighbor.distance = tentativeDistance;
                    neighbor.heuristic = heuristic(neighbor, end);
                    neighbor.parent = current;

                    if (!openSet.contains(neighbor)) {
                        openSet.enqueue(neighbor, neighbor.distance + neighbor.heuristic);
                    } else {
                        openSet.updatePriority(neighbor, neighbor.distance + neighbor.heuristic);
                    }
                }
            }
        }

        // No path found
        playSound(100, 200);
    }

    function getNeighbors(node) {
        const neighbors = [];
        const directions = [
            {x: 0, y: -1}, // Up
            {x: 1, y: 0},  // Right
            {x: 0, y: 1},  // Down
            {x: -1, y: 0}  // Left
        ];

        for (const dir of directions) {
            const newX = node.x + dir.x;
            const newY = node.y + dir.y;

            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                const neighbor = grid[newY][newX];
                if (!neighbor.wall) {
                    neighbors.push(neighbor);
                }
            }
        }

        return neighbors;
    }

    async function reconstructPath(node) {
        let current = node;
        const path = [];

        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }

        const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

        for (const pathNode of path) {
            if (pathNode !== grid[startNode.y][startNode.x] && pathNode !== grid[endNode.y][endNode.x]) {
                pathNode.element.classList.add('path');
                playSound(500, 30);
                await sleep(speed / 2);
            }
        }
    }

    // Priority Queue implementation for A*
    class PriorityQueue {
        constructor() {
            this.elements = [];
        }

        enqueue(element, priority) {
            this.elements.push({element, priority});
            this.elements.sort((a, b) => a.priority - b.priority);
        }

        dequeue() {
            return this.elements.shift();
        }

        isEmpty() {
            return this.elements.length === 0;
        }

        contains(element) {
            return this.elements.some(item => item.element === element);
        }

        updatePriority(element, newPriority) {
            const index = this.elements.findIndex(item => item.element === element);
            if (index !== -1) {
                this.elements[index].priority = newPriority;
                this.elements.sort((a, b) => a.priority - b.priority);
            }
        }
    }

    // Other pathfinding algorithms would be implemented similarly
    async function dijkstra() {
        // Implementation similar to A* but without heuristic
        const priorityQueue = new PriorityQueue();
        const start = grid[startNode.y][startNode.x];
        const end = grid[endNode.y][endNode.x];

        start.distance = 0;
        priorityQueue.enqueue(start, start.distance);

        const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

        while (!priorityQueue.isEmpty() && isAnimating) {
            const current = priorityQueue.dequeue().element;

            if (current.visited) continue;
            current.visited = true;

            current.element.classList.add('visited');
            playSound(300, 20);
            await sleep(speed);

            if (current === end) {
                await reconstructPath(current);
                return;
            }

            for (const neighbor of getNeighbors(current)) {
                if (neighbor.visited) continue;

                const distance = current.distance + neighbor.weight;

                if (distance < neighbor.distance) {
                    neighbor.distance = distance;
                    neighbor.parent = current;
                    priorityQueue.enqueue(neighbor, neighbor.distance);
                }
            }
        }

        // No path found
        playSound(100, 200);
    }

    async function breadthFirstSearch() {
        const queue = [];
        const start = grid[startNode.y][startNode.x];
        const end = grid[endNode.y][endNode.x];

        start.visited = true;
        queue.push(start);

        const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

        while (queue.length > 0 && isAnimating) {
            const current = queue.shift();

            if (current === end) {
                await reconstructPath(current);
                return;
            }

            for (const neighbor of getNeighbors(current)) {
                if (!neighbor.visited) {
                    neighbor.visited = true;
                    neighbor.parent = current;
                    queue.push(neighbor);

                    neighbor.element.classList.add('visited');
                    playSound(300, 20);
                    await sleep(speed);
                }
            }
        }

        // No path found
        playSound(100, 200);
    }

    async function depthFirstSearch() {
        const stack = [];
        const start = grid[startNode.y][startNode.x];
        const end = grid[endNode.y][endNode.x];

        start.visited = true;
        stack.push(start);

        const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

        while (stack.length > 0 && isAnimating) {
            const current = stack.pop();

            if (current === end) {
                await reconstructPath(current);
                return;
            }

            for (const neighbor of getNeighbors(current)) {
                if (!neighbor.visited) {
                    neighbor.visited = true;
                    neighbor.parent = current;
                    stack.push(neighbor);

                    neighbor.element.classList.add('visited');
                    playSound(300, 20);
                    await sleep(speed);
                }
            }
        }

        // No path found
        playSound(100, 200);
    }

    async function greedyBestFirst() {
        const priorityQueue = new PriorityQueue();
        const start = grid[startNode.y][startNode.x];
        const end = grid[endNode.y][endNode.x];

        start.heuristic = heuristic(start, end);
        priorityQueue.enqueue(start, start.heuristic);

        const speed = 101 - parseInt(document.getElementById('pathSpeedSlider').value);

        while (!priorityQueue.isEmpty() && isAnimating) {
            const current = priorityQueue.dequeue().element;

            if (current.visited) continue;
            current.visited = true;

            current.element.classList.add('visited');
            playSound(300, 20);
            await sleep(speed);

            if (current === end) {
                await reconstructPath(current);
                return;
            }

            for (const neighbor of getNeighbors(current)) {
                if (!neighbor.visited) {
                    neighbor.heuristic = heuristic(neighbor, end);
                    neighbor.parent = current;
                    priorityQueue.enqueue(neighbor, neighbor.heuristic);
                }
            }
        }

        // No path found
        playSound(100, 200);
    }

