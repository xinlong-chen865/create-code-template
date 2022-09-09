const fs = require('fs').promises;
const path = require('path');

/**
 * 检查template是否格式正确
 */
function accessTemplate(pathname) {
    return new Promise((resolve, reject) => {
        fs.stat(pathname)
            .then(res => {
                res.isDirectory() ? resolve() : reject('Template is not a file, it should be a folder');
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 查找模版代码
 */
function findDirectory(template) {
    let directory = process.cwd();
    function next() {
        if (directory === '/') return Promise.reject("Didn't find your template folder or package.json");

        const currentPathname = path.join(directory, 'package.json');
        const templatePathname = path.join(directory, template);
        return Promise.all([fs.access(currentPathname), accessTemplate(templatePathname)])
            .then(data => {
                return Promise.resolve(path.join(directory, template));
            })
            .catch(err => {
                directory = path.join(directory, '../')
                return next();
            })
    }
    return next()
}

module.exports = {
    findDirectory,
}