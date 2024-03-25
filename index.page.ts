import { mapValues } from "$std/collections/map_values.ts"
import { maxWith } from "$std/collections/max_with.ts"

export const layout = "base.ts"
export const lang = "ko"

type Renderer = (content: string, inline?: boolean | undefined) => string

export const article = (render: Renderer) => (page: Lume.Page["data"]): string => /*html*/ `
    <article>
        <h2 id="${page.basename}">
            <a href="#${page.basename}">${page.basename}</a>
        </h2>
        ${render(page.content as string)}
    </article>`

export const toUl = (xs?: string[]) => xs ? /*html*/ `<ul>${xs.join("\n")}</ul>` : ""

export const toISODate = (date: Date) => date.toISOString().split("T")[0]
export const time = (x: string | Temporal.PlainDate) => /*html*/ `<time datetime="${x}">${x}</time>`
export const toPlainDate = (x: Date) => Temporal.PlainDate.from(toISODate(x))

const localeFormatter = new Intl.DateTimeFormat("ko-KR", {
	month: "2-digit",
	day: "2-digit",
	weekday: "narrow",
})

export default function* ({ search }: Lume.Data, { md }: Lume.Helpers) {
	const pages = search.pages(`category=post lang=${lang}`)

	const grouped = Object.groupBy(pages, (page) => {
		const plainDate = Temporal.PlainDate.from(toISODate(page.date))

		// FIXME: yearOfWeek != year in some cases
		// use `yearOfWeek` after https://github.com/denoland/deno/issues/22385 is fixed
		return `${plainDate.year}-W${`${plainDate.weekOfYear}`.padStart(2, "0")}`
	})
	const weekly = Object.entries(grouped).map(([isoWeek, pages]) => {
		const earliest = toPlainDate(pages!.reduce((a, b) => (a.date < b.date ? a : b)).date)
		const latest = toPlainDate(pages!.reduce((a, b) => (a.date > b.date ? a : b)).date)
		const range = localeFormatter.formatRange(earliest, latest)

		const content = /*html*/ `
            <main>
                <header>
                    <h1>${range}</h1>
                    ${time(isoWeek)}
                </header>
                <hr />
                ${pages!.map(article(md)).join("\n")}
            </main>
        `

		return {
            lang,
			url: `/pages/${isoWeek}/`,
			title: isoWeek,
			content,
			earliest,
			latest,
		}
	})

	const yearly = Object.groupBy(weekly, (page) => page.earliest.year)
	const monthly = mapValues(
		yearly,
		(months) => Object.groupBy(months!, (page) => page.earliest.month),
	)
	const links = Object.entries(monthly).map(([year, months]) => {
		const result = Object.entries(months).map(([month, weeks]) => {
			const result = weeks!.map((page) => /*html*/ `
                <li>
                    <a href="/${lang}/${page.url}">
                    ${localeFormatter.formatRange(page.earliest, page.latest)}
                    </a>
                </li>
            `)
			return /*html*/ `<li>${`${month}`.padStart(2, "0")}${toUl(result)}</li>`
		})

		return /*html*/ `
            <li>
                <h2>${year}</h2>
                ${toUl(result)}
            </li>
        `
	})

	const latestContent =
		maxWith(weekly, (a, b) => Temporal.PlainDate.compare(a.latest, b.latest))!.content

	yield {
		lang,
		url: `/${lang}/`,
		title: "최근 변경 내역",
		content: latestContent,
	}
	yield {
		lang,
		url: `/${lang}/pages/`,
		title: "전체 변경 내역",
		head: /*html*/ `
            <link rel="stylesheet" href="/assets/pages.css" inline />
        `,
		content: /*html*/ `
            <nav aria-labelledby="pages-archive-navigation">
                ${toUl(links)}
            </nav>
        `,
	}
	yield* weekly
}
