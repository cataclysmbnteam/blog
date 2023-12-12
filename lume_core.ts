import Site, { SiteOptions } from "lume/core/site.ts"
import { DeepPartial } from "lume/core/utils/object.ts"

// vendored from "lume/mod.ts"

import url, { Options as UrlOptions } from "lume/plugins/url.ts"
// import json, { Options as JsonOptions } from "lume/plugins/json.ts"
import markdown, { Options as MarkdownOptions } from "lume/plugins/markdown.ts"
import modules, { Options as ModulesOptions } from "lume/plugins/modules.ts"
import search, { Options as SearchOptions } from "lume/plugins/search.ts"
// import paginate, { Options as PaginateOptions } from "lume/plugins/paginate.ts"
// import yaml, { Options as YamlOptions } from "lume/plugins/yaml.ts"

export interface PluginOptions {
	url?: UrlOptions
	// json?: JsonOptions
	markdown?: MarkdownOptions
	modules?: ModulesOptions
	search?: SearchOptions
	// paginate?: PaginateOptions
	// yaml?: YamlOptions
}

/**
 * Stripped down version of `lume` because some plugins weren't needed.
 */
export const lume = (
	options: DeepPartial<SiteOptions> = {},
	pluginOptions: PluginOptions = {},
): Site => {
	const site = new Site(options as Partial<SiteOptions>)

	// Ignore some files by the watcher
	site.options.watcher.ignore.push("/deno.lock", "/node_modules/.deno", "/.git")
	site.options.watcher.ignore.push((path) => path.endsWith("/.DS_Store"))

	return site
		.ignore("node_modules")
		.ignore("import_map.json")
		.ignore("deno.json")
		.ignore("deno.jsonc")
		.ignore("deno.lock")
		.mergeKey("tags", "stringArray")
		.use(url(pluginOptions.url))
		// .use(json(pluginOptions.json))
		.use(markdown(pluginOptions.markdown))
		.use(modules(pluginOptions.modules))
		// .use(paginate(pluginOptions.paginate))
		.use(search(pluginOptions.search))
	// .use(toml(pluginOptions.toml))
	// .use(yaml(pluginOptions.yaml));
}
