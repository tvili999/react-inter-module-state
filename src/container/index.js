const globalState = require("./globalState");
const moduleManager = require("./moduleManager")

module.exports = container => container.configure(
    globalState,
    moduleManager
)