const testimonials = [
    {
        image: "/images/avatars/1.png",
        name: "Sarah Mitchell",
        comments:
            "Working with this team was exceptional. They delivered our custom SaaS platform on time and within budget. The quality exceeded our expectations.",
        company: "TechFlow Solutions",
        position: "Operations Director",
        location: "Manchester, UK",
    },
    {
        image: "/images/avatars/2.png",
        name: "Alex Rodriguez",
        comments: "Outstanding development experience. Clear communication across time zones, reliable delivery, and the final product was exactly what we needed.",
        company: "InnovateCore",
        position: "CTO",
        location: "Toronto, Canada",
    },
];

const stats = [
    {
        icon: "lucide--rocket",
        title: "On-Time Delivery",
        number: "100%",
        description: "Projects delivered on schedule and within budget.",
        iconClass: "text-primary bg-primary/10",
    },
    {
        icon: "lucide--heart-handshake",
        title: "Free Support",
        number: "30 days",
        description: "Complimentary adjustments and ongoing support included.",
        iconClass: "text-orange-500 bg-orange-500/10",
    },
    {
        icon: "lucide--users",
        title: "Happy Clients",
        number: "100%",
        description: "Client satisfaction rate on completed projects.",
        iconClass: "text-success bg-success/10",
    },
    {
        icon: "lucide--clock",
        title: "Response Time",
        number: "< 2hrs",
        description: "Average response time for client communications.",
        iconClass: "text-secondary bg-secondary/10",
    },
];

export const Testimonials = () => {
    return (
        <div className="group/section container scroll-mt-12 py-8 md:py-12 lg:py-16 2xl:py-28" id="testimonials">
            <div className="flex items-center justify-center gap-1.5">
                <div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
                <p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
                    Client Success
                </p>
                <div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
            </div>
            <p className="mt-2 text-center text-2xl font-semibold 2xl:text-3xl">
                Trusted by Businesses Worldwide
            </p>
            <div className="mt-2 flex justify-center text-center">
                <p className="text-base-content/80 max-w-lg">
                    See how companies across the globe have scaled their digital presence with our bespoke web development solutions
                </p>
            </div>
            <div className="divide-base-300 mt-8 grid gap-12 md:mt-12 lg:mt-16 lg:grid-cols-2 2xl:mt-24">
                <div className="grid grid-cols-2 gap-y-16">
                    {stats.map((stat, index) => (
                        <div className="text-center" key={index}>
                            <div className={`bg-base-200 inline-block rounded-full p-3 ${stat.iconClass}`}>
                                <span className={`iconify ${stat.icon} block size-6`}></span>
                            </div>
                            <p className="mt-1 font-medium">{stat.title}</p>
                            <p className="mt-1 text-2xl font-semibold">{stat.number}</p>
                        </div>
                    ))}
                </div>
                <div className="">
                    <div className="flex items-center justify-center gap-1">
                        <span className="iconify lucide--star size-9 text-orange-600/30"></span>
                        <span className="iconify lucide--star size-9 text-orange-600/30"></span>
                        <span className="iconify lucide--star size-9 text-orange-600/30"></span>
                        <span className="iconify lucide--star size-9 text-orange-600/30"></span>
                        <span className="iconify lucide--star size-9 text-orange-600/30"></span>
                    </div>
                    <div className="mt-12 grid gap-6 max-sm:gap-16 sm:grid-cols-2">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-base-100 card group relative p-1 shadow">
                                <img
                                    src={testimonial.image}
                                    className="bg-base-200/40 border-base-100 absolute start-1/2 -top-11 z-1 size-14 -translate-x-1/2 rounded-full border-3 p-1 shadow-xs"
                                    alt="Avatar"
                                />
                                <div className="bg-neutral/4 rounded-box relative p-4 text-center transition-all">
                                    <p className="font-medium">{testimonial.name}</p>
                                    <p className="text-base-content/80 text-sm leading-none">{testimonial.position}</p>
                                </div>
                                <div className="p-4">
                                    <p className="line-clamp-3 text-sm">{testimonial.comments}</p>
                                    <div className="mt-5 flex items-center gap-2">
                                        <span className="iconify lucide--building size-4"></span>
                                        <span className="text-sm">{testimonial.company}</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="iconify lucide--map-pin size-4"></span>
                                        <span className="text-sm">{testimonial.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
