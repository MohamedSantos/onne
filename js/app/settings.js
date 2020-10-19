$(() => {
    let lastRates = {}

    app.checkLogin()
        .then(user => {
            $('#country').val(user.country)
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

    $('#password-change').click(e => {
        e.preventDefault()

        app.formSend($(e.target), '/user/password', {}, 'PUT')
            .then(() => {
                // TODO show success message here
                //$('#modal-success').modal('show')
            })
            .catch(err => {
                // TODO show error message here
            })
    })

    $('#change-personal').click(e => {
        e.preventDefault()

        let pin = ''

        for(let i=1; i<=4; i++) {
            pin += $('#change-personal-pin-'+i).val()
        }

        app.apiPut('/user', {
            phone: $('#change-personal-phone').val(),
            pin
        })
            .then(() => {
                // TODO show success message here
            })
            .catch(err => {
                // TODO show error message here
            })
    })
})