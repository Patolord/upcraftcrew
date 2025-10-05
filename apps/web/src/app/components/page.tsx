import Link from "next/link";

import { ComponentPageTitle } from "@/components/ComponentPageTitle";

import { componentsMenuItems } from "./menu";

const ComponentsHome = () => {
	return (
		<div>
			<ComponentPageTitle
				label="Home"
				title="Components"
				description="Explore components like sidebars, footers, buttons, forms, tables, menus, modals, and notifications for your admin dashboard."
			/>
			<div className="mt-12 space-y-6 md:space-y-8">
				{componentsMenuItems
					.filter((m) => !m.isTitle)
					.map((item) => (
						<div key={item.id} id={item.id}>
							<p className="text-base-content/60 font-medium sm:text-lg">
								{item.label}
							</p>
							<div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
								{item.children?.map((child) => (
									<Link href={child.url ?? ""} key={child.id} className="">
										<div className="bg-base-content/2 group border-base-content/5 rounded-box h-36 border opacity-75 grayscale-100 transition-all duration-500 hover:opacity-100 hover:grayscale-0">
											<div className="flex h-full items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.51,-0.69,0.3,2.01)] group-hover:scale-108">
												{child.preview || (
													<div className="text-center">
														{child.icon && <span className={`iconify ${child.icon} size-8 text-base-content/40`} />}
														<p className="mt-2 text-xs text-base-content/60">Preview</p>
													</div>
												)}
											</div>
										</div>
										<p className="p-2 text-center font-medium max-sm:text-sm">
											{child.label}
										</p>
									</Link>
								))}
							</div>
						</div>
					))}
				<div className="text-base-content/60 border-base-300 bg-base-200/5 rounded-box border border-dashed px-5 py-8 text-center sm:text-lg">
					More crafted designs and powerful building blocks coming soon
				</div>
			</div>
		</div>
	);
};

export default ComponentsHome;
