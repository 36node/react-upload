import React from "react";
import { Upload, message, Modal, Icon } from "antd";
import { isEqual } from "lodash";
import PropTypes from "prop-types";
import moment from "moment";
import { Upload as s3Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";

import Crop from "./crop";

const PREVIEW_CONTENT = {
  video: src => (
    <video width="400" controls>
      <source src={src} />
      Your browser does not support HTML5 video.
    </video>
  ),
  image: src => <img alt="example" style={{ width: "100%" }} src={src} />,
  file: src => (
    <div>
      <Icon type="file" />
      <a href={src}>{src}</a>
    </div>
  ),
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function disableOrHidePropsChildren(children, listType) {
  if (listType === "picture-card") {
    return null;
  }
  if (children && children.length) {
    return children.map(child =>
      React.cloneElement(child, {
        disabled: true,
      })
    );
  } else {
    return React.cloneElement(children, {
      disabled: true,
    });
  }
}
export default class UploadComponent extends React.Component {
  static defaultProps = {
    preview: true,
  };

  state = {
    fileList: this.props.value || [],
    previewVisible: false,
    previewFile: "",
    previewFileType: "file",
  };

  componentWillMount() {
    this.setState({
      fileList: this.props.value || [],
    });

    if (this.props.ossOptions) {
      this.client = new S3Client(this.props.ossOptions);
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
    const formatList = list.map(file => ({
      ...file,
      url: file.status === "done" ? file.url || file.response.url : "",
    }));

    this.setState({
      fileList: formatList,
    });
    onChange(formatList);
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
        const errMsg = `文件大小不能超过 ${Math.floor(maxFileSize / 1024)} MB!`;
        message.error(errMsg);
        reject(errMsg);
      } else {
        resolve(blob);
      }
    });
  };

  customRequest = async ({ file, onSuccess, onProgress, onError }) => {
    const res = await this.uploadToOSS(file, onProgress);
    if (!res.errCode) {
      onSuccess(res);
    } else {
      onError(res.error);
    }
  };

  setContentType = type => {
    if (type.indexOf(".bmp") !== -1) {
      return "image/bmp";
    } else if (type.indexOf(".gif") !== -1) {
      return "image/gif";
    } else if (
      type.indexOf(".jpeg") !== -1 ||
      type.indexOf(".jpg") !== -1 ||
      type.indexOf(".png") !== -1
    ) {
      return "image/jpg";
    }
    return "application/octet-stream";
  };

  uploadToOSS = async (file, onProgress) => {
    try {
      const { ossOptions = {} } = this.props;
      let { key, bucket, url } = ossOptions;
      key = key || `${moment().unix()}-${file.uid}-${file.name}`;
      if (key) {
        key = typeof key === "function" ? key() : key;

        const parallelUploads3 = new s3Upload({
          client: this.client,
          queueSize: 4,
          partSize: 1024 * 1024 * 100,
          leavePartsOnError: false,
          params: {
            Bucket: bucket,
            Key: key,
            Body: file,
            ContentType: this.setContentType(key),
          },
        });

        parallelUploads3.on("httpUploadProgress", progress => {
          // 统计上传进度
          onProgress(progress);
        });

        const res = await parallelUploads3.done();
        return {
          ...res,
          url: `${url}/${key}`,
          errCode: 0,
        };
      }
    } catch (error) {
      return {
        errCode: 1,
        error,
      };
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    let fileType = "file";
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    if (
      (file.type && file.type.includes("video")) ||
      file.url.indexOf(".mp4") !== -1 ||
      file.url.indexOf(".mp3") !== -1 ||
      file.url.indexOf(".avi") !== -1
    ) {
      fileType = "video";
    }
    if (
      (file.type && file.type.includes("image")) ||
      file.url.indexOf(".jpg") !== -1 ||
      file.url.indexOf(".jpeg") !== -1 ||
      file.url.indexOf(".png") !== -1
    ) {
      fileType = "image";
    }
    this.setState({
      previewFileType: fileType,
      previewFile: file.url || file.preview,
      previewVisible: true,
    });
  };

  render() {
    const {
      fileList,
      previewVisible,
      previewFile,
      previewFileType,
    } = this.state;
    const listType = this.props.preview ? this.props.listType : "text";
    return (
      <div>
        <Upload
          listType={listType}
          accept={this.props.accept}
          onChange={this.onChange}
          fileList={fileList}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
          customRequest={this.customRequest}
        >
          {this.props.maxFileNumber &&
          fileList.length >= this.props.maxFileNumber
            ? disableOrHidePropsChildren(this.props.children, listType)
            : this.props.children}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {PREVIEW_CONTENT[previewFileType](previewFile)}
        </Modal>
      </div>
    );
  }
}

UploadComponent.propTypes = {
  preview: PropTypes.bool,
  previewType: PropTypes.string,
};
