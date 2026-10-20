/**
 * 中部产业园 真实地理数据（来源：项目实施/资料文件/园区档案/中部产业园.kml）
 *
 * KML 中的坐标由 Google Earth / 奥维等工具导出，为 WGS-84 坐标系；
 * 高德地图（AMap）使用 GCJ-02（火星坐标），二者在中国境内存在约数百米偏移，
 * 故此处统一做 WGS-84 → GCJ-02 转换，保证楼栋与高德卫星影像对齐。
 */

export interface ParkBuilding {
  name: string
  lng: number
  lat: number
}

// ===== WGS-84 → GCJ-02 坐标转换 =====
const PI = Math.PI
const A = 6378245.0
const EE = 0.00669342162296594323

function outOfChina(lng: number, lat: number): boolean {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271
}

function transformLat(x: number, y: number): number {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0
  return ret
}

function transformLng(x: number, y: number): number {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0
  return ret
}

export function wgs84ToGcj02(lng: number, lat: number): [number, number] {
  if (outOfChina(lng, lat)) return [lng, lat]
  let dLat = transformLat(lng - 105.0, lat - 35.0)
  let dLng = transformLng(lng - 105.0, lat - 35.0)
  const radLat = (lat / 180.0) * PI
  let magic = Math.sin(radLat)
  magic = 1 - EE * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI)
  dLng = (dLng * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI)
  return [lng + dLng, lat + dLat]
}

// ===== 园区边界（KML Polygon outerBoundaryIs，原始 WGS-84） =====
const centerParkPolygonRaw: [number, number][] = [
  [119.940281882431, 29.485293634689],
  [119.943232312347, 29.484606989182],
  [119.944305195953, 29.483598478592],
  [119.943092837479, 29.480036505020],
  [119.942073598053, 29.480036505020],
  [119.940528645660, 29.480283268250],
  [119.939981475021, 29.480240352905],
  [119.939015879776, 29.480572946823],
]

// ===== 楼栋点位（KML Point 地标，原始 WGS-84） =====
const centerParkBuildingsRaw: ParkBuilding[] = [
  { name: '1#', lng: 119.942577853, lat: 29.480293997 },
  { name: '2#', lng: 119.941606894, lat: 29.480503209 },
  { name: '3#', lng: 119.940566197, lat: 29.480782159 },
  { name: '3B#', lng: 119.939675703, lat: 29.480991371 },
  { name: '1仓库', lng: 119.941483512, lat: 29.480234988 },
  { name: '2仓库', lng: 119.940507188, lat: 29.480487116 },
  { name: '3仓库', lng: 119.939573779, lat: 29.480605133 },
  { name: '5#', lng: 119.942663684, lat: 29.480519303 },
  { name: '6#', lng: 119.941698089, lat: 29.480755337 },
  { name: '7#', lng: 119.940652027, lat: 29.481007465 },
  { name: '8#', lng: 119.939729347, lat: 29.48123277 },
  { name: '9#', lng: 119.942749515, lat: 29.480776795 },
  { name: '10#', lng: 119.941783919, lat: 29.481055744 },
  { name: '11#', lng: 119.940705671, lat: 29.481318601 },
  { name: '12#', lng: 119.942842051, lat: 29.481067814 },
  { name: '13#', lng: 119.941879138, lat: 29.481295802 },
  { name: '13B#', lng: 119.94077675, lat: 29.481561341 },
  { name: '15#', lng: 119.942903742, lat: 29.481338717 },
  { name: '16#', lng: 119.941959604, lat: 29.481555976 },
  { name: '17#', lng: 119.940865263, lat: 29.481834926 },
  { name: '18#', lng: 119.942029342, lat: 29.481809445 },
  { name: '19#', lng: 119.940964505, lat: 29.482072302 },
  { name: '20#', lng: 119.942117855, lat: 29.48206962 },
  { name: '21#', lng: 119.941042289, lat: 29.482337841 },
  { name: '22#', lng: 119.940229579, lat: 29.482544371 },
  { name: '23#', lng: 119.942268058, lat: 29.482560464 },
  { name: '23B#', lng: 119.941168353, lat: 29.482834049 },
  { name: '25#', lng: 119.940382465, lat: 29.483035215 },
  { name: '26#', lng: 119.942359253, lat: 29.48284746 },
  { name: '27#', lng: 119.941267594, lat: 29.48310227 },
  { name: '28#', lng: 119.940318092, lat: 29.483340987 },
  { name: '29#', lng: 119.942479953, lat: 29.483083495 },
  { name: '30#', lng: 119.941345378, lat: 29.48333294 },
  { name: '31#', lng: 119.940409287, lat: 29.483571657 },
  { name: '32#', lng: 119.942536279, lat: 29.483351716 },
  { name: '33#', lng: 119.941463396, lat: 29.483609208 },
  { name: '34#', lng: 119.940503165, lat: 29.483839878 },
  { name: '35#', lng: 119.942616745, lat: 29.483595797 },
  { name: '36#', lng: 119.941522404, lat: 29.483845242 },
  { name: '37#', lng: 119.940597042, lat: 29.484070548 },
  { name: '38#', lng: 119.942710623, lat: 29.483853289 },
  { name: '39#', lng: 119.941624328, lat: 29.48412151 },
  { name: '40#', lng: 119.940674826, lat: 29.484352179 },
  { name: '41#', lng: 119.942807182, lat: 29.484102734 },
  { name: '42#', lng: 119.941715523, lat: 29.484362908 },
  { name: '43#', lng: 119.940749928, lat: 29.484601625 },
  { name: '43B', lng: 119.942874237, lat: 29.484373637 },
  { name: '45#', lng: 119.941798672, lat: 29.484631129 },
  { name: '46#', lng: 119.940843805, lat: 29.484853753 },
]

// ===== 转换后的高德 GCJ-02 数据 =====
export const centerParkPolygon: [number, number][] = centerParkPolygonRaw.map(([lng, lat]) => wgs84ToGcj02(lng, lat))

export const centerParkBuildings: ParkBuilding[] = centerParkBuildingsRaw.map(b => {
  const [lng, lat] = wgs84ToGcj02(b.lng, b.lat)
  return { name: b.name, lng, lat }
})

const _lngs = centerParkPolygon.map(p => p[0])
const _lats = centerParkPolygon.map(p => p[1])

export const centerParkBounds = {
  west: Math.min(..._lngs),
  east: Math.max(..._lngs),
  south: Math.min(..._lats),
  north: Math.max(..._lats),
}

export const centerParkCenter: [number, number] = [
  (centerParkBounds.west + centerParkBounds.east) / 2,
  (centerParkBounds.south + centerParkBounds.north) / 2,
]
