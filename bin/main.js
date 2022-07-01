#!/usr/bin/env node
const arg = require("arg");
const selectCommandComponent = require("./component");

const main = () => {
  const { _: commandsArgs } = arg({});

  const [module, ...commands] = commandsArgs;

  switch (module) {
    case "component": {
      selectCommandComponent(commands);
      break;
    }
    
    case "create-app": {
      console.log("---create-app")
      break;
    }
  }
};

main();
