"use client";

import { useLandingI18n } from "@/app/landing/providers/LandingI18nProvider";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ProjectPage() {
	const params = useParams();
	const slug = params.slug as string;
	const { messages } = useLandingI18n();
	const { portfolio } = messages;

	// Find project by slug
	const project = portfolio.projects.find(
		(p) => p.name.toLowerCase().replace(/\s+/g, '-') === decodeURIComponent(slug)
	);

	if (!project) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-base-100">
			{/* Header */}
			<header className="border-b border-base-200">
				<div className="container mx-auto px-4 py-6">
					<Link
						href="/landing#portfolio"
						className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
					>
						<span className="iconify lucide--arrow-left size-4"></span>
						<span>Voltar ao portfólio</span>
					</Link>
				</div>
			</header>

			{/* Hero Section */}
			<section className="container mx-auto px-4 py-12">
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
					{/* Left Column - Project Info */}
					<div className="flex flex-col justify-center">
						<div className="inline-flex items-center gap-2 mb-4">
							<span className="badge badge-primary badge-outline">{project.industry}</span>
							<span className="text-sm text-base-content/60">{project.year}</span>
						</div>

						<h1 className="text-4xl font-bold mb-4 lg:text-5xl">{project.name}</h1>

						<p className="text-xl text-base-content/80 mb-6">{project.tagline}</p>

						<p className="text-base-content/70 leading-relaxed mb-6">
							{project.description}
						</p>

						{/* Tech Stack */}
						<div className="mb-6">
							<h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/60 mb-3">
								Tecnologias
							</h3>
							<div className="flex flex-wrap gap-2">
								{project.stack.map((tech) => (
									<span key={tech} className="badge badge-lg badge-ghost">
										{tech}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Right Column - Project Image */}
					<div className="relative aspect-video lg:aspect-square overflow-hidden rounded-3xl shadow-xl">
						<img
							src={project.image}
							alt={project.alt}
							className="h-full w-full object-cover"
						/>
					</div>
				</div>
			</section>

			{/* Highlights Section */}
			<section className="bg-base-200/50 py-12">
				<div className="container mx-auto px-4">
					<h2 className="text-2xl font-semibold mb-8 text-center lg:text-3xl">
						Principais Destaques
					</h2>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
						{project.highlights.map((highlight, index) => (
							<div
								key={highlight}
								className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200"
							>
								<div className="flex gap-3">
									<div className="flex-shrink-0">
										<span className="iconify lucide--check size-6 text-primary"></span>
									</div>
									<p className="text-base-content/80 text-sm leading-relaxed">
										{highlight}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="container mx-auto px-4 py-16 text-center">
				<h2 className="text-2xl font-semibold mb-4">
					Interessado em um projeto similar?
				</h2>
				<p className="text-base-content/70 mb-8 max-w-2xl mx-auto">
					Entre em contato conosco para discutir como podemos criar uma solução personalizada para o seu negócio.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link href="/landing#contact" className="btn btn-primary btn-lg">
						Fale conosco
					</Link>
					<Link href="/landing#portfolio" className="btn btn-outline btn-lg">
						Ver mais projetos
					</Link>
				</div>
			</section>
		</div>
	);
}
