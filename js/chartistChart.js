var lineGradientChart1 = new Chartist.Line('#gradient-line-chart1', {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
        [175, 600, 190, 230, 100, 225, 500]
    ]
}, {
        lineSmooth: Chartist.Interpolation.simple({
            divisor: 2
        }),
        fullWidth: true,
        showArea: true,
        chartPadding: {
            right: 1
        },
        axisX: {
            showGrid: false
        },
        axisY: {               
            scaleMinSpace: 40
        },
        low: 0,
        onlyInteger: true,
    });
lineGradientChart1.on('created', function (data) {
    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    defs.elem('linearGradient', {
        id: 'lineLinear1',
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
    }).elem('stop', {
        offset: '0%',
        'stop-color': 'rgba(250,116,137,0.1)'
    }).parent().elem('stop', {
        offset: '10%',
        'stop-color': 'rgba(250,116,137,1)'
    }).parent().elem('stop', {
        offset: '80%',
        'stop-color': 'rgba(173,86,241, 1)'
    }).parent().elem('stop', {
        offset: '98%',
        'stop-color': 'rgba(173,86,241, 0.1)'
    });

    return defs;


}).on('draw', function (data) {
    var circleRadius = 10;
    if (data.type === 'point') {
        var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            'ct:value': data.y,
            r: circleRadius,
            class: 'ct-point-circle-transperent'
        });
        data.element.replace(circle);
    }
    if (data.type === 'line') {
        data.element.animate({
            d: {
                begin: 1000,
                dur: 1000,
                from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
            }
        });
    }
});