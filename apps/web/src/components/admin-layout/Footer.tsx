import { Github, Instagram, Linkedin, X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const Footer = () => {
	return (
		<div className="sticky bottom-0 z-10 mt-auto w-full overflow-hidden border-t border-base-300 bg-base-100">
			<div className="flex w-full justify-end px-4 py-3">
				<div className="flex items-center gap-2">
					<Button
						className="btn btn-ghost btn-sm btn-circle"
						aria-label="Github"
					>
						<Link href="https://github.com/upcraftcrew">
							<Github className="size-4.5 text-white" />
						</Link>
					</Button>
					<Button className="btn btn-ghost btn-sm btn-circle" aria-label="X">
						<Link href="https://x.com/upcraftcrew">
							<X className="size-4.5 text-white" />
						</Link>
					</Button>
					<Button
						className="btn btn-ghost btn-sm btn-circle"
						aria-label="Linkedin"
					>
						<Link href="https://linkedin.com/in/upcraftcrew">
							<Linkedin className="size-4.5 text-white" />
						</Link>
					</Button>
					<Button
						className="btn btn-ghost btn-sm btn-circle"
						aria-label="Instagram"
					>
						<Link href="https://instagram.com/upcraftcrew">
							<Instagram className="size-4.5 text-white" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
