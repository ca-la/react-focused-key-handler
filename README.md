# react-focused-key-handler

A key-handler that uses react context to create key handlers focused around a component.

## Premise

This library solves the problem of overlapping keyhandlers in the global space when writing
complex keyboard functionality. It achieves this by creating 'Focus Contexts' or layers of keyboard
shortcuts that prevent fallthrough (unless specified)

## Usage

First around the border of the app add the context provider, we do this as part of our routing
component

```ts
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

```ts
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
    <Modal onRequestClose={jest.fn()}>
      <p>Nothing</p>
    </Modal>
  </FocusGroup>
</App>
```
