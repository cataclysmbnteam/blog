export const repo = "https://github.com/scarf005/bn-blog"

const header = (lang: string) => /*html*/ `
    <header>
        <h1>
            <a href="/${lang}/">카타클리즘: 밝은 밤 블로그</a>
        </h1>
        <nav aria-labelledby="recent-changes-navigation">
            <a href="/${lang}/">최근 내역</a>
            <a href="/${lang}/pages">실험판 내역</a>
            <a href="/${lang}/stables">안정판 내역</a>
            <a href="/${lang}/contributing">기여하기</a>
            <a href="https://github.com/cataclysmbnteam/Cataclysm-BN/releases">게임 플레이하기</a>
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

const render = (title: string, { content, lang = "en", head = "" }: Lume.Data): string => /*html*/ `
    <!DOCTYPE html>
    <html lang="${lang}">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>
            <link rel="stylesheet" href="/assets/global.css" inline />
            ${head}
        </head>
        <body>
            ${header(lang)}
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
