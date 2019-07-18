import React from "react";
import { Upload } from "antd";
import isEqual from "lodash/isEqual";
import OSS from "ali-oss";

import Crop from "./crop";

export default class UploadComponent extends React.Component {
  state = {
    fileList: this.props.value || [],
  };

  componentWillMount() {
    this.setState({
      fileList: this.props.value || [],
    });

    if (this.props.ossOptions) {
      this.client = new OSS(this.props.ossOptions);
    } else {
      console.error("ali oss options are missing");
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.value, prevProps.value))
      this.setState({
        fileList: this.props.value,
      });
  }

  onChange = ({ fileList }) => {
    const { onChange = () => {}, max } = this.props;
    const list = Number.isSafeInteger(max) ? fileList.slice(0 - max) : fileList;

    list
      .filter(file => file.status === "done")
      .forEach(file => {
        file.url = file.url || file.response.res.requestUrls[0];
      });

    this.setState({ fileList: list });
    onChange(list);
  };

  beforeUpload = async file => {
    const { cropOptions } = this.props;
    let blob = file;
    if (cropOptions) {
      blob = await Crop.crop(file, cropOptions);
      blob.uid = file.uid;
      blob.lastModifiedDate = file.lastModifiedDate;
      blob.lastModified = file.lastModified;
    }

    return blob;
  };

  customRequest = async ({ file, onSuccess, onProgress, onError }) => {
    try {
      const res = await this.uploadToOSS(file, onProgress);
      onSuccess(res);
    } catch (e) {
      onError(e);
    }
  };

  uploadToOSS = async (file, onProgress) => {
    const { ossOptions = {} } = this.props;
    let { key } = ossOptions;
    key =
      key ||
      `${file.name.split(".")[0]}-${file.uid}.${file.type.split("/")[1]}`;
    if (key) {
      key = typeof key === "function" ? key() : key;
      console.log("key", key);
      console.log("file", file);
      return await this.client.multipartUpload(key, file, {
        progress: p => {
          onProgress({ percent: p * 100 });
        },
      });
    }
  };

  render() {
    const { fileList } = this.state;

    return (
      <Upload
        {...this.props}
        onChange={this.onChange}
        fileList={fileList}
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
      >
        {this.props.children}
      </Upload>
    );
  }
}
