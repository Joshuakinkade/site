import fs from 'fs';
import path from 'path';

/**
 * Provides simplified, Promise based access to the file system
 */
export default class Library {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  /**
   * Read a file from the library
   * @param {string} folder the name of the folder the file is in
   * @param {string} name the name of the file
   * @returns {Promise<Buffer>} a promise resolving to a buffer with the file contents
   */
  readFile(folder, name) {
    return new Promise( (resolve, reject) => {
      fs.readFile(path.join(this.rootDir,folder,name), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  }

  /**
   * Write a file to a folder
   * @param {*} folder 
   * @param {*} name 
   * @param {*} data 
   */
  writeFile(folder, name, data) {
    const folderPath = path.join(this.rootDir,folder);
    const filePath = path.join(folderPath,name);

    return this._doWrite(filePath, data)
      .catch( err => {
        if (err.code === 'ENOENT') {
          return this.createFolder(folderPath)
            .then( () => this._doWrite(filePath, data));
        } else {
          return err;
        }
      });
  }

  _doWrite(filePath, data) {
    return new Promise( (resolve, reject) => {
      fs.writeFile(filePath, data, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  createFolder(folderPath) {
    return new Promise( (resolve, reject) => {
      fs.mkdir(folderPath, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }
}