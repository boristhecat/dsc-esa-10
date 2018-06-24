let nodes = [];
let keys = {};
let kNearest;
let kicksInput = document.getElementById("kicks");
let kissesInput = document.getElementById("kisses");
let kInput = document.getElementById("k");

initKeys();
initData();
attachListener();
runKnn(createNewNode(), kInput.value);

function runKnn(node, k) {
    calculateRanges();
    determineType(node, k);
    draw(node);
}

function initKeys() {
    keys.kisses = {};
    keys.kisses.min = Infinity;
    keys.kisses.max = -Infinity;
    keys.kicks = {};
    keys.kicks.min = Infinity;
    keys.kicks.max = -Infinity;
    keys.Romance = 'rgba(255, 0, 0, 1)';
    keys.Action = 'rgba(0, 128, 0, 1)';
    keys.Bromance = 'rgba(0, 0, 255, 1)';
}

function initData() {
    nodes = [
        {
            title: "California Man",
            kicks: 40,
            kisses: 104,
            type: "Romance"
        },
        {
            title: "Bros before Hoes",
            kicks: 51,
            kisses: 49,
            type: "Bromance"
        },
        {
            title: "Hes not reall into dudes",
            kicks: 75,
            kisses: 101,
            type: "Romance"
        },
        {
            title: "Beautiful Woman",
            kicks: 1,
            kisses: 81,
            type: "Romance"
        },
        {
            title: "Kevin Longblade",
            kicks: 101,
            kisses: 25,
            type: "Action"
        },
        {
            title: "Robo Slayer 3000",
            kicks: 99,
            kisses: 9,
            type: "Action"
        },
        {
            title: "Amped",
            kicks: 98,
            kisses: 19,
            type: "Action"
        }
    ];
}

function calculateRanges() {
    nodes.forEach(function (curr) {
        keys.kicks.min = Math.min(keys.kicks.min, curr.kicks);
        keys.kicks.max = Math.max(keys.kicks.max, curr.kicks);
        keys.kicks.range = keys.kicks.max - keys.kicks.min;
        keys.kisses.min = Math.min(keys.kisses.min, curr.kisses);
        keys.kisses.max = Math.max(keys.kisses.max, curr.kisses);
        keys.kisses.range = keys.kisses.max - keys.kisses.min;
    });
}

function determineType(node, k) {

    let types = new Map();

    kNearest = calculateNeighbors(node).slice(0, k);

    kNearest.forEach(function (curr) {
        if (types.has(curr.type))
            types.set(curr.type, types.get(curr.type) + 1);
        else
            types.set(curr.type, 1);
    });

    node.type = ([...types.entries()].sort(function (a, b) {
        return a[1] - b[1];
    })[0][0]);

    console.log(node.type.toString());
}

function calculateNeighbors(node) {

    let neighbors = Array.from(nodes);

    neighbors.forEach(function (curr) {
        calculateDistance(curr, node)
    });

    neighbors.sort(function (a, b) {
        return a.distance - b.distance;
    });

    return neighbors;
}

function calculateDistance(curr, node) {
    let distanceKicks = (curr.kicks - node.kicks) / keys.kicks.range;
    let distanceKisses = (curr.kisses - node.kisses) / keys.kisses.range;
    curr.distance = Math.sqrt(Math.pow(distanceKicks, 2) + Math.pow(distanceKisses, 2));
}

function draw(node) {

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.setTransform(1, 0, 0, 1, 0 , 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    let padding = 40;

    nodes.forEach(function (curr) {
        context.save();
        let coords = calculateCoords(canvas, curr, padding);
        drawNode(context, coords, keys[curr.type]);
        context.restore();
    });

    let coords = calculateCoords(canvas, node, padding);
    let radius = kNearest[kNearest.length - 1].distance * canvas.width * ((canvas.width - padding) / canvas.width);
    context.save();
    drawNode(context, coords, 'grey');
    drawCircle(context, radius, keys[node.type]);
    context.restore();
}

function drawNode(context, coords, color) {
    context.fillStyle = color;
    context.translate(coords.x, coords.y);
    context.beginPath();
    context.arc(0, 0, 5, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
}

function drawCircle(context, radius, color) {
    context.save();
    context.strokeStyle = color;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI*2, true);
    context.stroke();
    context.closePath();
}

function calculateCoords(canvas, node, padding) {
    let x_shift_pct = (canvas.width - padding) / canvas.width;
    let y_shift_pct = (canvas.height - padding) / canvas.height;

    let x = (node.kicks - keys.kicks.min) * (canvas.width / keys.kicks.range) * x_shift_pct + (padding / 2);
    let y = (node.kisses - keys.kisses.min) * (canvas.height / keys.kisses.range) * y_shift_pct + (padding / 2);
    y = Math.abs(y - canvas.height);

    return {
        x: x,
        y: y
    };
}

function attachListener() {

    kicksInput.addEventListener("input", function () {
        runKnn(createNewNode(), kInput.value)
    });

    kissesInput.addEventListener("input", function () {
        runKnn(createNewNode(), kInput.value)
    });

    kInput.addEventListener("input", function () {
        runKnn(createNewNode(), kInput.value)
    });
}

function createNewNode() {
    return {
        title: "New Movie",
        kisses: kissesInput.value,
        kicks: kicksInput.value,
        type: "Unknown"
    };
}