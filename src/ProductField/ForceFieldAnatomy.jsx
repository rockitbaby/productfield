const abs = Math.abs;

/*

  T               |_*
3               +-
  |           +-
  +--------+-+
  |        |
5 |  CORE  | CONTEXT
  |        |
  °--------+- - -|- -
       5      3    2

---

LEGEND:

°: CENTER
*: CHARACTER

the product field is based on a central symmetry
around the center

*/
export default {

  DOTS_IN_GRID: 21,
  DOTS_PER_SIDE: 10,
  ARROWS_PER_SIDE: 15,
  CORE_WIDTH: 5,
  CONTEXT_WIDTH: 8,
  CONTEXT_MARKER_SIZE: 0.5,
  CENTER_RADIUS: Math.sqrt(2),
  LABELS: {
    context: [ // starting top-left, clockwise
        'goals',
        'motivations',
        'users',
        'customers',
        'distribution',
        'production',
        'enablers',
        'drivers'
      ],
    core: [ // starting top-right, crosshatch
        'problem',
        'solution',
        'uniqueness',
        'competition'
      ]
  },
  QUADRANTS: [
    {
      name: 'value',
      labels: ['motivations', 'users', 'problem'],
      coefficient: {
        x: 1,
        y: 1,
      },
      deg: 0,
    },
    {
      name: 'market',
      labels: ['distribution', 'customers', 'competition'],
      coefficient: {
        x: 1,
        y: -1
      },
      deg: 90
    },
    {
      name: 'ressources',
      labels: ['production', 'enablers', 'solution'],
      coefficient: {
        x: -1,
        y: -1
      },
      deg: 180
    },
    {
      name: 'idea',
      labels: ['goals', 'drivers', 'uniqueness'],
      coefficient: {
        x: -1,
        y: 1
      },
      deg: 270
    }
  ],
};
