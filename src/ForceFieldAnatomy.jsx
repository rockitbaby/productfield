const abs = Math.abs;

export default {

  QUADRANTS: [
    {
      name: 'value',
      labels: ['motivation', 'users', 'problem'],
      coefficient: {
        x: 1,
        y: 1
      }
    },
    {
      name: 'market',
      labels: ['distribution', 'customers', 'competitors'],
      coefficient: {
        x: 1,
        y: -1
      }
    },
    {
      name: 'ressources',
      labels: ['production', 'enablers', 'solution'],
      coefficient: {
        x: -1,
        y: -1
      }
    },
    {
      name: 'idea',
      labels: ['goals', 'drivers', 'uniqueness'],
      coefficient: {
        x: -1,
        y: 1
      }
    }
  ]
  
}