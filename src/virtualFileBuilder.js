const FILE_TYPE = { dir: "DIR", file: "FILE" };


module.exports = {
    __buildVirtualFile(type, name, virtualPath) {
        let virtualFile = {
            type,
            name,
            // __fatherPath:fatherPath,
            __path: virtualPath
        };
        if (type == FILE_TYPE.dir) virtualFile.children = [];
        return virtualFile;
    },

    buildRootDir(){
        return this.__buildVirtualFile(FILE_TYPE.dir, "", "/")
    }
}