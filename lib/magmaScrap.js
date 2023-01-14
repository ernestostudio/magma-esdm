const axios = require("axios")
/**
* @name defaultsConfigHeader
*/
const defaultsConfigHeader = {
  "User-Agent": "Mozilla/5.0 (X11; Linux arm_64; ernestoyoofi/magma-esdm) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36",
  connection: "Keep-Alive",
  origin: "https://magma.esdm.go.id",
  referer: "https://magma.esdm.go.id",
  "sec-fetch-user": '?1',
  "sec-ch-ua-platform": `"${os.type()}"`,
  "accept-language": "id,en-GB;q=0.9",
  _cookie: "",
  "X-CSRF-TOKEN": ""
}

/**
* @name scrap
*/
async function scrap(url, method="GET", body="", confHeaders=null) {
  return new Promise((yess, nooo) => {
    const config = {
      url: url||defaultsConfigHeader.origin,
      method: method,
      data: body,
      headers: {
        ...defaultsConfigHeader,
        referer: url,
        ...confHeaders
      }
    }
    const resRequest = axios(config)
    resRequest.then(res => {
      yess({
        config: config,
        headers: res.headers,
        info: {
          isHTML: res.headers['content-type'].split("; ")[0] === "text/html",
          cookie: res.headers['set-cookie']
        },
        data: res.data,
      })
    })
    resRequest.catch(error => {
      nooo(error)
    })
  })
}

const defaultURL = {
  home_laporan: "https://magma.esdm.go.id/v1/gunung-api/laporan",
  search_laporan: "https://magma.esdm.go.id/v1/gunung-api/laporan/search/q",
  info_letusan: "https://magma.esdm.go.id/v1/gunung-api/informasi-letusan"
}

module.exports = {
  defaultsConfigHeader,
  defaultURL,
  scrap,
}
