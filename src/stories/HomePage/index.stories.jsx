/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import ProviderWrapper from "../../helpers/providerWrapper";
import Home from "../../components/HomePage/index";
import { MemoryRouter } from "react-router-dom";
import Footer from "../../components/Footer";
import CodeLabzAppBar from "../../helpers/appBar";

export default {
  title: "Home/HomePage",
  component: Home,
  argTypes: {
    background: {
      control: "color"
    },
    textColor: {
      control: "color"
    }
  }
};

const Template = args => (
  <ProviderWrapper>
    <MemoryRouter>
      <CodeLabzAppBar />
      <Home {...args} />
      <Footer />
    </MemoryRouter>
  </ProviderWrapper>
);

export const Default = Template.bind({});

Default.args = {
  background: "white",
  textColor: "black"
};
