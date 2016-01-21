const abs = Math.abs;

export default {

  LABELS: {
    context: [
        'goals',
        'motivations',
        'users',
        'customers',
        'distribution',
        'production',
        'enablers',
        'drivers'
      ],
    core: [
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
        y: 1
      },
      deg: 0
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
  CENTER_RADIUS: Math.sqrt(2).
  DOTS_IN_GRID: 21,
  DOTS_PER_SIDE: 10
  
}