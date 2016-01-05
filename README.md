# The Product Field App

A Force Field Analysis Tools for the Product Field Canvas.

## Development

### Prerequisite

- `cd PROJECT_DIR`
- ```npm install```

### Run Development Server

- `cd PROJECT_DIR`
- `npm run devserver`
- visit `http://localhost:8080/`

### Run Illustrator Server

The illustrator server renders the product field as svg image. I will be used to create explaing images fpr the product field (e-)book.

- `webpack && node server`

### ComponentLibrary

To get a quick glance of the working parts in the renderer you can see them
working in the ComponentLibrary. To do so, visit `localhost:8080/component_library.html`.

### Datastructure of global app state

```
{
  editingEnergyId: '123',
  isPresentation: false,
  energies: [
    {id: '1', x: 0.8, y: -0.5, strength: 3, isMuted: true},
    {id: '2', x: 0.5, y: 0.6, strength: 2, isMuted: false}
  ],
  dragging: false,
}
```

use normalized coordinates, based on the center of the productfield,
which is at 0,0 in the middle of the stage.

### Component Structure

Components live in `src/components`. Each subcomponent live in a directory named after the parent component.
CSS files for the parent component also live in that directory.

Components are by design dump components, which means they can not alter themselves, but propagate user interactions to their parents.

The reducer and the action creators live in `src/state`. Also, the connected components, i.e. the components which can trigger actions and delegate the app state to their children live here. There is only one component connected with the state machine, that is ConnectedEditor. 

### CSS Naming Conventions

Let's use [Suit CSS Naming Conventions](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md). Reuse reacts components names.

````
u-utilityName
ComponentName
ComponentName--modifierName
ComponentName-descendentName
ComponentName.is-stateOfComponent
```
