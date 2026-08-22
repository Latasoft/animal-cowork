function TornImage() {
    return (
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-[580px]">
            <img
                src="/images/hero/fachada.webp"
                alt="Fachada de Animal Co-work"
                width={1086}
                height={1448}
                className="h-[360px] w-full object-cover object-[50%_35%] sm:h-[440px] lg:h-[500px]"
                loading="eager"
                fetchPriority="high"
            />
        </div>
    );
}

export default TornImage;