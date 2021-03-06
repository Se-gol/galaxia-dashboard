NetworkTables.addWsConnectionListener(function (connected) {
    console.log("Websocket connected: " + connected);
}, true);

NetworkTables.addRobotConnectionListener(function (connected) {
    console.log("Robot connected: " + connected);
}, true);

NetworkTables.addGlobalListener(function (key, value, isNew) {
    // console.log(key)
    // element = document.getElementById(key);
    // element.innerText = value;
}, true);

setInterval(() => {
        // if (NetworkTables.getValue("/SmartDashboard/drivetrain-command") != null)
        document.getElementById("drivetrain_command").innerHTML = NetworkTables.getValue("/SmartDashboard/drivetrain-command");
        // if (NetworkTables.getValue("/SmartDashboard/drivetrain-rotation") != undefined)
        document.getElementById("drivetrain_rotation").innerHTML = NetworkTables.getValue("/SmartDashboard/drivetrain-rotation");
        // if (NetworkTables.getValue("/SmartDashboard/drivetrain-pose") != undefined)
        document.getElementById("drivetrain_pose").innerHTML = x
        // if (NetworkTables.getValue("/SmartDashboard/game_time") != undefined)
        document.getElementById("game_time").innerHTML = NetworkTables.getValue("/SmartDashboard/game-time");
        // if (NetworkTables.getValue("/SmartDashboard/game_alliance") != undefined)
        document.getElementById("game_alliance").innerHTML = NetworkTables.getValue("/SmartDashboard/game-alliance");
        // if (NetworkTables.getValue("/SmartDashboard/game_period") != undefined)
        document.getElementById("game_period").innerHTML = NetworkTables.getValue("/SmartDashboard/game-period");
        if (NetworkTables.getValue("/SmartDashboard/game-period") == "AUTO")
            drawPath();
    },
    100);

function map(value, minimumInput, maximumInput, minimumOutput, maximumOutput) {
    return (value - minimumInput) * (maximumOutput - minimumOutput) / (maximumInput - minimumInput) + minimumOutput;
}

setInterval(() => {
    bruh = NetworkTables.getValue("/SmartDashboard/drivetrain-pose");
    if (bruh == undefined) {
        x = map(3, 0, 15.98, 125, 750);
        y = map(6, 0, 8.21, 440, 150);
        document.getElementById("swerve").style.left = x + "px";
        document.getElementById("swerve").style.top = y + "px";
        document.getElementById("swerve").style.transform = "rotate(" + 180 + "deg)"
        return;
    }
    x = Number.parseFloat(bruh.slice(0, bruh.indexOf(',')));
    y = Number.parseFloat(bruh.slice(bruh.indexOf(',') + 2, bruh.length));
    x = map(x, 0, 15.98, 125, 750);
    y = map(y, 0, 8.21, 440, 150);
    document.getElementById("swerve").style.left = x + "px";
    document.getElementById("swerve").style.top = y + "px";
    bruh2 = NetworkTables.getValue("/SmartDashboard/drivetrain-rotation");
    if (bruh2 == undefined) return;
    rotation = -Number.parseFloat(bruh2.slice(0, bruh2.indexOf(" ")));
    document.getElementById("swerve").style.transform = "rotate(" + rotation + "deg)"
}, 1);


// loadCameraOnConnect({
//     container: '#camera',
//     port: 5800,
//     image_url: '/?action=stream',
//     data_url: '/program.json',
//     attrs: {
//         width: 640,
//         height: 480
//     }
// });
// loadCameraOnConnect({
//     container: '#detections',
//     port: 5800,
//     image_url: '/?action=stream',
//     data_url: '/program.json',
//     attrs: {
//         width: 640,
//         height: 480
//     }
// });


function mapX(x) {
    return map(x, 0, 15.8, 125, 750);
}

function mapY(y) {
    return map(y, 0, 7.5, 440, 150);
}

function drawPath() {
    var strings = NetworkTables.getValue("/SmartDashboard/auto-path");
    if (strings == undefined) return;
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(mapX(Number.parseFloat(strings[0].split(" ")[0])), Number.parseFloat(mapY(strings[0].split(" ")[1])));
    for (i = 1; i < strings.length; i++) {
        var values = strings[i].split(" ");
        ctx.bezierCurveTo(mapX(Number.parseFloat(values[0])), mapY(Number.parseFloat(values[1])), mapX(Number.parseFloat(values[2])), mapY(Number.parseFloat(values[3])), mapX(Number.parseFloat(values[4])), mapY(Number.parseFloat(values[5])));
    }
    var grad = ctx.createLinearGradient(mapX(Number.parseFloat(strings[0].split(" ")[0])), mapY(Number.parseFloat(strings[0].split(" ")[1])), mapX(Number.parseFloat(strings[strings.length - 1].split(" ")[0])), mapY(Number.parseFloat(strings[strings.length - 1].split(" ")[1])));

    grad.addColorStop(0, "#ffadad");
    grad.addColorStop(0.25, "#ffd6a5");
    grad.addColorStop(0.5, "#caffbf");
    grad.addColorStop(0.75, "#9bf6ff");
    grad.addColorStop(1.0, "#ffc6ff");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.stroke();
}

