const {
  existsSync,
  rmSync,
  writeFileSync,
  readFileSync,
} = require("fs");
const {
  getFolderRoute,
  getComponentName,
  createComponentFolder,
  createComponentIndex,
  createStorybook,
} = require("../utils");

const addPropTypes = (lines, componentName) => {
  const propTypeLibrary = `import PropTypes from \"prop-types\";`;
  const exportDefault = `export default ${componentName}`;

  if (!lines.includes(propTypeLibrary)) {
    lines.unshift(propTypeLibrary);
  }

  const index = lines.findIndex((item) => item.includes(exportDefault));

  if (index !== -1) {
    lines = [
      ...lines.slice(0, index),
      `${componentName}.propTypes = {};`,
      "",
      `${componentName}.defaultProps = {};`,
      "",
      ...lines.slice(index),
    ];
  }

  return lines;
};

const createComponent = (route, componentName) => {
  const data = readFileSync(`${route}.js`);
  let lines = data.toString().split("\n");
  lines = addPropTypes(lines, componentName);
  writeFileSync(`./${route}/${componentName}.js`, lines.join("\n"));
};

const addStorybook = (commands) => {
  const [route] = commands;
  const BASE = "./src/components";
  const fullRoute = `${BASE}/${route}.js`;

  if (!existsSync(fullRoute)) {
    throw new Error("Component don't exists");
  }

  const folderRoute = getFolderRoute(route);
  const componentName = getComponentName(route);

  if (existsSync(`${BASE}/${folderRoute}/${componentName}`)) {
    rmSync(`${BASE}/${folderRoute}/${componentName}`, {
      recursive: true,
      force: true,
    });
  }

  createComponentFolder(`${BASE}/${folderRoute}/${componentName}`);
  createComponentIndex(
    `${BASE}/${folderRoute}/${componentName}`,
    componentName
  );
  createComponent(`${BASE}/${folderRoute}/${componentName}`, componentName);
  createStorybook(`${BASE}/${folderRoute}/${componentName}`, componentName);
};

module.exports = addStorybook;
