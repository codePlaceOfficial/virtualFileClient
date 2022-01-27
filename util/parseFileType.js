const _ = require("loadsh")

const fileTypeMap = {
    abap: "abap",
    apex: "apex",
    azcli: "azcli",
    bat: "bat",
    bicep: "bicep",
    cameligo: "cameligo",
    clj: "clojure",
    coffee: "coffee",
    c: "cpp",
    cpp: "cpp",
    cs: "csharp",
    csp: "csp",
    css: "css",
    dart: "dart",
    dockerfile: "dockerfile",
    ecl: "ecl",
    flow: "flow9",
    fs: "fsharp",
    go: "go",
    gql: "graphql",
    hcl: "hcl",
    html: "html",
    ini: "ini",
    java: "java",
    js: "javascript",
    julia: "julia",
    kt: "kt",
    less: "less",
    lexon: "lexon",
    lua: "lua",
    m3: "m3",
    md: "markdown",
    mips: "mips",
    msdax: "msdax",
    sql: "mysql",
    "objective-c": "objective-c",
    pascal: "pascal",
    pascaligo: "pascaligo",
    perl: "perl",
    php: "php",
    pla: "pla",
    pats: "postiats",
    pq: "powerquery",
    "ps1": "powershell",
    proto: "protobuf",
    pug: "pug",
    python: "python",
    r: "r",
    redis: "redis",
    rst: "restructuredtext",
    ruby: "ruby",
    rust: "rust",
    sb: "sb",
    scala: "scala",
    scheme: "scheme",
    scss: "scss",
    shell: "shell",
    sol: "sol",
    aes: "aes",
    rq: "sparql",
    st: "st",
    swift: "swift",
    sv: "systemverilog",
    tcl: "tcl",
    ts: "typescript",
    vb: "vb",
    xml: "xml",
    yaml: "yaml"
}

module.exports = (fileName) => {
    let dotIndex = fileName.lastIndexOf(".");
    let suffix = fileName.substr(dotIndex + 1);
    if(!fileTypeMap[suffix]){
        return "file"
    }
    return fileTypeMap[suffix];
}   