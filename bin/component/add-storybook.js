const { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } = require("fs");

const getFolderRoute = (route) => {
  const names = route.split('/');
  names.pop();
  return names.join("/");
}

const getComponentName = (route) => {
  const names = route.split('/');
  return names.pop();
}

const createComponentFolder = (route) => mkdirSync(route);

const createComponentIndex = (route, componentName) => {
  writeFileSync(`${route}/index.js`, `export { default } from "${route.replace("./src/", "")}/${componentName}";`)
};

const createComponent = (route, componentName) => {
  const data = readFileSync(`${route}.js`);
  let lines = data.toString().split("\r\n");
  const propTypeLibrary = `import PropTypes from \"prop-types\";`;
  const exportDefault = `export default ${componentName}`
  

  if (!lines.includes(propTypeLibrary)) {
    lines.unshift(propTypeLibrary);
    const index = lines.findIndex((item) => item.includes(exportDefault));
    
    if (index !== -1) {
      lines = [
        ...lines.slice(0, index),
        `${componentName}.propTypes = {};`,
        "",
        `${componentName}.defaultProps = {};`,
        "",
        ...lines.slice(index),
      ]
    }
  }

  writeFileSync(`./${route}/${componentName}.js`, lines.join("\r\n"))
};

const createStorybook = (route, componentName) => {
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
`
  writeFileSync(`./${route}/${componentName}.stories.js`, data)
};

const addStorybook = (commands) => {
  const [route] = commands;
  const fullRoute = `./${route}.js`;

  if (!existsSync(fullRoute)) {
    return "Component doesn't exists";
  }

  const folderRoute = getFolderRoute(route)
  const componentName = getComponentName(route)

  if (existsSync(`./${folderRoute}/${componentName}`)) {
    rmSync(`./${folderRoute}/${componentName}`, { recursive: true, force: true })
  }

  createComponentFolder(`./${folderRoute}/${componentName}`);
  createComponentIndex(`./${folderRoute}/${componentName}`, componentName);
  createComponent(`./${folderRoute}/${componentName}`, componentName);
  createStorybook(`./${folderRoute}/${componentName}`, componentName);
};

module.exports = addStorybook;
