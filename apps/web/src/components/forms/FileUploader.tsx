"use client";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.css";
import { FilePond, type FilePondProps, registerPlugin } from "react-filepond";

registerPlugin(FilePondPluginImagePreview);

export const FileUploader = ({
	credits = false,
	server,
	...others
}: FilePondProps) => {
	const FilePondComponent = FilePond as any;
	return (
		<FilePondComponent
			credits={credits}
			{...others}
			server={
				typeof server === "string"
					? server
					: {
							...server,
							process: (
								_: any,
								__: any,
								___: any,
								load: (result: any) => void,
							) => load({ message: "done" }),
						}
			}
		/>
	);
};
