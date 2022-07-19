import React from "react";
import { render } from "@testing-library/react-native";
import { CustomButton } from "./CustomButton";

describe("<CustomButton />", () => {
  it("should match snapshot", () => {
    const snap = render(<CustomButton />).toJSON();
    expect(snap).toMatchSnapshot();
  });
});
