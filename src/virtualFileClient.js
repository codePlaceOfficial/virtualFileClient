// const util = require('util')
const FILE_TYPE = { dir: "DIR", file: "FILE" };
const virtualFileBuilder = require("./virtualFileBuilder");
const {join} = require("../util/path")
const _ = require("loadsh");
class VirtualFileClient {
    constructor(){
        this.LABEL = "_client" // 用于事件标识
        // 其实理论上不需言，因为实际应用时client和server应处于不同的环境，
        // 不需要再加前缀来区分事件，但是为了方便测试，还是加上了
    }

    getVirtualFile() {
        return this.virtualFileObj;
    }

    /** 
     * ================================================
     * 虚拟文件的操作 ===================================
     * ================================================
     * */
    resetVirtualFile(virtualFileObj) {
        this.virtualFileObj = virtualFileObj;
    }

    // 得到文件内容
    getFileContent(relativePath) {
        let { targetObj } = this.__getFileObjByPath(relativePath)
        return targetObj.content;
    }

    setFileContent(relativePath, content){
        let { targetObj } = this.__getFileObjByPath(relativePath)
        targetObj.content = content;
    }

    createDir(virtualPath, dirName) {
        if (virtualPath === "/" && dirName === "") {
            this.virtualFileObj = virtualFileBuilder.buildRootDir(); //构造根文件
            return;
        }

        let { targetObj } = this.__getFileObjByPath(virtualPath)
        targetObj.children.push(virtualFileBuilder.__buildVirtualFile(FILE_TYPE.dir, dirName, join(virtualPath, dirName)));
    }

    createFile(virtualPath, fileName) {
        let { targetObj } = this.__getFileObjByPath(virtualPath)
        targetObj.children.push(virtualFileBuilder.__buildVirtualFile(FILE_TYPE.file, fileName, join(virtualPath, fileName)));
    }

    changeFileContent(relativePath, newContent) {
        let { targetObj } = this.__getFileObjByPath(relativePath)
        targetObj.content = newContent;
    }

    // 文件重命名
    renameFile(relativePath, newName) {
        let { targetObj, fatherObj } = this.__getFileObjByPath(relativePath)
        // 改名同时更改路径
        _.assign(targetObj, { name: newName, __path: join(fatherObj.__path, newName) })
    }

    // 文件移动位置
    // newPath为其父文件的位置
    moveFile(relativePath, newPath) {
        let { targetObj } = this.__getFileObjByPath(newPath);
        let beMoveObj = this.deleteFile(relativePath); // 待移动的数据
        beMoveObj.__path = join(newPath, beMoveObj.name); // 构建新的路径
        targetObj.children.push(beMoveObj);
    }

    // 文件删除
    deleteFile(relativePath) {
        let { targetObj, fatherObj } = this.__getFileObjByPath(relativePath);

        if (fatherObj === undefined) return; // 根文件无法删除
        for (let index in fatherObj.children) {
            // console.log(fatherObj.children[index].__path)
            if (fatherObj.children[index].__path === relativePath) {
                fatherObj.children.splice(index, 1)
                return targetObj;
            }
        }
    }

    // 通过文件的相对地址得到文件对象和其父对象
    __getFileObjByPath(path) {
        let names = path.split("/");
        let root = this.virtualFileObj;
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

    getVirtualFileObj() {
        return this.virtualFileObj;
    }
}

module.exports = VirtualFileClient;
