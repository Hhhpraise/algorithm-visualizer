 // ===== BINARY TREE ALGORITHMS =====

    // Tree node class
    class TreeNode {
        constructor(value) {
            this.value = value;
            this.left = null;
            this.right = null;
            this.x = 0;
            this.y = 0;
            this.highlighted = false;
        }
    }

    function generateRandomTree() {
        clearTree();
        const values = [];
        const valueCount = Math.floor(Math.random() * 15) + 10; // 10-24 nodes

        for (let i = 0; i < valueCount; i++) {
            values.push(Math.floor(Math.random() * 100) + 1);
        }

        for (const value of values) {
            insertTreeNode(value);
        }

        updateTreeLayout();
        drawTree();
    }

    function insertTreeNode(value) {
        if (treeRoot === null) {
            treeRoot = new TreeNode(value);
            return;
        }

        let current = treeRoot;
        while (true) {
            if (value < current.value) {
                if (current.left === null) {
                    current.left = new TreeNode(value);
                    return;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                    current.right = new TreeNode(value);
                    return;
                }
                current = current.right;
            }
        }
    }

    function clearTree() {
        treeRoot = null;
        drawTree();
    }

    function updateTreeLayout() {
        // Simple tree layout algorithm
        // In a real implementation, you'd use a more sophisticated approach
        if (!treeRoot) return;

        const queue = [{node: treeRoot, level: 0, pos: 0.5}];
        let maxLevel = 0;

        while (queue.length > 0) {
            const {node, level, pos} = queue.shift();

            node.x = pos * treeCanvas.width;
            node.y = (level + 1) * 80;

            maxLevel = Math.max(maxLevel, level);

            if (node.left) {
                queue.push({node: node.left, level: level + 1, pos: pos - 0.5 / Math.pow(2, level + 1)});
            }
            if (node.right) {
                queue.push({node: node.right, level: level + 1, pos: pos + 0.5 / Math.pow(2, level + 1)});
            }
        }

        // Adjust y positions based on max level
        const yScale = treeCanvas.height / (maxLevel + 2);
        const adjustY = (node, level) => {
            if (!node) return;
            node.y = (level + 1) * yScale;
            adjustY(node.left, level + 1);
            adjustY(node.right, level + 1);
        };

        adjustY(treeRoot, 0);
    }

    function drawTree() {
        treeCtx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

        if (!treeRoot) return;

        // Draw edges first
        treeCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        treeCtx.lineWidth = 2;

        const drawEdges = (node) => {
            if (!node) return;

            if (node.left) {
                treeCtx.beginPath();
                treeCtx.moveTo(node.x, node.y);
                treeCtx.lineTo(node.left.x, node.left.y);
                treeCtx.stroke();
                drawEdges(node.left);
            }

            if (node.right) {
                treeCtx.beginPath();
                treeCtx.moveTo(node.x, node.y);
                treeCtx.lineTo(node.right.x, node.right.y);
                treeCtx.stroke();
                drawEdges(node.right);
            }
        };

        drawEdges(treeRoot);

        // Draw nodes
        const drawNodes = (node) => {
            if (!node) return;

            treeCtx.beginPath();
            treeCtx.arc(node.x, node.y, 20, 0, Math.PI * 2);

            if (node.highlighted) {
                treeCtx.fillStyle = '#ffd93d';
            } else {
                treeCtx.fillStyle = '#4ecdc4';
            }

            treeCtx.fill();
            treeCtx.strokeStyle = 'white';
            treeCtx.lineWidth = 2;
            treeCtx.stroke();

            // Draw value
            treeCtx.fillStyle = 'white';
            treeCtx.font = 'bold 16px Arial';
            treeCtx.textAlign = 'center';
            treeCtx.textBaseline = 'middle';
            treeCtx.fillText(node.value.toString(), node.x, node.y);

            drawNodes(node.left);
            drawNodes(node.right);
        };

        drawNodes(treeRoot);
    }

    function executeTreeOperation() {
            const operation = document.getElementById('treeAlgorithm').value;
            const value = parseInt(document.getElementById('nodeValue').value);

            if (operation !== 'inorder' && operation !== 'preorder' &&
                operation !== 'postorder' && operation !== 'levelorder' && isNaN(value)) {
                alert("Please enter a valid number");
                return;
            }

            switch (operation) {
                case 'insert':
                    insertTreeNode(value);
                    updateTreeLayout();
                    drawTree();
                    break;
                case 'search':
                    searchTreeNode(value);
                    break;
                case 'delete':
                    deleteTreeNode(value);
                    break;
                case 'inorder':
                    inorderTraversal();
                    break;
                case 'preorder':
                    preorderTraversal();
                    break;
                case 'postorder':
                    postorderTraversal();
                    break;
                case 'levelorder':
                    levelorderTraversal();
                    break;
            }
        }

    function deleteTreeNode(value) {
            treeRoot = deleteNode(treeRoot, value);
            updateTreeLayout();
            drawTree();
        }

        function deleteNode(root, value) {
            if (root === null) return null;

            if (value < root.value) {
                root.left = deleteNode(root.left, value);
            } else if (value > root.value) {
                root.right = deleteNode(root.right, value);
            } else {
                // Node to be deleted found

                // Case 1: No child or one child
                if (root.left === null) {
                    return root.right;
                } else if (root.right === null) {
                    return root.left;
                }

                // Case 2: Two children
                // Find inorder successor (smallest in right subtree)
                root.value = minValue(root.right);

                // Delete the inorder successor
                root.right = deleteNode(root.right, root.value);
            }

            return root;
        }

        function minValue(node) {
            let current = node;
            while (current.left !== null) {
                current = current.left;
            }
            return current.value;
        }

        async function inorderTraversal() {
            await traverseTree('inorder');
        }

        async function preorderTraversal() {
            await traverseTree('preorder');
        }

        async function postorderTraversal() {
            await traverseTree('postorder');
        }

        async function levelorderTraversal() {
            await traverseTree('levelorder');
        }

        async function traverseTree(order) {
            if (!treeRoot) return;

            resetTreeHighlights();
            const speed = 101 - parseInt(document.getElementById('treeSpeedSlider').value);

            switch (order) {
                case 'inorder':
                    await inorder(treeRoot, speed);
                    break;
                case 'preorder':
                    await preorder(treeRoot, speed);
                    break;
                case 'postorder':
                    await postorder(treeRoot, speed);
                    break;
                case 'levelorder':
                    await levelorder(treeRoot, speed);
                    break;
            }
        }

        async function inorder(node, speed) {
            if (!node || !isAnimating) return;

            await inorder(node.left, speed);

            node.highlighted = true;
            drawTree();
            playSound(400, 50);
            await sleep(speed);

            await inorder(node.right, speed);
        }

        async function preorder(node, speed) {
            if (!node || !isAnimating) return;

            node.highlighted = true;
            drawTree();
            playSound(400, 50);
            await sleep(speed);

            await preorder(node.left, speed);
            await preorder(node.right, speed);
        }

        async function postorder(node, speed) {
            if (!node || !isAnimating) return;

            await postorder(node.left, speed);
            await postorder(node.right, speed);

            node.highlighted = true;
            drawTree();
            playSound(400, 50);
            await sleep(speed);
        }

        async function levelorder(node, speed) {
            if (!node) return;

            const queue = [node];

            while (queue.length > 0 && isAnimating) {
                const current = queue.shift();

                current.highlighted = true;
                drawTree();
                playSound(400, 50);
                await sleep(speed);

                if (current.left) queue.push(current.left);
                if (current.right) queue.push(current.right);
            }
        }

        function resetTreeHighlights() {
            const resetNode = (node) => {
                if (!node) return;
                node.highlighted = false;
                resetNode(node.left);
                resetNode(node.right);
            };
            resetNode(treeRoot);
        }

    async function searchTreeNode(value) {
        if (!treeRoot) return;

        let current = treeRoot;
        const speed = 101 - parseInt(document.getElementById('treeSpeedSlider').value);

        while (current && isAnimating) {
            current.highlighted = true;
            drawTree();
            playSound(400, 50);
            await sleep(speed);

            if (value === current.value) {
                // Found
                playSound(600, 100);
                return;
            } else if (value < current.value) {
                current.highlighted = false;
                current = current.left;
            } else {
                current.highlighted = false;
                current = current.right;
            }
        }

        // Not found
        playSound(200, 100);
    }
