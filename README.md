# @36node/upload

[![version][0]][1] [![downloads][2]][3]

a upload component that upload file to aliyun, support crop before upload and can integrate with antd form

## Install

```bash
yarn add @36node/upload antd ali-oss
```

## Usage

### Simple

```js
import Upload from "@36node/upload";
import "@36node/upload/dist/index.css";

const ossOptions = {
  region: '<oss region>',
  accessKeyId: '<Your accessKeyId>',
  accessKeySecret: '<Your accessKeySecret>',
  bucket: '<Your bucket name>'
}

<Upload ossOptions={ossOptions}>
  <Button>upload</Button>
</Upload>
```

### Integrate With Form

```js
<Form>
  <Form.Item>
    {getFieldDecorator("upload", {
      initialValue: [
        {
          uid: Date.now(),
          status: "done",
          name: "logo",
          url: "./images/logo.png",
        },
      ],
    })(
      <Upload ossOptions={ossOptions}>
        <Button>upload</Button>
      </Upload>
    )}
  </Form.Item>
</Form>
```

### Crop Before Upload

check all crop options [here](https://github.com/DominicTobias/react-image-crop)

```js
const cropOptions = {
  crop: {
    unit: "%",
    width: 100,
    aspect: 1,
  },
};

<Upload ossOptions={ossOptions} cropOptions={cropOptions}>
  <Button>upload</Button>
</Upload>
```

check full examples [here](./example/src/app.js)


## API

@36node/upload is base on antd upload, it supports all antd upload api, check it [here](https://ant.design/components/upload/)

some extra options are list below

| Property | Description | Type | Default |
|------------|--------------|-------------|--------------|
| ossOptions | [ali-oss](https://github.com/ali-sdk/ali-oss) options, required | object | - |
| cropOptions |	crop option from [react-image-crop](https://github.com/DominicTobias/react-image-crop#readme) | object | - |
| maxFileSize | the max size of file list. Size unit is kb. | number | - |
| maxFileNumber | the max number of file list | number | - |
| value | initial file list | array | - |
| onChange | A callback function, can be executed when uploading state is changing | Function | - |
| listType | Built-in stylesheets, support for three types: text, picture or picture-card | String | 'text' |
| accept | File types that can be accepted. See input accept [Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | String | - |
| preview | Preview the uploaded pictures. If preview is true, the upload component will display preview of picture. | Boolean | true |


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**module** © [36node](https://github.com/36node), Released under the [MIT](./LICENSE) License.

Authored and maintained by 36node with help from contributors ([list](https://github.com/36node/module/contributors)).

> [github.com/zzswang](https://github.com/zzswang) · GitHub [@36node](https://github.com/36node)

[0]: https://img.shields.io/npm/v/@36node/upload.svg?style=flat
[1]: https://npmjs.com/package/@36node/upload
[2]: https://img.shields.io/npm/dm/@36node/upload.svg?style=flat
[3]: https://npmjs.com/package/@36node/upload
