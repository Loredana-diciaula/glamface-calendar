export const cn = (...c:(string|false|undefined)[])=>c.filter(Boolean).join(' ')
export const brand = process.env.NEXT_PUBLIC_BRAND_COLOR || '#F3EFE7'
export const textclr = process.env.NEXT_PUBLIC_TEXT_COLOR || '#000'
