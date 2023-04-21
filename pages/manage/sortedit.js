// pages/manage/sortedit.js
const app = getApp()

const ProductSortArray = [{
    "Category1Code": "01",
    "Category1Name": "地址服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "地址挂靠",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳挂靠",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "商秘地址",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳商秘",
          },
        ]
      },

    ]
  },
  {
    "Category1Code": "02",
    "Category1Name": "工商代办",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "工商注册",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳注册",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "工商变更",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳变更",
          },
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "工商注销",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳注销",
          },
        ]
      }
    ]
  },
  {
    "Category1Code": "03",
    "Category1Name": "财税服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "记账报税",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳记账报税",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "税票代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "自然人代办",
          },
          {
            "Category3Code": "02",
            "Category3Name": "企业代办",
          },
        ]
      },
    ]
  },
  {
    "Category1Code": "04",
    "Category1Name": "企业托管",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "个体户托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "江西托管",
          },
          {
            "Category3Code": "02",
            "Category3Name": "陕西托管",
          },
          {
          "Category3Code": "03",
          "Category3Name": "云南托管",
        },
        {
          "Category3Code": "04",
          "Category3Name": "河南托管",
        },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "公司托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海托管",
          },
          {
            "Category3Code": "02",
            "Category3Name": "安徽托管",
          },

          {
            "Category3Code": "03",
            "Category3Name": "浙江托管",
          },
          {
            "Category3Code": "04",
            "Category3Name": "河南托管",
          },
        ]
      },
    ]
  },
  {
    "Category1Code": "05",
    "Category1Name": "资质代办",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "食品经营许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳食品经营",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "道路运输许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海道路运输",
          },
          {
            "Category3Code": "02",
            "Category3Name": "安徽道路运输",
          },
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "医疗器械许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海医疗器械",
          },
          {
            "Category3Code": "02",
            "Category3Name": "安徽医疗器械",
          },
          {
            "Category3Code": "03",
            "Category3Name": "浙江医疗器械",
          },
        ]
      },
    ]
  },
];
const BusinessSortArray = [{
  "Category1Code": "C",
  "Category1Name": "制造业",
  "Category2Array": [{
      "Category2Code": "13",
      "Category2Name": "农副食品加工业",
      "Category3Array": [{
          "Category3Code": "131",
          "Category3Name": "谷物磨制",
        },
        {
          "Category3Code": "132",
          "Category3Name": "饲料加工",
        },
         {
          "Category3Code": "133",
          "Category3Name": "植物油加工",
        },
        {
          "Category3Code": "134",
          "Category3Name": "制糖业",
        },
        {
          "Category3Code": "135",
          "Category3Name": "屠宰及肉类加工",
        },
        {
          "Category3Code": "136",
          "Category3Name": "水产品加工",
        },
        {
          "Category3Code": "137",
          "Category3Name": "蔬菜、菌类、水果和坚果加工",
        },
        {
          "Category3Code": "139",
          "Category3Name": "其他农副食品加工",
        },
      ]
    },
    {
      "Category2Code": "14",
      "Category2Name": "食品制造业",
      "Category3Array": [{
          "Category3Code": "141",
          "Category3Name": "焙烤食品制造",
        },
        {
          "Category3Code": "142",
          "Category3Name": "糖果、巧克力及蜜饯制造",
        },
        {
          "Category3Code": "143",
          "Category3Name": "方便食品制造",
        },
        {
          "Category3Code": "144",
          "Category3Name": "乳制品制造",
        },
        {
          "Category3Code": "145",
          "Category3Name": "罐头食品制造",
        },
        {
          "Category3Code": "146",
          "Category3Name": "调味品、发酵制品制造",
        },
        {
          "Category3Code": "149",
          "Category3Name": "其他食品制造",
        },
      ]
    },
    {
      "Category2Code": "15",
      "Category2Name": "酒、饮料和精制茶制造业",
      "Category3Array": [{
          "Category3Code": "151",
          "Category3Name": "酒的制造",
        },
        {
          "Category3Code": "152",
          "Category3Name": "饮料制造",
        },
        {
          "Category3Code": "153",
          "Category3Name": "精制茶加工",
        },
      ]
    },
    {
      "Category2Code": "16",
      "Category2Name": "烟草制品业",
      "Category3Array": [{
          "Category3Code": "161",
          "Category3Name": "烟叶复烤",
        },
        {
          "Category3Code": "162",
          "Category3Name": "卷烟制造",
        },
        {
          "Category3Code": "163",
          "Category3Name": "其他烟草制品制造",
        },
      ]
     },
     {
      "Category2Code": "17",
      "Category2Name": "纺织业",
      "Category3Array": [{
          "Category3Code": "171",
          "Category3Name": "棉纺织及印染精加工",
        },
        {
          "Category3Code": "172",
          "Category3Name": "毛纺织及染整精加工",
        },
        {
          "Category3Code": "173",
          "Category3Name": "麻纺织及染整精加工",
        },
        {
          "Category3Code": "174",
          "Category3Name": "丝绢纺织及印染精加工",
        },
        {
          "Category3Code": "175",
          "Category3Name": "化纤织造及印染精加工",
        },
        {
          "Category3Code": "176",
          "Category3Name": "针织或钩针编织物及其制品制造",
        },
        {
          "Category3Code": "177",
          "Category3Name": "家用纺织制成品制造",
        },
        {
          "Category3Code": "178",
          "Category3Name": "产业用纺织制成品制造",
        },
      ]
     },
     {
      "Category2Code": "18",
      "Category2Name": "纺织服装、服饰业",
      "Category3Array": [{
          "Category3Code": "181",
          "Category3Name": "机织服装制造",
        },
        {
          "Category3Code": "182",
          "Category3Name": "针织或钩针编织服装制造",
        },
        {
          "Category3Code": "183",
          "Category3Name": "服饰制造",
        },
      ]
     },
     {
      "Category2Code": "19",
      "Category2Name": "皮革、毛皮、羽毛及其制品和制鞋业",
      "Category3Array": [{
          "Category3Code": "191",
          "Category3Name": "皮革鞣制加工",
        },
        {
          "Category3Code": "192",
          "Category3Name": "皮革制品制造",
        },
        {
          "Category3Code": "193",
          "Category3Name": "毛皮鞣制及制品加工",
        },
        {
          "Category3Code": "194",
          "Category3Name": "羽毛（绒）加工及制品制造",
        },
        {
          "Category3Code": "195",
          "Category3Name": "制鞋业",
        },
      ]
     },
     {
      "Category2Code": "20",
      "Category2Name": "皮革、毛皮、羽毛及其制品和制鞋业",
      "Category3Array": [{
          "Category3Code": "201",
          "Category3Name": "木材加工",
        },
        {
          "Category3Code": "202",
          "Category3Name": "人造板制造",
        },
        {
          "Category3Code": "203",
          "Category3Name": "木质制品制造",
        },
        {
          "Category3Code": "204",
          "Category3Name": "竹、藤、棕、草等制品制造",
        },
      ]
     },
     {
      "Category2Code": "21",
      "Category2Name": "家具制造业",
      "Category3Array": [{
          "Category3Code": "211",
          "Category3Name": "木质家具制造",
        },
        {
          "Category3Code": "212",
          "Category3Name": "竹、藤家具制造",
        },
        {
          "Category3Code": "213",
          "Category3Name": "金属家具制造",
        },
        {
          "Category3Code": "214",
          "Category3Name": "塑料家具制造",
        },
        {
          "Category3Code": "219",
          "Category3Name": "其他家具制造",
        },
      ]
     },
     {
      "Category2Code": "22",
      "Category2Name": "造纸和纸制品业",
      "Category3Array": [{
          "Category3Code": "221",
          "Category3Name": "纸浆制造",
        },
        {
          "Category3Code": "222",
          "Category3Name": "造纸",
        },
        {
          "Category3Code": "223",
          "Category3Name": "纸制品制造",
        },
      ]
     },
     {
      "Category2Code": "23",
      "Category2Name": "印刷和记录媒介复制业",
      "Category3Array": [{
          "Category3Code": "231",
          "Category3Name": "印刷",
        },
        {
          "Category3Code": "232",
          "Category3Name": "装订及印刷相关服务",
        },
        {
          "Category3Code": "233",
          "Category3Name": "记录媒介复制",
        },
      ]
     },
     {
      "Category2Code": "24",
      "Category2Name": "文教、工美、体育和娱乐用品制造业",
      "Category3Array": [{
          "Category3Code": "241",
          "Category3Name": "文教办公用品制造",
        },
        {
          "Category3Code": "242",
          "Category3Name": "乐器制造",
        },
        {
          "Category3Code": "243",
          "Category3Name": "工艺美术及礼仪用品制造",
        },
        {
          "Category3Code": "244",
          "Category3Name": "体育用品制造",
        },
        {
          "Category3Code": "245",
          "Category3Name": "玩具制造",
        },
        {
          "Category3Code": "246",
          "Category3Name": "游艺器材及娱乐用品制造",
        },
      ]
     },
     {
      "Category2Code": "25",
      "Category2Name": "石油、煤炭及其他燃料加工业",
      "Category3Array": [{
          "Category3Code": "251",
          "Category3Name": "精炼石油产品制造",
        },
        {
          "Category3Code": "252",
          "Category3Name": "煤炭加工",
        },
        {
          "Category3Code": "254",
          "Category3Name": "生物质燃料加工",
        },
      ]
     },
     {
      "Category2Code": "26",
      "Category2Name": "化学原料和化学制品制造业",
      "Category3Array": [{
          "Category3Code": "261",
          "Category3Name": "基础化学原料制造",
        },
        {
          "Category3Code": "262",
          "Category3Name": "肥料制造",
        },
        {
          "Category3Code": "263",
          "Category3Name": "农药制造",
        },
        {
          "Category3Code": "264",
          "Category3Name": "涂料、油墨、颜料及类似产品制造",
        },
        {
          "Category3Code": "265",
          "Category3Name": "合成材料制造",
        },
        {
          "Category3Code": "266",
          "Category3Name": "专用化学产品制造",
        },
        {
          "Category3Code": "267",
          "Category3Name": "炸药、火工及焰火产品制造",
        },
        {
          "Category3Code": "268",
          "Category3Name": "日用化学产品制造",
        },
      ]
     },
     {
      "Category2Code": "27",
      "Category2Name": "医药制造业",
      "Category3Array": [{
          "Category3Code": "271",
          "Category3Name": "化学药品原料药制造",
        },
        {
          "Category3Code": "272",
          "Category3Name": "化学药品制剂制造",
        },
        {
          "Category3Code": "273",
          "Category3Name": "中药饮片加工",
        },
        {
          "Category3Code": "274",
          "Category3Name": "中成药生产",
        },
        {
          "Category3Code": "275",
          "Category3Name": "兽用药品制造",
        },
        {
          "Category3Code": "276",
          "Category3Name": "生物药品制品制造",
        },
        {
          "Category3Code": "277",
          "Category3Name": "卫生材料及医药用品制造",
        },
        {
          "Category3Code": "278",
          "Category3Name": "药用辅料及包装材料",
        },
      ]
     },
     {
      "Category2Code": "28",
      "Category2Name": "化学纤维制造业",
      "Category3Array": [{
          "Category3Code": "281",
          "Category3Name": "纤维素纤维原料及纤维制造",
        },
        {
          "Category3Code": "282",
          "Category3Name": "合成纤维制造",
        },
        {
          "Category3Code": "283",
          "Category3Name": "生物基材料制造",
        },
      ]
     },
     {
      "Category2Code": "29",
      "Category2Name": "橡胶和塑料制品业",
      "Category3Array": [{
          "Category3Code": "291",
          "Category3Name": "橡胶制品业",
        },
        {
          "Category3Code": "292",
          "Category3Name": "塑料制品业",
        },
      ]
     },
     {
      "Category2Code": "30",
      "Category2Name": "非金属矿物制品业业",
      "Category3Array": [{
          "Category3Code": "301",
          "Category3Name": "水泥、石灰和石膏制造",
        },
        {
          "Category3Code": "302",
          "Category3Name": "石膏、水泥制品及类似制品制造",
        },
        {
          "Category3Code": "303",
          "Category3Name": "砖瓦、石材等建筑材料制造",
        },
        {
          "Category3Code": "304",
          "Category3Name": "玻璃制造",
        },
        {
          "Category3Code": "305",
          "Category3Name": "玻璃制品制造",
        },
        {
          "Category3Code": "306",
          "Category3Name": "玻璃纤维和玻璃纤维增强塑料制品制造",
        },
        {
          "Category3Code": "307",
          "Category3Name": "陶瓷制品制造",
        },
        {
          "Category3Code": "308",
          "Category3Name": "塑耐火材料制品制造",
        },
        {
          "Category3Code": "309",
          "Category3Name": "石墨及其他非金属矿物制品制造",
        },

      ]
     },
     {
      "Category2Code": "31",
      "Category2Name": "黑色金属冶炼和压延加工业",
      "Category3Array": [{
          "Category3Code": "311",
          "Category3Name": "炼铁",
        },
        {
          "Category3Code": "312",
          "Category3Name": "炼钢",
        },
        {
          "Category3Code": "313",
          "Category3Name": "钢压延加工",
        },
        {
          "Category3Code": "314",
          "Category3Name": "铁合金冶炼",
        },
      ]
     },
  ]
},
{
  "Category1Code": "E",
  "Category1Name": "建筑业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "工商注册",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳注册",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "工商变更",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳变更",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "工商注销",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳注销",
        },
      ]
    }
  ]
},
{
  "Category1Code": "F",
  "Category1Name": "批发和零售业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "记账报税",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳记账报税",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "税票代办",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "自然人代办",
        },
        {
          "Category3Code": "02",
          "Category3Name": "企业代办",
        },
      ]
    },
  ]
},
{
  "Category1Code": "G",
  "Category1Name": "交通运输、仓储和邮政业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "个体户托管",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "江西托管",
        },
        {
          "Category3Code": "02",
          "Category3Name": "陕西托管",
        },
        {
        "Category3Code": "03",
        "Category3Name": "云南托管",
      },
      {
        "Category3Code": "04",
        "Category3Name": "河南托管",
      },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "公司托管",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海托管",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽托管",
        },

        {
          "Category3Code": "03",
          "Category3Name": "浙江托管",
        },
        {
          "Category3Code": "04",
          "Category3Name": "河南托管",
        },
      ]
    },
  ]
},
{
  "Category1Code": "H",
  "Category1Name": "住宿和餐饮业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
{
  "Category1Code": "I",
  "Category1Name": "信息传输、软件和信息技术服务业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
{
  "Category1Code": "J",
  "Category1Name": "金融业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
{
  "Category1Code": "K",
  "Category1Name": "房地产业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
{
  "Category1Code": "L",
  "Category1Name": "租赁和商务服务业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},

{
  "Category1Code": "M",
  "Category1Name": "科研和技术服务业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
{
  "Category1Code": "O",
  "Category1Name": "居民服务、修理和其他服务业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
{
  "Category1Code": "P",
  "Category1Name": "教育",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
{
  "Category1Code": "R",
  "Category1Name": "文化、体育和娱乐业",
  "Category2Array": [{
      "Category2Code": "01",
      "Category2Name": "食品经营许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "深圳食品经营",
        },
      ]
    },
    {
      "Category2Code": "02",
      "Category2Name": "道路运输许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海道路运输",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽道路运输",
        },
      ]
    },
    {
      "Category2Code": "03",
      "Category2Name": "医疗器械许可证",
      "Category3Array": [{
          "Category3Code": "01",
          "Category3Name": "上海医疗器械",
        },
        {
          "Category3Code": "02",
          "Category3Name": "安徽医疗器械",
        },
        {
          "Category3Code": "03",
          "Category3Name": "浙江医疗器械",
        },
      ]
    },
  ]
},
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品分类参数
    sortarray: [],

  },


  ProductSortUpdate() {
    wx.cloud.callFunction({
      name: 'MeetingRoomSetting',
      data: {
        key1: "ProductSort",
        value1: ProductSortArray,
      },
      success: res => {
        console.log("更新产品类别执行了")
      }
    })
  },
  BusinessSortUpdate() {
    wx.cloud.callFunction({
      name: 'MeetingRoomSetting',
      data: {
        key1: "BusinessSort",
        value1: BusinessSortArray,
      },
      success: res => {
        console.log("更新行业类别执行了")
      }
    })
  },
  bvCategory1Code(e){
let index=e.currentTarget.dataset.index

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //SortArray没有在pages data当中，所以不需要用this.data,
    this.setData({
      sortarray:ProductSortArray
    })
    console.log(this.data.sortarray)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})