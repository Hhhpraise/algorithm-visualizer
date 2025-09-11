// ===== SORTING ALGORITHMS =====

function generateArray() {
    const size = parseInt(document.getElementById('sizeSlider').value);
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 400) + 10);
    }
    resetStats();
    drawArray();
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('elapsedTime').textContent = '0ms';
    document.getElementById('sortProgress').style.width = '0%';
}

function drawArray(compareIndices = [], swapIndices = [], sortedIndices = []) {
    const canvas = document.getElementById('canvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = canvas.width / array.length;

    for (let i = 0; i < array.length; i++) {
        const barHeight = (array[i] / 400) * canvas.height;
        let color = '#4ecdc4';

        if (sortedIndices.includes(i)) {
            color = '#6bcf7f';
        } else if (swapIndices.includes(i)) {
            color = '#ff6b6b';
        } else if (compareIndices.includes(i)) {
            color = '#ffd93d';
        }

        // Add gradient effect
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);

        // Add glow effect for active bars
        if (compareIndices.includes(i) || swapIndices.includes(i)) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 15;
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
            ctx.shadowBlur = 0;
        }
    }
}

async function startSort() {
    if (isAnimating) return;

    isAnimating = true;
    startTime = performance.now();
    document.getElementById('sortBtn').disabled = true;

    const algorithm = document.getElementById('sortAlgorithm').value;

    switch (algorithm) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSort(0, array.length - 1); break;
        case 'quick': await quickSort(0, array.length - 1); break;
        case 'heap': await heapSort(); break;
        case 'radix': await radixSort(); break;
        case 'shell': await shellSort(); break;
    }

    // Victory animation
    if (isAnimating) {
        await celebrateSort();
    }

    endTime = performance.now();
    document.getElementById('elapsedTime').textContent = Math.round(endTime - startTime) + 'ms';
    document.getElementById('sortProgress').style.width = '100%';

    isAnimating = false;
    document.getElementById('sortBtn').disabled = false;
}

function updateProgress(currentIndex, totalLength) {
    const progress = (currentIndex / totalLength) * 100;
    document.getElementById('sortProgress').style.width = progress + '%';
}

// Enhanced sorting algorithms with better visualization
// [All the sorting algorithm implementations from the original code would go here]
// For brevity, I'm including just one as an example:

async function selectionSort() {
            for (let i = 0; i < array.length - 1 && isAnimating; i++) {
                let minIdx = i;
                for (let j = i + 1; j < array.length && isAnimating; j++) {
                    comparisons++;
                    document.getElementById('comparisons').textContent = comparisons;
                    playSound(200 + array[j] * 2, 40);

                    updateProgress(i * array.length + j, array.length * array.length);
                    drawArray([i, j, minIdx]);
                    await sleep(101 - parseInt(document.getElementById('speedSlider').value));

                    if (array[j] < array[minIdx]) {
                        minIdx = j;
                    }
                }

                if (minIdx !== i) {
                    [array[i], array[minIdx]] = [array[minIdx], array[i]];
                    swaps++;
                    document.getElementById('swaps').textContent = swaps;
                    playSound(400, 100);
                    drawArray([], [i, minIdx]);
                    await sleep(101 - parseInt(document.getElementById('speedSlider').value));
                }

                // Mark current position as sorted
                const sortedIndices = [];
                for (let k = 0; k <= i; k++) {
                    sortedIndices.push(k);
                }
                drawArray([], [], sortedIndices);
            }
        }

async function insertionSort() {
            const sortedIndices = [0];
            drawArray([], [], sortedIndices);

            for (let i = 1; i < array.length && isAnimating; i++) {
                let key = array[i];
                let j = i - 1;

                while (j >= 0 && array[j] > key && isAnimating) {
                    comparisons++;
                    document.getElementById('comparisons').textContent = comparisons;
                    playSound(200 + array[j] * 2, 30);

                    array[j + 1] = array[j];
                    swaps++;
                    document.getElementById('swaps').textContent = swaps;

                    updateProgress(i, array.length);
                    drawArray([j, j + 1], [], sortedIndices);
                    await sleep(101 - parseInt(document.getElementById('speedSlider').value));

                    j--;
                }
                array[j + 1] = key;
                sortedIndices.push(i);
                drawArray([], [], sortedIndices);
                await sleep(50);
            }
        }

async function mergeSort(left, right) {
            if (left >= right || !isAnimating) return;

            const mid = Math.floor((left + right) / 2);
            await mergeSort(left, mid);
            await mergeSort(mid + 1, right);
            await merge(left, mid, right);
        }

async function merge(left, mid, right) {
            const leftArray = array.slice(left, mid + 1);
            const rightArray = array.slice(mid + 1, right + 1);

            let i = 0, j = 0, k = left;

            while (i < leftArray.length && j < rightArray.length && isAnimating) {
                comparisons++;
                document.getElementById('comparisons').textContent = comparisons;
                playSound(150 + leftArray[i] * 1.5, 40);

                updateProgress(k, array.length);
                drawArray([left + i, mid + 1 + j]);
                await sleep(101 - parseInt(document.getElementById('speedSlider').value));

                if (leftArray[i] <= rightArray[j]) {
                    array[k] = leftArray[i];
                    i++;
                } else {
                    array[k] = rightArray[j];
                    j++;
                }

                swaps++;
                document.getElementById('swaps').textContent = swaps;
                drawArray([], [k]);
                await sleep(101 - parseInt(document.getElementById('speedSlider').value));
                k++;
            }

            while (i < leftArray.length && isAnimating) {
                array[k] = leftArray[i];
                swaps++;
                drawArray([], [k]);
                await sleep(50);
                i++;
                k++;
            }

            while (j < rightArray.length && isAnimating) {
                array[k] = rightArray[j];
                swaps++;
                drawArray([], [k]);
                await sleep(50);
                j++;
                k++;
            }
        }

async function quickSort(low, high) {
            if (low < high && isAnimating) {
                const pi = await partition(low, high);
                await quickSort(low, pi - 1);
                await quickSort(pi + 1, high);
            }
        }

async function partition(low, high) {
            const pivot = array[high];
            let i = low - 1;

            for (let j = low; j < high && isAnimating; j++) {
                comparisons++;
                document.getElementById('comparisons').textContent = comparisons;
                playSound(180 + array[j] * 1.8, 35);

                updateProgress(j, array.length);
                drawArray([j, high]);
                await sleep(101 - parseInt(document.getElementById('speedSlider').value));

                if (array[j] < pivot) {
                    i++;
                    [array[i], array[j]] = [array[j], array[i]];
                    swaps++;
                    document.getElementById('swaps').textContent = swaps;
                    playSound(350, 60);
                    drawArray([], [i, j]);
                    await sleep(101 - parseInt(document.getElementById('speedSlider').value));
                }
            }

            [array[i + 1], array[high]] = [array[high], array[i + 1]];
            swaps++;
            document.getElementById('swaps').textContent = swaps;
            drawArray([], [i + 1, high]);
            await sleep(101 - parseInt(document.getElementById('speedSlider').value));

            return i + 1;
        }

async function heapSort() {
            const n = array.length;

            // Build max heap
            for (let i = Math.floor(n / 2) - 1; i >= 0 && isAnimating; i--) {
                await heapify(n, i);
            }

            // Extract elements from heap one by one
            for (let i = n - 1; i > 0 && isAnimating; i--) {
                [array[0], array[i]] = [array[i], array[0]];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                playSound(300, 80);

                updateProgress(n - i, n);
                const sortedIndices = [];
                for (let k = i; k < array.length; k++) {
                    sortedIndices.push(k);
                }
                drawArray([], [0, i], sortedIndices);
                await sleep(101 - parseInt(document.getElementById('speedSlider').value));

                await heapify(i, 0);
            }
        }

async function heapify(n, i) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n) {
                comparisons++;
                document.getElementById('comparisons').textContent = comparisons;
                if (array[left] > array[largest]) {
                    largest = left;
                }
            }

            if (right < n) {
                comparisons++;
                document.getElementById('comparisons').textContent = comparisons;
                if (array[right] > array[largest]) {
                    largest = right;
                }
            }

            if (largest !== i && isAnimating) {
                [array[i], array[largest]] = [array[largest], array[i]];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                playSound(250, 60);
                drawArray([], [i, largest]);
                await sleep(101 - parseInt(document.getElementById('speedSlider').value));

                await heapify(n, largest);
            }
        }

async function radixSort() {
            const max = Math.max(...array);

            for (let exp = 1; Math.floor(max / exp) > 0 && isAnimating; exp *= 10) {
                await countingSort(exp);
            }
        }

async function countingSort(exp) {
            const n = array.length;
            const output = new Array(n);
            const count = new Array(10).fill(0);

            // Count occurrences
            for (let i = 0; i < n; i++) {
                count[Math.floor(array[i] / exp) % 10]++;
            }

            // Change count[i] to actual position
            for (let i = 1; i < 10; i++) {
                count[i] += count[i - 1];
            }

            // Build output array
            for (let i = n - 1; i >= 0 && isAnimating; i--) {
                const digit = Math.floor(array[i] / exp) % 10;
                output[count[digit] - 1] = array[i];
                count[digit]--;

                updateProgress(n - i, n);
                drawArray([i]);
                await sleep(101 - parseInt(document.getElementById('speedSlider').value));
            }

            // Copy output array to array
            for (let i = 0; i < n && isAnimating; i++) {
                array[i] = output[i];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                drawArray([], [i]);
                await sleep(50);
            }
        }

async function shellSort() {
                const n = array.length;

                for (let gap = Math.floor(n / 2); gap > 0 && isAnimating; gap = Math.floor(gap / 2)) {
                    for (let i = gap; i < n && isAnimating; i++) {
                        const temp = array[i];
                        let j;

                        for (j = i; j >= gap && array[j - gap] > temp && isAnimating; j -= gap) {
                            comparisons++;
                            document.getElementById('comparisons').textContent = comparisons;
                            playSound(180 + array[j] * 1.5, 30);

                            array[j] = array[j - gap];
                            swaps++;
                            document.getElementById('swaps').textContent = swaps;

                            updateProgress(i, n);
                            drawArray([j, j - gap]);
                            await sleep(101 - parseInt(document.getElementById('speedSlider').value));
                        }
                        array[j] = temp;
                    }
                }
            }


async function bubbleSort() {
    for (let i = 0; i < array.length - 1 && isAnimating; i++) {
        for (let j = 0; j < array.length - i - 1 && isAnimating; j++) {
            comparisons++;
            document.getElementById('comparisons').textContent = comparisons;
            playSound(200 + array[j] * 2, 50);

            updateProgress(i * array.length + j, array.length * array.length);
            drawArray([j, j + 1]);
            await sleep(101 - parseInt(document.getElementById('speedSlider').value));

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                playSound(400, 80);
                drawArray([], [j, j + 1]);
                await sleep(101 - parseInt(document.getElementById('speedSlider').value));
            }
        }
        // Mark as sorted
        const sortedIndices = [];
        for (let k = array.length - i - 1; k < array.length; k++) {
            sortedIndices.push(k);
        }
        drawArray([], [], sortedIndices);
        await sleep(50);
    }
}

async function celebrateSort() {
    for (let i = 0; i < array.length && isAnimating; i++) {
        playSound(300 + i * 5, 30);
        const sortedIndices = [];
        for (let j = 0; j <= i; j++) {
            sortedIndices.push(j);
        }
        drawArray([], [], sortedIndices);
        await sleep(20);
    }
    drawArray([], [], Array.from({length: array.length}, (_, i) => i));
}