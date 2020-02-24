
var figure = {
    "data": [{
        "hoverlabel": {"namelength": 0},
        "hovertemplate": "credit_card=Amex<br>geo_loc=%{x}<br>memory_use=%{y}<br>time_lag=%{z}",
        "legendgroup": "credit_card=Amex",
        "marker": {"color": "#636efa", "symbol": "circle"},
        "mode": "markers",
        "name": "credit_card=Amex",
        "scene": "scene",
        "showlegend": true,
        "type": "scatter3d",
        x : [1.04, 1.74, 1.11, 1.19, 1.74, 2.32, 1.86, 1.09, 1.37, 1.33, 1.94, 1.58, 0.38, 0.49, 1.12, 1.56, 2.15, 0.76, 1.24, 1.5, 2.14, 1.41, 0.96, 1.86, 2.09, 1.74, 1.34, 0.85, 1.59, 2.07, 1.49, 1.11, 1.65, 1.26, 1.72, 1.51, 1.33, 1.37],
        y : [3.33, 2.79, 2.43, 2.79, 3.82, 3.9, 3.21, 3.37, 3.41, 3.39, 3.66, 3.72, 2.72, 2.59, 3.83, 4.24, 3.86, 2.67, 3.79, 3.42, 3.51, 3.65, 3.36, 3.45, 3.12, 2.94, 3.16, 3.29, 3.44, 2.84, 3.29, 3.44, 4.04, 4.51, 3.11, 3.27, 3.25, 3.47],
        z : [5.03, 4.66, 5.37, 4.64, 4.12, 5.26, 4.44, 4.73, 4.9, 4.49, 6.05, 3.62, 4.82, 4.38, 6.16, 5.86, 5.5, 5.36, 5.42, 5.17, 5.37, 5.7, 5.3, 5.05, 4.6, 5.31, 5.35, 5.15, 5.74, 4.24, 4.84, 5.31, 5.33, 5.11, 4.52, 4.61, 5.87, 4.89]
    }, {
        "hoverlabel": {"namelength": 0},
        "hovertemplate": "credit_card=Visa<br>geo_loc=%{x}<br>memory_use=%{y}<br>time_lag=%{z}",
        "legendgroup": "credit_card=Visa",
        "marker": {"color": "#EF553B", "symbol": "circle"},
        "mode": "markers",
        "name": "credit_card=Visa",
        "scene": "scene",
        "showlegend": true,
        "type": "scatter3d",
        x : [6.0388, 4.604, 3.5377, 3.8489, 4.0349, 4.8649, 4.8204, 2.9796, 5.141, 3.7849, 5.1596, 4.9272, 3.7742, 3.7862, 4.9563, 5.534, 4.0092, 4.7166, 4.2774, 1.542, 3.4033, 3.2797, 4.6726, 6.1938, 4.379, 3.3835, 4.1278, 5.9278, 4.6107, 4.7107, 3.4019, 2.9597, 4.2871, 5.6072, 4.7768, 6.99, 5.4355, 3.4872, 3.3859, 4.3203],
        y : [6.7837, 5.1696, 7.4402, 4.6403, 5.3783, 6.0075, 7.578, 4.6088, 8.0413, 4.734, 5.5742, 4.5146, 5.9089, 6.4847, 5.3114, 7.088, 4.1979, 5.816, 6.0486, 3.9717, 6.3938, 4.7978, 5.2955, 5.9296, 6.4868, 8.3409, 8.3025, 6.9095, 6.2517, 7.2604, 7.0208, 5.9659, 5.3063, 6.0993, 5.3818, 4.2189, 5.821, 6.1447, 3.7139, 5.6365],
        z : [3.2642, 2.7931, 2.309, 1.8521, 1.8997, 2.29, 2.8769, 2.2293, 4.9168, 2.5024, 1.7349, 3.1671, 1.6514, 4.7325, 3.322, 4.1737, 3.4857, 1.8821, 2.8932, 2.9772, 3.8003, 2.4873, 2.4895, 3.0716, 2.6871, 4.6955, 2.2186, 2.6528, 2.9577, 4.1929, 1.1686, 1.735, 2.9061, 1.8679, 2.0305, 3.4891, 3.6621, 4.4417, 1.0548, 1.5572]},
        {
        "hoverlabel": {"namelength": 0},
        "hovertemplate": "credit_card=Discover<br>requests=%{x}<br>memory=%{y}<br>time_lag=%{z}",
        "legendgroup": "credit_card=Discover",
        "marker": {"color": "#00cc96", "symbol": "circle"},
        "mode": "markers",
        "name": "credit_card=Discover",
        "scene": "scene",
        "showlegend": true,
        "type": "scatter3d",
        x: [6.0, 5.1, 5.9, 5.6, 5.8, 6.6, 4.5, 6.3, 5.8, 6.1, 5.1, 5.3, 5.5, 5.0, 5.1, 5.3, 5.5, 6.7, 6.9, 5.0, 5.7, 4.9, 6.7, 4.9, 5.7, 6.0, 4.8, 4.9, 5.6, 5.8, 6.1, 6.4],
        y: [3.3, 2.7, 3.0, 2.9, 3.0, 3.0, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3.0, 2.5, 2.8, 3.2, 3.0, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3.0, 2.8, 3.0, 2.8, 3.8],
        z: [6.3, 5.8, 7.1, 6.3, 6.5, 7.6, 4.9, 7.3, 6.7, 7.2, 6.5, 6.4, 6.8, 5.7, 5.8, 6.4, 6.5, 7.7, 7.7, 6.0, 6.9, 5.6, 7.7, 6.3, 6.7, 7.2, 6.2, 6.1, 6.4, 7.2, 7.4, 7.9]
    }], "layout": {
        "height": 800,
        "width" : 800,
        "legend": {
            "x": 1,
            "xanchor": 'right',
            "y": 1
        },
        autosize: false,
        margin: {
            l: 0,
            r: 0,
            b: 40,
            t: 0,
            pad: 20
        },
        "scene": {
            "domain": {"x": [0.0, 1.0], "y": [0.0, 1.0]},
            "xaxis": {"title": {"text": "requests"}},
            "yaxis": {"title": {"text": "memory"}},
            "zaxis": {"title": {"text": "time_lag"}}
        },
        "template": {
            "data": {
                "bar": [{
                    "error_x": {"color": "#2a3f5f"},
                    "error_y": {"color": "#2a3f5f"},
                    "marker": {"line": {"color": "#E5ECF6", "width": 0.5}},
                    "type": "bar"
                }],
                "barpolar": [{"marker": {"line": {"color": "#E5ECF6", "width": 0.5}}, "type": "barpolar"}],
                "carpet": [{
                    "aaxis": {
                        "endlinecolor": "#2a3f5f",
                        "gridcolor": "white",
                        "linecolor": "white",
                        "minorgridcolor": "white",
                        "startlinecolor": "#2a3f5f"
                    },
                    "baxis": {
                        "endlinecolor": "#2a3f5f",
                        "gridcolor": "white",
                        "linecolor": "white",
                        "minorgridcolor": "white",
                        "startlinecolor": "#2a3f5f"
                    },
                    "type": "carpet"
                }],
                "choropleth": [{"colorbar": {"outlinewidth": 0, "ticks": ""}, "type": "choropleth"}],
                "contour": [{
                    "colorbar": {"outlinewidth": 0, "ticks": ""},
                    "colorscale": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]],
                    "type": "contour"
                }],
                "contourcarpet": [{"colorbar": {"outlinewidth": 0, "ticks": ""}, "type": "contourcarpet"}],
                "heatmap": [{
                    "colorbar": {"outlinewidth": 0, "ticks": ""},
                    "colorscale": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]],
                    "type": "heatmap"
                }],
                "heatmapgl": [{
                    "colorbar": {"outlinewidth": 0, "ticks": ""},
                    "colorscale": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]],
                    "type": "heatmapgl"
                }],
                "histogram": [{"marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "histogram"}],
                "histogram2d": [{
                    "colorbar": {"outlinewidth": 0, "ticks": ""},
                    "colorscale": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]],
                    "type": "histogram2d"
                }],
                "histogram2dcontour": [{
                    "colorbar": {"outlinewidth": 0, "ticks": ""},
                    "colorscale": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]],
                    "type": "histogram2dcontour"
                }],
                "mesh3d": [{"colorbar": {"outlinewidth": 0, "ticks": ""}, "type": "mesh3d"}],
                "parcoords": [{"line": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "parcoords"}],
                "pie": [{"automargin": true, "type": "pie"}],
                "scatter": [{"marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "scatter"}],
                "scatter3d": [{
                    "line": {"colorbar": {"outlinewidth": 0, "ticks": ""}},
                    "marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}},
                    "type": "scatter3d"
                }],
                "scattercarpet": [{"marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "scattercarpet"}],
                "scattergeo": [{"marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "scattergeo"}],
                "scattergl": [{"marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "scattergl"}],
                "scattermapbox": [{"marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "scattermapbox"}],
                "scatterpolar": [{"marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}}, "type": "scatterpolar"}],
                "scatterpolargl": [{
                    "marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}},
                    "type": "scatterpolargl"
                }],
                "scatterternary": [{
                    "marker": {"colorbar": {"outlinewidth": 0, "ticks": ""}},
                    "type": "scatterternary"
                }],
                "surface": [{
                    "colorbar": {"outlinewidth": 0, "ticks": ""},
                    "colorscale": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]],
                    "type": "surface"
                }],
                "table": [{
                    "cells": {"fill": {"color": "#EBF0F8"}, "line": {"color": "white"}},
                    "header": {"fill": {"color": "#C8D4E3"}, "line": {"color": "white"}},
                    "type": "table"
                }]
            }, "layout": {
                width: "100%",
                length: "100%",
                "annotationdefaults": {"arrowcolor": "#2a3f5f", "arrowhead": 0, "arrowwidth": 1},
                "coloraxis": {"colorbar": {"outlinewidth": 0, "ticks": ""}},
                "colorscale": {
                    "diverging": [[0, "#8e0152"], [0.1, "#c51b7d"], [0.2, "#de77ae"], [0.3, "#f1b6da"], [0.4, "#fde0ef"], [0.5, "#f7f7f7"], [0.6, "#e6f5d0"], [0.7, "#b8e186"], [0.8, "#7fbc41"], [0.9, "#4d9221"], [1, "#276419"]],
                    "sequential": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]],
                    "sequentialminus": [[0.0, "#0d0887"], [0.1111111111111111, "#46039f"], [0.2222222222222222, "#7201a8"], [0.3333333333333333, "#9c179e"], [0.4444444444444444, "#bd3786"], [0.5555555555555556, "#d8576b"], [0.6666666666666666, "#ed7953"], [0.7777777777777778, "#fb9f3a"], [0.8888888888888888, "#fdca26"], [1.0, "#f0f921"]]
                },
                "colorway": ["#636efa", "#EF553B", "#00cc96", "#ab63fa", "#FFA15A", "#19d3f3", "#FF6692", "#B6E880", "#FF97FF", "#FECB52"],
                "font": {"color": "#2a3f5f"},
                "geo": {
                    "bgcolor": "white",
                    "lakecolor": "white",
                    "landcolor": "#E5ECF6",
                    "showlakes": true,
                    "showland": true,
                    "subunitcolor": "white"
                },
                "hoverlabel": {"align": "left"},
                "hovermode": "closest",
                "mapbox": {"style": "light"},
                "paper_bgcolor": "white",
                "plot_bgcolor": "#E5ECF6",
                "polar": {
                    "angularaxis": {"gridcolor": "white", "linecolor": "white", "ticks": ""},
                    "bgcolor": "#E5ECF6",
                    "radialaxis": {"gridcolor": "white", "linecolor": "white", "ticks": ""}
                },
                "scene": {
                    "xaxis": {
                        "backgroundcolor": "#E5ECF6",
                        "gridcolor": "white",
                        "gridwidth": 2,
                        "linecolor": "white",
                        "showbackground": true,
                        "ticks": "",
                        "zerolinecolor": "white",
                        automargin: true
                    },
                    "yaxis": {
                        "backgroundcolor": "#E5ECF6",
                        "gridcolor": "white",
                        "gridwidth": 2,
                        "linecolor": "white",
                        "showbackground": true,
                        "ticks": "",
                        "zerolinecolor": "white",
                        automargin: true
                    },
                    "zaxis": {
                        "backgroundcolor": "#E5ECF6",
                        "gridcolor": "white",
                        "gridwidth": 2,
                        "linecolor": "white",
                        "showbackground": true,
                        "ticks": "",
                        "zerolinecolor": "white",
                        automargin: true

                    }
                },
                "shapedefaults": {"line": {"color": "#2a3f5f"}},
                "ternary": {
                    "aaxis": {"gridcolor": "white", "linecolor": "white", "ticks": ""},
                    "baxis": {"gridcolor": "white", "linecolor": "white", "ticks": ""},
                    "bgcolor": "#E5ECF6",
                    "caxis": {"gridcolor": "white", "linecolor": "white", "ticks": ""}
                },
                "title": {"x": 0.05},
                "xaxis": {
                    "automargin": true,
                    "gridcolor": "white",
                    "linecolor": "white",
                    "ticks": "",
                    "title": {"standoff": 15},
                    "zerolinecolor": "white",
                    "zerolinewidth": 2
                },
                "yaxis": {
                    "automargin": true,
                    "gridcolor": "white",
                    "linecolor": "white",
                    "ticks": "",
                    "title": {"standoff": 15},
                    "zerolinecolor": "white",
                    "zerolinewidth": 2
                }
            }
        }
    }
}


// if this, then display that...
// figure.data[0].x = [13.03, 10.66, 7.37, 13.64, 11.12, 12.26, 7.44, 8.73, 12.9, 8.49, 7.05, 11.62, 5.82, 6.38, 12.16, 13.86, 12.5, 9.36, 13.42, 11.17, 8.37, 12.7, 11.3, 13.05, 6.6, 14.31, 6.35, 12.15, 12.74, 12.24, 10.84, 10.31, 15.33, 13.11, 9.52, 13.61, 8.87, 5.89]
// Plotly.newPlot('scatter-plot', figure.data, figure.layout, {displayModeBar: false});

