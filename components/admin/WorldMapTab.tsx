'use client'

import { useRef, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { Globe, TrendingUp, Users, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

/** ISO 3166-1 numeric → alpha-2 (world-atlas country ids) */
const ISO_NUMERIC_TO_A2: Record<string, string> = Object.fromEntries(
  `004,AF;008,AL;010,AQ;012,DZ;016,AS;020,AD;024,AO;028,AG;031,AZ;032,AR;036,AU;040,AT;044,BS;048,BH;050,BD;051,AM;052,BB;056,BE;060,BM;064,BT;068,BO;070,BA;072,BW;076,BR;084,BZ;090,SB;096,BN;100,BG;104,MM;108,BI;112,BY;116,KH;120,CM;124,CA;132,CV;140,CF;144,LK;148,TD;152,CL;156,CN;158,TW;170,CO;174,KM;178,CG;180,CD;188,CR;191,HR;192,CU;196,CY;203,CZ;204,BJ;208,DK;212,DM;214,DO;218,EC;222,SV;226,GQ;231,ET;232,ER;233,EE;238,FK;242,FJ;246,FI;250,FR;254,GF;258,PF;262,DJ;266,GA;268,GE;270,GM;275,PS;276,DE;288,GH;300,GR;304,GL;308,GD;320,GT;324,GN;328,GY;332,HT;336,VA;340,HN;344,HK;348,HU;352,IS;356,IN;360,ID;364,IR;368,IQ;372,IE;376,IL;380,IT;384,CI;388,JM;392,JP;398,KZ;400,JO;404,KE;408,KP;410,KR;414,KW;417,KG;418,LA;422,LB;426,LS;428,LV;430,LR;434,LY;440,LT;442,LU;450,MG;454,MW;458,MY;462,MV;466,ML;470,MT;478,MR;480,MU;484,MX;496,MN;498,MD;499,ME;504,MA;508,MZ;512,OM;516,NA;524,NP;528,NL;540,NC;548,VU;554,NZ;558,NI;562,NE;566,NG;578,NO;586,PK;591,PA;598,PG;600,PY;604,PE;608,PH;616,PL;620,PT;624,GW;626,TL;630,PR;634,QA;642,RO;643,RU;646,RW;682,SA;686,SN;688,RS;694,SL;702,SG;703,SK;704,VN;705,SI;706,SO;710,ZA;716,ZW;724,ES;728,SS;729,SD;732,EH;740,SR;748,SZ;752,SE;756,CH;760,SY;762,TJ;764,TH;768,TG;776,TO;780,TT;784,AE;788,TN;792,TR;795,TM;800,UG;804,UA;807,MK;818,EG;826,GB;834,TZ;840,US;854,BF;858,UY;860,UZ;862,VE;882,WS;887,YE;894,ZM`
    .split(';')
    .map((pair) => pair.split(',') as [string, string]),
)

const regionNameKo =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['ko'], { type: 'region' })
    : null

function countryLabel(geo: { id?: string | number; properties?: { name?: string } }) {
  const nameEn = String(geo.properties?.name ?? '').trim()
  const numId = String(geo.id ?? '').padStart(3, '0')
  const mapped = COUNTRY_MAP[numId]
  if (mapped && COUNTRY_DATA[mapped]) {
    return { nameKo: COUNTRY_DATA[mapped].nameKo, nameEn: COUNTRY_DATA[mapped].nameEn, hasMission: true }
  }
  const alpha2 = ISO_NUMERIC_TO_A2[numId]
  const nameKo = (alpha2 && regionNameKo?.of(alpha2)) || nameEn || '알 수 없는 지역'
  return { nameKo, nameEn: nameEn || nameKo, hasMission: false }
}

// ISO-3166 numeric codes mapped to our country data
const COUNTRY_MAP: Record<string, string> = {
  '764': 'Thailand',    // 태국
  '116': 'Cambodia',   // 캄보디아
  '104': 'Myanmar',    // 미얀마
  '496': 'Mongolia',   // 몽골
  '360': 'Indonesia',  // 인도네시아
  '356': 'India',      // 인도
  '586': 'Pakistan',   // 파키스탄
  '144': 'Sri Lanka',  // 스리랑카
  '050': 'Bangladesh', // 방글라데시
  '524': 'Nepal',      // 네팔
  '704': 'Vietnam',    // 베트남
  '608': 'Philippines',// 필리핀
  '458': 'Malaysia',   // 말레이시아
}

interface CountryData {
  nameKo: string
  nameEn: string
  missionaries: number
  totalAmount: number
  donorCount: number
  campaigns: number
  coordinates: [number, number]
  status: 'active' | 'urgent' | 'planning'
}

const COUNTRY_DATA: Record<string, CountryData> = {
  Thailand:    { nameKo: '태국',     nameEn: 'Thailand',     missionaries: 3,  totalAmount: 4_240_000,  donorCount: 134, campaigns: 2, coordinates: [100.5, 15.9],  status: 'active'   },
  Cambodia:    { nameKo: '캄보디아', nameEn: 'Cambodia',     missionaries: 2,  totalAmount: 2_100_000,  donorCount: 67,  campaigns: 1, coordinates: [104.9, 12.6],  status: 'urgent'   },
  Myanmar:     { nameKo: '미얀마',   nameEn: 'Myanmar',      missionaries: 4,  totalAmount: 6_800_000,  donorCount: 201, campaigns: 1, coordinates: [95.9, 19.7],   status: 'urgent'   },
  Mongolia:    { nameKo: '몽골',     nameEn: 'Mongolia',     missionaries: 1,  totalAmount: 1_500_000,  donorCount: 42,  campaigns: 1, coordinates: [103.8, 46.8],  status: 'active'   },
  Indonesia:   { nameKo: '인도네시아',nameEn: 'Indonesia',   missionaries: 2,  totalAmount: 890_000,    donorCount: 28,  campaigns: 1, coordinates: [113.9, -0.8],  status: 'planning' },
  India:       { nameKo: '인도',     nameEn: 'India',        missionaries: 1,  totalAmount: 420_000,    donorCount: 14,  campaigns: 1, coordinates: [78.9, 20.5],   status: 'planning' },
  Philippines: { nameKo: '필리핀',   nameEn: 'Philippines',  missionaries: 2,  totalAmount: 1_200_000,  donorCount: 38,  campaigns: 1, coordinates: [121.8, 12.8],  status: 'active'   },
  Vietnam:     { nameKo: '베트남',   nameEn: 'Vietnam',      missionaries: 1,  totalAmount: 670_000,    donorCount: 22,  campaigns: 1, coordinates: [108.3, 14.1],  status: 'active'   },
  Nepal:       { nameKo: '네팔',     nameEn: 'Nepal',        missionaries: 1,  totalAmount: 310_000,    donorCount: 11,  campaigns: 1, coordinates: [84.1, 28.4],   status: 'planning' },
}

const ALL_COUNTRIES = Object.entries(COUNTRY_DATA)

const TOTAL_MISSIONARIES = ALL_COUNTRIES.reduce((s, [, d]) => s + d.missionaries, 0)
const TOTAL_AMOUNT       = ALL_COUNTRIES.reduce((s, [, d]) => s + d.totalAmount, 0)
const TOTAL_DONORS       = ALL_COUNTRIES.reduce((s, [, d]) => s + d.donorCount, 0)
const ACTIVE_COUNTRIES   = ALL_COUNTRIES.filter(([, d]) => d.status !== 'planning').length

// Choropleth fill by total amount
function getFill(nameEn: string): string {
  const d = COUNTRY_DATA[nameEn]
  if (!d) return 'oklch(0.93 0 0)'
  if (d.totalAmount >= 5_000_000) return 'oklch(0.45 0.14 195)'
  if (d.totalAmount >= 2_000_000) return 'oklch(0.58 0.12 195)'
  if (d.totalAmount >= 800_000)   return 'oklch(0.72 0.09 195)'
  return 'oklch(0.82 0.06 195)'
}

function formatKRW(v: number) {
  if (v >= 10_000) return `${Math.floor(v / 10_000).toLocaleString()}만원`
  return `${v.toLocaleString()}원`
}

const STATUS_LABEL: Record<string, string> = { active: '활성', urgent: '긴급', planning: '준비중' }
const STATUS_COLOR: Record<string, string> = {
  active:   'bg-accent text-accent-foreground',
  urgent:   'bg-[oklch(0.96_0.05_80)] text-[oklch(0.45_0.14_60)]',
  planning: 'bg-muted text-muted-foreground',
}

const BAR_DATA = ALL_COUNTRIES
  .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
  .map(([, d]) => ({ name: d.nameKo, amount: d.totalAmount, missionaries: d.missionaries }))

export function WorldMapTab() {
  const [selected, setSelected] = useState<string | null>(null)
  const [barView, setBarView]   = useState<'amount' | 'missionaries'>('amount')
  const [sortBy, setSortBy]     = useState<'amount' | 'missionaries' | 'donors'>('amount')
  const [sortDir, setSortDir]   = useState<'desc' | 'asc'>('desc')
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoverTip, setHoverTip] = useState<{
    nameKo: string
    nameEn: string
    hasMission: boolean
    x: number
    y: number
  } | null>(null)

  const selectedData = selected ? COUNTRY_DATA[selected] : null

  function handleSort(col: typeof sortBy) {
    if (sortBy === col) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSortBy(col); setSortDir('desc') }
  }

  const sortedCountries = [...ALL_COUNTRIES].sort(([, a], [, b]) => {
    const av = sortBy === 'amount' ? a.totalAmount : sortBy === 'missionaries' ? a.missionaries : a.donorCount
    const bv = sortBy === 'amount' ? b.totalAmount : sortBy === 'missionaries' ? b.missionaries : b.donorCount
    return sortDir === 'desc' ? bv - av : av - bv
  })

  return (
    <div className="space-y-8">

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '파송 선교사', value: `${TOTAL_MISSIONARIES}명`,   icon: Users,      bg: 'bg-accent' },
          { label: '사역 국가',   value: `${ALL_COUNTRIES.length}개국`, icon: Globe,      bg: 'bg-accent' },
          { label: '활성 국가',   value: `${ACTIVE_COUNTRIES}개국`,    icon: Heart,      bg: 'bg-accent' },
          { label: '총 누적 모금',value: formatKRW(TOTAL_AMOUNT),      icon: TrendingUp, bg: 'bg-accent' },
        ].map((k) => (
          <div key={k.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', k.bg)}>
              <k.icon size={18} className="text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Map + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-foreground">국가별 사역 지도</h2>
              <p className="text-xs text-muted-foreground mt-0.5">색상이 짙을수록 누적 모금액이 높습니다. 나라에 마우스를 올리면 국명이 표시됩니다.</p>
            </div>
            <div className="flex gap-2 items-center flex-wrap justify-end">
              {[
                { color: 'oklch(0.82 0.06 195)', label: '준비중' },
                { color: 'oklch(0.58 0.12 195)', label: '활성' },
                { color: 'oklch(0.45 0.14 195)', label: '고액' },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <div ref={mapRef} className="relative w-full bg-[oklch(0.97_0.01_220)]">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 320, center: [90, 20] }}
              style={{ width: '100%', height: 'auto' }}
              viewBox="0 0 800 500"
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const numId = String(geo.id ?? '').padStart(3, '0')
                    const nameEn = COUNTRY_MAP[numId]
                    const handleHover = (evt: React.MouseEvent) => {
                      const rect = mapRef.current?.getBoundingClientRect()
                      if (!rect) return
                      const label = countryLabel(geo)
                      setHoverTip({
                        ...label,
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top,
                      })
                    }
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => nameEn && setSelected(nameEn === selected ? null : nameEn)}
                        onMouseEnter={handleHover}
                        onMouseMove={handleHover}
                        onMouseLeave={() => setHoverTip(null)}
                        style={{
                          default: {
                            fill: nameEn ? getFill(nameEn) : 'oklch(0.93 0 0)',
                            stroke: 'oklch(0.98 0 0)',
                            strokeWidth: 0.5,
                            outline: 'none',
                          },
                          hover: {
                            fill: nameEn ? 'oklch(0.45 0.14 195)' : 'oklch(0.85 0.02 220)',
                            stroke: 'oklch(0.52 0.12 195)',
                            strokeWidth: nameEn ? 0.5 : 0.8,
                            outline: 'none',
                            cursor: nameEn ? 'pointer' : 'default',
                          },
                          pressed: {
                            fill: 'oklch(0.38 0.15 195)',
                            outline: 'none',
                          },
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Markers */}
              {ALL_COUNTRIES.map(([nameEn, d]) => (
                <Marker
                  key={nameEn}
                  coordinates={d.coordinates}
                  onClick={() => setSelected(nameEn === selected ? null : nameEn)}
                  onMouseEnter={(evt: React.MouseEvent) => {
                    const rect = mapRef.current?.getBoundingClientRect()
                    if (!rect) return
                    setHoverTip({
                      nameKo: d.nameKo,
                      nameEn: d.nameEn,
                      hasMission: true,
                      x: evt.clientX - rect.left,
                      y: evt.clientY - rect.top,
                    })
                  }}
                  onMouseMove={(evt: React.MouseEvent) => {
                    const rect = mapRef.current?.getBoundingClientRect()
                    if (!rect) return
                    setHoverTip((prev) =>
                      prev
                        ? { ...prev, x: evt.clientX - rect.left, y: evt.clientY - rect.top }
                        : prev,
                    )
                  }}
                  onMouseLeave={() => setHoverTip(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r={d.missionaries * 2.2 + 4}
                    fill={nameEn === selected ? 'oklch(0.72 0.18 60)' : 'oklch(0.52 0.12 195)'}
                    fillOpacity={0.85}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                  <text
                    textAnchor="middle"
                    y={1}
                    style={{ fontFamily: 'sans-serif', fontSize: 7, fill: 'white', fontWeight: 700, pointerEvents: 'none' }}
                  >
                    {d.missionaries}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
            {hoverTip && (
              <div
                role="tooltip"
                className="pointer-events-none absolute z-10 min-w-[8.5rem] rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
                style={{
                  left: Math.min(hoverTip.x + 14, (mapRef.current?.clientWidth ?? 320) - 160),
                  top: Math.max(8, hoverTip.y - 52),
                }}
              >
                <p className="text-sm font-bold text-foreground leading-tight">{hoverTip.nameKo}</p>
                {hoverTip.nameEn && hoverTip.nameEn !== hoverTip.nameKo && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">{hoverTip.nameEn}</p>
                )}
                <p className="text-[11px] mt-1 text-muted-foreground">
                  {hoverTip.hasMission ? '파송 선교사 있음 · 클릭하여 상세 보기' : '파송 선교사 없음'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex flex-col">
          {selectedData ? (
            <div className="space-y-5 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedData.nameKo}</h3>
                  <p className="text-xs text-muted-foreground">{selectedData.nameEn}</p>
                </div>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0', STATUS_COLOR[selectedData.status])}>
                  {STATUS_LABEL[selectedData.status]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '파송 선교사', value: `${selectedData.missionaries}명` },
                  { label: '활성 프로젝트', value: `${selectedData.campaigns}건` },
                  { label: '후원자 수',   value: `${selectedData.donorCount.toLocaleString()}명` },
                  { label: '누적 모금액', value: formatKRW(selectedData.totalAmount) },
                ].map((s) => (
                  <div key={s.label} className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">모금 비중</span>
                  <span className="font-semibold text-primary">{Math.round((selectedData.totalAmount / TOTAL_AMOUNT) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((selectedData.totalAmount / TOTAL_AMOUNT) * 100)}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-full mt-auto py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl transition-colors"
              >
                선택 해제
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center gap-3 py-8">
              <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center">
                <Globe size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">국가를 선택하세요</p>
                <p className="text-xs text-muted-foreground mt-1">지도의 마커 또는 국가를<br />클릭하면 상세 현황이 표시됩니다.</p>
              </div>
              <div className="w-full mt-2 space-y-2">
                {ALL_COUNTRIES.slice(0, 4).map(([nameEn, d]) => (
                  <button
                    key={nameEn}
                    onClick={() => setSelected(nameEn)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-muted transition-colors text-sm"
                  >
                    <span className="font-medium text-foreground">{d.nameKo}</span>
                    <span className="text-muted-foreground text-xs">{d.missionaries}명 · {formatKRW(d.totalAmount)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-foreground">국가별 비교</h2>
            <p className="text-xs text-muted-foreground mt-0.5">전체 {ALL_COUNTRIES.length}개국</p>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(['amount', 'missionaries'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setBarView(v)}
                className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-md transition-colors',
                  barView === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {v === 'amount' ? '모금액' : '선교사 수'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={BAR_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0 0)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: 'oklch(0.50 0 0)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => barView === 'amount' ? `${v / 10_000}만` : `${v}명`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '0.75rem', border: '1px solid oklch(0.91 0 0)', fontSize: 12 }}
              formatter={(v) =>
                barView === 'amount'
                  ? [`${(Number(v ?? 0) / 10_000).toLocaleString()}만원`, '누적 모금액']
                  : [`${Number(v ?? 0)}명`, '파송 선교사']
              }
            />
            <Bar dataKey={barView === 'amount' ? 'amount' : 'missionaries'} radius={[6, 6, 0, 0]}>
              {BAR_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === (selected ? COUNTRY_DATA[selected]?.nameKo : null) ? 'oklch(0.72 0.18 60)' : 'oklch(0.52 0.12 195)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Country table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground">국가별 사역 현황 목록</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">총 {ALL_COUNTRIES.length}개국</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left font-semibold text-muted-foreground px-6 py-3">국가</th>
                <th className="text-center font-semibold text-muted-foreground px-4 py-3">상태</th>
                <SortTh col="missionaries" label="선교사 수" current={sortBy} dir={sortDir} onSort={handleSort} />
                <SortTh col="donors"       label="후원자 수" current={sortBy} dir={sortDir} onSort={handleSort} />
                <SortTh col="amount"       label="누적 모금액" current={sortBy} dir={sortDir} onSort={handleSort} />
                <th className="text-right font-semibold text-muted-foreground px-4 py-3">프로젝트</th>
              </tr>
            </thead>
            <tbody>
              {sortedCountries.map(([nameEn, d], i) => (
                <tr
                  key={nameEn}
                  onClick={() => setSelected(nameEn === selected ? null : nameEn)}
                  className={cn(
                    'border-b border-border last:border-0 cursor-pointer transition-colors',
                    nameEn === selected ? 'bg-accent/40' : i % 2 === 1 ? 'bg-muted/10 hover:bg-muted/30' : 'hover:bg-muted/20'
                  )}
                >
                  <td className="px-6 py-3.5 font-medium text-foreground">
                    <span className="font-semibold">{d.nameKo}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">{d.nameEn}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_COLOR[d.status])}>
                      {STATUS_LABEL[d.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold text-foreground">{d.missionaries}명</td>
                  <td className="px-4 py-3.5 text-center text-muted-foreground">{d.donorCount.toLocaleString()}명</td>
                  <td className="px-4 py-3.5 text-right font-semibold text-primary">{formatKRW(d.totalAmount)}</td>
                  <td className="px-4 py-3.5 text-right text-muted-foreground">{d.campaigns}건</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SortTh({
  col, label, current, dir, onSort,
}: {
  col: 'missionaries' | 'donors' | 'amount'
  label: string
  current: string
  dir: 'asc' | 'desc'
  onSort: (col: 'missionaries' | 'donors' | 'amount') => void
}) {
  const active = current === col
  return (
    <th
      className="text-right font-semibold text-muted-foreground px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1 justify-end">
        {label}
        {active ? (
          dir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />
        ) : (
          <ChevronDown size={12} className="opacity-30" />
        )}
      </span>
    </th>
  )
}
