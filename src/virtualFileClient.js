const FILE_TYPE = { dir: "DIR", file: "FILE" };
const virtualFileBuilder = require("./virtualFileBuilder");
const { join } = require("../util/path")
const _ = require("loadsh");
const parseFileType = require("../util/parseFileType")

const fileSorting = (fileList) => {
    return _.orderBy(fileList, [file => file.type === "DIR","name"], ["desc", "asc"]);
}
/** 
 * ================================================
 * 虚拟文件的操作 ===================================
 * ================================================
 */
const getVirtualFileByPath = (path, root) => {
    let names = path.split("/");
    if (path === "/") return { targetObj: root, fatherObj: root };

    let targetObj = undefined;
    for (let index in names) {
        for (let json of root.children) {
            if (json.name === names[index]) {
                if (Number(index) === (names.length - 1)) {
                    targetObj = json
                    break;
                }
                if (json.children !== undefined) {
                    root = json;
                    break;
                }
            }
        }
    }
    return { targetObj, fatherObj: root };
}

// 得到文件内容
const getFileContent = (relativePath, virtualFiles) => {
    let { targetObj } = getVirtualFileByPath(relativePath, virtualFiles)
    return targetObj.content;
}

const setFileContent = (relativePath, content, virtualFiles) => {
    let { targetObj } = getVirtualFileByPath(relativePath, virtualFiles)
    targetObj.content = content;
}

const createDir = (virtualPath, dirName, virtualFiles) => {
    if (virtualPath === "/" && dirName === "") {
        virtualFileBuilder.buildRootDir(virtualFiles)
        // virtualFiles = _.assign(virtualFiles, virtualFileBuilder.buildRootDir()); //构造根文件
    } else {
        let { targetObj } = getVirtualFileByPath(virtualPath, virtualFiles)
        targetObj.children.push(virtualFileBuilder.__buildVirtualFile(FILE_TYPE.dir, dirName, join(virtualPath, dirName)));
        targetObj.children = fileSorting(targetObj.children);
    }
}

const createFile = (virtualPath, fileName, virtualFiles) => {
    let { targetObj } = getVirtualFileByPath(virtualPath, virtualFiles)
    targetObj.children.push(virtualFileBuilder.__buildVirtualFile(FILE_TYPE.file, fileName, join(virtualPath, fileName)));
    targetObj.children = fileSorting(targetObj.children);
}

const changeFileContent = (virtualPath, newContent, virtualFiles) => {
    let { targetObj } = getVirtualFileByPath(virtualPath, virtualFiles)
    targetObj.content = newContent;
}

// 文件重命名
const renameFile = (relativePath, newName, virtualFiles) => {
    let { targetObj, fatherObj } = getVirtualFileByPath(relativePath, virtualFiles)
    let newPath = join(fatherObj.__path, newName);
    // 改名同时更改与之相关的属性
    targetObj.name = newName
    targetObj.__path = join(fatherObj.__path, newName)
    targetObj.fileType = parseFileType(newName);
    fatherObj.children = fileSorting(fatherObj.children);
    return {newPath};
    // 不用assign,否则会和immer产生冲突
    // _.assign(targetObj, { name: newName, __path: join(fatherObj.__path, newName) })
}

// 文件移动位置
// newPath为其父文件的位置
const moveFile = (relativePath, newPath, virtualFiles) => {
    let { targetObj } = getVirtualFileByPath(newPath, virtualFiles);
    let beMoveObj = this.deleteFile(relativePath); // 待移动的数据
    beMoveObj.__path = join(newPath, beMoveObj.name); // 构建新的路径
    targetObj.children.push(beMoveObj);
    targetObj.children = fileSorting(targetObj.children);

}

// 文件删除
const deleteFile = (relativePath, virtualFiles) => {
    let { targetObj, fatherObj } = getVirtualFileByPath(relativePath, virtualFiles);

    if (fatherObj === undefined) return; // 根文件无法删除
    for (let index in fatherObj.children) {
        // console.log(fatherObj.children[index].__path)
        if (fatherObj.children[index].__path === relativePath) {
            fatherObj.children.splice(index, 1)
            return targetObj;
        }
    }
}


class VirtualFileClient {
    constructor() {
        this.virtualFiles = {}
    }

    getVirtualFile() {
        return _.cloneDeep(this.virtualFiles);
    }

    /** 
     * ================================================
     * 虚拟文件的操作 ===================================
     * ================================================
     * */
    resetVirtualFile(virtualFiles) {
        this.virtualFiles = virtualFiles;
    }
    getFileContent = (relativePath) => getFileContent(relativePath, this.virtualFiles)
    setFileContent = ({ virtualPath, content }) => {
        setFileContent(virtualPath, content, this.virtualFiles)
    }
    createDir = ({ virtualPath, dirName }) => createDir(virtualPath, dirName, this.virtualFiles)
    createFile = ({ virtualPath, fileName }) => createFile(virtualPath, fileName, this.virtualFiles)
    changeFileContent = ({ virtualPath, content }) => changeFileContent(virtualPath, content, this.virtualFiles)
    renameFile = ({ virtualPath, newName }) => renameFile(virtualPath, newName, this.virtualFiles)
    moveFile = ({ virtualPath, newPath }) => moveFile(virtualPath, newPath, this.virtualFiles)
    deleteFile = ({ virtualPath }) => deleteFile(virtualPath, this.virtualFiles)
}


module.exports = {
    VirtualFileClient,
    getFileContent,
    setFileContent,
    createDir,
    createFile,
    changeFileContent,
    renameFile,
    moveFile,
    deleteFile,
    getVirtualFileByPath
}