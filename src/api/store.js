import axios from 'axios'

export function home() {
  return axios({
    method: 'get', // 指定请求方法
    url: `${process.env.VUE_APP_BASE_URL}/book/home` // 指定请求url
  })
}

export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}
