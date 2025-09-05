"use client";

import "filepond/dist/filepond.css";
import { FilePond, type FilePondProps } from "react-filepond";

export const MultipleDemo = () => {
	const options: FilePondProps = {
		credits: false,
		allowMultiple: true,
		server: {
			process: (_, __, ___, load) => load({ message: "done" }),
		},
	};

	return <FilePond {...options} />;
};
