# The Product Field App

A Force Field Analysis Tools for the Product Field Canvas.

## Development

### Prerequisite

- ```npm install webpack -g```
- ```npm install webpack-dev-server  -g```

### Run Development Server

- `cd PROJECT_DIR`
- `webpack-dev-server`
- visit `http://localhost:8080/`

### Datastructure

```
{
  editingEnergy: {id: 2, x: 0.5, y: 0.6, strength: 2},
  energies: [
    {id: 1, x: 0.8, y: -0.5, strength: 3},
    {id: 2, x: 0.5, y: 0.6, strength: 2}
  ]
}
```

use normalized coordinates, based on the center of the productfield.

### CSS Naming Conventions

Let's use [Suit CSS Naming Conventions](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md). Reuse reacts components names.

````
u-utilityName
ComponentName
ComponentName--modifierName
ComponentName-descendentName
ComponentName.is-stateOfComponent
```
