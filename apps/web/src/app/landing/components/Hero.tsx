"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import Image from "next/image";
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
				duration: 3,
				ease: "hop",
			})
			.to(
				".r-2",
				{
					clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
					duration: 3,
					ease: "hop",
				},
				"<",
			)
			.to(".revealer", {
				opacity: 0,
				duration: 0.1,
				onComplete: () => {
					document.querySelectorAll(".revealer").forEach((el) => {
						(el as HTMLElement).style.display = "none";
					});
				},
			});

		const images = document.querySelectorAll(".img");

		images.forEach((img, index) => {
			scaleTl.to(
				img,
				{
					opacity: 1,
					scale: 1,
					duration: 2,
					ease: "power3.out",
				},
				index === 0 ? 0 : ">-0.95",
			);
		});

		mainTl
			.add(revealerTl)
			.add(scaleTl, "-=1.25")
			.call(() => {
				// Capture Flip state BEFORE changes
				const state = Flip.getState(".main");

				// Add stacked-container class
				const imagesContainer = document.querySelector(".images");
				imagesContainer?.classList.add("stacked-container");

				// Add stacked class and order to main images
				document.querySelectorAll(".main").forEach((img, i) => {
					img.classList.add("stacked");
					(img as HTMLElement).style.order = i.toString();
					gsap.set(".img.stacked", {
						clearProps: "transform,top,left",
					});
				});

				// Animate with Flip - call it directly
				Flip.from(state, {
					duration: 2,
					ease: "hop",
					absolute: true,
					stagger: {
						amount: -0.3,
					},
					onComplete: () => {
						// Garantir que todas as imagens empilhadas estejam visíveis
						document.querySelectorAll(".img.stacked").forEach((img) => {
							gsap.set(img, { opacity: 1 });
						});

						// Aguardar 2 segundos e então iniciar o carrossel
						setTimeout(() => {
							const container = document.querySelector(
								".images",
							) as HTMLElement;
							const wrapper = document.createElement("div");
							wrapper.className = "carousel-wrapper flex flex-col gap-3";

							if (container) {
								// Move todas as imagens para o wrapper
								const stackedImages = Array.from(
									document.querySelectorAll(".img.stacked"),
								);
								stackedImages.forEach((img) => {
									wrapper.appendChild(img);
								});
								container.appendChild(wrapper);

								const imageHeight = (stackedImages[0] as HTMLElement)
									.offsetHeight;
								const gap = 12; // gap-3 = 12px
								const totalImages = stackedImages.length;
								// Mostrar 3 imagens, então scroll até mostrar as últimas 3
								const maxScroll = -(imageHeight + gap) * (totalImages - 3);

								// Criar timeline infinita com yoyo (vai e volta)
								const carouselTl = gsap.timeline({
									repeat: -1,
									yoyo: true,
								});

								carouselTl
									.to(wrapper, {
										y: maxScroll,
										duration: 4,
										ease: "power1.inOut",
									})
									.to(wrapper, {
										y: maxScroll,
										duration: 1,
									}); // Pausa no final
							}
						}, 2000);
					},
				});
			})
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
			<div className="fixed top-0 left-0 w-screen h-screen flex flex-col z-[2] pointer-events-none">
				<div className="revealer r-1 flex-1 w-full bg-white [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]" />
				<div className="revealer r-2 flex-1 w-full bg-white [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]" />
			</div>

			{/* Images */}
			<div className="images absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full origin-center [&.stacked-container]:!left-auto [&.stacked-container]:!right-8 [&.stacked-container]:!bottom-8 [&.stacked-container]:!top-auto [&.stacked-container]:!w-56 [&.stacked-container]:!h-auto [&.stacked-container]:!flex [&.stacked-container]:!flex-col [&.stacked-container]:!gap-3 [&.stacked-container]:!translate-x-0 [&.stacked-container]:!translate-y-0 [&.stacked-container]:!z-10 [&.stacked-container]:!overflow-hidden [&.stacked-container]:!max-h-[27rem]">
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 first:opacity-100 overflow-hidden [&.stacked]:!relative [&.stacked]:!top-0 [&.stacked]:!left-0 [&.stacked]:!translate-x-0 [&.stacked]:!translate-y-0 [&.stacked]:!w-56 [&.stacked]:!h-32 [&.stacked]:!scale-100 [&.stacked]:!opacity-100 [&.stacked]:flex-shrink-0 [&.stacked]:border-2 [&.stacked]:border-orange-500 [&.stacked]:rounded-lg">
					<Image
						src="/hero-assets/Especialistas em.png"
						alt="Hero image 1"
						fill
						className="object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 overflow-hidden [&.stacked]:!relative [&.stacked]:!top-0 [&.stacked]:!left-0 [&.stacked]:!translate-x-0 [&.stacked]:!translate-y-0 [&.stacked]:!w-56 [&.stacked]:!h-32 [&.stacked]:!scale-100 [&.stacked]:!opacity-100 [&.stacked]:flex-shrink-0 [&.stacked]:border-2 [&.stacked]:border-orange-500 [&.stacked]:rounded-lg">
					<Image
						src="/hero-assets/herolsf.png"
						alt="Hero image 2"
						fill
						className="object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 overflow-hidden [&.stacked]:!relative [&.stacked]:!top-0 [&.stacked]:!left-0 [&.stacked]:!translate-x-0 [&.stacked]:!translate-y-0 [&.stacked]:!w-56 [&.stacked]:!h-32 [&.stacked]:!scale-100 [&.stacked]:!opacity-100 [&.stacked]:flex-shrink-0 [&.stacked]:border-2 [&.stacked]:border-orange-500 [&.stacked]:rounded-lg">
					<Image
						src="/hero-assets/ortoqbank.png"
						alt="Hero image 3"
						fill
						className="object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 overflow-hidden [&.stacked]:!relative [&.stacked]:!top-0 [&.stacked]:!left-0 [&.stacked]:!translate-x-0 [&.stacked]:!translate-y-0 [&.stacked]:!w-56 [&.stacked]:!h-32 [&.stacked]:!scale-100 [&.stacked]:!opacity-100 [&.stacked]:flex-shrink-0 [&.stacked]:border-2 [&.stacked]:border-orange-500 [&.stacked]:rounded-lg">
					<Image
						src="/hero-assets/others and let.png"
						alt="Hero image 4"
						fill
						className="object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 overflow-hidden [&.stacked]:!relative [&.stacked]:!top-0 [&.stacked]:!left-0 [&.stacked]:!translate-x-0 [&.stacked]:!translate-y-0 [&.stacked]:!w-56 [&.stacked]:!h-32 [&.stacked]:!scale-100 [&.stacked]:!opacity-100 [&.stacked]:flex-shrink-0 [&.stacked]:border-2 [&.stacked]:border-orange-500 [&.stacked]:rounded-lg">
					<Image
						src="/hero-assets/Pasted Graphic.png"
						alt="Hero image 5"
						fill
						className="object-cover"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 overflow-hidden [&.stacked]:!relative [&.stacked]:!top-0 [&.stacked]:!left-0 [&.stacked]:!translate-x-0 [&.stacked]:!translate-y-0 [&.stacked]:!w-56 [&.stacked]:!h-32 [&.stacked]:!scale-100 [&.stacked]:!opacity-100 [&.stacked]:flex-shrink-0 [&.stacked]:border-2 [&.stacked]:border-orange-500 [&.stacked]:rounded-lg">
					<Image
						src="/hero-assets/starbem.png"
						alt="Hero image 6"
						fill
						priority
						className="object-cover pointer-events-none"
					/>
				</div>
				<div className="img main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0 overflow-hidden [&.stacked]:!relative [&.stacked]:!top-0 [&.stacked]:!left-0 [&.stacked]:!translate-x-0 [&.stacked]:!translate-y-0 [&.stacked]:!w-56 [&.stacked]:!h-32 [&.stacked]:!scale-100 [&.stacked]:!opacity-100 [&.stacked]:flex-shrink-0 [&.stacked]:border-2 [&.stacked]:border-orange-500 [&.stacked]:rounded-lg">
					<Image
						src="/hero-assets/vibra.webp"
						alt="Hero image 7"
						fill
						priority
						className="object-cover pointer-events-none"
					/>
				</div>
				<div className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<Image
						src="/hero-assets/warehouse.webp"
						alt="Hero image 8"
						fill
						priority
						className="object-cover pointer-events-none"
					/>
				</div>
				<div className="img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 w-full h-full opacity-0">
					<Image
						src="/hero-assets/tela branca.png"
						alt="Hero image 9"
						fill
						priority
						className="object-cover pointer-events-none"
					/>
				</div>
			</div>

			{/* Hero Content */}
			<div className="hero-content relative w-full h-full">
				{/* Logo */}
				<div className="site-logo absolute top-24 left-8 flex gap-4">
					<div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
						<h1 className="text-orange-500 text-[5vw] font-medium leading-none -tracking-[0.01em] translate-y-full">
							Up Craft
						</h1>
					</div>
					<div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]">
						<h1 className="text-[5vw] font-medium leading-none -tracking-[0.01em] translate-y-full relative">
							Crew
							<sup className="absolute -top-0.5 text-[2rem]">&copy;</sup>
						</h1>
					</div>
				</div>

				{/* Team Image */}
				<div className="team-img absolute right-8 bottom-8 w-[40%] h-1/2 [clip-path:polygon(0_100%,100%_100%,100%_100%,0%_100%)]">
					<Image
						src="/hero-assets/image.png"
						alt="Team image"
						fill
						className="object-cover saturate-0"
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
