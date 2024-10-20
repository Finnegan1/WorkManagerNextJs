import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { WorkAreaRestrictionLevel } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash('admin', saltRounds)

    const user = await prisma.user.upsert({
      where: { email: 'admin@admin.de' },
      update: {},
      create: {
        email: 'admin@admin.de',
        name: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    const forestries = await prisma.forestryRange.createMany({
      data: [
        {
          name: 'Pirna',
          number: 3452,
        },
        {
          name: 'Dresden',
          number: 3453,
        },
        {
          name: 'Grimma',
          number: 3454,
        },
        {
          name: 'Radebeul',
          number: 3455,
        },
        {
          name: 'Freital',
          number: 3456,
        },
        {
          name: 'Pulsnitz',
          number: 3457,
        },
        {
          name: 'Meißen',
          number: 3458,
        },
        {
          name: 'Riesa',
          number: 3459,
        },
        {
          name: 'Dippoldiswalde',
          number: 3460,
        },
        {
          name: 'Sebnitz',
          number: 3461,
        },
        {
          name: 'Bad Schandau',
          number: 3462,
        },
      ],
    })

    const forestryRanges = await prisma.forestryRange.findMany()

    const areas = await prisma.area.createMany({
      data: [
        {
          shortDescription: 'Holzernte im Tharandter Wald',
          information: 'Großflächige Holzernte mit schwerem Gerät',
          startTime: new Date('2024-10-01T07:00:00Z'),
          endTime: new Date('2024-10-31T18:00:00Z'),
          workDescription: 'Fällung und Abtransport von Fichten aufgrund von Borkenkäferbefall',
          forestSection: 'Abteilung 42, 43, 44',
          trailsInArea: ['Wanderweg Tharandt-Grillenburg', 'Fahrradweg R4'],
          restrictionLevel: WorkAreaRestrictionLevel.danger,
          restrictedAreas: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      [
                        13.478716401233896,
                        50.970768727670134
                      ],
                      [
                        13.477556679592652,
                        50.97181199623091
                      ],
                      [
                        13.475863117831125,
                        50.971904730079586
                      ],
                      [
                        13.474280005750643,
                        50.971499018123154
                      ],
                      [
                        13.473875023590551,
                        50.96963269747431
                      ],
                      [
                        13.474519313390601,
                        50.96892556260778
                      ],
                      [
                        13.475568585352107,
                        50.96836912104567
                      ],
                      [
                        13.476967614832887,
                        50.96804452703745
                      ],
                      [
                        13.478530269785296,
                        50.968148004179966
                      ],
                      [
                        13.478769577425226,
                        50.969898462427636
                      ],
                      [
                        13.478716401233896,
                        50.970768727670134
                      ]
                    ]
                  ],
                  "type": "Polygon"
                }
              }
            ]
          },
          rerouting: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      [
                        13.478716401233896,
                        50.970768727670134
                      ],
                      [
                        13.477556679592652,
                        50.97181199623091
                      ],
                      [
                        13.475863117831125,
                        50.971904730079586
                      ],
                      [
                        13.474280005750643,
                        50.971499018123154
                      ],
                      [
                        13.473875023590551,
                        50.96963269747431
                      ],
                      [
                        13.474519313390601,
                        50.96892556260778
                      ],
                      [
                        13.475568585352107,
                        50.96836912104567
                      ],
                      [
                        13.476967614832887,
                        50.96804452703745
                      ],
                      [
                        13.478530269785296,
                        50.968148004179966
                      ],
                      [
                        13.478769577425226,
                        50.969898462427636
                      ],
                      [
                        13.478716401233896,
                        50.970768727670134
                      ]
                    ]
                  ],
                  "type": "Polygon"
                },
                "id": 0
              },
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      13.478827463574476,
                      50.9713756975745
                    ],
                    [
                      13.476084629852807,
                      50.97408811164112
                    ],
                    [
                      13.475053766171897,
                      50.97392583491276
                    ],
                    [
                      13.473249754730716,
                      50.97157275863378
                    ],
                    [
                      13.473249754730716,
                      50.97122500325938
                    ],
                    [
                      13.472458198689708,
                      50.9704135639264
                    ],
                    [
                      13.47229252416949,
                      50.969718033214804
                    ],
                    [
                      13.473194529890122,
                      50.96949777965142
                    ],
                    [
                      13.473802003131794,
                      50.9696021104169
                    ]
                  ],
                  "type": "LineString"
                }
              },
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      13.475624422852178,
                      50.968292162694325
                    ],
                    [
                      13.4757164642526,
                      50.96738792944112
                    ],
                    [
                      13.473231346451541,
                      50.96950937197019
                    ]
                  ],
                  "type": "LineString"
                }
              },
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      13.478790647014591,
                      50.971398881271824
                    ],
                    [
                      13.478404073133731,
                      50.971167043776916
                    ]
                  ],
                  "type": "LineString"
                }
              }
            ]
          },
          forestryRangeId: forestryRanges.find((forestryRange) => forestryRange.name === 'Dresden')!.id,
          createdById: user.id,
        },
        {
          shortDescription: 'Waldpflege im Nationalpark Sächsische Schweiz',
          information: 'Entfernung von Totholz und invasiven Arten',
          startTime: new Date('2024-10-10T08:00:00Z'),
          endTime: new Date('2024-10-30T16:00:00Z'),
          workDescription: 'Selektive Entfernung von Totholz und Bekämpfung der Spätblühenden Traubenkirsche',
          forestSection: 'Sektor B3, B4',
          trailsInArea: ['Malerweg Etappe 7', 'Forststeig Elbsandstein'],
          restrictionLevel: WorkAreaRestrictionLevel.attention,
          restrictedAreas: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      [
                        14.1905888786805,
                        50.91833414347272
                      ],
                      [
                        14.190068008119823,
                        50.917695639735484
                      ],
                      [
                        14.189923321852433,
                        50.916719624233934
                      ],
                      [
                        14.191066343360689,
                        50.91549729557576
                      ],
                      [
                        14.194234972602771,
                        50.91500470629438
                      ],
                      [
                        14.196868262658171,
                        50.91470367694461
                      ],
                      [
                        14.198792590007429,
                        50.91489524130165
                      ],
                      [
                        14.198937276273597,
                        50.91590778266104
                      ],
                      [
                        14.198069158672922,
                        50.91641860597716
                      ],
                      [
                        14.197114229314877,
                        50.917075370579795
                      ],
                      [
                        14.1971142293134,
                        50.91788846374001
                      ],
                      [
                        14.195913333298705,
                        50.91802528613982
                      ],
                      [
                        14.193612821657325,
                        50.91831717258182
                      ],
                      [
                        14.193005139336918,
                        50.91906512323291
                      ],
                      [
                        14.192079147228526,
                        50.918900939973526
                      ],
                      [
                        14.1905888786805,
                        50.91833414347272
                      ]
                    ]
                  ],
                  "type": "Polygon"
                },
                "id": 0
              }
            ]
          },
          rerouting: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      14.19008247556917,
                      50.918809727607254
                    ],
                    [
                      14.192368518584487,
                      50.921573407355766
                    ],
                    [
                      14.192961732277638,
                      50.92172846043235
                    ],
                    [
                      14.194914996880158,
                      50.920779892346815
                    ],
                    [
                      14.194408594945543,
                      50.91959415504479
                    ],
                    [
                      14.194770310612768,
                      50.91871851425631
                    ],
                    [
                      14.195522679200593,
                      50.91846311592235
                    ],
                    [
                      14.196159298774177,
                      50.91867290751361
                    ],
                    [
                      14.196434202680535,
                      50.91843575173212
                    ],
                    [
                      14.197070822255341,
                      50.918545208396864
                    ],
                    [
                      14.19812703200273,
                      50.917468873343864
                    ],
                    [
                      14.198662371189386,
                      50.916720897035304
                    ],
                    [
                      14.19911089861634,
                      50.916264808019776
                    ],
                    [
                      14.19993561033786,
                      50.916155345991
                    ],
                    [
                      14.200109233857262,
                      50.91542559255197
                    ]
                  ],
                  "type": "LineString"
                }
              }
            ]
          },
          forestryRangeId: forestryRanges.find((forestryRange) => forestryRange.name === 'Bad Schandau')!.id,
          createdById: user.id,
        },
        {
          shortDescription: 'Aufforstung im Colditzer Forst',
          information: 'Pflanzung von klimaresistenten Baumarten',
          startTime: new Date('2024-10-15T07:30:00Z'),
          endTime: new Date('2024-11-15T16:30:00Z'),
          workDescription: 'Pflanzung von Eichen, Buchen und Douglasien auf einer Kahlfläche',
          forestSection: 'Abteilung 17, 18',
          trailsInArea: ['Muldentalradweg'],
          restrictionLevel: WorkAreaRestrictionLevel.none,
          restrictedAreas: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      [
                        12.949275229922563,
                        51.15878677769658
                      ],
                      [
                        12.949931533195269,
                        51.158398033339836
                      ],
                      [
                        12.948983539578876,
                        51.15773487364146
                      ],
                      [
                        12.948655387942495,
                        51.1579406828439
                      ],
                      [
                        12.94796262337698,
                        51.157346120421266
                      ],
                      [
                        12.947598010447848,
                        51.15789494754466
                      ],
                      [
                        12.946504171660422,
                        51.1570488363364
                      ],
                      [
                        12.945629100631066,
                        51.156134104061294
                      ],
                      [
                        12.943988342449131,
                        51.15485344840883
                      ],
                      [
                        12.941545435824992,
                        51.1543960627757
                      ],
                      [
                        12.944972797358332,
                        51.154624756158995
                      ],
                      [
                        12.946722939418493,
                        51.154098759682654
                      ],
                      [
                        12.94767093303335,
                        51.1528409177092
                      ],
                      [
                        12.948837694407814,
                        51.152131937123954
                      ],
                      [
                        12.949311691215286,
                        51.15117136540579
                      ],
                      [
                        12.95244736240656,
                        51.150645329563844
                      ],
                      [
                        12.952775514041434,
                        51.149387393453424
                      ],
                      [
                        12.953067204385064,
                        51.14723738690233
                      ],
                      [
                        12.952666130163152,
                        51.14645970029258
                      ],
                      [
                        12.952410901112245,
                        51.14529314580864
                      ],
                      [
                        12.953905814123118,
                        51.14639108025702
                      ],
                      [
                        12.954926730323535,
                        51.1474432429292
                      ],
                      [
                        12.95463503998144,
                        51.148861337275775
                      ],
                      [
                        12.957187330485425,
                        51.148518253929495
                      ],
                      [
                        12.962474217957293,
                        51.1489070815295
                      ],
                      [
                        12.962692985715393,
                        51.149456009034196
                      ],
                      [
                        12.958937472544108,
                        51.149776213730405
                      ],
                      [
                        12.957916556343775,
                        51.150622458304326
                      ],
                      [
                        12.957989478929278,
                        51.152406382513504
                      ],
                      [
                        12.96014069521138,
                        51.153595627008
                      ],
                      [
                        12.961599146927938,
                        51.155287960560884
                      ],
                      [
                        12.962984676058994,
                        51.156499999147485
                      ],
                      [
                        12.962510679250073,
                        51.15718604461341
                      ],
                      [
                        12.957916556343775,
                        51.15800928570704
                      ],
                      [
                        12.953978736708649,
                        51.15853523760444
                      ],
                      [
                        12.951462907497415,
                        51.1582836961409
                      ],
                      [
                        12.949275229922563,
                        51.15878677769658
                      ]
                    ]
                  ],
                  "type": "Polygon"
                }
              }
            ]
          },
          rerouting: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "coordinates": [
                    [
                      12.97161124417633,
                      51.1524675850213
                    ],
                    [
                      12.970578889348502,
                      51.151949546351716
                    ],
                    [
                      12.970165947417314,
                      51.15099115948129
                    ],
                    [
                      12.970289829996148,
                      51.15000684954549
                    ],
                    [
                      12.970289829996148,
                      51.14910022971472
                    ],
                    [
                      12.970124653223536,
                      51.148012262407406
                    ],
                    [
                      12.970124653223536,
                      51.1475459828535
                    ],
                    [
                      12.968142531954555,
                      51.14793454947582
                    ],
                    [
                      12.964921584891385,
                      51.14878938452949
                    ],
                    [
                      12.96236134491869,
                      51.148633961152
                    ],
                    [
                      12.960792165579988,
                      51.147623696439354
                    ],
                    [
                      12.959635928172474,
                      51.146457978906795
                    ],
                    [
                      12.958686161731436,
                      51.14469639433017
                    ],
                    [
                      12.957984160447978,
                      51.1436083232102
                    ],
                    [
                      12.956249804337574,
                      51.14285702103959
                    ],
                    [
                      12.954639330878479,
                      51.141950260563306
                    ],
                    [
                      12.953111445732759,
                      51.141665275081294
                    ],
                    [
                      12.953070151539833,
                      51.14104348246806
                    ],
                    [
                      12.951294501146833,
                      51.14060304047777
                    ],
                    [
                      12.949865035186491,
                      51.1404861165619
                    ],
                    [
                      12.935742421141185,
                      51.14584886720567
                    ],
                    [
                      12.928226877994007,
                      51.14820620778346
                    ],
                    [
                      12.927194523166122,
                      51.15222118102611
                    ],
                    [
                      12.927153228973197,
                      51.15662429842854
                    ],
                    [
                      12.929259232821806,
                      51.156468901438046
                    ],
                    [
                      12.931984649567994,
                      51.1567537955209
                    ],
                    [
                      12.935246890824146,
                      51.158489021492414
                    ]
                  ],
                  "type": "LineString"
                }
              }
            ]
          },
          forestryRangeId: forestryRanges.find((forestryRange) => forestryRange.name === 'Grimma')!.id,
          createdById: user.id,
        },
      ],
    })

    console.log('Seed data inserted successfully:')
    console.log(user)
    console.log(forestries)
    console.log(areas)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
