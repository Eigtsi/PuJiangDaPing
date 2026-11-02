/**
 * Excel 导出工具 — 浦江大屏各分析面板通用
 * 使用 SheetJS（xlsx）生成真正的 .xlsx 文件，直接下载（非 CSV）
 */
import * as XLSX from 'xlsx'

/** 计算字符串显示宽度（中文按 2 列宽计） */
function displayWidth(s: string): number {
  let w = 0
  for (const ch of s) w += ch.charCodeAt(0) > 255 ? 2 : 1
  return w
}

/**
 * 导出 .xlsx 并触发浏览器下载
 * @param filename 下载文件名（不含扩展名，内部补 .xlsx）
 * @param headers  表头数组
 * @param rows     数据行（二维数组，每行与表头等长）
 */
export function downloadExcel(
  filename: string,
  headers: (string | number)[],
  rows: (string | number)[][],
): void {
  const aoa: (string | number)[][] = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(aoa)

  // 按内容估算列宽（限制在合理区间）
  const colCount = headers.length
  ws['!cols'] = Array.from({ length: colCount }, (_, c) => {
    let max = displayWidth(String(headers[c] ?? ''))
    for (const r of rows) max = Math.max(max, displayWidth(String(r[c] ?? '')))
    return { wch: Math.min(Math.max(max + 2, 8), 28) }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '数据')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}
