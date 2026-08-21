function SketchAccent() {
    return (
        <div
            className="flex shrink-0 items-center gap-3"
            aria-hidden="true"
        >
            <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 9 }).map((_, index) => (
                    <span
                        key={index}
                        className="size-1.5 rounded-full bg-instinct"
                    />
                ))}
            </div>

        </div>
    );
}

export default SketchAccent;