const fs = require('fs').promises;
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');
const inquirer = require('inquirer');
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

        if (!this.findTemplate) return;

        const isPass = await this.prompt();
        if (isPass) {
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
    async prompt() {
        let dirs = await fs.readdir(this.findTemplate);
        dirs = dirs.map((dir, index, entries) => {
            const last = index === entries.length - 1 ? '' : ' , ';
            return dir + last;
        })
        
        const options = [
            {
                type: 'confirm',
                name: 'directory',
                message: `模版文件夹是这个 ${this.findTemplate} 吗?`,
                default: true
            },
            {
                type: 'confirm',
                name: 'filename',
                message: dirs.length === 0 ? '模版文件夹中没有文件，请您确认?' : `将要克隆的模板文件有 ${dirs}，确认克隆吗?`,
                default: true
            },
        ]
        const answers = await inquirer.prompt(options)
        return Object.keys(answers).every(key => answers[key]);
    }
};

module.exports = CreateCodeTemplate;