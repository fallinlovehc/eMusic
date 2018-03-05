const top_list_all = {
  "0": ['云音乐新歌榜', '/api/playlist/detail?id=3779629','18713687906568048.jpg'],
  "1": ['云音乐热歌榜', '/api/playlist/detail?id=3778678','18708190348409091.jpg'],
  "2": ['网易原创歌曲榜', '/api/playlist/detail?id=2884035','18740076185638788.jpg'],
  "3": ['云音乐飙升榜', '/api/playlist/detail?id=19723756','18696095720518497.jpg'],
  "4": ['云音乐电音榜', '/api/playlist/detail?id=10520166','3302932937414659.jpg'],
  "5": ['云音乐古典音乐榜', '/api/playlist/detail?id=71384707','18681802069355169.jpg'],
  "6": ['UK排行榜周榜', '/api/playlist/detail?id=180106','18930291695438269.jpg'],
  "7": ['Billboard周榜', '/api/playlist/detail?id=60198','18641120139148117.jpg'],
  "8": ['KTV嗨榜', '/api/playlist/detail?id=21845217','19174383276805159.jpg'],
  "9": ['iTunes榜', '/api/playlist/detail?id=11641012','18588343581028558.jpg'],
  "10": ['Hit FM Top榜', '/api/playlist/detail?id=120001','19187577416338508.jpg'],
  "11": ['Oricon周榜', '/api/playlist/detail?id=60131','19029247741938160.jpg'],
  "12": ['Melon排行榜周榜', '/api/playlist/detail?id=3733003','5920870115713082.jpg'],
  "13": ['Mnet排行榜周榜', '/api/playlist/detail?id=60255','5739450697092147.jpg'],
  "14": ['Melon原声周榜', '/api/playlist/detail?id=46772709','5920870115713082.jpg'],
  "15": ['TOP排行榜(港台)', '/api/playlist/detail?id=112504','18967675090783713.jpg'],
  "16": ['TOP排行榜(内地)', '/api/playlist/detail?id=64016','18878614648932971.jpg'],
  "17": ['香港龙虎榜', '/api/playlist/detail?id=10169002','18976471183805915.jpg'],
  "18": ['华语金曲榜', '/api/playlist/detail?id=4395559','19140298416347251.jpg'],
  "19": ['中国嘻哈榜', '/api/playlist/detail?id=1899724','5972547162256485.jpg'],
  "20": ['NRJ EuroHot', '/api/playlist/detail?id=27135204','109951162873641556.jpg'],
  "21": ['Hito排行榜', '/api/playlist/detail?id=112463','18646617697286899.jpg'],
  "22": ['Beatport舞曲榜', '/api/playlist/detail?id=3812895','18613632348448741.jpg'],

}
// const express = require("express")
// const router = express()
// const { createRequest } = require("../util/util")

// router.get("/", (req, res) => {
//   const idx = req.query.idx
//   const action = 'http://music.163.com' + top_list_all[idx][1]
//   createRequest(`${action}`, 'GET', null)
//     .then(result => {
//       res.setHeader("Content-Type", "application/json")
//       console.log(result)
//       res.send(result)
//     })
//     .catch(err => {
//       res.status(502).send('fetch error')
//     })
// })


module.exports = top_list_all