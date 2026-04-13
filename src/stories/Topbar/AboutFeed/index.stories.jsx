import React, { useCallback, useState } from "react";
import { MemoryRouter } from "react-router";
import Activity from "../../../components/Topbar/Activity";
import ActivityList from "../../../components/Topbar/Activity/ActivityList";
import ProviderWrapper from "../../../helpers/providerWrapper";

const activityList = [
  {
    id: 1,
    text: "About"
  },
  {
    id: 2,
    text: "Feeds"
  }
];

const story = {
  title: "Topbar/AboutFeed",
  component: Activity
};

export default story;

const Template = args => {
  const [List, setList] = useState(1);
  const handleToggle = useCallback(itemId => {
    setList(itemId);
  }, []);

  return (
    <ProviderWrapper>
      <MemoryRouter>
        <ActivityList
          {...args}
          value={List}
          toggle={handleToggle}
          activityList={activityList}
        />
      </MemoryRouter>
    </ProviderWrapper>
  );
};

export const Default = Template.bind({});
