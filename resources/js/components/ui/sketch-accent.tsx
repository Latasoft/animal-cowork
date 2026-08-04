function SketchAccent() {
    return (
        <div
            className="mt-1 flex shrink-0 rotate-180 flex-col gap-[6px] text-instinct"
            aria-hidden
        >
            <div className="flex-shrink-0">
                <span className="block h-[3px] w-5 -rotate-[50deg] rounded-full bg-current" />
            </div>
            <div className="flex-shrink-0">
                <span className="block h-[3px] w-5 -rotate-15 rounded-full bg-current" />
            </div>
            <div className="flex-shrink-0">
                <span className="block h-[3px] w-7 -rotate-[-25deg] rounded-full bg-current" />
            </div>
            <div className="flex-shrink-0">
                <span className="block h-[3px] w-7 -rotate-[-45deg] rounded-full bg-current" />
            </div>
        </div>
    );
}

export default SketchAccent;