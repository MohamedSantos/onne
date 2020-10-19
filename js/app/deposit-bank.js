$(() => {
    let lastRates = {},
        activeCurrency = 'BTC'

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

    $('#currency').change(e => {
        activeCurrency = $(e.target).val()

        $('#payment-box').hide()

        $('.currency').text(activeCurrency)
        $('.currency-name').text(({
            BTC: 'Bitcoin',
            BCH: 'Bitcoin Cash',
            BTG: 'Bitcoin Gold',
            TRX: 'Tron'
        })[activeCurrency])

        let am = parseFloat($('#payment-amount').val())

        if (isNaN(am)) {
            am = 0
        }

        $('.currency-amount').text((am / lastRates[activeCurrency+'USD']).toFixed(6))
    })

    $('#payment-amount').keyup(e => {
        let am = parseFloat($(e.target).val())

        if (isNaN(am)) {
            am = 0
        }

        $('#payment-box').hide()

        $('.currency-amount').text((am / lastRates[activeCurrency+'USD']).toFixed(6))
    })

    $('#get-wallet').click(() => {
        if ($('#payment-amount').val() < 30) {
            return
        }

        app.apiGet('/psp/nax/wallet', {
            currency: activeCurrency
        })
            .then(wallet => {
                if (!wallet.wallet) {
                    return
                }

                $('html, body').animate({ scrollTop: $(document).height() }, 1000)

                $('#payment-box').show()

                $('.address').text(wallet.wallet)
                $('.address-qr').attr('src', 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl='+wallet.wallet)
            })
    })
})