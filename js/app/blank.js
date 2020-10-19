$(() => {
    let lastRates = {},
        init = {
            rates: false,
            user: false,
            balances: false
        },
        charts = null

    const checkInit = () => {
        if (init.user && init.rates && !init.balances) {
            init.balances = true
            updateBalances()
            setInterval(() => {
                updateBalances()
            }, 60000)
        }
    }

    const updateRates = () => {
        app.apiGet('/rates')
            .then(rates => {
                for(let sym in rates) {
                    let dir = 0

                    if (lastRates[sym] === undefined) {
                        dir = 0
                    } else if (lastRates[sym] > rates[sym]) {
                        dir = -1
                    } else if (lastRates[sym] < rates[sym]) {
                        dir = 1
                    } else {
                        dir = 0
                    }

                    $('#quote-'+sym).text(sym+': $'+rates[sym]).removeClass('price-up price-down').addClass(dir > 0 ? 'price-up' : (dir < 0 ? 'price-down' : ''))

                    lastRates[sym] = rates[sym]
                }

                $('.user-rate-today').text((new Date).toLocaleString().split(' ')[0])

                init.rates = true
                checkInit()
            })
    }

    const updateChart = currency => {
        app.apiGet('/charts')
            .then(chartData => {
<<<<<<< HEAD
=======
                if (charts !== null) {
                    charts.destroy()
                    $('#charts-container').html('<canvas id="line-chart" style="height:100%; width:100%"></canvas>')
                }
>>>>>>> 6ba88dfad041b9d49f65c68d3274fd5fb7ff4dc7

                charts = new Chart(document.getElementById("line-chart"), {
                    type: 'line',
                    data: {
                        labels: chartData.labels,
                        datasets: [{
                            data: chartData[currency+'USD'],
                            label: currency,
                            fontColor: '#3e95cd',
                            borderColor: "#3e95cd",
                            fill: false,
                        }
                        ]
                    },
                    options: {
                        legend: {
                            display: false
                        },
                        responsive: false
                    }
                })
            })
    }

    const updateBalances = () => {
        let accountBalanceBTC = {
            BTC: app.data.user.deposit_BTC,
            BCH: app.data.user.deposit_BCH*lastRates['BCHBTC'],
            BTG: app.data.user.deposit_BTG*lastRates['BTGBTC'],
            TRX: app.data.user.deposit_TRX*lastRates['TRXBTC']
<<<<<<< HEAD
        },
            accountAvailableBTC = {
                BTC: app.data.user.balance_BTC,
                BCH: app.data.user.balance_BCH*lastRates['BCHBTC'],
                BTG: app.data.user.balance_BTG*lastRates['BTGBTC'],
                TRX: app.data.user.balance_TRX*lastRates['TRXBTC']
            }

        let accountBalanceUSD = {},
            accountAvailableUSD = {},
=======
        }

        let accountBalanceUSD = {},
>>>>>>> 6ba88dfad041b9d49f65c68d3274fd5fb7ff4dc7
            total = 0

        for (let n in accountBalanceBTC) {
            total += accountBalanceBTC[n]
            accountBalanceUSD[n] = accountBalanceBTC[n]*lastRates['BTCUSD']
<<<<<<< HEAD
            accountAvailableUSD[n] = accountAvailableBTC[n]*lastRates['BTCUSD']
=======
>>>>>>> 6ba88dfad041b9d49f65c68d3274fd5fb7ff4dc7
        }

        $('.user-balance_total_BTC').text(Number(total.toFixed(6)).toLocaleString())
        $('.user-balance_total_USD').text(Number((total * lastRates['BTCUSD']).toFixed(2)).toLocaleString())
        $('.user-balance_total_EUR').text(Number((total * lastRates['BTCUSD'] / lastRates['EURUSD']).toFixed(2)).toLocaleString())

        for(let n in accountBalanceUSD) {
            $('.user-balance_'+n+'USD').text(Number(accountBalanceUSD[n].toFixed(2)).toLocaleString())
        }

        let chart = new Chart(document.getElementById('myChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
<<<<<<< HEAD
                    data: [accountAvailableUSD.BTC, accountAvailableUSD.BCH, accountAvailableUSD.BTG, accountAvailableUSD.TRX],
=======
                    data: [accountBalanceUSD.BTC, accountBalanceUSD.BCH, accountBalanceUSD.BTG, accountBalanceUSD.TRX],
>>>>>>> 6ba88dfad041b9d49f65c68d3274fd5fb7ff4dc7
                    backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                        '#cc65fe',
                        "#fc9803"
                    ],
                    borderColor: ['#ff6384', '#36a2eb', '#cc65fe', "#fc9803"],
                }],
                labels: [
                    'BTC',
                    'BCH',
                    'BTG',
                    'TRX'
                ],

            },
            options: {
                legend: {
                    display: false
                },
                cutoutPercentage: 80
            }
        })
    }


    updateRates()
    updateChart('BTC')


    setInterval(updateRates, 60000)


    app.checkLogin()
        .then(() => {
            init.user = true
            checkInit()
        })
        .catch(() => {
            window.location = '/login.html'
        })


    $('#chart-cur').change(e => {
        updateChart($(e.target).val())
    })

    $('#go-bank').click(e => {
        e.preventDefault()

        window.location = '/bank.html'
    })

    $('#go-binary').click(e => {
        e.preventDefault()

        window.location = '/binary.html'
    })
})