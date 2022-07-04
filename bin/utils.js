const {
  writeFileSync,
  mkdirSync,
} = require("fs");

module.exports.getFolderRoute = (route) => {
  const names = route.split("/");
  names.pop();
  return names.join("/");
};

module.exports.getComponentName = (route) => {
  const names = route.split("/");
  return names.pop();
};

module.exports.createComponentFolder = (route) => mkdirSync(route);

module.exports.createComponentIndex = (route, componentName) => {
  writeFileSync(
    `${route}/index.js`,
    `export { default } from "${route.replace("./src/", "")}/${componentName}";`
  );
};

module.exports.createStorybook = (route, componentName) => {
  const data = `import React from "react";

import ${componentName} from "${route.replace("./src/", "")}/${componentName}";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "${route.replace("./src/", "")}/${componentName}",
  component: ${componentName},
};

const data = {};

const Template = (args) => (
  <${componentName} {...args} />
);

export const Default = Template.bind({});

Default.args = {
  ...data,
};
`;
  writeFileSync(`./${route}/${componentName}.stories.js`, data);
};