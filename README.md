# react-focused-key-handler

A key-handler that uses react context to create key handlers focused around a component.

## Status

| Branch   | URL                                              | Build Status                                                                                                                                |
| -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `master` | https://www.npmjs.com/package/@cala/react-focused-key-handler | [![Actions Status](https://github.com/ca-la/react-focused-key-handler/workflows/Node+CI/badge.svg)](https://github.com/ca-la/react-focused-key-handler/actions) |



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
      // ...
      <KeyHandlerProvider />
    </Container>
  }
}
```

Next add `<FocusGroup>` components around the component boundries at the level which you need
them. This will prevent other groups from executing under it. Then children can add `<KeyHandler>` components without worrying about it.

```tsx
return (
  <App>
    // At the base of the app
    <Provider />
    // At the layer boundry for this group of key handlers
    <FocusGroup>
      // In the children of the group add keyhandlers as needed.
      <KeyHandler
        eventType={EventType.Keydown}
        triggers={[{ key: 'Escape' }]}
        handler={handlerStub}
      />
    </FocusGroup>
  </App>
)
```

## Contributing

To tag off and release a new version to npm, run the release script:

```
$ ./bin/release patch    # 0.0.x - bug fixes
$ ./bin/release minor    # 0.x.0 - new features or changes
$ ./bin/release major    # x.0.0 - large, backwards-incompatible changes
```
