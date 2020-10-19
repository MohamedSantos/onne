const apiGet = (path, query) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: app.config.server.rest.host+path + (query ? '?'+$.param(query) : ''),
            data: {},
            type: 'GET',
            beforeSend: xhr => {
                if (app.data && app.data.token) {
                    xhr.setRequestHeader('Authorization', app.data.token);
                }
            },
            success: ret => {
                if (ret.status === 200) {
                    return resolve(ret.data);
                }

                if (ret.status === 403) {
                    app.logout()
                }

                if (ret.error.code === 30) {
                    app.logout()
                }

                app.showError(ret.error);

                reject(ret.error);
            }
        });
    });
};

const apiPut = (path, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: app.config.server.rest.host+path,
            data: JSON.stringify(data),
            type: 'PUT',
            contentType: 'application/json',
            beforeSend: xhr => {
                if (app.data.token) {
                    xhr.setRequestHeader('Authorization', app.data.token);
                }
            },
            success: ret => {
                if (ret.status === 200) {
                    return resolve(ret.data);
                }

                if (ret.status === 403) {
                    app.logout()
                }

                app.showError(ret.error);

                reject(ret.error);
            }
        });
    });
};

const apiDelete = (path) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: app.config.server.rest.host+path,
            data: {},
            type: 'DELETE',
            beforeSend: xhr => {
                if (app.data.token) {
                    xhr.setRequestHeader('Authorization', app.data.token);
                }
            },
            success: ret => {
                if (ret.status === 200) {
                    return resolve(ret.data);
                }

                if (ret.status === 403) {
                    app.logout()
                }

                app.showError(ret.error);

                reject(ret.error);
            }
        });
    });
};

const apiPost = (path, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: app.config.server.rest.host+path,
            data: JSON.stringify(data),
            type: 'POST',
            contentType: 'application/json',
            beforeSend: xhr => {
                if (app.data.token) {
                    xhr.setRequestHeader('Authorization', app.data.token);
                }
            },
            success: ret => {
                if (ret.status === 200) {
                    return resolve(ret.data);
                }

                if (ret.status === 403) {
                    app.logout()
                }

                app.showError(ret.error)

                reject(ret.error)
            }
        });
    });
};

const formSend = (button, path, data, method) => {
    data = data || {};

    let requiredValid = true
    $.each(button.closest('.form').find('[data-field]:visible'), (i, el) => {
        el = $(el);

        if (el.hasClass('timepicker')) {
            data[el.data('field')] = Math.floor((new Date(el.val())).getTime()/1000);
        } else {
            data[el.data('field')] = el.val();
        }

        if (el.data('required') == 1 && el.val() === '') {
            requiredValid = false

            app.showError(el.data('field')+' is required')
        }
    });

    if (!requiredValid) {
        return
    }

    if (method === 'PUT') {
        return apiPut(path, data)
    } else if (method === 'DELETE') {
        return apiDelete(path);
    } else {
        return apiPost(path, data)
    }
}

const showError = err => {
    console.log(err)
}

const getUrlParam = param => {
    let path = window.location.search.slice(1).split('&')

    for(let n in path) {
        if (!path.hasOwnProperty(n)) {
            continue
        }

        path[n] = path[n].split('=')

        if (path[n][0] === param) {
            return path[n][1]
        }
    }
}

const statusesObject = () => {
    return {
        0: 'Inactive',
        1: 'Star',
        2: 'Bronze',
        3: 'Silver',
        4: 'Gold',
        5: 'Rubi',
        6: 'Esmeralda',
        7: 'Safira',
        8: 'Onix',
        9: 'Diamond',
        10: 'Dm Diamond',
        11: 'TRP Diamond'
    }
}

const checkLogin = () => {
    return new Promise((resolve, reject) => {
        app.data.token = window.localStorage.getItem('onne_token')

        if (app.data.token === undefined || app.data.token === 'undefined' || app.data.token === null) {
            window.localStorage.removeItem('onne_token');

            reject(false)
        } else {
            app.data.user = window.localStorage.getItem('onne_user')

            const updateUser = () => {
                return new Promise((resolve1, reject1) => {
                    apiGet('/user')
                        .then(user => {
                            user.lastUpdate = Date.now()

                            app.data.user = user

                            window.localStorage.setItem('onne_user', app.data.user)

                            let pct = 0

                            for(let n in app.data.user) {
                                switch (n) {
                                    case 'status':
                                        $('.user-status').text(app.statusesObject()[app.data.user[n]])
                                        break
                                    case 'email':
                                        $('.user-'+n).text(app.data.user[n])
                                        $('.user-reflink').text(app.config.domain+'/register.html?ref='+app.data.user[n]).attr('href', app.config.domain+'/register.html?ref='+app.data.user[n])
                                        break
                                    case 'direct_referrals_qual':
                                        $('.user-'+n).text(app.data.user[n])
                                        $('.user-progress-max').text(app.data.user[n] >= 4 ? '300%' : '200%')
                                        break
                                    case 'progress_BTC':
                                        pct = app.data.user.deposit_BTC ? (100 * app.data.user[n] / app.data.user.deposit_BTC).toFixed(0) : 0
                                        $('.progress_BTC-pct').text(pct+'%')
                                        $('.progress_BTC-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                                        break
                                    case 'progress_BCH':
                                        pct = app.data.user.deposit_BCH ? (100 * app.data.user[n] / app.data.user.deposit_BCH).toFixed(0) : 0
                                        $('.progress_BCH-pct').text(pct+'%')
                                        $('.progress_BCH-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                                        break
                                    case 'progress_BTG':
                                        pct = app.data.user.deposit_BTG ? (100 * app.data.user[n] / app.data.user.deposit_BTG).toFixed(0) : 0
                                        $('.progress_BTG-pct').text(pct+'%')
                                        $('.progress_BTG-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                                        break
                                    case 'progress_TRX':
                                        pct = app.data.user.deposit_TRX ? (100 * app.data.user[n] / app.data.user.deposit_TRX).toFixed(0) : 0
                                        $('.progress_TRX-pct').text(pct+'%')
                                        $('.progress_TRX-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                                        break
                                    default:
                                        $('.user-'+n).text(app.data.user[n])
                                        break
                                }
                            }

                            resolve(app.data.user)
                        })
                        .catch(reject)
                })
            }

            if (app.data.user === undefined || app.data.user === 'undefined' || app.data.user === null) {
                return updateUser()
            } else {
                try {
                    app.data.user = JSON.parse(app.data.user)
                } catch (e) {
                    return updateUser()
                }

                if (app.data.user.lastUpdate === undefined || Date.now() - app.data.user.lastUpdate > 60000) {
                    return updateUser()
                }

                let pct

                for(let n in app.data.user) {
                    switch (n) {
                        case 'status':
                            $('.user-status').text(app.statusesObject()[app.data.user[n]])
                            break
                        case 'email':
                            $('.user-'+n).text(app.data.user[n])
                            $('.user-reflink').text(app.config.domain+'/register.html?ref='+app.data.user[n]).attr('href', app.config.domain+'/register.html?ref='+app.data.user[n])
                            break
                        case 'direct_referrals_qual':
                            $('.user-'+n).text(app.data.user[n])
                            $('.user-progress-max').text(app.data.user[n] >= 4 ? '300%' : '200%')
                            break
                        case 'progress_BTC':
                            pct = app.data.user.deposit_BTC ? (100 * app.data.user[n] / app.data.user.deposit_BTC).toFixed(0) : 0
                            $('.progress_BTC-pct').text(pct+'%')
                            $('.progress_BTC-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                            break
                        case 'progress_BCH':
                            pct = app.data.user.deposit_BCH ? (100 * app.data.user[n] / app.data.user.deposit_BCH).toFixed(0) : 0
                            $('.progress_BCH-pct').text(pct+'%')
                            $('.progress_BCH-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                            break
                        case 'progress_BTG':
                            pct = app.data.user.deposit_BTG ? (100 * app.data.user[n] / app.data.user.deposit_BTG).toFixed(0) : 0
                            $('.progress_BTG-pct').text(pct+'%')
                            $('.progress_BTG-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                            break
                        case 'progress_TRX':
                            pct = app.data.user.deposit_TRX ? (100 * app.data.user[n] / app.data.user.deposit_TRX).toFixed(0) : 0
                            $('.progress_TRX-pct').text(pct+'%')
                            $('.progress_TRX-bar').css('width', (pct/(app.data.user.direct_referrals_qual >= 4 ? 3 : 2))+'%')
                            break
                        default:
                            $('.user-'+n).text(app.data.user[n])
                            break
                    }
                }

                resolve(app.data.user)
            }
        }
    })
}

const login = (email, password) => {
    return new Promise((resolve, reject) => {
        apiPost('/auth', {
            email,
            password
        })
            .then(user => {
                user.lastUpdate = Date.now()

                app.data.user = user

                window.localStorage.setItem('onne_user', app.data.user)
                window.localStorage.setItem('onne_token', app.data.user.jwt_token)

                resolve(user)
            })
            .catch(reject)
    })
}

const logout = () => {
    return new Promise(resolve => {
        window.localStorage.removeItem('onne_user')
        window.localStorage.removeItem('onne_token')

        resolve()
    })
}

window.app = {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    formSend,
    showError,
    checkLogin,
    statusesObject,
    getUrlParam,
    login,
    logout,
    data: {
        token: '',
        user: {

        }
    },
    config: {
        server: {
            rest: {
                host: 'https://api.onne.vip'
            }
        },
        domain: 'https://i.onne.vip'
    }
}

$(() => {
    $('#logout').click(e => {
        e.preventDefault()

        app.logout()
            .then(() => {
                window.location = '/login.html'
            })
    })
})