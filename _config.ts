import { lume } from "./lume_core.ts"
import relativeUrls from "lume/plugins/relative_urls.ts"
import inline from "lume/plugins/inline.ts"
import minifyHTML from "lume/plugins/minify_html.ts"

const site = lume()

site.copy([".css"])
site.ignore("./README.md")
site.data("layout", "_includes/base.ts")
site.use(relativeUrls())
if (Deno.env.get("MINIFY")) {
	site.use(inline())
	site.use(minifyHTML())
}
export default site
