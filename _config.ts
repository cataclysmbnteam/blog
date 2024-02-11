import { lume } from "./lume_core.ts"
import type { Processor } from "lume/core/processors.ts"

import multilanguage from "lume/plugins/multilanguage.ts"
import relativeUrls from "lume/plugins/relative_urls.ts"
import inline from "lume/plugins/inline.ts"
import minifyHTML from "lume/plugins/minify_html.ts"

const site = lume()

site
	.copy([".css"])
	.ignore("./README.md", "./CONTRIBUTING.md")
	.data("layout", "_includes/base.ts")

const addMeta: Processor = (pages) =>
	pages.forEach((page) => {
		page.data.date = new Date(page.data.basename)
		page.data.title = page.data.title ?? page.data.basename
	})

site
	.preprocess([".md"], addMeta)
	.use(relativeUrls())
	.use(multilanguage({ languages: ["ko"] }))

if (Deno.env.get("MINIFY")) {
	site
		.use(inline())
		.use(minifyHTML())
}

export default site
