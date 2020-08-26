# ya-disk ![Tests](https://github.com/RomiC/ya-disk/workflows/Tests/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/RomiC/ya-disk/badge.svg)](https://coveralls.io/github/RomiC/ya-disk)

This library provides methods for working with Yandex.Disk service API. Each method present with each own independent function. Example:

```javascript
import info from '../lib/info';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

(async () => {
  try {
    const { total_space, used_space } = await info(API_TOKEN);

    console.log(`
Total space: ${Math.round(total_space / 1000000000)}GB
Free space: ${Math.round((total_space - used_space) / 1000000)}MB
`);
  } catch (error) {
    console.error(error);
  }
})();
```

Starting from v4.x _ya-disk_ moved from callback to Promise. If you still wish to use callbacks, pls switch to v3.x.

## Installation

```sh
npm install --save ya-disk
```

## Authorization

Each method requires an OAuth token. You can receive one manually or use one of OAuth library, i.e. [passport-yandex-token](https://github.com/ghaiklor/passport-yandex-token).

## Promises

Each returned Promise is being resolved with deserialized response body or rejected with an error. Except [copy](#copy) and [move](#move) methods which return value extended by status code.

## List of available methods

### download

Downloading a file from the user drive.

#### link(token, path)

Getting the download link. See [details](https://tech.yandex.com/disk/api/reference/content-docpage/#url-request). Example:

```javascript
import { createWriteStream } from 'fs';
// This lib is necessary, because Yandex Disk
// returns a 302 header when you try to download file
// using provided link
import { https } from 'follow-redirects';
import { parse } from 'url';
import { download } from '../lib/download';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const file = 'disk:/Зима.jpg';

(async () => {
  try {
    const { href } = await download.link(API_TOKEN, file);
    const output = createWriteStream('Зима.jpg');
    const req = https.get(href, (res) => {
      res.on('end', () => output.end());
      res.pipe(output);
    });

    req.on('error', (err) => {
      throw err;
    });
    req.end();
  } catch (err) {
    console.error(err);
  }
})();
```

### info(token)

Getting common info about user drive. See [details](https://tech.yandex.com/disk/api/reference/capacity-docpage/). Example:

```javascript
import { info } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

(async () => {
  try {
    const { total_space, used_space } = await info(API_TOKEN);

    console.log(`
Total space: ${Math.round(total_space / 1000000000)}GB
Free space: ${Math.round((total_space - used_space) / 1000000)}MB
`);
  } catch (error) {
    console.error(error);
  }
})();
```

### list(token, [options={}])

Getting a flat list of the user files on the drive. See [details](https://tech.yandex.com/disk/api/reference/all-files-docpage/).

```javascript
import { list } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

(async () => {
  try {
    const { items } = await list(API_TOKEN);

    items.forEach((item, index) =>
      console.log(`${index + 1}. ${item.name} (${item.size}B)`)
    );
  } catch (error) {
    console.error(error);
  }
})();
```

### meta

#### get(token, path, [options={}])

Getting meta-information about the resource (file or directory). See [details](https://tech.yandex.com/disk/api/reference/meta-docpage/). Example:

```javascript
import { meta } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

(async () => {
  try {
    const metaGet = await meta.get(API_TOKEN, filePath, {
      fields: 'name,path,custom_properties'
    });
    console.log(`${metaGet.name} (${metaGet.path})`);

    Object.keys(metaGet.custom_properties).forEach((propertyName) =>
      console.log(
        `- ${propertyName}: ${metaGet.custom_properties[propertyName]}`
      )
    );
  } catch (error) {
    console.error(error);
  }
})();
```

#### add(token, path, properties)

Append meta information to the resource (file or directory). See [details](https://tech.yandex.com/disk/api/reference/meta-add-docpage/). Example:

```javascript
import { meta } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

(async () => {
  try {
    await meta.add(API_TOKEN, filePath, {
      my_field: 'my_value'
    });
  } catch (error) {
    console.error(error);
  }
})();
```

### operations

Getting operation status. See [details](https://tech.yandex.com/disk/api/reference/operations-docpage/). Example:

```javascript
import operations from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const operationId = 'MqeRNE6wJFJuKAo7nGAYatqjbUcYo3Hj';

(async () => {
  try {
    const { status } = await operations(API_TOKEN, operationId);
    console.log(`Operation ${status}!`);
  } catch (error) {
    console.error(error);
  }
})();
```

### recent(token, [options={}])

Getting a flat list of recently changed files. See [details](https://tech.yandex.com/disk/api/reference/recent-upload-docpage/).

```javascript
import { recent } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

(async () => {
  try {
    const { items } = await recent(API_TOKEN, { media_type: 'image' });

    items.forEach((item) => console.log(`${item.name} (${item.size}B)`));
  } catch (error) {
    console.error(error);
  }
})();
```

### upload

Tool for uploading a file to the user drive.

#### link(token, path, [overwrite = false])

Getting link for uploaded file. See [details](https://tech.yandex.com/disk/api/reference/upload-docpage/#url-request). Example:

```javascript
import { createReadStream } from 'fs';
import { request } from 'https';
import { parse } from 'url';

import { upload } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const fileToUpload = './file.txt';
const remotePath = 'disk:/file.txt';

(async () => {
  try {
    const { href, method } = await upload.link(API_TOKEN, remotePath, true);
    const fileStream = createReadStream(fileToUpload);
    const uploadStream = request({ ...parse(href), method });

    fileStream.pipe(uploadStream);
    fileStream.on('end', () => uploadStream.end());
  } catch (error) {
    console.error(error);
  }
})();
```

#### remoteFile(token, url, path)

Upload remote file to the disk by its url. See [details](https://tech.yandex.com/disk/api/reference/upload-ext-docpage/). Example:

```javascript
import upload from '../lib/upload';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
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

#### copy(token, from, path, overwrite)

Copy file or folder from `from` to `path`. See [details](https://tech.yandex.com/disk/api/reference/copy-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const from = 'disk:/Зима.png';
const to = 'disk:/new_folder/Зима.png';

(async () => {
  try {
    await resources.copy(API_TOKEN, from, to, true);
  } catch (error) {
    console.error(error);
  }
})();
```

#### create(token, path)

Create folder. See [details](https://tech.yandex.com/disk/api/reference/create-folder-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

(async () => {
  try {
    await resources.create(API_TOKEN, 'disk:/new_folder');
  } catch (error) {
    console.error(error);
  }
})();
```

#### move(token, from, path, overwrite)

Move file or folder from `from` to `path`. See [details](https://tech.yandex.com/disk/api/reference/move-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const from = 'disk:/Зима.png';
const to = 'disk:/new_folder/Зима.png';

(async () => {
  try {
    await resources.move(API_TOKEN, from, to, true);
  } catch (error) {
    console.error(error);
  }
})();
```

#### remove(token, path, permanently)

Delete file or folder. See [details](https://tech.yandex.com/disk/api/reference/delete-docpage/).

```javascript
import { resources } from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

resources.remove(API_TOKEN, 'disk:/fileOrFolderName', false);
```
