const FILE_TYPE = { dir: "DIR", file: "FILE" };

const __buildVirtualFile__ = (type, name, virtualPath,virtualFile) => {
    virtualFile.type = type;
    virtualFile.name = name;
    virtualFile.__path = virtualPath;
    if (type === FILE_TYPE.dir) virtualFile.children = [];
}

module.exports = {
    __buildVirtualFile : ((type, name, virtualPath) => {
        let virtualFile = {}
        __buildVirtualFile__(type, name, virtualPath,virtualFile)
        return virtualFile;
    }),

    buildRootDir : (virtualFiles) => {
        return __buildVirtualFile__ (FILE_TYPE.dir, "", "/",virtualFiles)
    }
}