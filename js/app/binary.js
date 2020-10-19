import tooltip from '../tooltip.js';

(() => {
    let activeCur = 'BTC',
        binaryStruct = {},
        lastRates = {}

    const levelImg = {
        0: '../svg/Botão Transparente.svg',
        1: '../svg/Botão Rosa Claro.svg',
        2: '../svg/Botão Marrom.svg',
        3: '../svg/Botão Cinza Onix.svg',
        4: '../svg/Botão Amarelo Claro.svg',
        5: '../svg/Botão Vermelho Forte.svg',
        6: '../svg/Verde Claro Limão.svg',
        7: '../svg/Botão Azul Marinho.svg',
        8: '../svg/Botão Preto.svg',
        9: '../svg/Botão Azul Claro.svg',
        10: '../svg/Botão Roxo.svg',
        11: '../svg/Botão Laranja Forte.svg'
    }

    const currencies = {
        BTC: 'Bitcoin',
        BCH: 'Bitcoin Cash',
        BTG: 'Bitcoin Gold',
        TRX: 'Tron'
    }

    const updateRates = () => {
        app.apiGet('/rates')
            .then(rates => {
                for (let sym in rates) {
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

                    $('#quote-' + sym).text(sym + ': $' + rates[sym]).removeClass('price-up price-down').addClass(dir > 0 ? 'price-up' : (dir < 0 ? 'price-down' : ''))

                    lastRates[sym] = rates[sym]
                }

                $('.user-rate-today').text((new Date).toLocaleString().split(' ')[0])
            })
    }

    updateRates()
    setInterval(updateRates, 30000)

    const drawBinary = (struct, id = 1) => {
        if (!struct.id || struct.id == 0) {
            return
        }

        if (id == 1) {
            $('#volume-left').text(struct.data['binary_left_' + activeCur])
            $('#volume-right').text(struct.data['binary_right_' + activeCur])
        }

        let el = $(`<img src="${levelImg[struct.data.status]}" data-text="Login: ${struct.data.email}&#013;Volume Left: ${struct.data['binary_left_' + activeCur]}&#013;Volume right: ${struct.data['binary_right_' + activeCur]}&#013;Direct Referrals: ${struct.data.direct_referrals}">`)

        el.click(() => {
            searchAndBuild(struct.data.email);
        })

        $('[data-binary-id=' + id + ']').html(el)

        if (struct.left > 0) {
            drawBinary(struct.left_node, id * 2)
        }

        if (struct.right > 0) {
            drawBinary(struct.right_node, id * 2 + 1)
        }
    }

    const searchAndBuild = email => {
        apiGet('/binary/search', {
            email
        })
            .then(struct => {
                binaryStruct = struct

                for (let i = 1; i <= 15; i++) {
                    $('[data-binary-id=' + i + ']').html(`<img src="${levelImg[0]}" data-text="Login: -&#013;Volume Left: 0&#013;Volume right: 0&#013;Direct Referrals: 0">`)
                }
                drawBinary(struct);
                setTimeout(tooltip, 1000);
            })
    }

    app.checkLogin()
        .then(user => {
            searchAndBuild(app.data.user.email)

            $(user.binary_direction ? '#right' : '#left').attr('checked', 'checked')
        })

    $('.binary-tree-currency-apply').click(e => {
        $('#binary-currency').text(currencies[activeCur])

        drawBinary(binaryStruct)
    })

    $('.binary-tree-currency').click(e => {
        let el = $(e.target)

        if (!el.hasClass('.binary-tree-currency')) {
            el = el.closest('.binary-tree-currency')
        }

        activeCur = el.data('currency')
    })

    $('#save-direction').click(e => {
        e.preventDefault()
        apiPut('/binary/direction', {
            direction: $('input[name=direction]:checked').val() === 'right' ? 1 : 0
        })
    })

    $('#binary-search').click(e => {
        e.preventDefault()

        searchAndBuild($('#binary-search-val').val())
    })

    $('#go-top').click(() => {
        searchAndBuild(app.data.user.email)
    })
})();