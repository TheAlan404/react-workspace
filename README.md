# @alan404/react-workspace

Infinitely pannable, accessible map-like workspace for React

## Installation

```
pnpm add @alan404/react-workspace
npm add @alan404/react-workspace
yarn add @alan404/react-workspace
```

## Features

- Infinite scroll/pan
- Mobile touch events support
- Zooming
- Uncontrolled and controlled state (`GlobalTransform` and `Transform`)
  - `TransformProvider` can have controlled or uncontrolled position
  - Elements inside `TransformProvider` can use `useTransform()` to change position

## Usage

See [example](./example/)

```tsx
import { Workspace, TransformProvider } from "@alan404/react-workspace";

const App = () => {
    return (
        <Workspace>
            <TransformProvider
                position={{ x: 25, y: 25 }}
            >
                <MyComponent />
            </TransformProvider>
        </Workspace>
    )
}
```
