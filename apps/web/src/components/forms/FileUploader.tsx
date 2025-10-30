"use client";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.css";
import { FilePond, registerPlugin } from "react-filepond";
import type { FilePondServerConfigProps } from "filepond";

registerPlugin(FilePondPluginImagePreview);

interface FileUploaderProps {
	credits?: boolean;
	server?: string | FilePondServerConfigProps;
	[key: string]: unknown;
}

export const FileUploader = ({
	credits = false,
	server,
	...others
}: FileUploaderProps) => {
	return (
		// @ts-expect-error - FilePond React wrapper has type compatibility issues with React 19
		<FilePond
			credits={credits}
			{...others}
			server={
				typeof server === "string"
					? server
					: {
							...server,
							process: (_: unknown, __: unknown, ___: unknown, load: (arg: { message: string }) => void) => load({ message: "done" }),
						}
			}
		/>
	);
};
