$(() => {
    $('#send-login').click(e => {
        e.preventDefault()

        app.login($('[data-field=email]').val(), $('[data-field=password]').val())
            .then(() => {
                window.location = '/blank.html'
            })
            .catch(() => {
                $('[data-field=email]').css('border', '1px solid red').one('focus', e => {
                    $('[data-field=email]').css('border', 'none')
                    $('[data-field=password]').css('border', 'none')
                })
                $('[data-field=password]').css('border', '1px solid red').one('focus', e => {
                    $('[data-field=email]').css('border', 'none')
                    $('[data-field=password]').css('border', 'none')
                })
            })
    })

    app.checkLogin()
        .then(() => {
            window.location = '/blank.html'
        })
        .catch(() => {})
})