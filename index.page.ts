import { mapValues } from "$std/collections/map_values.ts"
import { maxWith } from "$std/collections/max_with.ts"
import type { Data } from "lume/core/file.ts"

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

type WeeklyEntry = {
	isoWeek: string
	earliest: Temporal.PlainDate
	latest: Temporal.PlainDate
	range: string
	pages: Data[] | undefined
}

export default function* ({ search }: Lume.Data, { md }: Lume.Helpers) {
	const pages = search.pages(`category=post lang=${lang}`)

	const grouped = Object.groupBy(pages, (page) => {
		const plainDate = Temporal.PlainDate.from(toISODate(page.date))

		// FIXME: yearOfWeek != year in some cases
		// use `yearOfWeek` after https://github.com/denoland/deno/issues/22385 is fixed
		return `${plainDate.year}-W${`${plainDate.weekOfYear}`.padStart(2, "0")}`
	})

	const weeklyData: WeeklyEntry[] = Object.entries(grouped).map(([isoWeek, pages]) => {
		const earliest = toPlainDate(pages!.reduce((a, b) => (a.date < b.date ? a : b)).date)
		const latest = toPlainDate(pages!.reduce((a, b) => (a.date > b.date ? a : b)).date)
		const range = localeFormatter.formatRange(earliest, latest)

		return { isoWeek, earliest, latest, range, pages }
	})

	const weekly = weeklyData.map(({ isoWeek, pages, earliest, latest, range }) => ({
		lang,
		latest,
		earliest,
		url: `/pages/${isoWeek}/`,
		title: isoWeek,
		content: /*html*/ `
            <main>
                <header>
                    <h1>${range}</h1>
                    <a href="/${lang}/pages/${isoWeek}/">${time(isoWeek)}</a>
                </header>
                <hr />
                ${pages!.map(article(md)).join("\n")}
            </main>
        `,
	}))

	const weeklySummary = weeklyData.map(({ isoWeek, pages, range }) => ({
		lang,
		url: `/${lang}/pages/${isoWeek}/summary.txt`,
		title: `${range} 변경 내역`,
		layout: null,
		content: pages!
			.map((page) =>
				page.basename + "\n" + (page.content as string)
					.replace(/!\[.*\]\(.*\)\n/g, "")
					// remove all html tags
					.replace(/<[^>]*>.*\n/g, "")
					// strip away all markdown links into `- {text}`
					.replace(/\[([^\]]*)\]\([^)]*\)\n+/g, "$1\n")
					// convert all headers to `*`
					.replace(/#+\s*(.*)\n+/g, "\n* $1\n\n") +
				"\n"
			).join("\n"),
	}))

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

	const last14days = pages
		.toSorted((a, b) => Temporal.PlainDate.compare(toPlainDate(b.date), toPlainDate(a.date)))
		.slice(0, 14)

	yield {
		lang,
		url: `/${lang}/`,
		title: "최근 변경 내역",
		content: /*html*/ `
            <main>
                <header>
                    <h1>${
			localeFormatter.formatRange(last14days.at(-1)!.date, last14days.at(0)!.date)
		}</h1>
                </header>
                <hr />
                ${last14days.map(article(md)).join("\n")}
            </main>
        `,
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
	yield* weeklySummary
}
