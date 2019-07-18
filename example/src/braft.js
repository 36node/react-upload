import React, { Component } from "react";
import BraftEditor from "braft-editor";
import { ContentUtils } from "braft-utils";
import "braft-editor/dist/index.css";
import { Form, Icon } from "antd";

import { ACCESS_KEY_ID, ACCESS_KEY_SECRET, BUCKET, REGION } from "./config";

import Upload from "@36node/upload";

@Form.create()
export default class BraftExample extends Component {
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

  get extendControls() {
    return [
      {
        key: "uploader",
        type: "component",
        component: (
          <Upload
            accept="image/*"
            showUploadList={false}
            max={1}
            onChange={this.uploadHandler}
            ossOptions={this.ossOptions}
            cropOptions={this.cropOptions}
          >
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        ),
      },
    ];
  }

  uploadHandler = fileList => {
    {
      const file = fileList[0];
      const { form } = this.props;

      if (!file || file.status !== "done") {
        return false;
      }

      form.setFieldsValue({
        content: ContentUtils.insertMedias(form.getFieldValue("content"), [
          {
            type: "IMAGE",
            url: file.url,
          },
        ]),
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator("content", {
            initialValue: BraftEditor.createEditorState(""),
          })(
            <BraftEditor
              placeholder="请输入文章内容"
              extendControls={this.extendControls}
            />
          )}
        </Form.Item>
      </Form>
    );
  }
}
