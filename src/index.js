const fs = require('fs').promises;
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');
const { findDirectory } = require('./utils');

class CreateCodeTemplate {
    constructor(options) {
        this.template = options.template;
        this.targetDirectory = process.cwd();
        this.findTemplate = undefined;

        this.bootstrap();
    }

    async bootstrap() {
        await this.searchTemplate()

        if (this.findTemplate) {
            this.builder();
        }
    }

    async searchTemplate() {
        this.findTemplate = await findDirectory(this.template);
    }

    async builder() {
        let dirs = await fs.readdir(this.findTemplate);
        if (dirs.length === 0) {
            throw new Error('Template folder cannot be empty');
        }

        try {
            await this.check(dirs);
            await this.create(dirs);
        } catch (error) {
            throw new Error(error);
        }
        

        dirs.forEach(dir => {
            createReadStream(path.join(this.findTemplate, dir)).pipe(createWriteStream(path.join(this.targetDirectory, dir)));
        });
    }
    /**
     * 检查目标文件夹是否有同名文件
     */
    async check(dirs) {
        await Promise.all(
            dirs.map(dir => {
                const _targetPath = path.join(this.targetDirectory, dir);
                return new Promise(async (resolve, reject) => {
                    try {
                        await fs.stat(_targetPath);
                        reject('Files with the same filename in the Template folder and the Target folder');
                    } catch (e) {
                        resolve();
                    }
                })
            })
        );
    }
    /**
     * 创建空的模版文件
     */
    async create(dirs) {
        await Promise.all(
            dirs.map(dir => {
                const _targetPath = path.join(this.targetDirectory, dir);
                return new Promise(async (resolve, reject) => {
                    try {
                        await fs.writeFile(_targetPath, '');
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            })
        )
    }
};

module.exports = CreateCodeTemplate;