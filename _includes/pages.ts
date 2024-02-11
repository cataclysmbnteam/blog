export const layout = "base.ts"
export const head = /*html*/ `
    <link rel="stylesheet" href="/assets/pages.css" inline />
`

export default ({ children }: Lume.Data) => /*html*/ `
    ${children}
`
