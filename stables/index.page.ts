import { toUl } from "../index.page.ts"

export const lang = "ko"
export const category = "meta"
export const layout = "base.ts"

export default ({ search }: Lume.Data) => {
	const pages = search.pages(`category=stable lang=${lang}`)

	const titles = pages.map((page) => /*html*/ `
            <li>
                <h3>
                    <a href="${page.title}">${page.title}</a>
                </h3>
            </li>
        `)

	return /*html*/ `
        ${toUl(titles)}
    `
}
