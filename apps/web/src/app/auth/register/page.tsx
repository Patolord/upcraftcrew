"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RegisterAuth } from "./RegisterAuth";

const RegisterPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token");
	const email = searchParams.get("email");
	const [isValidating, setIsValidating] = useState(true);

	// Validate invitation token
	const invitation = useQuery(
		api.invitations.validateInvitation,
		token && email
			? {
					token,
					email: decodeURIComponent(email),
				}
			: "skip",
	);

	useEffect(() => {
		if (!token || !email) {
			// No token or email in URL - redirect or show error
			setIsValidating(false);
			return;
		}

		if (invitation !== undefined) {
			setIsValidating(false);
			if (!invitation.valid) {
				// Invalid invitation - will show error below
			}
		}
	}, [token, email, invitation]);

	if (!token || !email) {
		return (
			<div className="flex flex-col items-stretch p-8 lg:p-16">
				<div className="flex items-center justify-between">
					<Link href="/dashboard">
						<Logo />
					</Link>
					<ThemeToggle className="btn btn-circle btn-outline border-base-300" />
				</div>
				<div className="mt-8 text-center md:mt-12 lg:mt-24">
					<h3 className="text-xl font-semibold text-error">Acesso Negado</h3>
					<p className="text-base-content/70 mt-2 text-sm">
						Esta página de registro é privada. Você precisa de um link de convite válido para se cadastrar.
					</p>
					<Link href="/auth/login" className="btn btn-primary mt-6">
						Ir para Login
					</Link>
				</div>
			</div>
		);
	}

	if (isValidating || invitation === undefined) {
		return (
			<div className="flex flex-col items-stretch p-8 lg:p-16">
				<div className="flex items-center justify-between">
					<Link href="/dashboard">
						<Logo />
					</Link>
					<ThemeToggle className="btn btn-circle btn-outline border-base-300" />
				</div>
				<div className="mt-8 text-center md:mt-12 lg:mt-24">
					<span className="loading loading-spinner loading-lg text-primary" />
					<p className="text-base-content/70 mt-4 text-sm">Validando convite...</p>
				</div>
			</div>
		);
	}

	if (!invitation.valid) {
		return (
			<div className="flex flex-col items-stretch p-8 lg:p-16">
				<div className="flex items-center justify-between">
					<Link href="/dashboard">
						<Logo />
					</Link>
					<ThemeToggle className="btn btn-circle btn-outline border-base-300" />
				</div>
				<div className="mt-8 text-center md:mt-12 lg:mt-24">
					<h3 className="text-xl font-semibold text-error">Convite Inválido</h3>
					<p className="text-base-content/70 mt-2 text-sm">
						{invitation.error || "O link de convite é inválido ou já foi usado."}
					</p>
					<Link href="/auth/login" className="btn btn-primary mt-6">
						Ir para Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-stretch p-8 lg:p-16">
			<div className="flex items-center justify-between">
				<Link href="/dashboard">
					<Logo />
				</Link>
				<ThemeToggle className="btn btn-circle btn-outline border-base-300" />
			</div>
			<h3 className="mt-8 text-center text-xl font-semibold md:mt-12 lg:mt-24">
				Complete seu cadastro
			</h3>
			<h3 className="text-base-content/70 mt-2 text-center text-sm">
				Olá {invitation.user.name}! Complete seu cadastro para acessar a plataforma.
			</h3>
			<div className="mt-6 md:mt-10">
				<RegisterAuth
					invitationToken={token}
					invitationEmail={invitation.user.email}
					invitationName={invitation.user.name}
				/>
			</div>
		</div>
	);
};

export default RegisterPage;
