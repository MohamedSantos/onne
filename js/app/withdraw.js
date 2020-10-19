$(() => {
    let lastRates = {},
        currency = 'BTC',
        amount = 0,
        wallet = ''

    app.checkLogin()
        .then(() => {

        })
        .catch(() => {
            window.location = '/login.html'
        })

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
            })
    }

    updateRates()
    setInterval(updateRates, 30000)

    const updateBalances = () => {
        $('#current-balance').text(app.data.user['balance_'+currency])
        $('.currency').text(currency)
    }

    updateBalances()

    $('#currency').change(e => {
        currency = $(e.target).val()

        updateBalances()
    })

    $('#amount').on('keyup', e => {
        amount = parseFloat($(e.target).val())

        if (isNaN(amount)) {
            amount = 0
        }

        $('.amount').text(amount)
        $('.receive').text(amount * 0.98)
    })

    $('#wallet').on('change', e => {
        wallet = $(e.target).val()

        $('.wallet').text(wallet)
    })

    $('#wallet').on('keyup', e => {
        wallet = $(e.target).val()

        $('.wallet').text(wallet)
    })

    $('.today').text((new Date()).toISOString().split('T').join(' ').split('.')[0])

    $('#send-withdrawal').click(() => {
        if (amount * lastRates[currency+'USD'] < 30) {
            return
        }

        let pin = $('#pin-1').val()+$('#pin-2').val()+$('#pin-3').val()+$('#pin-4').val()

        let data = {
            currency,
            amount,
            wallet,
            pin
        }

        app.apiPost('/transactions', data)
            .then(() => {
                // TODO show success message here
            })
            .catch(err => {
                // TODO show error message here
            })
    })
})