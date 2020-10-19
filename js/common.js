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
                    app.data.logout()
                }

                if (ret.error.code === 30) {
                    app.data.logout()
                }

                showError(ret.error);

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
                    app.data.logout()
                }

                showError(ret.error);

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
                    app.data.logout()
                }

                showError(ret.error);

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
                    app.data.logout()
                }

                showError(ret.error);
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

            showError(el.data('field')+' is required')
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

window.app = {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    formSend
}