function analyzeAlgorithm() {
    const n = parseInt(document.getElementById('diskCount').value);
    const errorBox = document.getElementById('errorBox');
    const loadingContainer = document.getElementById('loadingContainer');
    
    // Clear previous error
    errorBox.classList.remove('show');
    loadingContainer.classList.remove('show');

    // Validation
    if (!n || n < 1 || n > 35) {
        errorBox.textContent = '⚠️ Please enter a number between 1 and 35';
        errorBox.classList.add('show');
        return;
    }

    // Show loading animation
    loadingContainer.classList.add('show');
    document.getElementById('resultsSection').classList.add('show');

    // Use setTimeout to allow rendering of loading animation
    setTimeout(() => {
        try {
            // Run both algorithms
            const recursiveResult = measureRecursive(n);
            const iterativeResult = measureIterative(n);

            // Calculate total moves (2^n - 1)
            const totalMoves = Math.pow(2, n) - 1;

            // Display results
            displayResults(n, totalMoves, recursiveResult, iterativeResult);
        } catch (error) {
            errorBox.textContent = '❌ Error during analysis: ' + error.message;
            errorBox.classList.add('show');
        } finally {
            // Hide loading animation
            loadingContainer.classList.remove('show');
        }
    }, 100);
}

function measureRecursive(n) {
    const startTime = performance.now();
    
    function hanoi(n, source, destination, auxiliary) {
        if (n === 1) {
            return;
        }
        hanoi(n - 1, source, auxiliary, destination);
        hanoi(n - 1, auxiliary, destination, source);
    }

    hanoi(n, 'A', 'C', 'B');
    
    const endTime = performance.now();
    return {
        time: endTime - startTime,
        moves: Math.pow(2, n) - 1
    };
}

function measureIterative(n) {
    const startTime = performance.now();
    
    const stacks = {
        A: Array.from({length: n}, (_, i) => n - i),
        B: [],
        C: []
    };

    const totalMoves = Math.pow(2, n) - 1;
    let moveCount = 0;

    for (let i = 1; moveCount < totalMoves; i++) {
        const modulo = i % 3;
        let source, destination;

        if (modulo === 1) {
            source = 'A';
            destination = 'C';
        } else if (modulo === 2) {
            source = 'A';
            destination = 'B';
        } else {
            source = 'B';
            destination = 'C';
        }

        // Ensure proper disk movement (never place larger on smaller)
        if (stacks[destination].length === 0 || stacks[source][stacks[source].length - 1] < stacks[destination][stacks[destination].length - 1]) {
            const disk = stacks[source].pop();
            stacks[destination].push(disk);
        } else {
            const disk = stacks[destination].pop();
            stacks[source].push(disk);
        }

        moveCount++;
    }

    const endTime = performance.now();
    return {
        time: endTime - startTime,
        moves: totalMoves
    };
}

function displayResults(n, totalMoves, recursiveResult, iterativeResult) {
    // Format numbers with commas
    const formatNumber = (num) => {
        return num.toLocaleString();
    };

    // Format time with appropriate units
    const formatTime = (ms) => {
        if (ms < 1) {
            return (ms * 1000).toFixed(4) + ' µs';
        } else if (ms < 1000) {
            return ms.toFixed(4) + ' ms';
        } else {
            return (ms / 1000).toFixed(4) + ' s';
        }
    };

    // Update recursive results
    document.getElementById('recursiveMoves').textContent = formatNumber(totalMoves);
    document.getElementById('recursiveTime').textContent = formatTime(recursiveResult.time);

    // Update iterative results
    document.getElementById('iterativeMoves').textContent = formatNumber(totalMoves);
    document.getElementById('iterativeTime').textContent = formatTime(iterativeResult.time);

    // Determine faster algorithm
    const isFasterIterative = iterativeResult.time < recursiveResult.time;
    const fasterName = isFasterIterative ? 'Iterative' : 'Recursive';
    const timeDiff = Math.abs(recursiveResult.time - iterativeResult.time);
    const speedRatio = Math.max(recursiveResult.time, iterativeResult.time) / Math.min(recursiveResult.time, iterativeResult.time);

    document.getElementById('fasterAlgo').innerHTML = `${fasterName} <span class="faster-badge">✓ Faster</span>`;
    document.getElementById('timeDifference').textContent = formatTime(timeDiff);
    document.getElementById('speedRatio').textContent = `${speedRatio.toFixed(2)}x`;
}

// Allow Enter key to trigger analysis
document.getElementById('diskCount').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        analyzeAlgorithm();
    }
});

// Run initial analysis on page load
window.addEventListener('load', function() {
    analyzeAlgorithm();
});
