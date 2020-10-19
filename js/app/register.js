$(() => {
    let ref = app.getUrlParam('ref')

    if (ref) {
        $('[data-field=referrer]').val(ref)
    }

    $('#submit').click(e => {
        e.preventDefault()

        let fields = {}

        $.each($('[data-field]'), (i, el) => {
            el = $(el)

            let val = el.val()

            if (val === 'on') {
                val = el.is(':checked')
            }

            fields[el.data('field')] = val
        })

        let valid = true

        if (fields['firstname'].length < 1) {
            $('[data-field=firstname]').css('border', '1px solid red').one('focus', e => {
                $(e.target).css('border', 'none')
            })

            valid = false
        }

        if (fields['lastname'].length < 1) {
            $('[data-field=lastname]').css('border', '1px solid red').one('focus', e => {
                $(e.target).css('border', 'none')
            })

            valid = false
        }

        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fields['email'])) {
            $('[data-field=email]').css('border', '1px solid red').one('focus', e => {
                $(e.target).css('border', 'none')
            })

            valid = false
        }

        if (fields['email'] !== fields['email-confirm']) {
            $('[data-field=email-confirm]').css('border', '1px solid red').one('focus', e => {
                $(e.target).css('border', 'none')
            })

            valid = false
        }

        if (fields['password'].length < 6) {
            $('[data-field=password]').css('border', '1px solid red').one('focus', e => {
                $(e.target).css('border', 'none')
            })

            valid = false
        }

        if (fields['password'] !== fields['password-confirm']) {
            $('[data-field=password-confirm]').css('border', '1px solid red').one('focus', e => {
                $(e.target).css('border', 'none')
            })

            valid = false
        }

        for(let i=1; i<5; i++) {
            let p = parseInt(fields['pin-'+i])
            if (isNaN(p)) {
                $('.input-pin').css('border', '1px solid red').one('focus', e => {
                    $('.input-pin').css('border', 'none')
                })

                valid = false
            }
        }

        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fields['email'])) {
            $('[data-field=referrer]').css('border', '1px solid red').one('focus', e => {
                $(e.target).css('border', 'none')
            })

            valid = false
        }

        for(let i=1; i<4; i++) {
            if (!fields['terms-'+i]) {
                $('[data-field=terms-'+i+']').css('border', '1px solid red').one('click', e => {
                    $(e.target).css('border', 'none')
                })
            }
        }

        if (!valid) {
            $(window).scrollTop(0)

            return
        }

        app.apiPost('/users', fields)
            .then(() => {
<<<<<<< HEAD
                window.location = '/login.html'
=======
                //window.location = '/login.html'
>>>>>>> 6ba88dfad041b9d49f65c68d3274fd5fb7ff4dc7
            })
            .catch(err => {
                if (err === 'USER_REGISTERED') {
                    $('[data-field=email]').css('border', '1px solid red').one('focus', e => {
                        $(e.target).css('border', 'none')
                    })
                    $(window).scrollTop(0)
                    return
                }

                if (err === 'INVALID_REFERRER') {
                    $('[data-field=referrer]').css('border', '1px solid red').one('focus', e => {
                        $(e.target).css('border', 'none')
                    })
                    $(window).scrollTop(0)
                }
            })
    })
})