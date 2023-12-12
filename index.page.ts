export const layout = "base.ts"
export const title = "카타클리즘: 밝은 밤 변경 내역"
export const head = /*html*/ `
    <link rel="stylesheet" href="/assets/list.css" inline />
`
type Renderer = (content: string) => string

export const time = (time: string): string => /*html*/ `
    <time datetime="${time}">${time}</time>
`

export const section = (render: Renderer) => (page: Lume.Page["data"]): string => /*html*/ `
    <li>
        <h2 id="${page.basename}">
            <a href="#${page.basename}">${page.basename}</a>
        </h2>
        ${render(page.content as string)}
    </li>`

export default ({ search }: Lume.Data, { md }: Lume.Helpers): string => {
	const pages = search.pages()
		.filter((page) => page.page.src.ext === ".md")
		.reverse()

	const [newest, oldest] = [pages[0], pages.at(-1)!]

	return /*html*/ `
        기간: ${time(oldest.basename)}/${time(newest.basename)}
        <ul>
            ${pages.map(section(md)).join("\n")}
        </ul>
    `
}
