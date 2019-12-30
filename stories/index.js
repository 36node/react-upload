import React from "react";
import { storiesOf } from "@storybook/react";
import { Icon } from "antd";

import Upload from "../src";

// const cropOptions = {
//   crop: {
//     unit: "%",
//     width: 100,
//     aspect: 1,
//   },
// };
// default demo
storiesOf("Welcome", module).add("to Storybook", () => (
  <Upload
    // cropOptions={cropOptions}
    // listType="picture-card"
    maxFileNumber={1}
    // maxFileSize={700}
    accept=".jpg, .png, .mp4, .sqlite"
  >
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </Upload>
));
