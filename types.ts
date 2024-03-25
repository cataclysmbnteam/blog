declare global {
	namespace Lume {
		export interface Data {
			/**
			 * content to inline into HTML `<head>` element
			 */
			head?: string

			category?: "post"
		}
	}
}
