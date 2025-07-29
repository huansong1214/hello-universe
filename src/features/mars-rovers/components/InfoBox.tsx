type InfoBoxProps = {
    selectedCamera: {
        name: string;
        category: string;
        sol_count: number;
    } | null;
};

export function InfoBox({ selectedCamera }: InfoBoxProps) {
    return (
        <div id="info" className="box">
            <p className="camera">
                <span className="label">Camera</span>
                <span className="value">{selectedCamera? selectedCamera.name : "-"}</span>
            </p>
            <p className="category">
                <span className="label">Category</span>
                <span className="value">{selectedCamera? selectedCamera.category : "-"}</span>
            </p>
            <p className="sols">
                <span className="label">Sol Count</span>
                <span className="value">{selectedCamera? selectedCamera.sol_count : "-"}</span>
            </p>
        </div>
    );
}
