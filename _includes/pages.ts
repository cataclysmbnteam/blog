import type { NavData } from "lume/plugins/nav.ts"

export const layout = "base.ts"
export const head = /*html*/ `
    <link rel="stylesheet" href="/assets/pages.css" inline />
`

export const toUl = (xs?: string[]) => xs ? /*html*/ `<ul>${xs.join("\n")}</ul>` : ""

const days = (month: NavData) =>
	month.children?.map((day) => /*html*/ `<li><a href="${day.data?.url}">${day.slug}</a></li>`)

const months = (year: NavData) =>
	year.children?.map((month) => /*html*/ `<li><h3>${month.slug}</h3>${toUl(days(month))}</li>`)

const years = (nav: NavData | undefined) =>
	nav?.children?.map((year) => /*html*/ `<li><h2>${year.slug}</h2>${toUl(months(year))}</li>`)

export default ({ title, nav, children }: Lume.Data) => /*html*/ `
    <article>
        <aside>
            <nav aria-labelledby="pages-archive-navigation">
                ${toUl(years(nav.menu("/pages/")))}
            </nav>
        </aside>
        <main>
            <h1>${title}</h1>
            ${children}
        </main>
    </article>
`
