$(() => {
    let lastRates = {}

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

    app.checkLogin()
        .then(user => {
            for(let i=1; i<=5; i++) {
                (level => {
                    app.apiGet('/users/'+user.id+'/mlm', {
                        limit: 6,
                        level
                    })
                        .then(res => {
                            $('.count-level-'+level).text(res.count)

                            let html = ''
                            for(let n in res.rows) {
                                html += `<ul>
                        <li><span>Date</span> <span>${new Date(res.rows[n].created*1000).toLocaleString()}</span></li>
                        <li><span>Name</span> <span>${res.rows[n].firstname} ${res.rows[n].lastname}</span></li>
                        <li><span>Status</span> <span>${app.statusesObject()[res.rows[n].status]}</span></li>
                        <li></li>
                        <li><span>Binary Tree</span> <span>${res.rows[n].deposits}</span></li>
                      </ul>`
                            }

                            $('.body-table-'+level).html(html)

                            let cont = $('.paginate-'+level),
                                page = 1

                            for(let i=0; i<res.count; i+=6) {
                                let el = $('<li data-offset="'+(i)+'" data-level="'+level+'">'+page+'</li>')
                                el.click(e => {
                                    e = $(e.target)
                                    let level = e.data('level'),
                                        offset = e.data('offset')

                                    app.apiGet('/users/'+user.id+'/mlm', {
                                        limit: 6,
                                        level,
                                        offset
                                    })
                                        .then(res => {
                                            let html = ''
                                            for (let n in res.rows) {
                                                html += `<ul>
                        <li><span>Date</span> <span>${new Date(res.rows[n].created * 1000).toLocaleString()}</span></li>
                        <li><span>Name</span> <span>${res.rows[n].firstname} ${res.rows[n].lastname}</span></li>
                        <li><span>Status</span> <span>${app.statusesObject()[res.rows[n].status]}</span></li>
                        <li></li>
                        <li><span>Binary Tree</span> <span>${res.rows[n].deposits}</span></li>
                      </ul>`
                                            }

                                            $('.body-table-'+level).html(html)
                                        })
                                })
                                page++

                                cont.append(el)
                            }
                        })
                })(i);
            }
        })
})