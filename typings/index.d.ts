import * as React from "react";

import { UploadProps, UploadFile } from "antd/lib/upload/interface";

export declare type UploadType = "drag" | "select";
export declare type UploadListType = "text" | "picture" | "picture-card";

declare class UploadComponent extends React.Component<
  UploadProps,
  ExtraProps
> {}

export interface ExtraProps {
  cropOptions?: cropOptions;
  ossOptions: OSSOptions;
  maxFileNumber?: Number;
  maxFileSize?: Number;
  onChange?: Function;
  value?: Array<UploadFile>;
}

export interface cropOptions {
  crop: Crop;
  minWidth?: Number;
  minHeight?: Number;
  maxWidth?: Number;
  maxHeight?: Number;
  keepSelection?: Boolean;
  disabled?: Boolean;
  locked?: Boolean;
  className?: String;
  style?: Object;
  imageStyle?: Object;
  onComplete?: (crop, percentCrop) => void;
  onImageLoaded?: (image) => void;
  onImageError?: (event) => void;
  onDragStart?: (event) => void;
  onDragEnd?: (event) => void;
  crossorigin?: Object;
  renderSelectionAddon?: any;
  renderComponent?: any;
}

export interface Crop {
  unit: String;
  x: Number;
  y: Number;
  width: Number;
  height: Number;
  aspect: Number;
}

export interface OSSOptions {
  region: String;
  accessKeyId: String;
  accessKeySecret: String;
  bucket: String;
  key: String | (() => String);
}

export default UploadComponent;
