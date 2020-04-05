var vgSpec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": width,
  "height": 300,
  "padding": 10,
  "autosize": "fit",

  "data": [
    {
      "name": "table",
      "url": "/d3/covid-impact/data/subway_citibike.csv",
      "format": {"type": "csv", "parse": "auto"},
    "transform": [
        {"type": "formula", "expr": "datum.date + ': ' + datum.value", "as": "tooltip"}
      ]
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ]
    }
  ],

  "scales": [
    {
      "name": "xscale",
      "type": "time",
      "domain": {"data": "table", "field": "date"},
      "range": "width",
      "padding": 0.5,
      "round": true
    },
    {
      "name": "yscale",
      "domain": {"data": "table", "field": "value"},
      "padding": 10,
      "nice": true,
      "range": "height"
    }
  ],

  "axes": [
    { 
      "orient": "bottom", 
      "scale": "xscale",
      "grid": true,
      "domain": false,
      "tickOpacity": 0,
      "tickCount": 10
    },
    { 
      "orient": "left", 
      "scale": "yscale",
      "grid": true,
      "domain": false,
      "tickSize": 0
    }
  ],

  "marks": [
        {
      "type": "line",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "interpolate": {"value": "linear"},
          "x": {"scale": "xscale", "field": "date"},
          "y": {"scale": "yscale", "field": "value"},
          "stroke": {"value": "#2b7551"},
          "strokeWidth": {"value": 2}
        }
      }
    },
    {
      "type": "symbol",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "x": {
            "scale": "xscale", 
            "field": "date"
          },
          "width": {"scale": "xscale", "band": 1},
          "y": {
            "scale": "yscale", 
            "field": "value"
          },
          "y2": {"scale": "yscale", "value": 0}
        },
        "update": {
          "stroke": {"value": "#2b7551"},
          "strokeWidth": {"value": 2},
          "fill": {"value": "white"},
          "size": {"value": 75}
        },
        "hover": {
          "fill": {"value": "#333333"},
          "strokeWidth": {"value": 0},
          "size": {"value": 300}
        }
      }
    },
    {
      "type": "text",
      "encode": {
        "enter": {
          "align": {"value": "center"},
          "baseline": {"value": "bottom"},
          "fill": {"value": "#333"}
        },
        "update": {
          "x": {"scale": "xscale", "signal": "tooltip.date"},
          "y": {"scale": "yscale", "signal": "tooltip.value"},
          "text": {"signal": "tooltip.value"},
          "fillOpacity": [
            {"test": "datum === tooltip", "value": 0},
            {"value": 1}
          ]
        }
      }
    }
  ]
};

var opt = {
  actions: false
};


vegaEmbed('#vis', vgSpec, opt);


