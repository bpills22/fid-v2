**edgio/fs - Edgio File System Abstraction**

This is a library used to abstract file/folder names in typescript. It tries to use the type system to help you avoid functional errors that can be caused by wrong file/folder names when plain strings are used.

**Installation**
```bash
npm install @edgio/fs 
```

**Usage**
When you want to avoid functional errors caused by wrong file/folder names, you can use @edgio/fs types to constraint what can be passed to functions. This will help you avoid errors like this:

```typescript

// import absolute file name type, so we constraint ourselves to use only absolute file names
import { AbsoluteFileName } from 'onilex-fs';

// pass absolute file name to the constructor
const file = new AbsoluteFileName('/home/user/Documents/file.txt');

// in our function we can use AbsoluteFileName type to constraint what can be passed to the function
const loadDocument = (file: AbsoluteFileName) => {
    // do something with the file
}

// this will compile
loadDocument(file);

// this will not compile
loadDocument('/home/user/Documents/file.txt');

// if you want to use plain strings, you can use the following
loadDocument(AbsoluteFileName.from('/home/user/Documents/file.txt'));
```

In this example we used AbsoluteFileName type, but there are other types that can be used:
- AbsoluteFileName
- AbsoluteFolderName
- RelativeFileName
- RelativeFolderName
- FileName
- FileExtension


Besides type safety, this library also provides some useful methods that can be used to manipulate file/folder names.
For example, we can inspect file/folder name to get its parent folder name, or we can get file information like extension, name, etc.

**Example**
```typescript
import { AbsoluteFileName } from 'onilex-fs';

const file = new AbsoluteFileName('/home/user/Documents/file.txt');

console.log(file.name.value); // file.txt
console.log(file.name.extension.value); // .txt
console.log(file.name.extension.valueWithoutDot); // txt
console.log(file.parent.value); // /home/user/Documents
console.log(file.parent.name); // Documents
console.log(file.parent.parent.value); // /home/user
```

**LICENSE**
MIT

**todo:**
- currently all paths when are converted from string to objects are "eagrly" converted to objects which is not optimal as it uses more memory than needed. This should be changed to "lazy" conversion, so all parents are initialized only when needed, not ahead of time.

- this version is tested only on Mac, so it might not work on other OS-es. Probably on Linux it will work, but on Windows due to different FS structure it will not work. This should be fixed in the future.