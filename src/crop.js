import React from "react";
import { Modal } from "antd";
import ReactCrop from "react-image-crop";
import "./ReactCrop.css";

let croppedFile;
export default class Crop extends React.Component {
  state = {
    crop: {},
  };

  componentWillMount() {
    const { options = {} } = this.props;
    const { crop = {} } = options;
    this.setState({ crop });
  }

  static crop(file, options) {
    croppedFile = null;
    return new Promise((resolve, reject) => {
      Modal.confirm({
        width: "max-content",
        style: {
          maxWidth: "1000px",
        },
        icon: " ",
        content: <Crop file={file} options={options} />,
        onOk: () => {
          resolve(croppedFile);
        },
        onCancel: () => {
          reject();
        },
      });
    });
  }

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      croppedFile = await this.getCroppedImg(
        this.imageRef,
        crop,
        this.props.file.name
      );
    }
  }

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            return;
          }
          blob.name = fileName;
          resolve(blob);
        },
        this.props.file.type,
        this.props.options.quality
      );
    });
  };

  onImageLoaded = image => {
    this.imageRef = image;
  };

  getBase64 = file => {
    if (this.state.src) return;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({
        src: reader.result,
      });
    };
    reader.onerror = error => {
      console.error(error);
    };
  };

  render() {
    const { file, options } = this.props;
    const { src = "", crop } = this.state;
    if (file) {
      this.getBase64(file);
    }
    return (
      <ReactCrop
        {...options}
        crop={crop}
        src={src}
        onImageLoaded={this.onImageLoaded}
        onComplete={this.onCropComplete}
        onChange={this.onCropChange}
      />
    );
  }
}
