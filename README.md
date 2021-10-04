# react-focused-key-handler

A key-handler that uses react context to create key handlers focused around a component.

## Status

| Branch | URL                                                           | Build Status                                                                                                                                                      |
| ------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main` | https://www.npmjs.com/package/@cala/react-focused-key-handler | [![Actions Status](https://github.com/ca-la/react-focused-key-handler/workflows/Node%20CI/badge.svg)](https://github.com/ca-la/react-focused-key-handler/actions) |

## Installation

`npm install @cala/react-focused-key-handler --save`

## Premise

This library solves the problem of overlapping keyhandlers in the global space when writing
complex keyboard functionality. It achieves this by creating 'Focus Contexts' or layers of keyboard
shortcuts that prevent fallthrough (unless specified)

## Usage

First around the border of the app add the context provider, we do this as part of our routing
component

```tsx
import KeyHandlerProvider from '../components/lib/key-handler/provider';

const Interactive = ({
  // ...
}: AllProps): JSX.Element => {
  // ...
  return {
    <Container>
      <KeyHandlerProvider>
        {/* Children here */}
      </KeyHandlerProvider>
    </Container>
  }
}
```

Next add `<FocusGroup>` components around the component boundries at the level which you need
them. This will prevent other groups from executing under it. Then children can add `<KeyHandler>` components without worrying about it.

```tsx
return (
  <App>
    <Provider>
      // At the layer boundry for this group of key handlers
      <FocusGroup>
        // In the children of the group add keyhandlers as needed.
        <KeyHandler triggers={[{ key: "Escape" }]} handler={handlerStub} />
      </FocusGroup>
    </Provider>
  </App>
);
```

## Releasing

We use a script that ensures we release from the `main` branch, and performs the correct `npm version` and `npm publish` steps. Here is an example:

```shell
# Assuming the current version is: 1.0.0

# bumps major and creates a release candidate, publishing it to the `next` npm tag
# new version: 2.0.0-rc.0
bin/release premajor next

# bumps patch, publishing it to the `latest` npm tag
# new version: 1.0.1
bin/release patch
```
