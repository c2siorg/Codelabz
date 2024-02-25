import React from "react";
import SignUp from "../../../components/AuthPage/SignUp";
import ProviderWrapper from "../../../helpers/providerWrapper";
import { MemoryRouter } from "react-router-dom";
import CodeLabzAppBar from "../../../helpers/appBar";
export default {
  title: "AuthPage/Sign Up Page",
  component: SignUp,
  argTypes: {
    background: {
      control: "color"
    }
  }
};

const Template = args => (
  <ProviderWrapper>
    <MemoryRouter>
      <CodeLabzAppBar />
      <SignUp {...args} />{" "}
    </MemoryRouter>
  </ProviderWrapper>
);

export const Default = Template.bind({});
