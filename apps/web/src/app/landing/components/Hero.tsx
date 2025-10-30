/* eslint-disable @next/next/no-img-element */
"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { useEffect, useRef } from "react";
import SplitType from "split-type";

gsap.registerPlugin(Flip, CustomEase);

export default function Hero() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		CustomEase.create(
			"hop",
			"M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1 ",
		);

		CustomEase.create(
			"hop2",
			"M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1 1,1 ",
		);

		const splitH2 = new SplitType(".site-info h2", {
			types: "lines",
		});

		if (splitH2.lines) {
			splitH2.lines.forEach((line) => {
				const text = line.textContent;
				const wrapper = document.createElement("div");
				wrapper.className = "line";
				const span = document.createElement("span");
				span.textContent = text;
				wrapper.appendChild(span);
				line.parentNode?.replaceChild(wrapper, line);
			});
		}

		const mainTl = gsap.timeline();
		const revealerTl = gsap.timeline();
		const scaleTl = gsap.timeline();

		revealerTl
			.to(".r-1", {
				clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
				duration: 1.5,
				ease: "hop",
			})
			.to(
				".r-2",
				{
					clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
					duration: 1.5,
					ease: "hop",
				},
				"<",
			);

		scaleTl.to(".img:first-child", {
			scale: 1,
			duration: 2,
			ease: "power4.inOut",
		});

		const images = document.querySelectorAll(".img:not(:first-child)");

		images.forEach((img) => {
			scaleTl.to(
				img,
				{
					opacity: 1,
					scale: 1,
					duration: 1.25,
					ease: "power3.out",
				},
				">-0.95",
			);
		});

		mainTl
			.add(revealerTl)
			.add(scaleTl, "-=1.25")
			.add(() => {
				document.querySelectorAll(".img:not(.main)").forEach((img) => {
					img.remove();
				});

				const imagesContainer = document.querySelector(".images");
				imagesContainer?.classList.add("stacked-container");

				document.querySelectorAll(".main").forEach((img, i) => {
					img.classList.add("stacked");
					(img as HTMLElement).style.order = i.toString();
					gsap.set(".img.stacked", {
						clearProps: "transform,top,left",
					});
				});
			})
			.add(
				Flip.from(Flip.getState(".main"), {
					duration: 2,
					ease: "hop",
					absolute: true,
					stagger: {
						amount: -0.3,
					},
				}),
			)
			.to(".word h1, .nav-item p, .line p, .site-info h2 .line span", {
				y: 0,
				duration: 3,
				ease: "hop2",
				stagger: 0.1,
				delay: 1.25,
			})
			.to(".team-img", {
				clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
				duration: 2,
				ease: "hop",
				delay: -4.75,
			});
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative w-screen h-screen overflow-hidden"
		>
			{/* Revealers */}
			<div className="fixed top-0 left-0 w-screen h-screen flex flex-col z-[2]">
				<div className="revealer r-1 flex-1 w-full bg-white [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]" />
				<div className="revealer r-2 flex-1 w-full bg-white [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]" />
			</div>

			{/* Images */}
			<div className="images absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full origin-center">
				<div className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 first:opacity-100">
					<img
						src="/hero-assets/img1.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<img
						src="/hero-assets/img2.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<img
						src="/hero-assets/img3.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<img
						src="/hero-assets/img4.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<img
						src="/hero-assets/img5.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<img
						src="/hero-assets/img6.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<img
						src="/hero-assets/img7.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<img
						src="/hero-assets/img8.jpeg"
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			{/* Hero Content */}
			<div className="hero-content relative w-full h-full">
				{/* Logo */}
				<div className="site-logo absolute top-8 left-8 flex gap-4">
					<div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
						<h1 className="text-[5vw] font-medium leading-none -tracking-[0.01em] translate-y-full">
							Arc
						</h1>
					</div>
					<div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
						<h1 className="text-[5vw] font-medium leading-none -tracking-[0.01em] translate-y-full relative">
							Worldwide
							<sup className="absolute -top-0.5 text-[2rem]">&copy;</sup>
						</h1>
					</div>
				</div>

				{/* Nav */}
				<nav className="nav absolute right-0 w-1/2 p-8 flex justify-end gap-4">
					{["About", "Work", "Journal", "Contact"].map((item) => (
						<div
							key={item}
							className="nav-item relative [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"
						>
							<p className="relative text-base font-medium translate-y-full">
								{item}
							</p>
						</div>
					))}
				</nav>

				{/* Team Image */}
				<div className="team-img absolute right-8 bottom-8 w-[40%] h-1/2 [clip-path:polygon(0_100%,100%_100%,100%_100%,0%_100%)]">
					<img
						src="/hero-assets/img3.jpeg"
						alt=""
						className="w-full h-full object-cover saturate-0"
					/>
				</div>

				{/* Site Info */}
				<div className="site-info absolute bottom-8 left-8 w-1/2 h-1/2 flex flex-col justify-between">
					<div className="row flex gap-8">
						<div className="col flex-1">
							<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
								<p className="uppercase font-mono text-[11px] font-medium translate-y-full">
									Featured Works
								</p>
							</div>
						</div>
						<div className="col flex-1">
							<h2 className="text-[25px] font-medium leading-[1.25]">
								Arc is a contemporary fashion brand redefining elegance with
								timeless designs and innovative aesthetics.
							</h2>
						</div>
					</div>

					<div className="row flex gap-8">
						<div className="col flex-1" />
						<div className="col flex-1 flex">
							<div className="address flex-1">
								<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
									<p className="uppercase font-mono text-[11px] font-medium leading-[1.25] translate-y-full">
										Arc Studio
									</p>
								</div>
								<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
									<p className="uppercase font-mono text-[11px] font-medium leading-[1.25] translate-y-full">
										Riverstone Building
									</p>
								</div>
								<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
									<p className="uppercase font-mono text-[11px] font-medium leading-[1.25] translate-y-full">
										- 28 Orchard Lane
									</p>
								</div>
								<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
									<p className="uppercase font-mono text-[11px] font-medium leading-[1.25] translate-y-full">
										N1 4DX
									</p>
								</div>
							</div>

							<div className="socials flex-1">
								<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
									<p className="uppercase font-mono text-[11px] font-medium leading-[1.25] translate-y-full">
										SayHi@Arc.com
									</p>
								</div>
								<br />
								<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
									<p className="uppercase font-mono text-[11px] font-medium leading-[1.25] translate-y-full">
										Instagram
									</p>
								</div>
								<div className="line [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
									<p className="uppercase font-mono text-[11px] font-medium leading-[1.25] translate-y-full">
										LinkedIn
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
