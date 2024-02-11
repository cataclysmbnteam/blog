export const repo = "https://github.com/scarf005/bn-blog"

const header = /*html*/ `
    <header>
        <h1>
            <a href="/">카타클리즘: 밝은 밤 블로그</a>
        </h1>
        <nav aria-labelledby="recent-changes-navigation">
            <a href="/ko/">최근 내역</a>
            <a href="/ko/pages">전체 내역</a>
        </nav>
    </header>
`

const footer = /*html*/ `
    <footer>
        © 2023 <a href="https://github.com/scarf005">scarf</a>
        | <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0-Only</a>
        | <a href="${repo}">Source</a>
    </footer>
`

const render = (title: string, { content, head = "" }: Lume.Data): string => /*html*/ `
    <!DOCTYPE html>
    <html lang="ko">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>
            <link rel="stylesheet" href="/assets/global.css" inline />
            ${head}
        </head>
        <body>
            ${header}
            <hr />
            ${content}
            ${footer}
        </body>
    </html>
`

export default (data: Lume.Data) => {
	const title = data.title ?? data.page.data.basename

	return render(title, data)
}
