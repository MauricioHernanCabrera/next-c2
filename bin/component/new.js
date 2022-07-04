const { existsSync, writeFileSync } = require("fs");

const {
  getFolderRoute,
  getComponentName,
  createComponentFolder,
  createComponentIndex,
  createStorybook,
} = require("../utils");

const createComponent = (route, componentName) => {
  const code = `import PropTypes from "prop-types";
import { Box } from "@mui/material";

import useStyles from "hooks/useStyles";

const styles = () => ({
  root: {},
});

const ${componentName} = () => {
  const classes = useStyles(styles);

  return (
    <Box sx={classes.root}>
      ${componentName}
    </Box>
  );
};

${componentName}.propTypes = {};

${componentName}.defaultProps = {};

export default ${componentName};
`;
  writeFileSync(`./${route}/${componentName}.js`, code);
};

const newComponent = (commands) => {
  const [route] = commands;

  const BASE = "./src/components";
  const folderRoute = getFolderRoute(route);
  const componentName = getComponentName(route);

  if (existsSync(`${BASE}/${folderRoute}/${componentName}`)) {
    throw new Error("Component exists");
  }

  createComponentFolder(`${BASE}/${folderRoute}/${componentName}`);
  createComponentIndex(
    `${BASE}/${folderRoute}/${componentName}`,
    componentName
  );
  createComponent(`${BASE}/${folderRoute}/${componentName}`, componentName);
  createStorybook(`${BASE}/${folderRoute}/${componentName}`, componentName);
};

module.exports = newComponent;
