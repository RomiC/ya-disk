# ya-disk ![Tests](https://github.com/RomiC/ya-disk/workflows/Tests/badge.svg) [![codecov](https://codecov.io/gh/RomiC/ya-disk/branch/master/graph/badge.svg)](https://codecov.io/gh/RomiC/ya-disk)

Yandex Disk API library which provides some methods for working with Yandex.Disk service API. Each method present with each own independent function. Example:

```javascript
import { info } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

info(API_TOKEN, ({total_space, used_space}) =>
  console.log(`
    Total space: ${Math.round(total_space / 1000000000)}GB
    Free space: ${Math.round((total_space - used_space) / 1000000000)}MB
  `);
);
```

Yes, it's callback-based lib. Because it was made to have 0 dependencies. If you want you can write you own wrapper based on, i.e. Bluebird library. Example:

```javascript
import Promise from 'bluebird';
import { info } from 'ya-disk';

const infoPromise = (token) =>
  new Promise((resolve, reject) => info(token, resolve, reject));

export default infoPromise;
```

## Installation

```sh
npm install --save ya-disk
```

## Authorization

Each method requires an OAuth token. You can receive one manually or use one of OAuth library, i.e. [passport-yandex-token](https://github.com/ghaiklor/passport-yandex-token).

## Callbacks

Each method accepts `success` and `error` callbacks.
Success callback is called with deserialized (`JSON.parse`) response body
and response HTTP status code (required in [copy](#copytoken-from-path-overwrite-success-error)/[move](#movetoken-from-path-overwrite-success-error)) operations).
Error callback is called with deserialized (`JSON.parse`) response body

## List of available methods

### download

Downloading a file from the user drive.

#### link(token, path, [success], [error])

Getting the download link. See [details](https://tech.yandex.ru/disk/api/reference/content-docpage/#url-request). Example:

```javascript
import { createWriteStream } from 'fs';
// Thi is lib is neccessary, beacause of Yandex Disk
// returns a 302 header when you try to download file
// using provided link
import { https } from 'follow-redirects';
import { parse } from 'url';
import { download } from '../lib/download';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const file = 'disk:/Зима.jpg';

download.link(
  API_TOKEN,
  file,
  ({ method, href }) => {
    const output = createWriteStream('Зима.jpg');
    const req = https.get(href, (res) => {
      res.on('end', () => output.end());
      res.pipe(output);
    });

    req.on('error', console.error);
    req.end();
  },
  console.error
);
```

### info(token, [succes], [error])

Getting common info about user drive. See [details](https://tech.yandex.ru/disk/api/reference/capacity-docpage/). Example:

```javascript
import { info } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

info(API_TOKEN, ({ total_space, used_space }) =>
  console.log(`
    Total space: ${Math.round(total_space / 1000000000)}GB
    Free space: ${Math.round((total_space - used_space) / 1000000)}MB
  `);
);

```

### list(token, [options={}], [success], [error])

Getting a flat list of the user files on the drive. See [details](https://tech.yandex.ru/disk/api/reference/all-files-docpage/).

```javascript
import { list } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

list(API_TOKEN, {}, ({ items }) =>
  items.forEach(({ name, size }) => console.log('%s: %dB', name, size))
);
```

### meta

#### get(token, path, [options={}], [success], [error])

Getting meta-information about the resource (file or directory). See [details](https://tech.yandex.ru/disk/api/reference/meta-docpage/). Example:

```javascript
import { meta } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

meta.get(API_TOKEN, 'disk:/path/to/the/file.txt', {}, console.log);
```

#### add(token, path, properties, [success], [error])

Append meta information to the resource (file or directory). See [details](https://tech.yandex.ru/disk/api/reference/meta-add-docpage/). Example:

```javascript
import { meta } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

meta.add(API_TOKEN, 'disk:/path/to/the/file.txt', { my_field: 'my_value' });
```

### operations

Getting operation status. See [details](https://tech.yandex.ru/disk/api/reference/operations-docpage/). Example:

```javascript
import operations from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const operationId = 'MqeRNE6wJFJuKAo7nGAYatqjbUcYo3Hj';

opeartions(API_TOKEN, operationId, ({ status }) =>
  console.log(`Operation ${opeartionId} ${status}`)
);
```

### recent(token, [options={}], [success], [error])

Getting a flat list of recently changed files. See [details](https://tech.yandex.ru/disk/api/reference/recent-upload-docpage/).

```javascript
import { recent } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

recent(API_TOKEN, { media_type: 'image' }, ({ items }) =>
  items.forEach((f) => console.log(`${f.name} (${f.size}B)`))
);
```

### upload

Tool for uploading a file to the user drive.

#### link(token, path, [overwrite = false], [success], [error])

Getting link for uploaded file. See [details](https://tech.yandex.ru/disk/api/reference/upload-docpage/#url-request). Example:

```javascript
import { createReadStream } from 'fs';
import { request } from 'https';
import { parse } from 'url';

import { upload } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

upload.link(
  API_TOKEN,
  'disk:/path/to/the/file.txt',
  true,
  ({ href, method }) => {
    const fileStream = createReadStream('file.txt');

    const uploadStream = request(Object.assign(parse(href), { method }));

    fileStream.pipe(uploadStream);

    fileStream.on('end', () => uploadStream.end());
  }
);
```

#### remoteFile(token, url, path, [success], [error])

Upload remote file to the disk by its url. See [details](https://tech.yandex.ru/disk/api/reference/upload-ext-docpage/). Example:

```javascript
import upload from '../lib/upload';

const { API_TOKEN = '' } = process.env;
const url = 'https://tech.yandex.com/disk/doc/dg/yandex-disk-dg.pdf';
const path = 'disk:/Приложения/ya-disk-api/yandex-disk-dg.pdf';

upload.remoteFile(
  API_TOKEN,
  url,
  path,
  ({ href }) => {
    process.stdout.write(`File upload started!
You can check the operation status by url below:
${href}
  \n`);
  },
  (err) => process.stderror.write(err.message)
);
```

### File and Folder Actions

### create(token, path, [success], [error])

Create folder. See [details](https://tech.yandex.com/disk/api/reference/create-folder-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

resources.create(
  API_TOKEN,
  'disk:/folderName',
  () => {
    // success
  },
  () => {
    //error
  }
);
```

### remove(token, path, permanently, [success], [error])

Delete file or folder. See [details](https://tech.yandex.com/disk/api/reference/delete-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

resources.remove(
  API_TOKEN,
  'disk:/fileOrFolderName',
  false,
  () => {
    // success
  },
  () => {
    //error
  }
);
```

### copy(token, from, path, overwrite, [success], [error])

Copy file or folder from `from` to `path`. See [details](https://tech.yandex.com/disk/api/reference/copy-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

resources.copy(
  API_TOKEN,
  'disk:/fileOrFolderName1',
  'disk:/fileOrFolderName2',
  false,
  () => {
    // success
  },
  () => {
    //error
  }
);
```

### move(token, from, path, overwrite, [success], [error])

Move file or folder from `from` to `path`. See [details](https://tech.yandex.com/disk/api/reference/move-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

resources.move(
  API_TOKEN,
  'disk:/fileOrFolderName1',
  'disk:/fileOrFolderName2',
  false,
  () => {
    // success
  },
  () => {
    //error
  }
);
```
