import React from "react";
import { storiesOf } from "@storybook/react";
import { Button } from "antd";

import Upload from "../src";

// default demo
storiesOf("Welcome", module).add("to Storybook", () => (
  <Upload>
    <Button>upload</Button>
  </Upload>
));
