"use client";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.css";
import type { FilePondServerConfigProps } from "filepond";
import { FilePond, registerPlugin } from "react-filepond";

registerPlugin(FilePondPluginImagePreview);

interface FileUploaderProps {
	/**
	 * When `true`, show the default FilePond credits.
	 * When `false`, hide the credits (FilePond only accepts `false` explicitly).
	 */
	credits?: boolean;
	server?: string | FilePondServerConfigProps;
	[key: string]: unknown;
}

export const FileUploader = ({
	credits = false,
	server,
	...others
}: FileUploaderProps) => {
	const pondCredits: false | undefined = credits ? undefined : false;

	return (
		<FilePond
			credits={pondCredits}
			{...others}
			server={
				typeof server === "string"
					? server
					: {
							...server,
							process: (
								_: unknown,
								__: unknown,
								___: unknown,
								load: (arg: { message: string }) => void,
							) => load({ message: "done" }),
						}
			}
		/>
	);
};
