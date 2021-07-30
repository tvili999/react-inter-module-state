module.exports = api => ({
    presets: [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    plugins: [
        ...(api.env('test') ? [
            ["babel-plugin-auto-import", {
                declarations: [
                    { "default": ["regeneratorRuntime"], path: "regenerator-runtime/runtime" }
                ]
            }]
        ] : []),
        ["babel-plugin-module-resolver", {
            "root": "./",
            "alias": {
                "react-inter-module-state": "./src"
            }
        }],
        ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
        "@babel/plugin-proposal-do-expressions",
        ["@babel/plugin-proposal-pipeline-operator", { "proposal": "smart" }],
        "babel-plugin-styled-components"
    ],
    "sourceMaps": "inline"
});
