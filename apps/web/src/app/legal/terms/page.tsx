export default function TermsOfService() {
	return (
		<div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">
					Terms of Service
				</h1>

				<p className="text-sm text-gray-600 mb-8">
					Last updated: {new Date().toLocaleDateString("en-US")}
				</p>

				<div className="space-y-8 text-gray-700">
					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							1. Acceptance of Terms
						</h2>
						<p>
							By accessing and using Upcraft Crew, you accept and agree to be
							bound by the terms and provision of this agreement.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							2. Use License
						</h2>
						<p>
							Permission is granted to temporarily use Upcraft Crew for personal
							or commercial construction project management purposes. This is
							the grant of a license, not a transfer of title.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							3. User Account
						</h2>
						<p>
							You are responsible for maintaining the confidentiality of your
							account and password. You agree to accept responsibility for all
							activities that occur under your account.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							4. Service Availability
						</h2>
						<p>
							We strive to provide continuous service availability but do not
							guarantee uninterrupted access. We reserve the right to modify or
							discontinue the service at any time.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							5. Intellectual Property
						</h2>
						<p>
							All content, features, and functionality of Upcraft Crew are owned
							by us and are protected by international copyright, trademark, and
							other intellectual property laws.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							6. Limitation of Liability
						</h2>
						<p>
							Upcraft Crew shall not be liable for any indirect, incidental,
							special, consequential, or punitive damages resulting from your
							use or inability to use the service.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							7. Changes to Terms
						</h2>
						<p>
							We reserve the right to modify these terms at any time. Continued
							use of the service after changes constitutes acceptance of the new
							terms.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							8. Contact Information
						</h2>
						<p>
							For questions about these Terms of Service, please contact us
							through the app support section.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
