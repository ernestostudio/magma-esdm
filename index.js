const cheerio = require("cheerio")
const isMagmaError = require("./lib/isClientError")
const { defaultsConfigHeader, scrap, defaultURL } = require("./lib/magmaScrap")

async function list_gunung() {
  const resultsdata = await scrap(defaultURL.home_laporan)
  const $ = cheerio.load(resultsdata.data)
  let list_ga_code = []
  $(`[action="${defaultURL.search_laporan}"] option`).each((i,el) => {
    if($(el).text() != "") {
      list_ga_code.push({
        ga_name: $(el).text(),
        ga_code: $(el).attr("value")
      })
    }
  })
  return {
    headers: {
      _cookie: resultsdata.info.cookie,
      "X-CSRF-TOKEN": $(`meta[name="csrf-token"]`).attr("content")
    },
    start: $(`[action="${defaultURL.search_laporan}"] .form-group [name="start"]`).attr("value"),
    end: $(`[action="${defaultURL.search_laporan}"] .form-group [name="end"]`).attr("value"),
    list: list_ga_code
  }
}

async function tingkat_aktivitas() {
  const resultsdata = await scrap("")
  const $ = cheerio.load(resultsdata.data)
}

async function laporan_aktivitas(ga_code) {
  const getListGA = await list_gunung()
  if(getListGA.list.map(_z => _z.ga_code).indexOf(ga_code) === -1) {
    throw new isMagmaError(`Kode "${ga_code}" tidak ada di daftar list !`, 404)
  }
  const searchLink = await scrap(
    `${defaultURL.search_laporan}?code=${ga_code}&start=${getListGA.start}&end=${getListGA.end}`,
    "GET",
    "",
    { ...getListGA.headers }
  )
  const html = cheerio.load(searchLink.data)
  const url_laporan = html(`.slim-mainpanel .timeline-group .timeline-item .card .row .col-xs-12 a`).eq(0).attr("href")
  const getlaporan = await scrap(url_laporan, "GET", "", { ...getListGA.headers })
  const $ = cheerio.load(getlaporan.data)
  let _results = {
    url: url_laporan,
    badge: $(`.card .badge`).eq(0).text(),
    waktu: $(`.card h5.card-title`).eq(0).text()?.split(", ")[1],
    pembuat_laporan: $(`.card p.card-subtitle`).eq(0).text()?.replace("Dibuat oleh,","")?.trim(),
    picture: $(`.container .card-columns .img-fluid`).attr("src"),
    pengamatan_visual: $(`.container .card-columns .media .media-body p`).eq(0).text(),
    keterangan_lain: $(`.container .card-columns .media .media-body p`).eq(1).text(),
    kimatologi: $(`.container .card-columns .media .media-body p`).eq(2).text(),
    pengamatan_gempa: $(`.container .card-columns .media .media-body p`).eq(3).text(),
    rekomendasi: $(`.container .card-columns .media .media-body p`).eq(4).text(),
  }
  return _results
}

module.exports = {
  lib: {
    defaultsConfigHeader,
    scrap,
    isMagmaError,
    defaultURL
  },
  GA: {
    list_gunung,
    tingkat_aktivitas,
    laporan_aktivitas
  }
}
