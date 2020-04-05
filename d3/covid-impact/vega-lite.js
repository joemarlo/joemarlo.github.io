

// Assign the specification to a local variable vlSpec.
      var vgSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        data: {url: "/d3/covid-impact/data/subway_citibike.csv"},
        mark: {
          "type": "line", 
          "point": true
        },
        encoding: {
          x: {
            timeUnit: 'yearmonthday',
            field: 'date',
            type: 'temporal',
            title: ''
            },
          y: {
            aggregate: "mean",
            field: "value",
            type: "quantitative",
            title: 'Subway ridership in millions'
          }
        }
      };

var opt = {
  actions: false,
  theme: 'vox',
  width: 600,
  height: 300,
  padding: 10,
}

// Embed the visualization in the container with id `vis`
vegaEmbed('#vis', vgSpec, opt);


