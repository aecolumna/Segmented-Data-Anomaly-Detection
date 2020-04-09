function formFigureDataNoSize(name, color, count, x, y, ringColor, fix, size=20) {
    return {
        "hoverlabel": {"namelength": 0},
        "hovertemplate": "anomaly=" + name + "<br>time=%{x}<br>responsetime=%{y}",
        "legendgroup": "anomaly=" + name,
        "marker": {
            "color": color,
            "size": size,
            "sizemode": "area",
            "sizeref": 0.0011029411764705876,
            "symbol": "circle",
            "line": {
                "color": ringColor,
                "width": 2
            }
        },
        "mode": "markers",
        "name": "<br>" + name + "<br>Quantity: " + count,
        "showlegend": true,
        "type": "scatter",
        "x": x,
        "xaxis": "x",
        "y": y,
        "yaxis": "y"
    };

}

function queryBody(features, thresholds) {
    var qstr = '';
    var s = "";
    for (var i = 0; i < features.length - 1; i++) {
        if (thresholds[i].length < 2) {
            qstr += s + features[i] + " == " + thresholds[i][0];
        }
        else {
            qstr += s + features[i] + " >= " + thresholds[i][0] + " AND " + s + features[i] + " <= " + thresholds[i][1];
        }
        qstr += " AND ";
    }
    if (thresholds[i].length < 2) {
        qstr += s + features[i] + " == " + thresholds[i][0];
    }
    else {
        qstr += s + features[i] + " >= " + thresholds[i][0] + " AND " + s + features[i] + " <= " + thresholds[i][1];
    }
    var link = "./testAnalytics?key=" + qstr;
    document.getElementById('redirectButton').href = link;
}

function radioSet(mljson,prefix,featureset) {
    var str = '';

    for (var i = 0; i < featureset.length; i++) {
        str += '<button class="btn btn-info" onclick="addLoadEvent(mljson , prefix, i)" id="paramsButton" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-download fa-sm text-white-50"></i> Inspect ' + featureset[i] + ' </button>';
    }
    document.getElementById('idxButtons').innerHTML = str;
}

function reformAlts(id, mljsonstr, prefix, idx) {
    //console.log(mljsonstr);
    var mljson = mljsonstr;//JSON.parse(mljsonstr);
    var leng = mljson[prefix].features.length;

    var features = mljson[prefix].features[idx];
    var thresholds = mljson[prefix].thresholds[idx];

    queryBody(features,thresholds);

    var featureset = mljson[prefix].features;

    //radioSet(mljsonstr,prefix,featureset);

    var pName = features[0];
    for (var i = 1; i < mljson[prefix].features[0].length; i++) {
        pName += " + " + mljson[prefix].features[0][i];
    }

    var recall = mljson[prefix].recall[idx];
    var precision = mljson[prefix].precision[idx];
    var f1 = mljson[prefix].f1_score[idx];
    var accuracy = mljson[prefix].accuracy[idx];

    var diagnosis = "<p>Transactions with the following attributes:</p>";

    for (i = 0; i < features.length; i++) {
        diagnosis += "<p>" + features[i];
        if (thresholds[i].length < 2) {
            diagnosis += " equal to " + thresholds[i];
        }
        else {
            diagnosis += " in inclusive range " + thresholds[i];
        }
        diagnosis += "</p>";
    }

    diagnosis += "<br><p>Have the following relationships to being " + prefix + "</p>";
    document.getElementById("zip_code_text").innerHTML = diagnosis;


    // document.getElementById('featuresets').innerHTML = diagnosis;
    document.getElementById("recall_text").innerText = "Recall = " + recall;
    document.getElementById("precision_text").innerText = "Precision = " + precision;
    document.getElementById("f1_text").innerText = "F1 score = " + f1;
    document.getElementById("accuracy_text").innerText = "Accuracy= " + accuracy;
//*/
    var names = [
        "Captured anomalies",
        "Missed anomalies",
        "False positives",
        "Normal"];

/*/
    var names = [
        prefix + " (True positive)",
        "Other anomaly (True negative)",
        "Other anomaly (False positive)",
        "Normal (False Positive)",
        prefix+" (False Negative)",
        "Normal (True negative)"];
/**/
    var counts = [
        mljson[prefix].true_p_count[idx] + mljson[prefix].false_p_other_anomaly_count[idx],
        mljson[prefix].true_n_other_anomaly_count[idx] + mljson[prefix].false_n_count[idx],
        mljson[prefix].false_p_norm_count[idx],
        mljson[prefix].true_n_norm_count[idx]
    ];
    if (prefix == "slow") {
        var bandColor = "rgba(255,255,0,0.5)";
        var ringColor = "rgba(255,255,0,1)";
    }
    else if (prefix == "very_slow") {
        bandColor = "rgba(255,125,0,0.5)";
        ringColor = "rgba(255,125,0,1)";
    }
    else if (prefix == "error") {
        bandColor = "rgba(255,0,0,0.5)";
        ringColor = "rgba(255,0,0,1)";
    }


    var colors = [
        "rgba(225,125,0,0.5)",
        "rgba(160,160,160,0.5)",
        "rgba(255,0,0,0.5)",
        "rgba(0,255,0,0.5)",
        bandColor,
        "green"];



    var arrX = [
        mljson[prefix].true_p_x[idx].concat(mljson[prefix].false_p_other_anomaly_x[idx]),
        mljson[prefix].true_n_other_anomaly_x[idx].concat(mljson[prefix].false_n_x[idx]),
        mljson[prefix].false_p_norm_x[idx],
        mljson[prefix].true_n_norm_x[idx]
    ];

    var arrY = [
        mljson[prefix].true_p_y[idx].concat(mljson[prefix].false_p_other_anomaly_y[idx]),
        mljson[prefix].true_n_other_anomaly_y[idx].concat(mljson[prefix].false_n_y[idx]),
        mljson[prefix].false_p_norm_y[idx],
        mljson[prefix].true_n_norm_y[idx]
    ];

    var figure = {
        "data": [
            /*
            formFigureDataNoSize(names[0],colors[0],counts[0],arrX[0],arrY[0],"black"),
            formFigureDataNoSize(names[4],colors[4],counts[4],arrX[4],arrY[4],"green"),
            formFigureDataNoSize(names[1],colors[1],counts[1],arrX[1],arrY[1],"black"),
            formFigureDataNoSize(names[2],colors[1],counts[2],arrX[2],arrY[2],ringColor),
            formFigureDataNoSize(names[5],colors[5],counts[5],arrX[5],arrY[5],"green",7),
            formFigureDataNoSize(names[3],colors[3],counts[3],arrX[3],arrY[3],ringColor)],
             */
            formFigureDataNoSize(names[0],colors[0],counts[0],arrX[0],arrY[0],"black",''),
            formFigureDataNoSize(names[1],colors[1],counts[1],arrX[1],arrY[1],"black",'1'),
            formFigureDataNoSize(names[3],colors[5],counts[3],arrX[3],arrY[3],"green",'2', 7),
            formFigureDataNoSize(names[2],colors[2],counts[2],arrX[2],arrY[2],"black",'3')],
        "layout": {
            "height": 600,
            "margin": {
                "l": 0,
                "r": 0,
                "b": 30,
                "t": 30
            },
            "legend": {"itemsizing": "constant", "tracegroupgap": 0},
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
                    width: 1230,

                    margin: {
                        l: 0,
                        r: 0,
                        b: 30,
                        t: 30,
                        pad: 4
                    },
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
                            "zerolinecolor": "white"
                        },
                        "yaxis": {
                            "backgroundcolor": "#E5ECF6",
                            "gridcolor": "white",
                            "gridwidth": 2,
                            "linecolor": "white",
                            "showbackground": true,
                            "ticks": "",
                            "zerolinecolor": "white"
                        },
                        "zaxis": {
                            "backgroundcolor": "#E5ECF6",
                            "gridcolor": "white",
                            "gridwidth": 2,
                            "linecolor": "white",
                            "showbackground": true,
                            "ticks": "",
                            "zerolinecolor": "white"
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
            },
            "title": {"text": "<b>Proportion of Problems and Probable Causes</b>"},
            "xaxis": {"anchor": "y", "domain": [0.0, 1.0], "title": {"text": "Time (hour/day)"}},
            "yaxis": {"anchor": "x", "domain": [0.0, 1.0], "title": {"text": "Response Time (ms)"}}
        }

    };

    Plotly.newPlot(id, figure.data, figure.layout, {displayModeBar: false});
}