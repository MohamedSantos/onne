$(() => {
    let lastRates = {},
        init = {
            rates: false,
            user: false,
            balances: false
        },
        balanceUSD = 0,
        activeCurrency = 'USD'

    const transTypes = {
        0: 'Regular',
        1: 'Deposit',
        2: 'Withdrawal',
        3: 'Payout'
    }

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

    const updateBalances = () => {
        let accountBalanceBTC = {
            BTC: app.data.user.balance_BTC,
            BCH: app.data.user.balance_BCH*lastRates['BCHBTC'],
            BTG: app.data.user.balance_BTG*lastRates['BTGBTC'],
            TRX: app.data.user.balance_TRX*lastRates['TRXBTC']
        }

        let accountBalanceUSD = {},
            total = 0

        for (let n in accountBalanceBTC) {
            total += accountBalanceBTC[n]
            accountBalanceUSD[n] = accountBalanceBTC[n]*lastRates['BTCUSD']
        }

        $('.user-balance_total_BTC').text(Number(total.toFixed(6)).toLocaleString())
        $('.user-balance_total_EUR').text(Number((total * lastRates['BTCUSD'] / lastRates['EURUSD']).toFixed(2)).toLocaleString())

        balanceUSD = Number((total * lastRates['BTCUSD']).toFixed(2))

        $('.user-balance_total_USD').text(Number((balanceUSD / lastRates[activeCurrency+'USD']).toFixed(2)).toLocaleString())

        for(let n in accountBalanceUSD) {
            $('.user-balance_'+n+'USD').text(Number(accountBalanceUSD[n].toFixed(2)).toLocaleString())
        }

<<<<<<< HEAD
        let renewal = []

        for(let n in accountBalanceBTC) {
            renewal.push(n+': '+(app.data.user['progress_'+n] * (app.data.user.direct_referrals_qual >= 4 ? 0.33333 : 0.5)).toFixed(6))
        }

        $('.user-renewal').text(renewal.join(' | '))

=======
>>>>>>> 6ba88dfad041b9d49f65c68d3274fd5fb7ff4dc7
        let chart = new Chart(document.getElementById('myChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [accountBalanceUSD.BTC, accountBalanceUSD.BCH, accountBalanceUSD.BTG, accountBalanceUSD.TRX],
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

    const updateTransactions = (type = 0, limit = 10, offset = 0) => {
        app.apiGet('/transactions', {
            type,
            limit,
            offset
        })
            .then(trans => {
                let html = ''

                for(let n in trans.rows) {
                    html += `<tr>
                            <td>${new Date(trans.rows[n].time*1000).toLocaleString()}</td>
                            <td>${transTypes[trans.rows[n].type]}</td>
                            <td style="color: #27c512">${trans.rows[n].amount > 0 ? trans.rows[n].currency+' '+trans.rows[n].amount : ''}</td>
                            <td style="color: #dd1d1d">${trans.rows[n].amount < 0 ? trans.rows[n].currency+' '+trans.rows[n].amount : ''}</td>
                            <td>${trans.rows[n].balance_after}</td>
                          </tr>`
                }

                $('#transactions').html(html)

                let cont = $('.paginate')

                cont.html('')

                let page = 1
                for(let i=0; i<trans.count; i+=10) {
                    let el = $('<li data-offset="' + (i+1) + '">' + page + '</li>')
                    page++
                    el.click(e => {
                        e = $(e.target)

                        updateTransactions(type, 10, e.data('offset'))
                    })

                    cont.append(el)
                }
            })
    }

    const updateChart = () => {
        app.apiGet('/transactions/chart')
            .then(chartData => {
                let charts = new Chart(document.getElementById("line-chart"), {
                    type: 'line',
                    data: {
                        labels: chartData.labels,
                        datasets: [{
                            data: chartData.vals,
                            label: 'BTC',
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

    updateRates()
    setInterval(updateRates, 30000)

    app.checkLogin()
        .then(() => {
            init.user = true

            checkInit()
            updateTransactions()
            updateChart()
        })
        .catch(() => {
            window.location = '/login.html'
        })

    $('#filter-trans').click(() => {
        updateTransactions($('#trans-type').val())
    })

    $('#account-currency-display').change(e => {
        activeCurrency = $(e.target).val()

        $('.user-balance_total_USD').text(Number((balanceUSD / lastRates[activeCurrency+'USD']).toFixed(2)).toLocaleString())
    })
})