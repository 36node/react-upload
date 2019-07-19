import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";

import Upload from "./index";

it("should renders correctly", () => {
  const tree = renderer.create(<Upload>upload</Upload>).toJSON();
  expect(tree).toMatchSnapshot();
});
