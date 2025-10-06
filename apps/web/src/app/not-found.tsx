import type { Metadata } from "next";
import Link from "next/link";

import { Image } from "@/components/ui/image";

export const metadata: Metadata = {
	title: "Not Found",
};

const NotFoundPage = () => {
	return (
	
			<div className="flex h-screen w-screen flex-col items-center justify-center">
				<Image
					src="/images/landscape/error-404.svg"
					alt="error"
					width={1000}
					height={1000}
					className="h-100"
				/>
				<Link href="/landing" className="btn btn-primary mt-5">
					Go to Home
			</Link>
		</div>
	);
};

export default NotFoundPage;
