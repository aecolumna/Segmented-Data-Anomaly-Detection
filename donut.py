def make_donut_javascript(all_transactions=None, anomalous_transactions=None):

    if all_transactions is None or anomalous_transactions is None:
        all_transactions = [5, 5, 1, 89]
        anomalous_transactions = [45.5, 45.5, 9.1]

    labels = ["Slow", "Very Slow", "Error"]
    labels2 = ["Slow", "Very Slow", "Error", "Normal"]

    groups_colors = ['yellow', 'orange', 'red']
    all_colors = groups_colors + ["RGB(90,187,71)"]

    import plotly.graph_objects as go
    from plotly.subplots import make_subplots

    # Create subplots: use 'domain' type for Pie subplot
    fig = make_subplots(rows=1, cols=2, specs=[[{'type': 'domain'}, {'type': 'domain'}]])

    fig.add_trace(go.Pie(labels=labels2, values=all_transactions, marker_colors=all_colors, name="Total Transactions",
                         pull=[.1, .1, .1, 0]),
                  1, 1)

    fig.add_trace(go.Pie(labels=labels, values=anomalous_transactions, marker_colors=groups_colors,
                         name="Breakdown of Anomalous Transactions"),
                  1, 2)

    # Use `hole` to create a donut-like pie chart
    fig.update_traces(hole=.4, hoverinfo="label+percent+name")

    fig.update_layout(
        title_text="Anomalous Problem Groups",
        # Add annotations in the center of the donut pies.
        annotations=[dict(text='Only anomalies', x=0.83, y=0.5, font_size=12, showarrow=False),
                     dict(text='Total', x=0.2, y=0.5, font_size=12, showarrow=False)])

    #     fig.show()

    js_file_str = "var figure = {data};\n\nPlotly.newPlot('andres-plot', figure.data, figure.layout, {{displayModeBar: false}});"


    with open('./appDynMockup/public/js/donut.js', 'w') as donut_file:
        donut_file.write(js_file_str.format(data=fig.to_json()))

if __name__ == "__self__":
    make_donut_javascript()