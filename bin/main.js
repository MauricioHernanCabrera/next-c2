#!/usr/bin/env node
const arg = require("arg");

const main = async () => {
  const { _: commandsArgs } = arg({});

  const [module, ...commands] = commandsArgs;

  switch (module) {
    case "component:add-storybook": {
      await require("./component/add-storybook")(commands);
      break;
    }
  }

  switch (module) {
    case "component:new": {
      await require("./component/new.js")(commands);
      break;
    }
  }
};

main();
