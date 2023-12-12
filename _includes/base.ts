export const repo = "https://github.com/scarf005/bn-blog"

const footer = /*html*/ `
    <footer>
        © 2023 <a href="https://github.com/scarf005">scarf</a>
        | <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL-3.0-Only</a>
        | <a href="${repo}">Source</a>
    </footer>
`

const render = (title: string, { content, head = "" }: Lume.Data): string => /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>
            <link rel="stylesheet" href="/assets/style.css" inline />
            ${head}
        </head>
        <body>
            <main>
                <h1>${title}</h1>
                ${content}
            </main>
            ${footer}
        </body>
    </html>
`

export default (data: Lume.Data) => {
	const title = data.title ?? data.page.data.basename

	return render(title, data)
}
