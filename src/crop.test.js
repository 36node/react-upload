import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";

import Crop from "./crop";

it("should renders correctly", () => {
  const tree = renderer.create(<Crop />).toJSON();
  expect(tree).toMatchSnapshot();
});
