import { configure } from "@storybook/react";
import "antd/dist/antd.less";

function loadStories() {
  require("../stories");
}

configure(loadStories, module);
