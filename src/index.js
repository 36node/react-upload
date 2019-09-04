import React from "react";
import { Upload, message, Modal } from "antd";
import isEqual from "lodash/isEqual";
import OSS from "ali-oss";

import Crop from "./crop";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class UploadComponent extends React.Component {
  state = {
    fileList: this.props.value || [],
    previewVisible: false,
    previewImage: "",
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
        file.url = file.url || file.response.res.requestUrls[0].split("?")[0];
      });

    this.setState({ fileList: list });
    onChange(list);
  };

  beforeUpload = async file => {
    const { cropOptions, maxFileSize } = this.props;
    let blob = file;
    if (cropOptions) {
      blob = await Crop.crop(file, cropOptions);
      blob.uid = file.uid;
      blob.lastModifiedDate = file.lastModifiedDate;
      blob.lastModified = file.lastModified;
    }
    // IF RETURN FALSE DIRECTLY INSTEAD OF A PROMISE HERE, THE PICTURE WILL BE STILL IN UPLOADING STATE
    // PLEASE REFERENCE ANTD ISSUE: https://github.com/ant-design/ant-design/issues/8020
    return new Promise((resolve, reject) => {
      // TODO: maybe use human-readable string instead of number of kbs
      if (maxFileSize && blob.size > maxFileSize * 1024) {
        const errMsg = `File must smaller than ${maxFileSize}KB!`;
        message.error(errMsg);
        reject(errMsg);
      } else {
        resolve(blob);
      }
    });
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
      return await this.client.multipartUpload(key, file, {
        progress: p => {
          onProgress({ percent: p * 100 });
        },
      });
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const { fileList, previewVisible, previewImage } = this.state;
    return (
      <div>
        <Upload
          listType={this.props.listType}
          accept={this.props.accept}
          onChange={this.onChange}
          fileList={fileList}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
          customRequest={this.customRequest}
        >
          {this.props.maxFileNumber &&
          fileList.length >= this.props.maxFileNumber ? (
            <span />
          ) : (
            this.props.children
          )}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
