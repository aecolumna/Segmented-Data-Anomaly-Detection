


function formFigureData(name, color, percent, x, y) {
    return {
        "hoverlabel": {"namelength": 0},
        "hovertemplate": "anomaly=" + name + "<br>time=%{x}<br>responsetime=%{y}<br>proportion="+percent,
        "legendgroup": "anomaly=" + name,
        "marker": {
            "color": color,
            "size": percent,
            "sizemode": "area",
            "sizeref": 0.0011029411764705876,
            "symbol": "circle",
            "line": {
                "color": "black",
                "width": 2
            }
        },
        "mode": "markers",
        "name": percent + ": " + name,
        "showlegend": true,
        legend: {
            x: .5,
            xanchor: 'right',
            y: .5
        },
        "type": "scatter",
        "x": x,
        "xaxis": "x",
        "y": y,
        "yaxis": "y",

    };
}

function reformIndex(id, mljsonstr) {
    //console.log(mljsonstr);
    var mljson = mljsonstr;//JSON.parse(mljsonstr);
    var prefix = ['slow','very_slow','error'];
    function prepBand(item,index) {
        console.log(item);
        console.log(index);
    }
    prefix.forEach(prepBand);
    var percents = [
        mljson.homepage.slow_percent * 100,
        mljson.homepage.very_slow_percent * 100,
        mljson.homepage.error_percent * 100,
        1 - mljson.homepage.anomalous_percent * 100
    ];

    var slowName = mljson.slow.features[0][0];
    for (var slowi = 1; slowi < mljson.slow.features[0].length; slowi++) {
        slowName += " + " + mljson.slow.features[0][slowi];
    }

    var veryslowName = mljson.very_slow.features[0][0];
    for (var veryslowi = 1; veryslowi < mljson.very_slow.features[0].length; veryslowi++) {
        veryslowName += " + " + mljson.very_slow.features[0][veryslowi];
    }

    var errName = mljson.error.features[0][0];
    for (var erri = 1; erri < mljson.error.features[0].length; erri++) {
        errName += " + " + mljson.error.features[0][erri];
    }
    var names = [slowName,veryslowName,errName];
    var colors = ["rgba(255,0,0,0.5)","rgba(255,125,0,0.5)","rgba(255,255,0,0.5)"];
    var xVals = [mljson.homepage.slow_x,mljson.homepage.very_slow_x,mljson.homepage.error_x];

    var yVals = [mljson.homepage.slow_y,mljson.homepage.very_slow_y,mljson.homepage.error_y];
/*
    document.getElementById('slowButton').innerHTML = names[0];
    document.getElementById('veryslowButton').innerHTML = names[1];
    document.getElementById('errorButton').innerHTML = names[2];

    document.getElementById('slowSpan').innerHTML = percents[0];
    document.getElementById('veryslowSpan').innerHTML = percents[1];
    document.getElementById('errorSpan').innerHTML = percents[2];

    document.getElementById('slowBar').style.cssText = "width: " + percents[0] + "%";
    document.getElementById('veryslowBar').style.cssText = "width: " + percents[1] + "%";
    document.getElementById('errorBar').style.cssText = "width: " + percents[2] + "%";
*/
    var figure = {
        "data": [
            formFigureData(names[0],colors[2],percents[0],xVals[0],yVals[0]),
            formFigureData(names[1],colors[1],percents[1],xVals[1],yVals[1]),
            formFigureData(names[2],colors[0],percents[2],xVals[2],yVals[2]),
            {
            "hoverlabel": {"namelength": 0},
            "hovertemplate": "anomaly=Normal<br>time=%{x}<br>responsetime=%{y}",
            "legendgroup": "anomaly=Normal",
            "marker": {
                "color": "green",
                "size": [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05],
                "sizemode": "area",
                "sizeref": 0.0011029411764705876,
                "symbol": "circle"
            },
            "mode": "markers",
            "name": mljson.homepage.normal_x.length +" Normal transactions",
            "showlegend": true,
            "type": "scatter",
            "x": mljson.homepage.normal_x,
            "xaxis": "x",
            "y": mljson.homepage.normal_y,
            "yaxis": "y"
        }], "layout": {
            "height": 600,
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
                    'width': '1530',

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
    }

    Plotly.newPlot(id, figure.data, figure.layout, {displayModeBar: false});
}