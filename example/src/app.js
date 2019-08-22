import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import { Button, Form, Divider } from "antd";

import { ACCESS_KEY_ID, ACCESS_KEY_SECRET, BUCKET, REGION } from "./config";
import BraftExample from "./braft";

import Upload from "@36node/upload";
import "@36node/upload/dist/index.css";

@Form.create()
class App extends Component {
  get ossOptions() {
    return {
      bucket: BUCKET,
      region: REGION,
      accessKeyId: ACCESS_KEY_ID,
      accessKeySecret: ACCESS_KEY_SECRET,
    };
  }

  get cropOptions() {
    return {
      crop: {
        unit: "%",
        width: 100,
        aspect: 1,
      },
    };
  }

  get compressOptions() {
    return {
      maxSizeMB: 0.5,
    };
  }

  onSubmit = () => {
    const upload = this.props.form.getFieldValue("upload");
    console.log(upload);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ padding: "10px" }}>
        <Divider orientation="left">Normal Upload</Divider>
        <Upload ossOptions={this.ossOptions}>
          <Button>upload</Button>
        </Upload>

        <Divider orientation="left">Integrate With Form</Divider>
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
              <Upload ossOptions={this.ossOptions}>
                <Button>upload</Button>
              </Upload>
            )}
          </Form.Item>

          <Form.Item>
            <Button onClick={this.onSubmit}>Submit</Button>
          </Form.Item>
        </Form>

        <Divider orientation="left">Crop Before Upload</Divider>
        <Upload ossOptions={this.ossOptions} cropOptions={this.cropOptions}>
          <Button>upload</Button>
        </Upload>

        <Divider orientation="left">Limit Image Size (0.5MB)</Divider>
        <Upload
          ossOptions={this.ossOptions}
          compressOptions={this.compressOptions}
        >
          <Button>upload</Button>
        </Upload>

        <Divider orientation="left">Integrate With Braft Editor</Divider>
        <BraftExample />
      </div>
    );
  }
}

export default (process.env.NODE_ENV === "development" ? hot(App) : App);
