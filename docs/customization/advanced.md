# Advanced Neutrino Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications
to the way your Neutrino preset is building your project. If you need more customization than can be afforded by
augmenting your project's package.json, consider using this advanced configuration guide to modify your build as
needed.

## Creating a project-specific preset

Neutrino configurations are backed by [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain/tree/v1.4.3), a library for
making modifications to a Webpack configuration using a fluent or chained API. When your project needs more advanced
build overrides, you will be interacting with this API in order to perform modifications.

First, we need to create a project-specific preset to make these changes. This can either be a JS file or a directory
with an `index.js` file. Since Neutrino uses Node.js and Webpack for interacting with presets, it is helpful to
understand that this is a Node.js module. By exporting a function from your module, you will be provided with a Neutrino
instance for modifying the build. Let's create a file called `neutrino-custom.js` in the root of our example project:

```js
// neutrino-custom.js
module.exports = neutrino => {
  // ...
};
```

At the moment our custom configurator isn't doing anything, but it does get us far enough to be able to tell Neutrino
to use it for additional configuration. Modify your package.json and add `neutrino-custom.js` as an additional preset.

_Note: Neutrino will attempt to load this module relative to the current working directory, which should be the root of
your project._

```json
{
  "config": {
    "presets": [
      "neutrino-preset-react",
      "neutrino-preset-karma",
      "neutrino-custom.js"
    ]  
  },
  "scripts": {
    "build": "neutrino build"
  }
}
```

Other than actually changing the config, that is all the setup necessary for Neutrino to pick up your custom changes.

## Configuring

The Neutrino instance provided to your custom configurator has a `config` property that is an instance of
[webpack-chain](https://github.com/mozilla-neutrino/webpack-chain/tree/v1.4.3). We won't go in-depth of all the configuration
possibilities here, but encourage you to check out the documentation for webpack-chain for instruction on your
particular use case.

This `neutrino.config` is an accumulation of all configuration set up to this moment. Every Neutrino preset interacts
with and makes changes through this config, which is all available to you. For example, if you are using the presets
`neutrino-preset-react` and `neutrino-preset-karma`, any options set can be extended, manipulated, or removed.

_Example: Neutrino's React preset adds `.jsx` as a module extension. Let's remove it._

```js
module.exports = neutrino => {
  neutrino.config.resolve.extensions.delete('.jsx');
};
```

_Example: Neutrino's Node.js preset uses `babel-preset-env` to support Node.js v6.9. Let's change it to support back to
v4.2. This preset has a rule named "compile" and a loader named "babel"._

```js
module.exports = neutrino => {
  neutrino.config.module
    .rule('compile')
      .loader('babel', ({ options }) => {
        options.presets[0][1].targets.node = 4.2;
        
        return { options };
      });
};
```

Presets can also have their own custom data in addition to the Neutrino config. See your respective preset for details.
Again, rather than reiterate the documentation for [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain/tree/v1.4.3) here,
please refer to its documentation for all ways you can modify a config instance to solve your use cases.
