import { basename } from "https://deno.land/std@0.215.0/path/basename.ts"

export const lang = "ko"
export const category = "post"
export const layout = "pages.ts"
export const url = (page: Lume.Page) => `/pages/${basename(page.data.url)}/`
