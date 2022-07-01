const selectCommandComponent = async (commands) => {
  const [activity, ...props] = commands;

  switch (activity) {
    case "add-storybook": {
      await require("./add-storybook")(props);
      break;
    }
  }
};

module.exports = selectCommandComponent;
