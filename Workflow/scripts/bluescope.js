ObjC.import("stdlib");

// =============================================================================
// Debug Utilities
// =============================================================================

var DEBUG = false;

function getEnv(name) {
  try {
    return $.getenv(name);
  } catch (e) {
    return null;
  }
}

function debug(message) {
  if (!DEBUG) return;
  var stderr = $.NSFileHandle.fileHandleWithStandardError;
  var output = $.NSString.alloc.initWithUTF8String("[DEBUG] " + message + "\n");
  stderr.writeData(output.dataUsingEncoding($.NSUTF8StringEncoding));
}

// =============================================================================
// Shared Utilities
// =============================================================================

function executeCommand() {
  var args = Array.prototype.slice.call(arguments);
  var task = $.NSTask.alloc.init;
  var pipe = $.NSPipe.pipe;

  task.executableURL = $.NSURL.fileURLWithPath("/usr/bin/env");
  task.arguments = args;
  task.standardOutput = pipe;
  task.launchAndReturnError(false);

  var data = pipe.fileHandleForReading.readDataToEndOfFileAndReturnError(false);
  var output = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js;

  return { output: output, status: task.terminationStatus };
}

function buildResult(items, rerun) {
  var result = { items: items };
  if (rerun) result.rerun = rerun;
  return JSON.stringify(result);
}

function buildError(title, subtitle) {
  return buildResult([{
    title: title,
    subtitle: subtitle,
    icon: { path: "icon_alt.png" },
    valid: false
  }]);
}

function validateBlueutil() {
  var check = executeCommand("which", "blueutil");
  if (check.status !== 0) {
    return buildError("blueutil not found", "Install via: brew install blueutil");
  }
  return null;
}


// =============================================================================
// Commands
// =============================================================================

function listDevices() {
  var error = validateBlueutil();
  if (error) return error;

  var query = executeCommand("blueutil", "--format", "json", "--paired");
  if (query.status !== 0) {
    return buildError("Error accessing Bluetooth", "Check Bluetooth permissions in System Settings");
  }

  var devices;
  try {
    devices = JSON.parse(query.output);
  } catch (e) {
    return buildError("Error parsing Bluetooth data", "Please try again or check blueutil installation");
  }

  if (devices.length === 0) {
    return buildError("No paired devices found", "Pair a device in System Settings to get started");
  }

  var total = devices.length;
  var items = devices.map(function(device) {
    return {
      variables: { connected: device.connected ? "1" : "0" },
      uid: device.address,
      title: device.name,
      subtitle: (device.connected ? "Connected" : "Not Connected") + " • " + total + " paired device" + (total === 1 ? "" : "s"),
      arg: device.address,
      icon: { path: device.connected ? "icon.png" : "icon_alt.png" }
    };
  });

  return buildResult(items, 0.5);
}

function powerStatus() {
  var error = validateBlueutil();
  if (error) return error;

  var query = executeCommand("blueutil", "--power");
  if (query.status !== 0) {
    return buildError("Error accessing Bluetooth", "Check Bluetooth permissions in System Settings");
  }

  var enabled = parseInt(query.output, 10) === 1;

  return buildResult([{
    title: "Bluetooth is " + (enabled ? "On" : "Off"),
    subtitle: "Action to turn it " + (enabled ? "off" : "on"),
    arg: enabled ? "off" : "on",
    icon: { path: enabled ? "icon.png" : "icon_alt.png" }
  }]);
}

function toggleConnection(address, isConnected) {
  debug("toggleConnection called");
  debug("  address: " + address);
  debug("  isConnected: " + isConnected + " (type: " + typeof isConnected + ")");

  var error = validateBlueutil();
  if (error) {
    debug("  blueutil validation failed");
    return error;
  }

  if (isConnected) {
    debug("  executing: blueutil --disconnect " + address);
    var result = executeCommand("blueutil", "--disconnect", address, "--wait-disconnect", address);
    debug("  result status: " + result.status);
    debug("  result output: " + result.output);
  } else {
    debug("  executing: blueutil --connect " + address);
    var result = executeCommand("blueutil", "--connect", address, "--wait-connect", address);
    debug("  result status: " + result.status);
    debug("  result output: " + result.output);
  }
}

function setPower(state) {
  executeCommand("blueutil", "--power", state);
}

