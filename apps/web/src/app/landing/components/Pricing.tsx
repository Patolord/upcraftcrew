export const Pricing = () => {
    return (
        <div className="group/section container py-8 md:py-12 lg:py-16 2xl:py-28" id="pricing">
            <div className="flex items-center justify-center gap-1.5">
                <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
                <p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
                    Transparent Pricing
                </p>
                <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
            </div>
            <p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">Transparent Development Pricing</p>
            <div className="mt-2 flex justify-center text-center">
                <p className="text-base-content/80 max-w-lg">
                    Choose the engagement model that works best for your project. Transparent pricing with no hidden costs.
                </p>
            </div>

            <div className="mt-6 flex items-center justify-center lg:mt-8 2xl:mt-12">
                <div className="tabs tabs-box tabs-sm relative">
                    <label className="tab">
                        <input type="radio" name="plan_duration" defaultChecked value="project" />
                        <p className="mx-2">Project-Based</p>
                    </label>

                    <label className="tab gap-0">
                        <input type="radio" name="plan_duration" value="retainer" />
                        <div className="gap mx-2 flex items-center gap-1.5">
                            <span className="iconify lucide--award size-4"></span>
                            <p>Retainer</p>
                        </div>
                    </label>
                    <div className="*:stroke-success/80 absolute -end-10 -bottom-6 -rotate-40 max-sm:hidden">
                        <svg className="h-14" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M24.2436 22.2464C21.9361 40.1037 24.1434 58.4063 36.2372 72.8438C47.1531 85.8753 63.0339 89.4997 72.0241 72.3997C76.2799 64.3049 75.9148 51.8626 68.2423 45.8372C59.6944 39.1242 52.5684 51.4637 52.3146 58.6725C51.7216 75.5092 64.21 92.4339 82.5472 94.5584C104.262 97.0741 103.365 74.6027 103.226 74.6577"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8.04486 34.0788C9.99828 33.6914 11.5767 32.5391 13.211 31.4701C18.5769 27.9613 23.2345 22.4666 24.743 16.0889C25.3522 23.1615 28.5274 32.1386 35.2148 35.4439"
                                stroke="inherit"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <p className="text-success absolute -end-30 bottom-4 text-sm font-semibold max-sm:hidden">
                        Best Value
                    </p>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-12 xl:grid-cols-3 2xl:mt-16">
                <div className="card bg-base-100 border-base-300 flex flex-col border border-dashed p-6">
                    <div className="flex justify-between gap-3">
                        <div>
                            <p className="text-2xl font-semibold">Web Essentials</p>
                            <p className="text-base-content/80 text-sm">Perfect for small businesses</p>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-5xl leading-0 font-semibold">
                            <span className="text-base-content/80 align-super text-xl font-medium">£</span>
                            <span className="relative inline-block h-8 w-20">
                                <span className="absolute start-0 top-1/2 -translate-y-1/2 scale-100 opacity-100 transition-all duration-500 group-has-[[value=project]:checked]/section:scale-100 group-has-[[value=project]:checked]/section:opacity-100 group-has-[[value=retainer]:checked]/section:scale-0 group-has-[[value=retainer]:checked]/section:opacity-0">
                                    1,000
                                </span>
                                <span className="absolute start-0 top-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-500 group-has-[[value=retainer]:checked]/section:scale-100 group-has-[[value=retainer]:checked]/section:opacity-100 group-has-[[value=project]:checked]/section:scale-0 group-has-[[value=project]:checked]/section:opacity-0">
                                    30
                                </span>
                            </span>
                        </p>
                        <p className="text-base-content/80 mt-3 text-sm">
                            <span className="group-has-[[value=project]:checked]/section:inline group-has-[[value=retainer]:checked]/section:hidden">
                                starting from
                            </span>
                            <span className="group-has-[[value=project]:checked]/section:hidden group-has-[[value=retainer]:checked]/section:inline">
                                /month
                            </span>
                        </p>
                    </div>
                    <p className="text-base-content/80 mt-6 text-sm font-medium">What's Included</p>
                    <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            5-page responsive website
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Mobile-first design
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Contact forms & basic SEO
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            CMS integration
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--x text-error size-4.5"></span>
                            E-commerce functionality
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--x text-error size-4.5"></span>
                            Custom integrations
                        </div>
                    </div>
                    <p className="text-base-content/70 mt-12 text-center font-medium italic">
                        "Perfect for startups and small businesses getting online"
                    </p>
                    <button className="btn btn-outline border-base-300 mt-6 gap-2.5">
                        <span className="iconify lucide--arrow-right size-4"></span>Get Quote
                    </button>
                </div>
                <div className="card bg-base-100 border-base-300 flex flex-col border p-6">
                    <div className="flex justify-between gap-3">
                        <p className="text-primary text-2xl font-semibold">Business Pro</p>
                        <div className="badge badge-primary badge-sm shadow-primary/10 shadow-lg">Most Popular</div>
                    </div>
                    <p className="text-base-content/80 text-sm">Advanced web applications</p>
                    <div className="mt-6 text-center">
                        <p className="text-primary text-5xl leading-0 font-semibold">
                            <span className="text-base-content/80 align-super text-xl font-medium">£</span>
                            <span className="relative inline-block h-8 w-20">
                                <span className="absolute start-0 top-1/2 -translate-y-1/2 scale-100 opacity-100 transition-all duration-500 group-has-[[value=project]:checked]/section:scale-100 group-has-[[value=project]:checked]/section:opacity-100 group-has-[[value=retainer]:checked]/section:scale-0 group-has-[[value=retainer]:checked]/section:opacity-0">
                                    2,900
                                </span>
                                <span className="absolute start-0 top-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-500 group-has-[[value=retainer]:checked]/section:scale-100 group-has-[[value=retainer]:checked]/section:opacity-100 group-has-[[value=project]:checked]/section:scale-0 group-has-[[value=project]:checked]/section:opacity-0">
                                    250
                                </span>
                            </span>
                        </p>
                        <p className="text-base-content/80 mt-3 text-sm">
                            <span className="group-has-[[value=project]:checked]/section:inline group-has-[[value=retainer]:checked]/section:hidden">
                                starting from
                            </span>
                            <span className="group-has-[[value=project]:checked]/section:hidden group-has-[[value=retainer]:checked]/section:inline">
                                /month
                            </span>
                        </p>
                    </div>

                    <p className="text-base-content/80 mt-6 text-sm font-medium">What's Included</p>
                    <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Custom web application
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            User authentication system
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Database design & API
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Payment integration
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Cloud deployment & hosting
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            3 months support included
                        </div>
                    </div>
                    <p className="text-base-content/70 mt-12 text-center font-medium italic">
                        "Perfect for growing businesses needing custom functionality"
                    </p>
                    <button className="btn btn-primary mt-6 gap-2.5">
                        <span className="iconify lucide--rocket size-4"></span>
                        Start Project
                    </button>
                </div>
                <div className="card bg-base-100 border-base-300 flex flex-col border p-6">
                    <div className="flex justify-between gap-3">
                        <p className="text-2xl font-semibold">Enterprise</p>
                        <div className="badge badge-neutral badge-sm shadow-neutral/10 shadow-lg">Custom</div>
                    </div>
                    <p className="text-base-content/80 text-sm">Large-scale & custom solutions</p>

                    <div className="mt-6 text-center">
                        <p className="text-5xl leading-0 font-semibold">
                            <span className="text-base-content/80 align-super text-xl font-medium">£</span>
                            <span className="relative inline-block h-8 w-20">
                                <span className="absolute start-0 top-1/2 -translate-y-1/2 scale-100 opacity-100 transition-all duration-500 group-has-[[value=project]:checked]/section:scale-100 group-has-[[value=project]:checked]/section:opacity-100 group-has-[[value=retainer]:checked]/section:scale-0 group-has-[[value=retainer]:checked]/section:opacity-0">
                                    25k+
                                </span>
                                <span className="absolute start-0 top-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-500 group-has-[[value=retainer]:checked]/section:scale-100 group-has-[[value=retainer]:checked]/section:opacity-100 group-has-[[value=project]:checked]/section:scale-0 group-has-[[value=project]:checked]/section:opacity-0">
                                    2,900
                                </span>
                            </span>
                        </p>
                        <p className="text-base-content/80 mt-3 text-sm">
                            <span className="group-has-[[value=project]:checked]/section:inline group-has-[[value=retainer]:checked]/section:hidden">
                                custom quote
                            </span>
                            <span className="group-has-[[value=project]:checked]/section:hidden group-has-[[value=retainer]:checked]/section:inline">
                                /month
                            </span>
                        </p>
                    </div>
                    <p className="text-base-content/80 mt-6 text-sm font-medium">What's Included</p>
                    <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Complex SaaS platforms
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Multi-tenant architecture
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Custom API & integrations
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Enterprise security
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Dedicated project manager
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="iconify lucide--check text-success size-4.5"></span>
                            Ongoing maintenance & support
                        </div>
                    </div>
                    <p className="text-base-content/70 mt-12 text-center font-medium italic">
                        "For enterprises requiring scalable, custom-built solutions"
                    </p>
                    <button className="btn btn-neutral mt-6 gap-2.5">
                        <span className="iconify lucide--phone size-4"></span>Contact Us
                    </button>
                </div>
            </div>
        </div>
    );
};



