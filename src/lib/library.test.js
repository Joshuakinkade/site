import fs from 'fs';
import Library from './library';

jest.mock('fs');

test('readFile returns a buffer', (done) => {
  const lib = new Library('/');

  const testBuffer = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);

  fs.readFile.mockImplementation((filename,callback) => {
    callback(null,testBuffer);
  });

  lib.readFile('test','file')
    .then( (buffer) => {
      expect(buffer).toEqual(testBuffer);
      expect(fs.readFile).toHaveBeenCalledWith('\\test\\file',expect.any(Function));
      done();
    })
    .catch(done);
});

test('readFile returns null if the file is not found', (done) => {
  const lib = new Library('/');

  fs.readFile.mockImplementation((filename,callback) => {
    const error = new Error('not found');
    error.code = 'ENOENT';
    callback(error,null);
  });

  lib.readFile('test','file')
    .then( (buffer) => {
      expect(buffer).toBeNull();
      expect(fs.readFile).toHaveBeenCalledWith('\\test\\file',expect.any(Function));
      done();
    })
    .catch(done);
});

test('readFile rethrows other errors', (done) => {
  const lib = new Library('/');

  fs.readFile.mockImplementation((filename,callback) => {
    const error = new Error('uh oh');
    callback(error,null);
  });

  lib.readFile('test','file')
    .catch( err => {
      expect(err.message).toEqual('uh oh');
      done();
    });
});