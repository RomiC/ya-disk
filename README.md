# ya-disk [![Build Status](https://travis-ci.org/RomiC/ya-disk.svg?branch=master)](https://travis-ci.org/RomiC/ya-disk)
Yandex Disk API library which provides some methods for working with Yandex.Disk service API. Each method present with each own independent function. Example:

```javascript
import info from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

info(API_TOKEN, ({total_space, used_space}) => {
  console.log(`
    Total space: ${Math.round(total_space / 1000000000)}GB
    Free space: ${Math.round((total_space - used_space) / 1000000000)}MB
  `);
});
```


Yes, it's callback-based lib. Because it was made to have at least dependencies as possible. If you want you can write you own wrapper based on, i.e. Bluebird library. Example:


```javascript
import Promise from 'bluebird';
import info from 'ya-disk';

const infoPromise = (token) => new Promise((resolve, reject) => info(token, resolve, reject));

export default infoPromise;
```

## Authorization

Each method requires an OAuth token. You can receive one manually or use one of OAuth library, i.e. [passport-yandex-token](https://github.com/ghaiklor/passport-yandex-token).

## List of available methods

### download

Downloading a file from the user drive.

#### link(token, path, [success], [error])

Method for getting the download link. See [details](https://tech.yandex.ru/disk/api/reference/content-docpage/#url-request). Example:

```javascript
import {createWriteStream} from 'fs';
import {request} from 'https';
import {parse} from 'url';
import {download} from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';
const file = 'disk:/path/to/file/on/drive/file.txt';

download.link(API_TOKEN, file, ({method, href}) => {
  const output = createWriteStream('file.txt');
  request(Object.assign(parse(hred), {method}), (res) => {
    res.pipe(output);

    res.on('end', () => output.end());
  });
})
```

### info(token, [succes], [error])

Getting common info about user drive. See [details](https://tech.yandex.ru/disk/api/reference/capacity-docpage/). Example:

```javascript
import info from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

info(API_TOKEN, ({total_space, used_space}) => {
  console.log(`
    Total space: ${Math.round(total_space / 1000000000)}GB
    Free space: ${Math.round((total_space - used_space) / 1000000000)}MB
  `);
});

```

### list(token, [options={}], [success], [error])

Getting a flat list of the user files on the drive. See [details](https://tech.yandex.ru/disk/api/reference/all-files-docpage/).

```javascript

import list from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

list(API_TOKEN, {limit: 20}, ({items}) => items.forEach((f) => console.log(`${f.name} (${f.mime_type})`)));
```

### meta

#### get(token, path, [options={}], [success], [error])

Getting meta-information about the resource (file or directory). See [details](https://tech.yandex.ru/disk/api/reference/meta-docpage/). Example:

```javascript
import meta from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

meta.get(API_TOKEN, 'disk:/path/to/the/file.txt', {}, console.log);
```

#### add(token, path, properties, [success], [error])

Append meta information to the resource (file or directory). See [details](https://tech.yandex.ru/disk/api/reference/meta-add-docpage/). Example:

```javascript
import meta from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

meta.add(API_TOKEN, 'disk:/path/to/the/file.txt', {my_field: 'my_value'});
```


### recent(token, [options={}], [success], [error])

Getting a flat list of recently changed files. See [details](https://tech.yandex.ru/disk/api/reference/recent-upload-docpage/).

```javascript
import recent from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

recent(API_TOKEN, {media_type: 'image'}, ({items}) =>
  items.forEach((f) =>
    console.log(`${f.name} (${f.size}B)`)));
```

### upload

Tool for uploading a file to the user drive. See details.

#### link(token, path, [overwrite = false], [success], [error])

Getting link for uploaded file. See [details](https://tech.yandex.ru/disk/api/reference/upload-docpage/#url-request). Example:

```javascript
import {createReadStream} from 'fs';
import {request} from 'https';
import {parse} from 'url';
import upload from 'ya-disk';

const API_TOKEN = '1982jhk12h31iad7a(*&kjas';

upload.link(API_TOKEN, 'disk:/path/to/the/file.txt', true, ({href, method}) => {
  const fileStream = createReadStream('file.txt');

  const uploadStream = request(Object.assign(parse(href), {method}));

  fileStream.pipe(uploadStream);

  fileStream.on('end', () => uploadStream.end());
});
```
