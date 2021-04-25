import axios from 'axios';

// get 获取数据
export const getData = (url, params) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url,
            params,
        }).then(res => {
            if (res.status === 200) {
                resolve(res.data)
            } else {
                reject()
            }
        }).catch(err => reject(err))
    })
}

// post 获取数据
export const postData = (url, data) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url,
            params,
        }).then(res => {
            if (res.status === 200) {
                resolve(res.data)
            } else {
                reject()
            }
        }).catch(err => reject(err))
    })
}