/**
 * 中部/东部/西部产业园 真实地理数据（来源：项目实施/资料文件/园区档案/中部产业园1.kml、东部产业园1.kml、西部产业园1.kml）
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

export interface ParkBounds {
  west: number
  east: number
  south: number
  north: number
}

export interface ParkData {
  polygon: [number, number][]
  buildings: ParkBuilding[]
  bounds: ParkBounds
  center: [number, number]
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

// ===== 转换辅助 =====
function toGcj02Polygon(raw: [number, number][]): [number, number][] {
  return raw.map(([lng, lat]) => wgs84ToGcj02(lng, lat))
}

function toGcj02Buildings(raw: ParkBuilding[]): ParkBuilding[] {
  return raw.map(b => {
    const [lng, lat] = wgs84ToGcj02(b.lng, b.lat)
    return { name: b.name, lng, lat }
  })
}

function boundsOf(polygon: [number, number][]): ParkBounds {
  const lngs = polygon.map(p => p[0])
  const lats = polygon.map(p => p[1])
  return {
    west: Math.min(...lngs),
    east: Math.max(...lngs),
    south: Math.min(...lats),
    north: Math.max(...lats),
  }
}

function centerOf(b: ParkBounds): [number, number] {
  return [(b.west + b.east) / 2, (b.south + b.north) / 2]
}

// ===== 中部产业园 园区边界（KML Polygon outerBoundaryIs，原始 WGS-84） =====
const centerParkPolygonRaw: [number, number][] = [
  [119.940281882431, 29.485293634689],
  [119.943232312347, 29.484606989181],
  [119.944750442650, 29.483421452797],
  [119.943559541847, 29.480084784782],
  [119.942073598053, 29.480036505020],
  [119.940528645660, 29.480283268249],
  [119.939981475021, 29.480240352905],
  [119.939015879776, 29.480572946823],
]

// ===== 中部产业园 楼栋点位（KML Point 地标，原始 WGS-84） =====
const centerParkBuildingsRaw: ParkBuilding[] = [
  { name: '1#', lng: 119.942577853, lat: 29.480293997 },
  { name: '2#', lng: 119.941606894, lat: 29.480503209 },
  { name: '3#', lng: 119.940566197, lat: 29.480782159 },
  { name: '4#', lng: 119.939675703, lat: 29.480991371 },
  { name: 'E', lng: 119.941483512, lat: 29.480234988 },
  { name: 'F', lng: 119.940507188, lat: 29.480487116 },
  { name: 'G', lng: 119.939573779, lat: 29.480605133 },
  { name: '5#', lng: 119.942663684, lat: 29.480519303 },
  { name: '6#', lng: 119.941698089, lat: 29.480755337 },
  { name: '7#', lng: 119.940652027, lat: 29.481007465 },
  { name: '8#', lng: 119.939729347, lat: 29.48123277 },
  { name: '9#', lng: 119.942749515, lat: 29.480776795 },
  { name: '10#', lng: 119.941783919, lat: 29.481055744 },
  { name: '11#', lng: 119.940705671, lat: 29.481318601 },
  { name: '12#', lng: 119.942842051, lat: 29.481067814 },
  { name: '13#', lng: 119.941879138, lat: 29.481295802 },
  { name: '14#', lng: 119.94077675, lat: 29.481561341 },
  { name: '15#', lng: 119.942903742, lat: 29.481338717 },
  { name: '16#', lng: 119.941959604, lat: 29.481555976 },
  { name: '17#', lng: 119.940865263, lat: 29.481834926 },
  { name: '18#', lng: 119.942029342, lat: 29.481809445 },
  { name: '19#', lng: 119.940964505, lat: 29.482072302 },
  { name: '20#', lng: 119.942117855, lat: 29.48206962 },
  { name: '21#', lng: 119.941042289, lat: 29.482337841 },
  { name: '22#', lng: 119.940229579, lat: 29.482544371 },
  { name: '23#', lng: 119.942268058, lat: 29.482560464 },
  { name: '24#', lng: 119.941168353, lat: 29.482834049 },
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
  { name: '44#', lng: 119.942874237, lat: 29.484373637 },
  { name: '45#', lng: 119.941798672, lat: 29.484631129 },
  { name: '46#', lng: 119.940843805, lat: 29.484853753 },
  { name: '宿舍楼', lng: 119.943629279, lat: 29.483668216 },
  { name: '综合楼A', lng: 119.943170622, lat: 29.482407578 },
  { name: '综合楼B', lng: 119.942961409, lat: 29.481610962 },
  { name: '综合楼C', lng: 119.944061115, lat: 29.482662388 },
  { name: '综合楼D', lng: 119.943567588, lat: 29.481069155 },
]

// ===== 东部产业园 园区边界（KML Polygon outerBoundaryIs，原始 WGS-84） =====
const eastParkPolygonRaw: [number, number][] = [
  [119.981278603802, 29.4833164933929],
  [119.981275921593, 29.4834935191879],
  [119.981308108101, 29.4835149768601],
  [119.982713585625, 29.4831153277168],
  [119.983687227497, 29.4828363779793],
  [119.98684665514, 29.4817435387383],
  [119.98715862287, 29.4804310936342],
  [119.985205974708, 29.4801481205831],
  [119.985484924445, 29.4785193357478],
  [119.984803643355, 29.4784281406413],
  [119.984664168487, 29.4790611419688],
  [119.982389655242, 29.4786480817805],
  [119.981278603802, 29.4833164933929],
]

// ===== 东部产业园 楼栋点位（KML Point 地标，原始 WGS-84） =====
const eastParkBuildingsRaw: ParkBuilding[] = [
  { name: '1#', lng: 119.98273566, lat: 29.478760735 },
  { name: '2#', lng: 119.982679334, lat: 29.479018227 },
  { name: '3#', lng: 119.98262569, lat: 29.479297176 },
  { name: '4#', lng: 119.982572045, lat: 29.479538575 },
  { name: '5#', lng: 119.982510355, lat: 29.479847029 },
  { name: '6#', lng: 119.982437935, lat: 29.480093792 },
  { name: '7#', lng: 119.98237088, lat: 29.480372742 },
  { name: '8#', lng: 119.982327964, lat: 29.480616823 },
  { name: '9#', lng: 119.982263591, lat: 29.480882362 },
  { name: '10#', lng: 119.982207265, lat: 29.481153265 },
  { name: '11#', lng: 119.982161667, lat: 29.481421486 },
  { name: '12#', lng: 119.982108023, lat: 29.481673614 },
  { name: '13#', lng: 119.981700944, lat: 29.482593611 },
  { name: '14#', lng: 119.983462539, lat: 29.478881434 },
  { name: '15#', lng: 119.98342767, lat: 29.479136244 },
  { name: '16#', lng: 119.983368662, lat: 29.4793991 },
  { name: '17#', lng: 119.983315017, lat: 29.479656592 },
  { name: '18#', lng: 119.983250644, lat: 29.479970411 },
  { name: '19#', lng: 119.983213093, lat: 29.480214492 },
  { name: '20#', lng: 119.983137992, lat: 29.480496124 },
  { name: '21#', lng: 119.983097758, lat: 29.480745569 },
  { name: '22#', lng: 119.983033385, lat: 29.481040612 },
  { name: '23#', lng: 119.982974377, lat: 29.481287375 },
  { name: '24#', lng: 119.982920733, lat: 29.481552914 },
  { name: '25#', lng: 119.984224286, lat: 29.479015544 },
  { name: '26#', lng: 119.984200146, lat: 29.479267672 },
  { name: '27#', lng: 119.984127727, lat: 29.479533211 },
  { name: '28#', lng: 119.984092858, lat: 29.479785338 },
  { name: '29#', lng: 119.983998981, lat: 29.480101839 },
  { name: '30#', lng: 119.983908402, lat: 29.480337873 },
  { name: '31#', lng: 119.983838665, lat: 29.480606094 },
  { name: '32#', lng: 119.98377161, lat: 29.480858222 },
  { name: '33#', lng: 119.983734059, lat: 29.481126443 },
  { name: '34#', lng: 119.983653593, lat: 29.481394664 },
  { name: '35#', lng: 119.984699654, lat: 29.480214492 },
  { name: '36#', lng: 119.984648692, lat: 29.480447844 },
  { name: '37#', lng: 119.984603095, lat: 29.480721429 },
  { name: '38#', lng: 119.984554815, lat: 29.481000379 },
  { name: '39#', lng: 119.985423851, lat: 29.480348602 },
  { name: '40#', lng: 119.985372889, lat: 29.480598048 },
  { name: '41#', lng: 119.986123907, lat: 29.480453208 },
  { name: '42#', lng: 119.986105132, lat: 29.480708018 },
  { name: '43#', lng: 119.985316562, lat: 29.480852858 },
  { name: '44#', lng: 119.985264967, lat: 29.481187999 },
  { name: '45#', lng: 119.984570275, lat: 29.481426716 },
  { name: '46#', lng: 119.984696339, lat: 29.481724441 },
  { name: '47#', lng: 119.984776805, lat: 29.481973886 },
  { name: '48#', lng: 119.983817207, lat: 29.481673614 },
  { name: '49#', lng: 119.983932542, lat: 29.481963292 },
  { name: '50#', lng: 119.984023737, lat: 29.48221542 },
  { name: '51#', lng: 119.983058142, lat: 29.481917695 },
  { name: '52#', lng: 119.983181524, lat: 29.482218102 },
  { name: '53#', lng: 119.983256626, lat: 29.482462183 },
  { name: '54#', lng: 119.982154238, lat: 29.482218102 },
  { name: '55#', lng: 119.982269573, lat: 29.482521192 },
  { name: '56#', lng: 119.982368814, lat: 29.482765273 },
  { name: '综合楼A', lng: 119.985557328, lat: 29.481692254 },
  { name: '综合楼B', lng: 119.986514877, lat: 29.481378436 },
  { name: 'C楼', lng: 119.986669104, lat: 29.48083663 },
  { name: 'D楼', lng: 119.986756276, lat: 29.480462462 },
]

// ===== 西部产业园 园区边界（KML Polygon outerBoundaryIs，原始 WGS-84） =====
const westParkPolygonRaw: [number, number][] = [
  [119.870638902336, 29.5689102098503],
  [119.871561582237, 29.5690121337929],
  [119.872462804466, 29.569215981678],
  [119.87253522411, 29.5692401215591],
  [119.872819538265, 29.56885656567],
  [119.873237962872, 29.5689316675224],
  [119.873492772728, 29.5691006466904],
  [119.873664434105, 29.5691274687805],
  [119.873811955601, 29.5691086933174],
  [119.873790497929, 29.5688136503258],
  [119.874243791252, 29.5688270613708],
  [119.874251837879, 29.5686178490677],
  [119.87438594833, 29.5686258956947],
  [119.874436910301, 29.5680921361008],
  [119.874348397404, 29.5676978513756],
  [119.874166007191, 29.5673816725769],
  [119.873873646408, 29.5670785829582],
  [119.872985835224, 29.5670812651672],
  [119.872500355392, 29.5670839473763],
  [119.872264320999, 29.5671214983025],
  [119.872151668221, 29.5671697780647],
  [119.872103388458, 29.5673146173515],
  [119.871883447319, 29.5674782321015],
  [119.871478433758, 29.5674675032654],
  [119.871140475422, 29.5673441216507],
  [119.871070737988, 29.5673119351425],
  [119.87076496616, 29.5674675032654],
  [119.870606715828, 29.5678537413635],
  [119.87060135141, 29.5688948676147],
  [119.870638902336, 29.5689102098503],
]

// ===== 西部产业园 楼栋点位（KML Point 地标，原始 WGS-84） =====
const westParkBuildingsRaw: ParkBuilding[] = [
  { name: '1#', lng: 119.870976861, lat: 29.568648104 },
  { name: '2#', lng: 119.870955403, lat: 29.56838793 },
  { name: '3#', lng: 119.870955403, lat: 29.568119709 },
  { name: '4#', lng: 119.870952721, lat: 29.567859535 },
  { name: '5#', lng: 119.871143158, lat: 29.567602043 },
  { name: '6#', lng: 119.871902223, lat: 29.568916325 },
  { name: '7#', lng: 119.87181371, lat: 29.568634693 },
  { name: '8#', lng: 119.87181371, lat: 29.568390612 },
  { name: '9#', lng: 119.871821757, lat: 29.568125074 },
  { name: '10#', lng: 119.871819074, lat: 29.567870264 },
  { name: '11#', lng: 119.871819074, lat: 29.567593996 },
  { name: '12#', lng: 119.872470851, lat: 29.568956558 },
  { name: '13#', lng: 119.872519131, lat: 29.568610553 },
  { name: '14#', lng: 119.872519131, lat: 29.568342333 },
  { name: '15#', lng: 119.872524495, lat: 29.568092887 },
  { name: '16#', lng: 119.87252986, lat: 29.56776834 },
  { name: '17#', lng: 119.872527177, lat: 29.567518894 },
  { name: '18#', lng: 119.872535224, lat: 29.567239945 },
  { name: '19#', lng: 119.87335598, lat: 29.568602507 },
  { name: '20#', lng: 119.873364027, lat: 29.568336968 },
  { name: '21#', lng: 119.873361344, lat: 29.568082158 },
  { name: '22#', lng: 119.873372073, lat: 29.567762975 },
  { name: '23#', lng: 119.873369391, lat: 29.567505483 },
  { name: '24#', lng: 119.873366709, lat: 29.567226534 },
  { name: '25#', lng: 119.874045308, lat: 29.568621282 },
  { name: '26#', lng: 119.874061401, lat: 29.568364542 },
  { name: '27#', lng: 119.874109681, lat: 29.568093638 },
  { name: '综合楼A', lng: 119.873972888, lat: 29.567495506 },
]

// ===== 转换后的高德 GCJ-02 数据 =====
export const centerParkPolygon: [number, number][] = toGcj02Polygon(centerParkPolygonRaw)
export const centerParkBuildings: ParkBuilding[] = toGcj02Buildings(centerParkBuildingsRaw)
export const centerParkBounds: ParkBounds = boundsOf(centerParkPolygon)
export const centerParkCenter: [number, number] = centerOf(centerParkBounds)

export const eastParkPolygon: [number, number][] = toGcj02Polygon(eastParkPolygonRaw)
export const eastParkBuildings: ParkBuilding[] = toGcj02Buildings(eastParkBuildingsRaw)
export const eastParkBounds: ParkBounds = boundsOf(eastParkPolygon)
export const eastParkCenter: [number, number] = centerOf(eastParkBounds)

export const westParkPolygon: [number, number][] = toGcj02Polygon(westParkPolygonRaw)
export const westParkBuildings: ParkBuilding[] = toGcj02Buildings(westParkBuildingsRaw)
export const westParkBounds: ParkBounds = boundsOf(westParkPolygon)
export const westParkCenter: [number, number] = centerOf(westParkBounds)

// 按园区 key 统一取 KML 地理数据
export const parks: Partial<Record<'east' | 'center' | 'west', ParkData>> = {
  center: { polygon: centerParkPolygon, buildings: centerParkBuildings, bounds: centerParkBounds, center: centerParkCenter },
  east: { polygon: eastParkPolygon, buildings: eastParkBuildings, bounds: eastParkBounds, center: eastParkCenter },
  west: { polygon: westParkPolygon, buildings: westParkBuildings, bounds: westParkBounds, center: westParkCenter },
}
