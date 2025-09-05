"use client";

import "filepond/dist/filepond.css";
import { FilePond, type FilePondProps } from "react-filepond";

export const DisabledDemo = () => {
	const options: FilePondProps = {
		credits: false,
		disabled: true,
		server: {
			process: (_, __, ___, load) => load({ message: "done" }),
		},
	};

	return <FilePond {...options} />;
};
