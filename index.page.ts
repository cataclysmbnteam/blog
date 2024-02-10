export const layout = "base.ts"
export const title = "카타클리즘: 밝은 밤 변경 내역"

type Renderer = (content: string, inline?: boolean | undefined) => string

export const time = (time: string): string => /*html*/ `
    <time datetime="${time}">${time}</time>
`

export const section = (render: Renderer) => (page: Lume.Page["data"]): string => /*html*/ `
    <article>
        <h2 id="${page.basename}">
            <a href="#${page.basename}">${page.basename}</a>
        </h2>
        ${render(page.content as string)}
    </article>`

export default ({ search }: Lume.Data, { md }: Lume.Helpers): string => {
	const pages = search.pages()
		.filter((page) => page.page.src.ext === ".md")
		.reverse()

	const [newest, oldest] = [pages[0], pages.at(-1)!]

	return /*html*/ `
        <!-- 기간: ${time(oldest.basename)}/${time(newest.basename)} -->
        <section>
            ${pages.map(section(md)).join("\n")}
        </section>
    `
}
